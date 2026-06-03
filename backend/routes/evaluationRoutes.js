/**
 * Evaluation Routes
 * 
 * POST /api/evaluation/run      - Run async evaluation
 * POST /api/evaluation/run-sync - Run synchronous evaluation
 * GET  /api/evaluation/results  - Get all evaluation results
 * GET  /api/evaluation/latest   - Get latest evaluation result
 */

const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

// Run evaluation (async - returns immediately)
router.post('/run', evaluationController.runEvaluation);

// Run evaluation (sync - waits for completion)
router.post('/run-sync', evaluationController.runEvaluationSync);

// Get all evaluation results
router.get('/results', evaluationController.getResults);

// Get latest evaluation result
router.get('/latest', evaluationController.getLatestResult);

module.exports = router;
