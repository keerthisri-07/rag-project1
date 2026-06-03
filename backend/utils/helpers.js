/**
 * Helper Utility Functions
 * 
 * Common utility functions used across the application:
 * - cosineSimilarity: Vector similarity calculation
 * - chunkArray: Split arrays into smaller chunks
 * - generateId: Generate unique identifiers
 * - sleep: Async delay utility
 * - retryAsync: Retry failed async operations
 */

const { v4: uuidv4 } = require('uuid');

/**
 * Calculate cosine similarity between two vectors
 * Cosine similarity = (A·B) / (||A|| × ||B||)
 * 
 * @param {number[]|Float32Array} vecA - First vector
 * @param {number[]|Float32Array} vecB - Second vector
 * @returns {number} Cosine similarity score between -1 and 1
 */
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
};

/**
 * Split an array into smaller chunks of specified size
 * 
 * @param {Array} array - Array to split
 * @param {number} size - Size of each chunk
 * @returns {Array[]} Array of chunks
 * 
 * @example
 * chunkArray([1,2,3,4,5], 2) => [[1,2], [3,4], [5]]
 */
const chunkArray = (array, size) => {
  if (!array || !Array.isArray(array)) return [];
  if (size <= 0) return [array];

  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Generate a unique identifier
 * 
 * @param {string} [prefix=''] - Optional prefix for the ID
 * @returns {string} Unique identifier string
 */
const generateId = (prefix = '') => {
  const id = uuidv4();
  return prefix ? `${prefix}_${id}` : id;
};

/**
 * Async sleep utility - pauses execution for specified milliseconds
 * 
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry an async function with exponential backoff
 * 
 * @param {Function} fn - Async function to retry
 * @param {number} [maxRetries=3] - Maximum number of retry attempts
 * @param {number} [baseDelay=1000] - Base delay in milliseconds (doubles each retry)
 * @param {string} [operationName='operation'] - Name of the operation for logging
 * @returns {Promise<any>} Result of the successful function call
 * @throws {Error} Throws the last error if all retries are exhausted
 */
const retryAsync = async (fn, maxRetries = 3, baseDelay = 1000, operationName = 'operation') => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.warn(
          `[Retry] ${operationName} failed (attempt ${attempt}/${maxRetries}). ` +
          `Retrying in ${delay}ms... Error: ${error.message}`
        );
        await sleep(delay);
      }
    }
  }

  throw new Error(
    `${operationName} failed after ${maxRetries} attempts. Last error: ${lastError.message}`
  );
};

/**
 * Truncate text to specified length with ellipsis
 * 
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
const truncateText = (text, maxLength = 200) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Clean and normalize text for processing
 * Removes extra whitespace, normalizes line breaks
 * 
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
};

module.exports = {
  cosineSimilarity,
  chunkArray,
  generateId,
  sleep,
  retryAsync,
  truncateText,
  cleanText,
};
