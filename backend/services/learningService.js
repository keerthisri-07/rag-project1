/**
 * Learning Service
 * 
 * Provides learning-oriented features using Groq LLM:
 * - Topic summarization
 * - Quiz generation
 * - Multiple choice question generation
 * - Interview question generation
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const Groq = require('groq-sdk');
const logger = require('../utils/logger');
const vectorStore = require('./vectorStore');
const { generateEmbedding } = require('./embeddingService');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = 'llama-3.3-70b-versatile';

/**
 * Generate a comprehensive summary for a given cloud computing topic
 * 
 * @param {string} topic - Topic to summarize
 * @returns {Promise<Object>} { summary, sources }
 */
const summarizeTopic = async (topic) => {
  try {
    logger.info(`Generating summary for topic: "${topic}"`);

    // Retrieve relevant context from vector store
    const queryEmbedding = await generateEmbedding(topic);
    const results = vectorStore.semanticSearch(queryEmbedding, 6);

    const context = results
      .map((r) => `[${r.title}] ${r.content}`)
      .join('\n\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are an expert cloud computing instructor. Generate a comprehensive, well-structured summary of the given topic. 

Your summary should include:
1. **Overview**: Brief introduction and definition
2. **Key Concepts**: Core concepts and terminology
3. **How It Works**: Technical explanation of the architecture/mechanism
4. **Key Features**: Important features and capabilities
5. **Use Cases**: Real-world applications and scenarios
6. **Best Practices**: Recommended approaches and guidelines
7. **Key Takeaways**: Most important points to remember

Use clear language, include practical examples, and make it educational.
Format the output in clean Markdown.

CONTEXT FROM KNOWLEDGE BASE:
${context || 'No specific context available. Use your general knowledge.'}`,
        },
        {
          role: 'user',
          content: `Generate a comprehensive summary about: ${topic}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 2048,
    });

    const summary = response.choices[0]?.message?.content;

    const sources = results.map((r) => ({
      title: r.title,
      category: r.category,
      confidence: Math.round((r.score || 0) * 1000) / 1000,
    }));

    logger.success(`Summary generated for "${topic}": ${summary.length} chars`);

    return { summary, sources };
  } catch (error) {
    logger.error(`Summary generation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Generate quiz questions (open-ended) for a topic
 * 
 * @param {string} topic - Topic for quiz
 * @param {number} [numQuestions=5] - Number of questions to generate
 * @returns {Promise<Object>} { quiz, sources }
 */
const generateQuiz = async (topic, numQuestions = 5) => {
  try {
    logger.info(`Generating ${numQuestions} quiz questions for: "${topic}"`);

    // Retrieve context
    const queryEmbedding = await generateEmbedding(topic);
    const results = vectorStore.semanticSearch(queryEmbedding, 5);

    const context = results
      .map((r) => `[${r.title}] ${r.content}`)
      .join('\n\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a cloud computing instructor creating a quiz. Generate ${numQuestions} quiz questions about the given topic.

For each question, provide:
1. The question text
2. A detailed model answer
3. Difficulty level (beginner/intermediate/advanced)
4. Key concepts tested

Format as JSON array:
[
  {
    "questionNumber": 1,
    "question": "question text",
    "answer": "detailed model answer",
    "difficulty": "beginner|intermediate|advanced",
    "conceptsTested": ["concept1", "concept2"]
  }
]

CONTEXT:
${context || 'Use your general knowledge.'}`,
        },
        {
          role: 'user',
          content: `Create a quiz about: ${topic}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    });

    let quizContent = response.choices[0]?.message?.content;

    // Try to parse as JSON
    let quiz;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = quizContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        quiz = JSON.parse(jsonMatch[1].trim());
      } else {
        quiz = JSON.parse(quizContent);
      }
    } catch (parseError) {
      // Return as raw text if JSON parsing fails
      quiz = { raw: quizContent };
    }

    const sources = results.map((r) => ({
      title: r.title,
      category: r.category,
    }));

    logger.success(`Quiz generated: ${numQuestions} questions`);

    return { quiz, sources };
  } catch (error) {
    logger.error(`Quiz generation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Generate multiple choice questions (MCQs) for a topic
 * 
 * @param {string} topic - Topic for MCQs
 * @param {number} [numQuestions=5] - Number of MCQs to generate
 * @returns {Promise<Object>} { mcqs, sources }
 */
const generateMCQ = async (topic, numQuestions = 5) => {
  try {
    logger.info(`Generating ${numQuestions} MCQs for: "${topic}"`);

    // Retrieve context
    const queryEmbedding = await generateEmbedding(topic);
    const results = vectorStore.semanticSearch(queryEmbedding, 5);

    const context = results
      .map((r) => `[${r.title}] ${r.content}`)
      .join('\n\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a cloud computing instructor creating MCQs. Generate ${numQuestions} multiple choice questions about the given topic.

For each question, provide exactly 4 options (A, B, C, D), with one correct answer and an explanation.

Format as JSON array:
[
  {
    "questionNumber": 1,
    "question": "question text",
    "options": {
      "A": "option A text",
      "B": "option B text",
      "C": "option C text",
      "D": "option D text"
    },
    "correctAnswer": "A",
    "explanation": "why this answer is correct",
    "difficulty": "beginner|intermediate|advanced"
  }
]

CONTEXT:
${context || 'Use your general knowledge.'}`,
        },
        {
          role: 'user',
          content: `Create MCQs about: ${topic}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    });

    let mcqContent = response.choices[0]?.message?.content;

    // Try to parse as JSON
    let mcqs;
    try {
      const jsonMatch = mcqContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        mcqs = JSON.parse(jsonMatch[1].trim());
      } else {
        mcqs = JSON.parse(mcqContent);
      }
    } catch (parseError) {
      mcqs = { raw: mcqContent };
    }

    const sources = results.map((r) => ({
      title: r.title,
      category: r.category,
    }));

    logger.success(`MCQs generated: ${numQuestions} questions`);

    return { mcqs, sources };
  } catch (error) {
    logger.error(`MCQ generation failed: ${error.message}`);
    throw error;
  }
};

