/**
 * Status Controller
 * 
 * Provides system status and readiness information:
 * - getStatus: Returns comprehensive system health and readiness status
 */

const vectorStore = require('../services/vectorStore');
const { isModelLoaded } = require('../services/embeddingService');
const logger = require('../utils/logger');
const mongoose = require('mongoose');

/**
 * GET /api/status
 * Get comprehensive system status
 */
const getStatus = async (req, res) => {
  try {
    // Get vector store stats
    const storeStats = vectorStore.getStats();

    // Check MongoDB connection
    const dbStatus = mongoose.connection.readyState;
    const dbStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    // Determine overall system readiness
    const isReady =
      dbStatus === 1 &&
      storeStats.totalChunks > 0;

    const status = {
      status: isReady ? 'ready' : 'initializing',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStates[dbStatus] || 'unknown',
          connected: dbStatus === 1,
        },
        embeddingModel: {
          loaded: isModelLoaded(),
          model: 'all-MiniLM-L6-v2',
        },
        vectorStore: {
          loaded: vectorStore.isLoaded,
          totalChunks: storeStats.totalChunks,
          totalDocuments: storeStats.documents,
          embeddingDimension: storeStats.embeddingDimension,
          categories: storeStats.categories,
        },
        llm: {
          provider: 'Groq',
          model: 'llama-3.3-70b-versatile',
          configured: !!process.env.GROQ_API_KEY,
        },
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: Math.round(process.uptime()),
        memoryUsage: {
          rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
        },
      },
    };

    res.json(status);
  } catch (error) {
    logger.error(`Status check error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      error: error.message,
    });
  }
};

module.exports = {
  getStatus,
};
