/**
 * Learning Routes
 * 
 * POST /api/learning/summarize   - Generate topic summary
 * POST /api/learning/quiz        - Generate quiz questions
 * POST /api/learning/mcq         - Generate MCQs
 * POST /api/learning/interview   - Generate interview questions
 */

const express = require('express');
const router = express.Router();
const learningController = require('../controllers/learningController');

// Generate topic summary
router.post('/summarize', learningController.summarize);

// Generate quiz questions
router.post('/quiz', learningController.generateQuiz);

// Generate MCQs
router.post('/mcq', learningController.generateMCQ);

// Generate interview questions
router.post('/interview', learningController.generateInterviewQuestions);

module.exports = router;
