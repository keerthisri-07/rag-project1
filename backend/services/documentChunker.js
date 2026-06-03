/**
 * Document Chunker Service
 * 
 * Splits documents into overlapping chunks for embedding and retrieval.
 * Uses a sliding window approach with configurable chunk size and overlap
 * to ensure context continuity between chunks.
 */

const logger = require('../utils/logger');
const { generateId } = require('../utils/helpers');

// Chunking configuration
const DEFAULT_CHUNK_SIZE = 500;      // Characters per chunk
const DEFAULT_OVERLAP = 100;          // Overlap between consecutive chunks

/**
 * Split a single text into overlapping chunks
 * 
 * @param {string} text - Text to split into chunks
 * @param {number} chunkSize - Maximum characters per chunk
 * @param {number} overlap - Number of overlapping characters between chunks
 * @returns {string[]} Array of text chunks
 */
const splitTextIntoChunks = (text, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP) => {
  if (!text || text.length === 0) return [];

  // If text is shorter than chunk size, return as single chunk
  if (text.length <= chunkSize) {
    return [text.trim()];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;

    // If we're not at the end, try to break at a sentence or word boundary
    if (endIndex < text.length) {
      // Look for the last sentence boundary within the chunk
      const chunkText = text.substring(startIndex, endIndex);

      // Try to find sentence boundary (. ! ?) followed by space or newline
      const sentenceBreakRegex = /[.!?]\s/g;
      let lastSentenceBreak = -1;
      let match;

      while ((match = sentenceBreakRegex.exec(chunkText)) !== null) {
        // Only consider breaks in the last 30% of the chunk to avoid very short chunks
        if (match.index > chunkSize * 0.5) {
          lastSentenceBreak = match.index + 1; // Include the punctuation
        }
      }

      if (lastSentenceBreak > 0) {
        endIndex = startIndex + lastSentenceBreak;
      } else {
        // Fall back to word boundary
        const lastSpace = chunkText.lastIndexOf(' ');
        if (lastSpace > chunkSize * 0.5) {
          endIndex = startIndex + lastSpace;
        }
      }
    }

    // Extract chunk and trim whitespace
    const chunk = text.substring(startIndex, Math.min(endIndex, text.length)).trim();

    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move start position forward, accounting for overlap
    startIndex = endIndex - overlap;

    // Prevent infinite loop if overlap >= chunk size
    if (startIndex <= chunks.length > 1 ? startIndex : -1) {
      startIndex = endIndex;
    }
  }

  return chunks;
};

/**
 * Chunk an array of documents into smaller pieces with metadata
 * 
 * @param {Object[]} documents - Array of document objects
 * @param {number} [chunkSize=500] - Maximum characters per chunk
 * @param {number} [overlap=100] - Overlap between chunks
 * @returns {Object[]} Array of chunk objects with metadata
 * 
 * Each chunk object contains:
 * - id: Unique chunk identifier
 * - documentId: Source document ID
 * - title: Source document title
 * - category: Source document category
 * - subcategory: Source document subcategory
 * - chunkIndex: Position of this chunk within the source document
 * - totalChunks: Total number of chunks from the source document
 * - content: The chunk text content
 * - metadata: Combined metadata from source document
 */
const chunkDocuments = (documents, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_OVERLAP) => {
  if (!documents || !Array.isArray(documents)) {
    logger.error('chunkDocuments: Invalid documents array provided');
    return [];
  }

  logger.info(`Chunking ${documents.length} documents (chunkSize=${chunkSize}, overlap=${overlap})...`);

  const allChunks = [];
  let totalChunksCreated = 0;

  for (const doc of documents) {
    if (!doc.content || doc.content.trim().length === 0) {
      logger.warn(`Skipping document "${doc.title || doc.id}" - no content`);
      continue;
    }

    // Split the document content into text chunks
    const textChunks = splitTextIntoChunks(doc.content, chunkSize, overlap);

    // Create chunk objects with metadata
    const docChunks = textChunks.map((chunkText, index) => ({
      id: generateId('chunk'),
      documentId: doc.id,
      title: doc.title || 'Untitled',
      category: doc.category || 'Uncategorized',
      subcategory: doc.subcategory || '',
      chunkIndex: index,
      totalChunks: textChunks.length,
      content: chunkText,
      metadata: {
        ...(doc.metadata || {}),
        sourceDocId: doc.id,
        sourceTitle: doc.title,
        sourceCategory: doc.category,
        chunkPosition: `${index + 1}/${textChunks.length}`,
      },
    }));

    allChunks.push(...docChunks);
    totalChunksCreated += docChunks.length;
  }

  logger.success(
    `Chunking complete: ${documents.length} documents → ${totalChunksCreated} chunks ` +
    `(avg ${Math.round(totalChunksCreated / documents.length)} chunks/doc)`
  );

  // Log category distribution
  const categoryDistribution = {};
  allChunks.forEach((chunk) => {
    categoryDistribution[chunk.category] = (categoryDistribution[chunk.category] || 0) + 1;
  });

  logger.info('Chunk distribution by category:');
  Object.entries(categoryDistribution).forEach(([category, count]) => {
    logger.info(`  ${category}: ${count} chunks`);
  });

  return allChunks;
};

/**
 * Get statistics about a collection of chunks
 * 
 * @param {Object[]} chunks - Array of chunk objects
 * @returns {Object} Statistics object
 */
const getChunkStats = (chunks) => {
  if (!chunks || chunks.length === 0) {
    return { totalChunks: 0, avgLength: 0, categories: {}, documents: 0 };
  }

  const lengths = chunks.map((c) => c.content.length);
  const uniqueDocs = new Set(chunks.map((c) => c.documentId));
  const categories = {};

  chunks.forEach((chunk) => {
    categories[chunk.category] = (categories[chunk.category] || 0) + 1;
  });

  return {
    totalChunks: chunks.length,
    avgLength: Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length),
    minLength: Math.min(...lengths),
    maxLength: Math.max(...lengths),
    categories,
    documents: uniqueDocs.size,
  };
};

module.exports = {
  chunkDocuments,
  splitTextIntoChunks,
  getChunkStats,
  DEFAULT_CHUNK_SIZE,
  DEFAULT_OVERLAP,
};
