/**
 * Status Routes
 * 
 * GET /api/status - Get system status and readiness
 */

const express = require('express');
const router = express.Router();
const statusController = require('../controllers/statusController');

// Get system status
router.get('/', statusController.getStatus);

module.exports = router;
