/**
 * Embedding Service
 * 
 * Uses @xenova/transformers with the all-MiniLM-L6-v2 model to generate
 * text embeddings for semantic search. Features lazy loading of the model
 * pipeline and batch processing capabilities.
 */

const logger = require('../utils/logger');

// Model configuration
const MODEL_NAME = 'Xenova/all-MiniLM-L6-v2';

// Pipeline singleton - lazy loaded on first use
let pipeline = null;
let pipelinePromise = null;

/**
 * Initialize the embedding pipeline (lazy loading)
 * Loads the model on first call, returns cached pipeline on subsequent calls
 * 
 * @returns {Promise<Function>} The initialized pipeline function
 */
const initializePipeline = async () => {
  if (pipeline) return pipeline;

  // Prevent multiple simultaneous initializations
  if (pipelinePromise) return pipelinePromise;

  pipelinePromise = (async () => {
    try {
      logger.info(`Loading embedding model: ${MODEL_NAME}...`);
      logger.info('This may take a moment on first run (downloading model)...');

      // Dynamic import for @xenova/transformers (ESM module)
      const { pipeline: transformersPipeline } = await import('@xenova/transformers');

      // Create feature-extraction pipeline
      pipeline = await transformersPipeline('feature-extraction', MODEL_NAME, {
        quantized: true, // Use quantized model for faster inference
      });

      logger.success(`Embedding model loaded: ${MODEL_NAME}`);
      return pipeline;
    } catch (error) {
      logger.error(`Failed to load embedding model: ${error.message}`);
      pipelinePromise = null; // Reset so it can be retried
      throw error;
    }
  })();

  return pipelinePromise;
};

/**
 * Generate embedding for a single text
 * 
 * @param {string} text - Input text to embed
 * @returns {Promise<number[]>} Embedding vector as array of numbers
 */
const generateEmbedding = async (text) => {
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot generate embedding for empty text');
  }

  // 1. Try Hugging Face Cloud API (Serverless-friendly, extremely fast)
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: text })
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (hfError) {
    logger.warn(`Hugging Face cloud embedding failed: ${hfError.message}. Using local fallback...`);
  }

  // 2. Fallback to local model pipeline
  const pipe = await initializePipeline();
  const truncatedText = text.substring(0, 512);
  const output = await pipe(truncatedText, {
    pooling: 'mean',
    normalize: true,
  });
  return Array.from(output.data);
};

/**
 * Generate embeddings for multiple texts in batch
 * Processes texts sequentially to manage memory usage
 * 
 * @param {string[]} texts - Array of texts to embed
 * @param {Function} [progressCallback] - Optional callback for progress updates
 * @returns {Promise<number[][]>} Array of embedding vectors
 */
const generateBatchEmbeddings = async (texts, progressCallback = null) => {
  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  // 1. Try Hugging Face Cloud API for batch embedding
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: texts })
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length === texts.length) {
        logger.success(`Generated ${data.length} embeddings using Hugging Face Cloud API`);
        return data;
      }
    }
  } catch (hfError) {
    logger.warn(`Hugging Face cloud batch embedding failed: ${hfError.message}. Using local fallback...`);
  }

  // 2. Fallback to local sequential pipeline batch processing
  const pipe = await initializePipeline();
  const embeddings = [];
  const totalTexts = texts.length;

  logger.info(`Generating embeddings locally for ${totalTexts} texts...`);

  const BATCH_SIZE = 16;
  for (let i = 0; i < totalTexts; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);

    for (let j = 0; j < batch.length; j++) {
      const text = batch[j];
      const truncatedText = text.substring(0, 512);

      try {
        const output = await pipe(truncatedText, {
          pooling: 'mean',
          normalize: true,
        });

        embeddings.push(Array.from(output.data));
      } catch (error) {
        logger.error(`Failed to embed text at index ${i + j}: ${error.message}`);
        embeddings.push(new Array(384).fill(0));
      }

      // Progress tracking
      const processed = i + j + 1;
      if (processed % 50 === 0 || processed === totalTexts) {
        const percent = Math.round((processed / totalTexts) * 100);
        logger.info(`Local embedding progress: ${processed}/${totalTexts} (${percent}%)`);

        if (progressCallback) {
          progressCallback(processed, totalTexts, percent);
        }
      }
    }
  }

  logger.success(`Generated ${embeddings.length} local embeddings successfully`);
  return embeddings;
};

/**
 * Get the embedding dimension for the current model
 * @returns {number} Dimension of embedding vectors (384 for MiniLM-L6-v2)
 */
const getEmbeddingDimension = () => 384;

/**
 * Check if the embedding model is loaded and ready
 * @returns {boolean} Whether the model is loaded
 */
const isModelLoaded = () => pipeline !== null;

module.exports = {
  generateEmbedding,
  generateBatchEmbeddings,
  initializePipeline,
  getEmbeddingDimension,
  isModelLoaded,
};
