/**
 * Evaluation Service
 * 
 * Evaluates the RAG pipeline quality using predefined test queries.
 * Measures both retrieval metrics (Precision@5, Recall@5, MRR) and
 * answer quality metrics (relevance, faithfulness, context utilization, completeness).
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const fs = require('fs');
const Groq = require('groq-sdk');
const logger = require('../utils/logger');
const EvaluationResult = require('../models/EvaluationResult');
const { retrieveContext, generateAnswer } = require('./adaptiveRAG');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

// Load test queries
const TEST_QUERIES_PATH = path.join(__dirname, '..', 'evaluation', 'testQueries.json');

/**
 * Load test queries from the evaluation test queries file
 * @returns {Object[]} Array of test query objects
 */
const loadTestQueries = () => {
  try {
    const data = fs.readFileSync(TEST_QUERIES_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    logger.error(`Failed to load test queries: ${error.message}`);
    return [];
  }
};

/**
 * Calculate Precision@K
 * Fraction of retrieved documents that are relevant
 * 
 * @param {string[]} retrieved - Retrieved topic/category names
 * @param {string[]} relevant - Expected relevant topics
 * @param {number} [k=5] - Top K to consider
 * @returns {number} Precision score (0-1)
 */
const calculatePrecisionAt5 = (retrieved, relevant, k = 5) => {
  if (!retrieved || retrieved.length === 0) return 0;

  const topK = retrieved.slice(0, k);
  const relevantSet = new Set(relevant.map((r) => r.toLowerCase()));

  let hits = 0;
  topK.forEach((item) => {
    if (relevantSet.has(item.toLowerCase())) {
      hits++;
    }
  });

  return hits / Math.min(k, topK.length);
};

/**
 * Calculate Recall@K
 * Fraction of relevant documents that were retrieved
 * 
 * @param {string[]} retrieved - Retrieved topic/category names
 * @param {string[]} relevant - Expected relevant topics
 * @param {number} [k=5] - Top K to consider
 * @returns {number} Recall score (0-1)
 */
const calculateRecallAt5 = (retrieved, relevant, k = 5) => {
  if (!relevant || relevant.length === 0) return 0;

  const topK = retrieved.slice(0, k);
  const retrievedSet = new Set(topK.map((r) => r.toLowerCase()));

  let hits = 0;
  relevant.forEach((item) => {
    if (retrievedSet.has(item.toLowerCase())) {
      hits++;
    }
  });

  return hits / relevant.length;
};

/**
 * Calculate Mean Reciprocal Rank (MRR)
 * Considers the rank of the first relevant result
 * 
 * @param {string[]} retrieved - Retrieved topic/category names
 * @param {string[]} relevant - Expected relevant topics
 * @returns {number} MRR score (0-1)
 */
const calculateMRR = (retrieved, relevant) => {
  if (!retrieved || !relevant || retrieved.length === 0 || relevant.length === 0) {
    return 0;
  }

  const relevantSet = new Set(relevant.map((r) => r.toLowerCase()));

  for (let i = 0; i < retrieved.length; i++) {
    if (relevantSet.has(retrieved[i].toLowerCase())) {
      return 1 / (i + 1);
    }
  }

  return 0;
};

/**
 * Calculate relevance score using Groq LLM
 * Measures how relevant the answer is to the query
 * 
 * @param {string} answer - Generated answer
 * @param {string} query - Original query
 * @returns {Promise<number>} Relevance score (0-1)
 */
const calculateRelevanceScore = async (answer, query) => {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are evaluating the relevance of an answer to a question. Rate the relevance on a scale of 0 to 10, where:
0 = Completely irrelevant
5 = Partially relevant
10 = Perfectly relevant and directly addresses the question

Respond with ONLY a single number (0-10).`,
        },
        {
          role: 'user',
          content: `Question: ${query}\n\nAnswer: ${answer.substring(0, 1000)}`,
        },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    const score = parseFloat(response.choices[0]?.message?.content?.trim()) || 5;
    return Math.min(score / 10, 1);
  } catch (error) {
    logger.warn(`Relevance scoring failed: ${error.message}`);
    return 0.5;
  }
};

/**
 * Calculate faithfulness score using Groq LLM
 * Measures whether the answer is grounded in the provided context
 * 
 * @param {string} answer - Generated answer
 * @param {string} context - Retrieved context
 * @returns {Promise<number>} Faithfulness score (0-1)
 */
const calculateFaithfulnessScore = async (answer, context) => {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are evaluating whether an answer is faithful to the provided context. Rate the faithfulness on a scale of 0 to 10:
0 = Answer contains information not present in context (hallucinated)
5 = Answer partially matches context
10 = Answer is fully grounded in the provided context

Respond with ONLY a single number (0-10).`,
        },
        {
          role: 'user',
          content: `Context: ${context.substring(0, 1500)}\n\nAnswer: ${answer.substring(0, 1000)}`,
        },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    const score = parseFloat(response.choices[0]?.message?.content?.trim()) || 5;
    return Math.min(score / 10, 1);
  } catch (error) {
    logger.warn(`Faithfulness scoring failed: ${error.message}`);
    return 0.5;
  }
};

