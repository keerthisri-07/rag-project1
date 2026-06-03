/**
 * VectorChunk Mongoose Model
 * 
 * Stores document chunks with their embeddings in MongoDB for persistence.
 * This is used to load vectors into memory on serverless cold starts.
 */

const mongoose = require('mongoose');

const VectorChunkSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  documentId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  subcategory: {
    type: String,
    default: '',
  },
  chunkIndex: {
    type: Number,
    required: true,
  },
  totalChunks: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number], // Array of float numbers for vector embedding (384 dimensions)
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

const VectorChunk = mongoose.model('VectorChunk', VectorChunkSchema);

module.exports = VectorChunk;