/**
 * Generate interview questions and answers for a topic
 * 
 * @param {string} topic - Topic for interview prep
 * @param {string} [difficulty='intermediate'] - Difficulty level
 * @param {number} [numQuestions=5] - Number of questions
 * @returns {Promise<Object>} { questions, sources }
 */
const generateInterviewQuestions = async (topic, difficulty = 'intermediate', numQuestions = 5) => {
  try {
    logger.info(`Generating ${numQuestions} ${difficulty} interview questions for: "${topic}"`);

    // Retrieve context
    const queryEmbedding = await generateEmbedding(topic);
    const results = vectorStore.semanticSearch(queryEmbedding, 5);

    const context = results
      .map((r) => `[${r.title}] ${r.content}`)
      .join('\n\n');

    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `You are a senior cloud architect preparing interview questions. Generate ${numQuestions} ${difficulty}-level interview questions about the given topic.

For each question, provide:
1. The interview question
2. An ideal answer (comprehensive)
3. Key points the interviewer looks for
4. Follow-up questions

Format as JSON array:
[
  {
    "questionNumber": 1,
    "question": "interview question",
    "idealAnswer": "comprehensive answer",
    "keyPoints": ["point1", "point2"],
    "followUpQuestions": ["follow-up 1", "follow-up 2"],
    "difficulty": "${difficulty}"
  }
]

CONTEXT:
${context || 'Use your general knowledge.'}`,
        },
        {
          role: 'user',
          content: `Generate interview questions about: ${topic}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 2048,
    });

    let content = response.choices[0]?.message?.content;

    // Try to parse as JSON
    let questions;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[1].trim());
      } else {
        questions = JSON.parse(content);
      }
    } catch (parseError) {
      questions = { raw: content };
    }

    const sources = results.map((r) => ({
      title: r.title,
      category: r.category,
    }));

    logger.success(`Interview questions generated: ${numQuestions} questions`);

    return { questions, sources };
  } catch (error) {
    logger.error(`Interview question generation failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  summarizeTopic,
  generateQuiz,
  generateMCQ,
  generateInterviewQuestions,
};
