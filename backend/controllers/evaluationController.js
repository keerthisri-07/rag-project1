/**
 * Evaluation Controller
 * 
 * Handles evaluation-related API endpoints:
 * - runEvaluation: Trigger a full RAG evaluation run
 * - getResults: Get all evaluation results
 * - getLatestResult: Get the most recent evaluation result
 */

const evaluationService = require('../services/evaluationService');
const EvaluationResult = require('../models/EvaluationResult');
const logger = require('../utils/logger');

/**
 * POST /api/evaluation/run
 * Run the full RAG evaluation pipeline
 */
const runEvaluation = async (req, res) => {
  try {
    logger.info('Starting RAG evaluation...');

    // Send immediate response that evaluation has started
    // since it can take a while
    res.json({
      status: 'running',
      message: 'Evaluation started. This may take several minutes.',
    });

    // Note: In production, this would use a job queue.
    // For simplicity, we start it but have already sent the response.
    // Results can be retrieved via the getResults endpoint.
    try {
      await evaluationService.runEvaluation();
      logger.success('Evaluation completed successfully');
    } catch (evalError) {
      logger.error(`Evaluation failed: ${evalError.message}`);
    }
  } catch (error) {
    logger.error(`Evaluation start error: ${error.message}`);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to start evaluation', details: error.message });
    }
  }
};

/**
 * POST /api/evaluation/run-sync
 * Run evaluation and wait for results (synchronous)
 */
const runEvaluationSync = async (req, res) => {
  try {
    logger.info('Starting synchronous RAG evaluation...');
    const results = await evaluationService.runEvaluation();
    res.json({ status: 'completed', results });
  } catch (error) {
    logger.error(`Evaluation error: ${error.message}`);
    res.status(500).json({ error: 'Evaluation failed', details: error.message });
  }
};

/**
 * GET /api/evaluation/results
 * Get all evaluation results (most recent first)
 */
const getResults = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const results = await EvaluationResult.find({})
      .sort({ timestamp: -1 })
      .limit(limit);

    res.json({
      results,
      total: results.length,
    });
  } catch (error) {
    logger.error(`Get results error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch evaluation results' });
  }
};

/**
 * GET /api/evaluation/latest
 * Get the most recent evaluation result
 */
const getLatestResult = async (req, res) => {
  try {
    const result = await EvaluationResult.findOne({})
      .sort({ timestamp: -1 });

    if (!result) {
      return res.status(404).json({ error: 'No evaluation results found. Run an evaluation first.' });
    }

    res.json(result);
  } catch (error) {
    logger.error(`Get latest result error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch latest evaluation result' });
  }
};

module.exports = {
  runEvaluation,
  runEvaluationSync,
  getResults,
  getLatestResult,
};
