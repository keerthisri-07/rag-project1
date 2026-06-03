/**
 * Adaptive RAG Engine
 * 
 * Implements an adaptive Retrieval-Augmented Generation pipeline that:
 * 1. Classifies incoming queries by type (factual, comparison, explanation, etc.)
 * 2. Selects optimal retrieval strategy based on query type
 * 3. Retrieves relevant context using vector store (semantic/keyword/hybrid)
 * 4. Optionally reranks results using LLM
 * 5. Generates answers with source citations using Groq LLM
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const Groq = require('groq-sdk');
const logger = require('../utils/logger');
const vectorStore = require('./vectorStore');
const { generateEmbedding } = require('./embeddingService');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Query type classification
 * Determines what kind of question the user is asking
 */
const QUERY_TYPES = {
  FACTUAL: 'factual',           // What is X?
  COMPARISON: 'comparison',     // X vs Y
  EXPLANATION: 'explanation',   // How does X work?
  PROCEDURAL: 'procedural',     // How to do X?
  OPINION: 'opinion',           // What's the best X?
};

/**
 * Retrieval strategies mapped to query types
 * Each strategy configures the search parameters
 */
const STRATEGIES = {
  factual: {
    searchType: 'hybrid',
    topK: 5,
    useReranking: false,
    useExpansion: false,
    semanticWeight: 0.5,
  },
  comparison: {
    searchType: 'hybrid',
    topK: 8,
    useReranking: true,
    useExpansion: true,
    semanticWeight: 0.6,
  },
  explanation: {
    searchType: 'semantic',
    topK: 6,
    useReranking: true,
    useExpansion: false,
    semanticWeight: 0.7,
  },
  procedural: {
    searchType: 'hybrid',
    topK: 6,
    useReranking: false,
    useExpansion: false,
    semanticWeight: 0.5,
  },
  opinion: {
    searchType: 'hybrid',
    topK: 7,
    useReranking: true,
    useExpansion: true,
    semanticWeight: 0.6,
  },
};

/**
 * Classify the type of user query using Groq LLM
 * 
 * @param {string} query - The user's question
 * @returns {Promise<string>} Query type: factual, comparison, explanation, procedural, or opinion
 */
const classifyQuery = async (query) => {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a query classifier. Classify the following query into exactly one of these categories:
- factual: Questions asking what something is, definitions, features
- comparison: Questions comparing two or more things
- explanation: Questions asking how something works, why something happens
- procedural: Questions asking how to do something, step-by-step instructions
- opinion: Questions asking for recommendations, best practices, opinions

Respond with ONLY the category name, nothing else.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0,
      max_tokens: 20,
    });

    const classification = response.choices[0]?.message?.content?.trim().toLowerCase();

    // Validate classification
    if (Object.values(QUERY_TYPES).includes(classification)) {
      logger.info(`Query classified as: ${classification}`);
      return classification;
    }

    // Default to factual if classification is unrecognized
    logger.warn(`Unrecognized classification "${classification}", defaulting to factual`);
    return QUERY_TYPES.FACTUAL;
  } catch (error) {
    logger.error(`Query classification failed: ${error.message}`);
    return QUERY_TYPES.FACTUAL; // Default fallback
  }
};

/**
 * Select retrieval strategy based on query type
 * 
 * @param {string} queryType - The classified query type
 * @returns {Object} Strategy configuration
 */
const selectStrategy = (queryType) => {
  const strategy = STRATEGIES[queryType] || STRATEGIES.factual;
  logger.info(`Selected strategy: ${JSON.stringify(strategy)}`);
  return strategy;
};

/**
 * Expand query for better retrieval coverage
 * Generates related terms and synonyms
 * 
 * @param {string} query - Original query
 * @returns {Promise<string>} Expanded query
 */
const expandQuery = async (query) => {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Given a cloud computing question, generate 3-5 related search terms or phrases that would help find relevant information. Return only the terms, separated by commas. Do not include explanations.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const expansion = response.choices[0]?.message?.content?.trim();
    const expandedQuery = `${query} ${expansion}`;
    logger.info(`Query expanded: "${query}" → added terms: "${expansion}"`);
    return expandedQuery;
  } catch (error) {
    logger.warn(`Query expansion failed: ${error.message}`);
    return query; // Return original query on failure
  }
};

/**
 * Rerank retrieved chunks using Groq LLM
 * Scores each chunk's relevance to the query on a 1-10 scale
 * 
 * @param {string} query - The user's query
 * @param {Object[]} chunks - Retrieved chunks to rerank
 * @returns {Promise<Object[]>} Reranked chunks with updated scores
 */
