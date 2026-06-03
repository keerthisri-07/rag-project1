/**
 * Document Controller
 * 
 * Handles document-related API endpoints:
 * - listDocuments: List all documents with metadata
 * - getDocumentStats: Get document statistics by category
 * - getDocument: Get a specific document by ID
 */

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');

/**
 * Load all documents from the documents directory
 * @returns {Object[]} Array of document objects
 */
const loadDocuments = () => {
  try {
    if (!fs.existsSync(DOCUMENTS_DIR)) {
      return [];
    }

    const files = fs.readdirSync(DOCUMENTS_DIR).filter((f) => f.endsWith('.json'));
    const documents = [];

    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(DOCUMENTS_DIR, file), 'utf-8'));
        if (Array.isArray(data)) {
          documents.push(...data);
        } else {
          documents.push(data);
        }
      } catch (err) {
        logger.warn(`Failed to parse ${file}: ${err.message}`);
      }
    }

    return documents;
  } catch (error) {
    logger.error(`Failed to load documents: ${error.message}`);
    return [];
  }
};

/**
 * GET /api/documents
 * List all documents with optional category filtering
 */
const listDocuments = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    let documents = loadDocuments();

    // Filter by category if specified
    if (category) {
      documents = documents.filter(
        (d) => d.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedDocs = documents.slice(startIndex, endIndex).map((doc) => ({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      subcategory: doc.subcategory,
      contentLength: doc.content ? doc.content.length : 0,
      metadata: doc.metadata,
    }));

    res.json({
      documents: paginatedDocs,
      total: documents.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(documents.length / limitNum),
    });
  } catch (error) {
    logger.error(`List documents error: ${error.message}`);
    res.status(500).json({ error: 'Failed to list documents' });
  }
};

/**
 * GET /api/documents/stats
 * Get document statistics grouped by category
 */
const getDocumentStats = async (req, res) => {
  try {
    const documents = loadDocuments();

    const stats = {
      totalDocuments: documents.length,
      totalContentLength: 0,
      categories: {},
      difficulties: { beginner: 0, intermediate: 0, advanced: 0 },
    };

    documents.forEach((doc) => {
      const contentLen = doc.content ? doc.content.length : 0;
      stats.totalContentLength += contentLen;

      // Category stats
      if (!stats.categories[doc.category]) {
        stats.categories[doc.category] = {
          count: 0,
          totalLength: 0,
          documents: [],
        };
      }
      stats.categories[doc.category].count++;
      stats.categories[doc.category].totalLength += contentLen;
      stats.categories[doc.category].documents.push(doc.title);

      // Difficulty stats
      if (doc.metadata?.difficulty) {
        stats.difficulties[doc.metadata.difficulty] =
          (stats.difficulties[doc.metadata.difficulty] || 0) + 1;
      }
    });

    stats.avgContentLength = documents.length > 0
      ? Math.round(stats.totalContentLength / documents.length)
      : 0;

    res.json(stats);
  } catch (error) {
    logger.error(`Document stats error: ${error.message}`);
    res.status(500).json({ error: 'Failed to get document stats' });
  }
};

/**
 * GET /api/documents/:id
 * Get a specific document by ID
 */
const getDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const documents = loadDocuments();
    const document = documents.find((d) => d.id === id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    logger.error(`Get document error: ${error.message}`);
    res.status(500).json({ error: 'Failed to get document' });
  }
};

module.exports = {
  listDocuments,
  getDocumentStats,
  getDocument,
};
