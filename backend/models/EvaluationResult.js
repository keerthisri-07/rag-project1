/**
 * EvaluationResult Mongoose Model
 * 
 * Stores RAG pipeline evaluation results including retrieval metrics
 * (precision, recall, MRR) and answer quality metrics (relevance,
 * faithfulness, context utilization, completeness).
 */

const mongoose = require('mongoose');

// Schema for individual query evaluation results
const QueryResultSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  expectedTopics: {
    type: [String],
    default: [],
  },
  retrievedTopics: {
    type: [String],
    default: [],
  },
  answer: {
    type: String,
    default: '',
  },
  scores: {
    relevance: { type: Number, default: 0 },
    faithfulness: { type: Number, default: 0 },
    contextUtilization: { type: Number, default: 0 },
    completeness: { type: Number, default: 0 },
  },
}, { _id: false });

// Schema for retrieval metrics
const RetrievalMetricsSchema = new mongoose.Schema({
  precisionAt5: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  recallAt5: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  mrr: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
}, { _id: false });

// Schema for answer quality metrics
const AnswerMetricsSchema = new mongoose.Schema({
  relevanceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  faithfulnessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  contextUtilization: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
  completenessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
  },
}, { _id: false });

// Main EvaluationResult schema
const EvaluationResultSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  retrievalMetrics: {
    type: RetrievalMetricsSchema,
    required: true,
  },
  answerMetrics: {
    type: AnswerMetricsSchema,
    required: true,
  },
  queryResults: {
    type: [QueryResultSchema],
    default: [],
  },
  totalQueries: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number, // Duration in milliseconds
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for sorting by timestamp
EvaluationResultSchema.index({ timestamp: -1 });

const EvaluationResult = mongoose.model('EvaluationResult', EvaluationResultSchema);

module.exports = EvaluationResult;
