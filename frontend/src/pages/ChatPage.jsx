import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Send,
  Plus,
  Download,
  Trash2,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import ChatMessage from '../components/ChatMessage'
import { TypingIndicator } from '../components/LoadingSpinner'
import { sendMessage, getChatSession } from '../services/api'
import jsPDF from 'jspdf'

const suggestedQuestions = [
  'What is cloud computing and what are its main service models?',
  'Explain the differences between AWS, Azure, and GCP',
  'How does Docker containerization work?',
  'What is Kubernetes and how does it orchestrate containers?',
  'Explain cloud security best practices',
  'What is serverless computing and when should I use it?',
  'How do virtual machines differ from containers?',
  'What are the key concepts of cloud networking?',
]

export default function ChatPage() {
  const { sessionId: urlSessionId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(urlSessionId || null)
  const [loadingSession, setLoadingSession] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Load existing session
  useEffect(() => {
    if (urlSessionId) {
      loadSession(urlSessionId)
    }
  }, [urlSessionId])

  const loadSession = async (sid) => {
    try {
      setLoadingSession(true)
      const res = await getChatSession(sid)
      const data = res.data
      if (data.messages) {
        setMessages(data.messages)
        setSessionId(sid)
      }
    } catch (err) {
      console.error('Failed to load session:', err)
    } finally {
      setLoadingSession(false)
    }
  }

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    // Add user message
    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const res = await sendMessage(sessionId, text)
      const data = res.data

      // Update session ID if new
      if (data.session_id && !sessionId) {
        setSessionId(data.session_id)
      }

      // Add assistant message
      const assistantMsg = {
        role: 'assistant',
        content: data.response || data.answer || data.message || 'I received your message.',
        sources: data.sources || data.context || [],
        confidence: data.confidence,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      const errorMsg = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${
          err.response?.data?.error || err.message || 'Please try again.'
        }`,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setSessionId(null)
    setInput('')
    navigate('/chat')
  }

  const handleSuggestedQuestion = (q) => {
    setInput(q)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 15
      const maxWidth = pageWidth - margin * 2
      let y = 20

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('CloudRAG AI - Chat Export', margin, y)
      y += 10

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(128, 128, 128)
      doc.text(`Exported: ${new Date().toLocaleString()}`, margin, y)
      y += 15
      doc.setTextColor(0, 0, 0)

      messages.forEach((msg) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(11)
        doc.text(msg.role === 'user' ? 'You:' : 'Assistant:', margin, y)
        y += 6

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        const lines = doc.splitTextToSize(msg.content, maxWidth)
        lines.forEach((line) => {
          if (y > 280) {
            doc.addPage()
            y = 20
          }
          doc.text(line, margin, y)
          y += 5
        })
        y += 8
      })

      doc.save(`cloudrag-chat-${Date.now()}.pdf`)
    } catch (err) {
      console.error('PDF export error:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <p className="text-xs text-gray-500">
              {sessionId ? `Session: ${sessionId.slice(0, 8)}...` : 'New Conversation'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleExportPDF}
              className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Export as PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/15 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/25 transition-colors border border-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto rounded-2xl glass-card p-4 space-y-4 mb-4">
        {loadingSession ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full border-2 border-navy-500 border-t-cyan-400 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-400">Loading conversation...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center mb-5 border border-cyan-500/20">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start a Conversation
            </h3>
            <p className="text-gray-500 text-sm mb-8 max-w-md">
              Ask me anything about cloud computing - AWS, Azure, GCP, Docker, Kubernetes,
              security, and more.
            </p>

            {/* Suggested Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-2xl w-full">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-left px-4 py-3 bg-navy-800/60 rounded-xl text-sm text-gray-300 border border-navy-500/30 hover:border-cyan-500/30 hover:bg-navy-700/60 hover:text-white transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-card rounded-2xl p-3">
        <div className="flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about cloud computing..."
            rows={1}
            className="flex-1 bg-navy-800/60 border border-navy-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 resize-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all max-h-32"
            style={{
              minHeight: '44px',
              height: 'auto',
            }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-11 h-11 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
