/**
 * Chat Controller
 * 
 * Handles chat-related API endpoints:
 * - sendMessage: Process a user message through the RAG pipeline
 * - getChatHistory: List all chat sessions
 * - getChatSession: Get a specific chat session
 * - deleteChatSession: Delete a chat session
 * - exportChat: Export chat session data
 */

const ChatSession = require('../models/ChatSession');
const { processQuery } = require('../services/adaptiveRAG');
const { generateId } = require('../utils/helpers');
const logger = require('../utils/logger');

/**
 * POST /api/chat/message
 * Send a message and get a RAG-powered response
 */
const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Find or create session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ sessionId });
    }

    if (!session) {
      const newSessionId = sessionId || generateId('chat');
      session = new ChatSession({
        sessionId: newSessionId,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
      });
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
      sources: [],
      timestamp: new Date(),
    });

    // Get chat history for context (last few messages)
    const chatHistory = session.messages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Process through Adaptive RAG pipeline
    logger.info(`Processing chat message: "${message.substring(0, 80)}..."`);
    const result = await processQuery(message, chatHistory.slice(0, -1)); // Exclude current message

    // Add assistant response
    session.messages.push({
      role: 'assistant',
      content: result.answer,
      sources: result.sources,
      timestamp: new Date(),
    });

    // Save session
    await session.save();

    res.json({
      sessionId: session.sessionId,
      message: result.answer,
      sources: result.sources,
      queryType: result.queryType,
      strategy: result.strategy,
    });
  } catch (error) {
    logger.error(`Chat error: ${error.message}`);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
};

/**
 * GET /api/chat/history
 * Get all chat sessions (sorted by most recent)
 */
const getChatHistory = async (req, res) => {
  try {
    const sessions = await ChatSession.find({})
      .select('sessionId title messageCount createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(50);

    const formatted = sessions.map((s) => ({
      sessionId: s.sessionId,
      title: s.title,
      messageCount: s.messages.length,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    res.json({ sessions: formatted, total: formatted.length });
  } catch (error) {
    logger.error(`Get history error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

/**
 * GET /api/chat/session/:sessionId
 * Get a specific chat session with all messages
 */
const getChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({
      sessionId: session.sessionId,
      title: session.title,
      messages: session.messages,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (error) {
    logger.error(`Get session error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
};

/**
 * DELETE /api/chat/session/:sessionId
 * Delete a chat session
 */
const deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = await ChatSession.deleteOne({ sessionId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json({ message: 'Chat session deleted successfully', sessionId });
  } catch (error) {
    logger.error(`Delete session error: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete chat session' });
  }
};

/**
 * GET /api/chat/export/:sessionId
 * Export a chat session as JSON
 */
const exportChat = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await ChatSession.findOne({ sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    const exportData = {
      title: session.title,
      sessionId: session.sessionId,
      exportedAt: new Date().toISOString(),
      messageCount: session.messages.length,
      messages: session.messages.map((m) => ({
        role: m.role,
        content: m.content,
        sources: m.sources,
        timestamp: m.timestamp,
      })),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=chat-${sessionId}.json`
    );
    res.json(exportData);
  } catch (error) {
    logger.error(`Export chat error: ${error.message}`);
    res.status(500).json({ error: 'Failed to export chat' });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getChatSession,
  deleteChatSession,
  exportChat,
};
