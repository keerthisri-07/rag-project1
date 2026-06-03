/**
 * Custom Local Vector Store
 * 
 * In-memory vector store with JSON persistence for document chunk storage
 * and retrieval. Supports semantic search (cosine similarity), keyword search
 * (BM25-style), and hybrid search combining both approaches.
 */

const fs = require('fs');
const path = require('path');
const natural = require('natural');
const logger = require('../utils/logger');
const { cosineSimilarity } = require('../utils/helpers');
const mongoose = require('mongoose');
const VectorChunk = require('../models/VectorChunk');

// Storage paths
const VECTOR_DB_DIR = path.join(__dirname, '..', 'vector-db');
const STORE_FILE = path.join(VECTOR_DB_DIR, 'store.json');

// TF-IDF instance for keyword search
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

/**
 * Vector Store class
 * Manages document chunks with their embeddings for search operations
 */
class VectorStore {
  constructor() {
    // In-memory storage: array of { id, content, embedding, metadata }
    this.documents = [];
    this.isLoaded = false;
    this.tfidf = null;
    this.tfidfDirty = true; // Flag to rebuild TF-IDF index
  }

  /**
   * Ensure the vector-db directory exists
   */
  ensureDirectory() {
    if (!fs.existsSync(VECTOR_DB_DIR)) {
      fs.mkdirSync(VECTOR_DB_DIR, { recursive: true });
      logger.info(`Created vector-db directory: ${VECTOR_DB_DIR}`);
    }
  }

  /**
   * Add documents (chunks) with their embeddings to the store
   * 
   * @param {Object[]} chunks - Array of chunk objects with content and metadata
   * @param {number[][]} embeddings - Array of embedding vectors corresponding to chunks
   */
  addDocuments(chunks, embeddings) {
    if (!chunks || !embeddings || chunks.length !== embeddings.length) {
      throw new Error(
        `Mismatch: ${chunks?.length || 0} chunks vs ${embeddings?.length || 0} embeddings`
      );
    }

    logger.info(`Adding ${chunks.length} documents to vector store...`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = embeddings[i];

      this.documents.push({
        id: chunk.id,
        documentId: chunk.documentId,
        title: chunk.title,
        category: chunk.category,
        subcategory: chunk.subcategory || '',
        chunkIndex: chunk.chunkIndex,
        totalChunks: chunk.totalChunks,
        content: chunk.content,
        embedding: embedding,
        metadata: chunk.metadata || {},
      });
    }

    this.tfidfDirty = true; // Mark TF-IDF index as needing rebuild
    logger.success(`Vector store now contains ${this.documents.length} documents`);
  }

  /**
   * Build or rebuild the TF-IDF index for keyword search
   */
  buildTfIdfIndex() {
    if (!this.tfidfDirty && this.tfidf) return;

    logger.info('Building TF-IDF index...');
    this.tfidf = new TfIdf();

    for (const doc of this.documents) {
      // Add document content to TF-IDF
      this.tfidf.addDocument(doc.content.toLowerCase());
    }

    this.tfidfDirty = false;
    logger.success('TF-IDF index built successfully');
  }

  /**
   * Semantic search using cosine similarity between query embedding and stored embeddings
   * 
   * @param {number[]} queryEmbedding - Query embedding vector
   * @param {number} [topK=5] - Number of top results to return
   * @param {Object} [filter=null] - Optional filter { category: string }
   * @returns {Object[]} Array of matching documents with similarity scores
   */
  semanticSearch(queryEmbedding, topK = 5, filter = null) {
    if (!queryEmbedding || this.documents.length === 0) {
      return [];
    }

    // Calculate similarity for each document
    let candidates = this.documents;

    // Apply category filter if provided
    if (filter && filter.category) {
      candidates = candidates.filter(
        (doc) => doc.category.toLowerCase() === filter.category.toLowerCase()
      );
    }

    const scored = candidates.map((doc) => ({
      ...doc,
      score: cosineSimilarity(queryEmbedding, doc.embedding),
    }));

    // Sort by score descending and return top K
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map((doc) => ({
      id: doc.id,
      documentId: doc.documentId,
      title: doc.title,
      category: doc.category,
      subcategory: doc.subcategory,
      chunkIndex: doc.chunkIndex,
      content: doc.content,
      score: doc.score,
      metadata: doc.metadata,
    }));
  }

