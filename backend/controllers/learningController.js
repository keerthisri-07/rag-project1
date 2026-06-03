/**
 * Learning Controller
 * 
 * Handles learning feature API endpoints:
 * - summarize: Generate topic summaries
 * - generateQuiz: Generate open-ended quiz questions
 * - generateMCQ: Generate multiple choice questions
 * - generateInterviewQuestions: Generate interview Q&A
 */

const learningService = require('../services/learningService');
const logger = require('../utils/logger');

/**
 * POST /api/learning/summarize
 * Generate a comprehensive summary of a topic
 */
const summarize = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    logger.info(`Summarize request: "${topic}"`);
    const result = await learningService.summarizeTopic(topic);

    res.json({
      topic,
      summary: result.summary,
      sources: result.sources,
    });
  } catch (error) {
    logger.error(`Summarize error: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate summary', details: error.message });
  }
};

/**
 * POST /api/learning/quiz
 * Generate open-ended quiz questions
 */
const generateQuiz = async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const num = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 15);
    logger.info(`Quiz request: "${topic}", ${num} questions`);

    const result = await learningService.generateQuiz(topic, num);

    res.json({
      topic,
      numQuestions: num,
      quiz: result.quiz,
      sources: result.sources,
    });
  } catch (error) {
    logger.error(`Quiz generation error: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
  }
};

/**
 * POST /api/learning/mcq
 * Generate multiple choice questions
 */
const generateMCQ = async (req, res) => {
  try {
    const { topic, numQuestions = 5 } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const num = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 15);
    logger.info(`MCQ request: "${topic}", ${num} questions`);

    const result = await learningService.generateMCQ(topic, num);

    res.json({
      topic,
      numQuestions: num,
      mcqs: result.mcqs,
      sources: result.sources,
    });
  } catch (error) {
    logger.error(`MCQ generation error: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate MCQs', details: error.message });
  }
};

/**
 * POST /api/learning/interview
 * Generate interview questions and answers
 */
const generateInterviewQuestions = async (req, res) => {
  try {
    const { topic, difficulty = 'intermediate', numQuestions = 5 } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const validDifficulties = ['beginner', 'intermediate', 'advanced'];
    const diff = validDifficulties.includes(difficulty) ? difficulty : 'intermediate';
    const num = Math.min(Math.max(parseInt(numQuestions) || 5, 1), 15);

    logger.info(`Interview questions request: "${topic}", ${diff}, ${num} questions`);

    const result = await learningService.generateInterviewQuestions(topic, diff, num);

    res.json({
      topic,
      difficulty: diff,
      numQuestions: num,
      questions: result.questions,
      sources: result.sources,
    });
  } catch (error) {
    logger.error(`Interview questions error: ${error.message}`);
    res.status(500).json({ error: 'Failed to generate interview questions', details: error.message });
  }
};

module.exports = {
  summarize,
  generateQuiz,
  generateMCQ,
  generateInterviewQuestions,
};
