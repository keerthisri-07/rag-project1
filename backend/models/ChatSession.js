/**
 * ChatSession Mongoose Model
 * 
 * Stores chat conversation sessions with full message history.
 * Each session has a unique sessionId and contains an array of messages
 * with their associated sources from RAG retrieval.
 */

const mongoose = require('mongoose');

// Schema for source references attached to assistant messages
const SourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  chunkText: {
    type: String,
    default: '',
  },
}, { _id: false });

// Schema for individual messages within a chat session
const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    enum: ['user', 'assistant'],
  },
  content: {
    type: String,
    required: true,
  },
  sources: {
    type: [SourceSchema],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

// Main ChatSession schema
const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    default: 'New Chat',
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Index for efficient queries
ChatSessionSchema.index({ createdAt: -1 });
ChatSessionSchema.index({ updatedAt: -1 });

// Virtual for message count
ChatSessionSchema.virtual('messageCount').get(function () {
  return this.messages.length;
});

// Ensure virtuals are included in JSON output
ChatSessionSchema.set('toJSON', { virtuals: true });
ChatSessionSchema.set('toObject', { virtuals: true });

const ChatSession = mongoose.model('ChatSession', ChatSessionSchema);

module.exports = ChatSession;