  /**
   * Keyword-based search using TF-IDF scoring (BM25-style)
   * 
   * @param {string} query - Search query text
   * @param {number} [topK=5] - Number of top results to return
   * @param {Object} [filter=null] - Optional filter { category: string }
   * @returns {Object[]} Array of matching documents with relevance scores
   */
  keywordSearch(query, topK = 5, filter = null) {
    if (!query || this.documents.length === 0) {
      return [];
    }

    // Rebuild TF-IDF index if needed
    this.buildTfIdfIndex();

    const queryTokens = tokenizer.tokenize(query.toLowerCase());
    if (!queryTokens || queryTokens.length === 0) return [];

    // Score each document using TF-IDF
    const scored = [];

    this.tfidf.tfidfs(query.toLowerCase(), (docIndex, measure) => {
      if (docIndex < this.documents.length) {
        const doc = this.documents[docIndex];

        // Apply category filter
        if (filter && filter.category) {
          if (doc.category.toLowerCase() !== filter.category.toLowerCase()) {
            return;
          }
        }

        if (measure > 0) {
          scored.push({
            id: doc.id,
            documentId: doc.documentId,
            title: doc.title,
            category: doc.category,
            subcategory: doc.subcategory,
            chunkIndex: doc.chunkIndex,
            content: doc.content,
            score: measure,
            metadata: doc.metadata,
          });
        }
      }
    });

    // Normalize scores to 0-1 range
    const maxScore = scored.length > 0 ? Math.max(...scored.map((s) => s.score)) : 1;
    scored.forEach((doc) => {
      doc.score = doc.score / maxScore;
    });

    // Sort by score descending and return top K
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  /**
   * Hybrid search combining semantic and keyword search with score fusion
   * Uses Reciprocal Rank Fusion (RRF) to combine results
   * 
   * @param {number[]} queryEmbedding - Query embedding vector
   * @param {string} queryText - Query text for keyword search
   * @param {number} [topK=5] - Number of top results to return
   * @param {Object} [filter=null] - Optional filter { category: string }
   * @param {number} [semanticWeight=0.6] - Weight for semantic search (0-1)
   * @returns {Object[]} Array of matching documents with combined scores
   */
  hybridSearch(queryEmbedding, queryText, topK = 5, filter = null, semanticWeight = 0.6) {
    // Get results from both search methods
    const semanticResults = this.semanticSearch(queryEmbedding, topK * 2, filter);
    const keywordResults = this.keywordSearch(queryText, topK * 2, filter);

    const keywordWeight = 1 - semanticWeight;

    // Combine using Reciprocal Rank Fusion
    const scoreMap = new Map();

    // Process semantic results
    semanticResults.forEach((result, rank) => {
      const rrf = 1 / (rank + 60); // RRF constant k=60
      const existing = scoreMap.get(result.id) || { ...result, combinedScore: 0 };
      existing.combinedScore += semanticWeight * rrf;
      existing.semanticScore = result.score;
      scoreMap.set(result.id, existing);
    });

    // Process keyword results
    keywordResults.forEach((result, rank) => {
      const rrf = 1 / (rank + 60);
      const existing = scoreMap.get(result.id) || { ...result, combinedScore: 0 };
      existing.combinedScore += keywordWeight * rrf;
      existing.keywordScore = result.score;
      scoreMap.set(result.id, existing);
    });

    // Sort by combined score and return top K
    const combined = Array.from(scoreMap.values());
    combined.sort((a, b) => b.combinedScore - a.combinedScore);

    return combined.slice(0, topK).map((doc) => ({
      id: doc.id,
      documentId: doc.documentId,
      title: doc.title,
      category: doc.category,
      subcategory: doc.subcategory,
      chunkIndex: doc.chunkIndex,
      content: doc.content,
      score: doc.combinedScore,
      semanticScore: doc.semanticScore || 0,
      keywordScore: doc.keywordScore || 0,
      metadata: doc.metadata,
    }));
  }

  /**
   * Get statistics about the vector store
   * @returns {Object} Store statistics
   */
  getStats() {
    if (this.documents.length === 0) {
      return {
        totalChunks: 0,
        categories: {},
        documents: 0,
        embeddingDimension: 0,
      };
    }

    const categories = {};
    const uniqueDocs = new Set();

    this.documents.forEach((doc) => {
      categories[doc.category] = (categories[doc.category] || 0) + 1;
      uniqueDocs.add(doc.documentId);
    });

    return {
      totalChunks: this.documents.length,
      categories,
      documents: uniqueDocs.size,
      embeddingDimension: this.documents[0]?.embedding?.length || 0,
    };
  }

  /**
   * Save the vector store to MongoDB (with local JSON file fallback)
   */
  async save() {
    try {
      // 1. Try saving to MongoDB first
      if (mongoose.connection.readyState === 1) {
        logger.info(`Saving ${this.documents.length} chunks to MongoDB...`);
        await VectorChunk.deleteMany({});
        if (this.documents.length > 0) {
          await VectorChunk.insertMany(this.documents);
        }
        logger.success(`Vector store saved to MongoDB: ${this.documents.length} documents`);
      }
    } catch (dbError) {
      logger.error(`Failed to save vector store to MongoDB: ${dbError.message}`);
    }

    // 2. Also save to disk (local fallback)
    try {
      this.ensureDirectory();
      const data = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        totalDocuments: this.documents.length,
        documents: this.documents,
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(data), 'utf-8');
      logger.success(`Vector store saved locally: ${this.documents.length} documents → ${STORE_FILE}`);
    } catch (error) {
      logger.error(`Failed to save vector store locally: ${error.message}`);
    }
  }

