/**
 * Main Express Server
 * 
 * Cloud Computing Learning Assistant with Adaptive RAG
 * 
 * Startup sequence:
 * 1. Load environment variables
 * 2. Connect to MongoDB
 * 3. Check if documents exist, if not → generate → chunk → embed → store
 * 4. Load vector store from disk (if exists)
 * 5. Start Express server
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const fs = require('fs');

const logger = require('./utils/logger');
const connectDB = require('./config/db');

// Route imports
const chatRoutes = require('./routes/chatRoutes');
const learningRoutes = require('./routes/learningRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const statusRoutes = require('./routes/statusRoutes');
const documentRoutes = require('./routes/documentRoutes');

// Service imports
const { generateDocuments } = require('./services/documentGenerator');
const { chunkDocuments } = require('./services/documentChunker');
const { generateBatchEmbeddings, initializePipeline } = require('./services/embeddingService');
const vectorStore = require('./services/vectorStore');

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Track initialization status
let initStatus = {
  database: false,
  documents: false,
  embeddings: false,
  vectorStore: false,
  ready: false,
};

// ============================================================
// Middleware
// ============================================================

// CORS - allow frontend origin
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// JSON body parser
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  if (req.path !== '/api/status') { // Skip logging status checks
    logger.info(`${req.method} ${req.path}`);
  }
  next();
});

// ============================================================
// Routes
// ============================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Init status
app.get('/api/init-status', (req, res) => {
  res.json(initStatus);
});

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/documents', documentRoutes);

// ============================================================
// Error Handling Middleware
// ============================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  logger.error(err.stack);

  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  });
});

// ============================================================
// Initialization Pipeline
// ============================================================

/**
 * Initialize the knowledge base:
 * 1. Generate documents (if not already existing)
 * 2. Chunk documents
 * 3. Generate embeddings
 * 4. Store in vector store
 */
const initializeKnowledgeBase = async () => {
  const DOCUMENTS_DIR = path.join(__dirname, 'documents');
  const VECTOR_STORE_FILE = path.join(__dirname, 'vector-db', 'store.json');

  // Try loading existing vector store first (checks MongoDB, falls back to disk)
  logger.info('Checking for existing vector store...');
  const loaded = await vectorStore.load();
  if (loaded && vectorStore.hasData()) {
    logger.success('Vector store loaded successfully - skipping rebuild');
    initStatus.documents = true;
    initStatus.embeddings = true;
    initStatus.vectorStore = true;
    return;
  }

  // Step 1: Generate documents
  logger.separator('Step 1: Document Generation');
  const documents = await generateDocuments();
  initStatus.documents = true;
  logger.success(`Generated ${documents.length} documents`);

  // Step 2: Chunk documents
  logger.separator('Step 2: Document Chunking');
  const chunks = chunkDocuments(documents);
  logger.success(`Created ${chunks.length} chunks from ${documents.length} documents`);

  // Step 3: Initialize embedding model
  logger.separator('Step 3: Embedding Generation');
  await initializePipeline();

  // Extract texts for embedding
  const texts = chunks.map((chunk) => chunk.content);
  logger.info(`Generating embeddings for ${texts.length} chunks...`);

  // Generate embeddings in batches
  const embeddings = await generateBatchEmbeddings(texts);
  initStatus.embeddings = true;
  logger.success(`Generated ${embeddings.length} embeddings`);

  // Step 4: Store in vector store
  logger.separator('Step 4: Vector Store Population');
  vectorStore.addDocuments(chunks, embeddings);
  await vectorStore.save();
  initStatus.vectorStore = true;
  logger.success('Vector store populated and saved');
};

// ============================================================
// Server Startup
// ============================================================

const startServer = async () => {
  logger.separator('Cloud Computing Learning Assistant - Backend');
  logger.info('Starting server initialization...');

  try {
    // Step 1: Connect to MongoDB
    logger.separator('Connecting to MongoDB');
    await connectDB();
    initStatus.database = true;

    // Step 2: Start Express server (start listening immediately)
    const server = app.listen(PORT, () => {
      logger.success(`Server running on http://localhost:${PORT}`);
      logger.info('API endpoints available:');
      logger.info('  POST /api/chat/message        - Send chat message');
      logger.info('  GET  /api/chat/history         - Get chat history');
      logger.info('  POST /api/learning/summarize   - Summarize topic');
      logger.info('  POST /api/learning/quiz        - Generate quiz');
      logger.info('  POST /api/learning/mcq         - Generate MCQs');
      logger.info('  POST /api/learning/interview   - Interview questions');
      logger.info('  POST /api/evaluation/run       - Run evaluation');
      logger.info('  GET  /api/evaluation/latest    - Latest eval results');
      logger.info('  GET  /api/status               - System status');
      logger.info('  GET  /api/documents            - List documents');
      logger.info('  GET  /api/documents/stats      - Document stats');
      logger.separator();
    });

    // Step 3: Initialize knowledge base in background
    logger.info('Starting knowledge base initialization (background)...');
    initializeKnowledgeBase()
      .then(() => {
        initStatus.ready = true;
        logger.separator('Initialization Complete');
        logger.success('System is fully ready!');
        const stats = vectorStore.getStats();
        logger.info(`Vector store: ${stats.totalChunks} chunks from ${stats.documents} documents`);
        logger.info(`Categories: ${Object.keys(stats.categories).join(', ')}`);
      })
      .catch((error) => {
        logger.error(`Knowledge base initialization failed: ${error.message}`);
        logger.error('Server is running but RAG features may not work correctly.');
        logger.error(error.stack);
      });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
