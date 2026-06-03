/**
 * Document Routes
 * 
 * GET /api/documents        - List all documents
 * GET /api/documents/stats  - Get document statistics
 * GET /api/documents/:id    - Get a specific document
 */

const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// Get document statistics (must be before /:id route)
router.get('/stats', documentController.getDocumentStats);

// List all documents
router.get('/', documentController.listDocuments);

// Get a specific document by ID
router.get('/:id', documentController.getDocument);

module.exports = router;