  /**
   * Load the vector store from MongoDB (with local JSON file fallback)
   * @returns {Promise<boolean>} Whether loading was successful
   */
  async load() {
    // 1. Try loading from MongoDB first
    try {
      if (mongoose.connection.readyState === 1) {
        logger.info('Loading vector store from MongoDB...');
        const count = await VectorChunk.countDocuments();
        if (count > 0) {
          const chunks = await VectorChunk.find({});
          this.documents = chunks.map(chunk => ({
            id: chunk.id,
            documentId: chunk.documentId,
            title: chunk.title,
            category: chunk.category,
            subcategory: chunk.subcategory || '',
            chunkIndex: chunk.chunkIndex,
            totalChunks: chunk.totalChunks,
            content: chunk.content,
            embedding: chunk.embedding,
            metadata: chunk.metadata || {},
          }));
          this.tfidfDirty = true;
          this.isLoaded = true;
          logger.success(`Vector store loaded from MongoDB: ${this.documents.length} documents`);
          return true;
        }
        logger.info('MongoDB vector store collection is empty.');
      }
    } catch (dbError) {
      logger.error(`Failed to load vector store from MongoDB: ${dbError.message}`);
    }

    // 2. Fallback to loading from disk
    try {
      if (!fs.existsSync(STORE_FILE)) {
        logger.info('No existing local vector store file found. Starting fresh.');
        this.isLoaded = true;
        return false;
      }

      logger.info(`Loading vector store from local file ${STORE_FILE}...`);
      const data = JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8'));

      if (data.documents && Array.isArray(data.documents)) {
        this.documents = data.documents;
        this.tfidfDirty = true;
        this.isLoaded = true;
        logger.success(`Vector store loaded from local file: ${this.documents.length} documents`);
        return true;
      }

      logger.warn('Local vector store file exists but contains no documents');
      this.isLoaded = true;
      return false;
    } catch (error) {
      logger.error(`Failed to load local vector store: ${error.message}`);
      this.isLoaded = true;
      return false;
    }
  }

  /**
   * Clear all documents from the store
   */
  clear() {
    this.documents = [];
    this.tfidf = null;
    this.tfidfDirty = true;
    logger.info('Vector store cleared');
  }

  /**
   * Check if vector store has data
   * @returns {boolean}
   */
  hasData() {
    return this.documents.length > 0;
  }
}

// Export singleton instance
const vectorStore = new VectorStore();
module.exports = vectorStore;