/**
 * Calculate context utilization score
 * Measures how much of the provided context was used in the answer
 * Uses keyword overlap as a heuristic
 * 
 * @param {string} answer - Generated answer
 * @param {string} context - Retrieved context
 * @returns {number} Context utilization score (0-1)
 */
const calculateContextUtilization = (answer, context) => {
  if (!answer || !context) return 0;

  // Extract significant keywords from context (words with 4+ chars)
  const contextWords = new Set(
    context
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= 4)
  );

  const answerWords = new Set(
    answer
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length >= 4)
  );

  if (contextWords.size === 0) return 0;

  // Calculate overlap
  let overlap = 0;
  contextWords.forEach((word) => {
    if (answerWords.has(word)) overlap++;
  });

  return Math.min(overlap / contextWords.size, 1);
};

/**
 * Calculate completeness score using Groq LLM
 * Measures how completely the answer addresses the query
 * 
 * @param {string} answer - Generated answer
 * @param {string} query - Original query
 * @returns {Promise<number>} Completeness score (0-1)
 */
const calculateCompletenessScore = async (answer, query) => {
  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are evaluating the completeness of an answer. Rate how completely the answer addresses all aspects of the question on a scale of 0 to 10:
0 = Does not address the question at all
5 = Addresses some aspects but misses important parts
10 = Thoroughly and completely addresses all aspects of the question

Respond with ONLY a single number (0-10).`,
        },
        {
          role: 'user',
          content: `Question: ${query}\n\nAnswer: ${answer.substring(0, 1000)}`,
        },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    const score = parseFloat(response.choices[0]?.message?.content?.trim()) || 5;
    return Math.min(score / 10, 1);
  } catch (error) {
    logger.warn(`Completeness scoring failed: ${error.message}`);
    return 0.5;
  }
};

/**
 * Run full evaluation pipeline
 * Processes all test queries through the RAG pipeline and calculates metrics
 * 
 * @returns {Promise<Object>} Complete evaluation results
 */
const runEvaluation = async () => {
  logger.separator('RAG Evaluation Pipeline');
  const startTime = Date.now();

  const testQueries = loadTestQueries();
  if (testQueries.length === 0) {
    throw new Error('No test queries available for evaluation');
  }

  logger.info(`Running evaluation with ${testQueries.length} test queries...`);

  const queryResults = [];
  let totalPrecision = 0;
  let totalRecall = 0;
  let totalMRR = 0;
  let totalRelevance = 0;
  let totalFaithfulness = 0;
  let totalContextUtil = 0;
  let totalCompleteness = 0;

  for (let i = 0; i < testQueries.length; i++) {
    const testQuery = testQueries[i];
    logger.info(`[${i + 1}/${testQueries.length}] Evaluating: "${testQuery.query}"`);

    try {
      // Run through RAG pipeline
      const retrieval = await retrieveContext(testQuery.query);
      const answer = await generateAnswer(testQuery.query, retrieval.context);

      // Extract retrieved topics/categories
      const retrievedTopics = retrieval.sources.map((s) => s.category);
      const retrievedTitles = retrieval.sources.map((s) => s.title);
      const allRetrieved = [...new Set([...retrievedTopics, ...retrievedTitles])];

      // Calculate retrieval metrics
      const precision = calculatePrecisionAt5(allRetrieved, testQuery.expectedTopics);
      const recall = calculateRecallAt5(allRetrieved, testQuery.expectedTopics);
      const mrr = calculateMRR(allRetrieved, testQuery.expectedTopics);

      // Calculate answer quality metrics (with rate limiting)
      const relevance = await calculateRelevanceScore(answer, testQuery.query);
      await new Promise((r) => setTimeout(r, 500)); // Rate limit
      const faithfulness = await calculateFaithfulnessScore(answer, retrieval.context);
      await new Promise((r) => setTimeout(r, 500));
      const contextUtil = calculateContextUtilization(answer, retrieval.context);
      const completeness = await calculateCompletenessScore(answer, testQuery.query);
      await new Promise((r) => setTimeout(r, 500));

      // Accumulate totals
      totalPrecision += precision;
      totalRecall += recall;
      totalMRR += mrr;
      totalRelevance += relevance;
      totalFaithfulness += faithfulness;
      totalContextUtil += contextUtil;
      totalCompleteness += completeness;

      queryResults.push({
        query: testQuery.query,
        expectedTopics: testQuery.expectedTopics,
        retrievedTopics: allRetrieved,
        answer: answer.substring(0, 500),
        scores: {
          relevance: Math.round(relevance * 1000) / 1000,
          faithfulness: Math.round(faithfulness * 1000) / 1000,
          contextUtilization: Math.round(contextUtil * 1000) / 1000,
          completeness: Math.round(completeness * 1000) / 1000,
        },
      });

      logger.success(
        `  Scores - Rel: ${relevance.toFixed(2)}, Faith: ${faithfulness.toFixed(2)}, ` +
        `Ctx: ${contextUtil.toFixed(2)}, Comp: ${completeness.toFixed(2)}`
      );
    } catch (error) {
      logger.error(`  Failed: ${error.message}`);
      queryResults.push({
        query: testQuery.query,
        expectedTopics: testQuery.expectedTopics,
        retrievedTopics: [],
        answer: `Error: ${error.message}`,
        scores: { relevance: 0, faithfulness: 0, contextUtilization: 0, completeness: 0 },
      });
    }
  }

  // Calculate averages
  const n = testQueries.length;
  const results = {
    timestamp: new Date(),
    retrievalMetrics: {
      precisionAt5: Math.round((totalPrecision / n) * 1000) / 1000,
      recallAt5: Math.round((totalRecall / n) * 1000) / 1000,
      mrr: Math.round((totalMRR / n) * 1000) / 1000,
    },
    answerMetrics: {
      relevanceScore: Math.round((totalRelevance / n) * 1000) / 1000,
      faithfulnessScore: Math.round((totalFaithfulness / n) * 1000) / 1000,
      contextUtilization: Math.round((totalContextUtil / n) * 1000) / 1000,
      completenessScore: Math.round((totalCompleteness / n) * 1000) / 1000,
    },
    queryResults,
    totalQueries: n,
    duration: Date.now() - startTime,
  };

  // Save to MongoDB
  try {
    const evalResult = new EvaluationResult(results);
    await evalResult.save();
    logger.success('Evaluation results saved to MongoDB');
  } catch (error) {
    logger.error(`Failed to save evaluation results: ${error.message}`);
  }

  logger.separator('Evaluation Results');
  logger.info(`Retrieval - P@5: ${results.retrievalMetrics.precisionAt5}, R@5: ${results.retrievalMetrics.recallAt5}, MRR: ${results.retrievalMetrics.mrr}`);
  logger.info(`Answer - Rel: ${results.answerMetrics.relevanceScore}, Faith: ${results.answerMetrics.faithfulnessScore}, Ctx: ${results.answerMetrics.contextUtilization}, Comp: ${results.answerMetrics.completenessScore}`);
  logger.info(`Duration: ${(results.duration / 1000).toFixed(1)}s`);

  return results;
};

module.exports = {
  runEvaluation,
  calculatePrecisionAt5,
  calculateRecallAt5,
  calculateMRR,
  calculateRelevanceScore,
  calculateFaithfulnessScore,
  calculateContextUtilization,
  calculateCompletenessScore,
  loadTestQueries,
};
