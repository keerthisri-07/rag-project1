/**
 * Chat Routes
 * 
 * POST   /api/chat/message           - Send a message and get response
 * GET    /api/chat/history            - Get all chat sessions
 * GET    /api/chat/session/:sessionId - Get a specific chat session
 * DELETE /api/chat/session/:sessionId - Delete a chat session
 * GET    /api/chat/export/:sessionId  - Export a chat session
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Send a message and get RAG response
router.post('/message', chatController.sendMessage);

// Get all chat sessions
router.get('/history', chatController.getChatHistory);

// Get a specific chat session
router.get('/session/:sessionId', chatController.getChatSession);

// Delete a chat session
router.delete('/session/:sessionId', chatController.deleteChatSession);

// Export a chat session
router.get('/export/:sessionId', chatController.exportChat);

module.exports = router;