const rerank = async (query, chunks) => {
  if (!chunks || chunks.length === 0) return [];

  try {
    // Build the reranking prompt with all chunks
    const chunkSummaries = chunks.map((chunk, i) =>
      `[${i + 1}] (Category: ${chunk.category}) ${chunk.content.substring(0, 200)}...`
    ).join('\n\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a relevance scorer. Given a query and a list of text passages, rate each passage's relevance to the query on a scale of 1-10 (10 being most relevant).

Respond ONLY with a JSON array of numbers representing scores for each passage in order.
Example: [8, 5, 9, 3, 7]`,
        },
        {
          role: 'user',
          content: `Query: "${query}"\n\nPassages:\n${chunkSummaries}`,
        },
      ],
      temperature: 0,
      max_tokens: 100,
    });

    const responseText = response.choices[0]?.message?.content?.trim();

    // Parse scores from response
    const scoreMatch = responseText.match(/\[[\d\s,]+\]/);
    if (scoreMatch) {
      const scores = JSON.parse(scoreMatch[0]);

      // Apply reranking scores
      const reranked = chunks.map((chunk, i) => ({
        ...chunk,
        rerankScore: (scores[i] || 5) / 10, // Normalize to 0-1
        originalScore: chunk.score,
        score: ((scores[i] || 5) / 10) * 0.6 + (chunk.score || 0) * 0.4, // Blend scores
      }));

      // Sort by new blended score
      reranked.sort((a, b) => b.score - a.score);
      logger.info(`Reranking complete. Top score: ${reranked[0]?.score?.toFixed(3)}`);
      return reranked;
    }

    logger.warn('Could not parse reranking scores, returning original order');
    return chunks;
  } catch (error) {
    logger.error(`Reranking failed: ${error.message}`);
    return chunks; // Return unchanged on failure
  }
};

/**
 * Full retrieval pipeline
 * Classifies query → selects strategy → retrieves → optionally reranks
 * 
 * @param {string} query - The user's query
 * @returns {Promise<Object>} Retrieved context with metadata
 */
const retrieveContext = async (query) => {
  logger.separator('Adaptive RAG Pipeline');
  logger.info(`Processing query: "${query}"`);

  // Step 1: Classify the query
  const queryType = await classifyQuery(query);

  // Step 2: Select retrieval strategy
  const strategy = selectStrategy(queryType);

  // Step 3: Optionally expand the query
  let searchQuery = query;
  if (strategy.useExpansion) {
    searchQuery = await expandQuery(query);
  }

  // Step 4: Generate query embedding
  const queryEmbedding = await generateEmbedding(searchQuery);

  // Step 5: Retrieve documents based on strategy
  let results = [];

  switch (strategy.searchType) {
    case 'semantic':
      results = vectorStore.semanticSearch(queryEmbedding, strategy.topK);
      break;
    case 'keyword':
      results = vectorStore.keywordSearch(searchQuery, strategy.topK);
      break;
    case 'hybrid':
    default:
      results = vectorStore.hybridSearch(
        queryEmbedding,
        searchQuery,
        strategy.topK,
        null,
        strategy.semanticWeight
      );
      break;
  }

  logger.info(`Retrieved ${results.length} chunks using ${strategy.searchType} search`);

  // Step 6: Optionally rerank results
  if (strategy.useReranking && results.length > 0) {
    results = await rerank(query, results);
  }

  // Step 7: Format context and sources
  const context = results
    .map((r) => `[Source: ${r.title} (${r.category})]\n${r.content}`)
    .join('\n\n---\n\n');

  const sources = results.map((r) => ({
    title: r.title,
    category: r.category,
    confidence: Math.round((r.score || 0) * 1000) / 1000,
    chunkText: r.content.substring(0, 200) + '...',
  }));

  logger.success(`Context prepared: ${results.length} sources, ${context.length} chars`);

  return {
    context,
    sources,
    queryType,
    strategy: strategy.searchType,
    chunks: results,
  };
};

/**
 * Generate an answer using Groq LLM with retrieved context
 * 
 * @param {string} query - The user's question
 * @param {string} context - Retrieved context from documents
 * @param {Object[]} [chatHistory=[]] - Previous chat messages for continuity
 * @returns {Promise<string>} Generated answer
 */
const generateAnswer = async (query, context, chatHistory = []) => {
  try {
    // Build the system prompt
    const systemPrompt = `You are an expert Cloud Computing Learning Assistant. Your role is to help students and professionals learn about cloud computing concepts, services, and best practices.

INSTRUCTIONS:
1. Answer questions based PRIMARILY on the provided context
2. If the context doesn't contain enough information, you can supplement with your general knowledge but clearly indicate this
3. Be detailed, accurate, and educational in your responses
4. Use examples, analogies, and practical scenarios when helpful
5. Structure your answers clearly with headings, bullet points, and code examples where appropriate
6. When comparing services or concepts, use structured comparisons
7. Always be technically accurate - do not make up service names, features, or pricing
8. If you're unsure about something, say so rather than guessing

CONTEXT FROM KNOWLEDGE BASE:
${context || 'No relevant context found in the knowledge base.'}`;

    // Build message history
    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add recent chat history (last 6 messages for context window management)
    if (chatHistory && chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-6);
      recentHistory.forEach((msg) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      });
    }

    // Add the current query
    messages.push({ role: 'user', content: query });

    // Generate response using Groq
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages,
      temperature: 0.3,
      max_tokens: 2048,
      top_p: 0.9,
    });

    const answer = response.choices[0]?.message?.content;

    if (!answer) {
      throw new Error('Empty response from Groq');
    }

    logger.success(`Answer generated: ${answer.length} chars`);
    return answer;
  } catch (error) {
    logger.error(`Answer generation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Full RAG pipeline: retrieve context + generate answer
 * 
 * @param {string} query - The user's question
 * @param {Object[]} [chatHistory=[]] - Previous chat messages
 * @returns {Promise<Object>} { answer, sources, queryType, strategy }
 */
const processQuery = async (query, chatHistory = []) => {
  // Retrieve relevant context
  const retrieval = await retrieveContext(query);

  // Generate answer with context
  const answer = await generateAnswer(query, retrieval.context, chatHistory);

  return {
    answer,
    sources: retrieval.sources,
    queryType: retrieval.queryType,
    strategy: retrieval.strategy,
  };
};

module.exports = {
  classifyQuery,
  selectStrategy,
  expandQuery,
  rerank,
  retrieveContext,
  generateAnswer,
  processQuery,
  QUERY_TYPES,
  STRATEGIES,
};
