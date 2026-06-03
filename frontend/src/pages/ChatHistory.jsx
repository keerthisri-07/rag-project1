import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  History,
  MessageSquare,
  Trash2,
  Search,
  Calendar,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { getChatHistory, deleteChatSession } from '../services/api'

export default function ChatHistory() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getChatHistory()
      const data = res.data
      setSessions(Array.isArray(data) ? data : data.sessions || data.history || [])
    } catch (err) {
      setError('Failed to load chat history. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (sid) => {
    try {
      await deleteChatSession(sid)
      setSessions((prev) => prev.filter((s) => (s.session_id || s.id) !== sid))
      setDeleteConfirm(null)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown'
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const filteredSessions = sessions.filter((s) => {
    if (!search) return true
    const title = (s.title || s.topic || '').toLowerCase()
    const firstMsg = (s.first_message || '').toLowerCase()
    return title.includes(search.toLowerCase()) || firstMsg.includes(search.toLowerCase())
  })

  if (loading) return <LoadingSpinner text="Loading chat history..." />

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Chat History</h2>
            <p className="text-xs text-gray-500">{sessions.length} conversation{sessions.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-11 pr-4 py-3 bg-navy-800/60 border border-navy-500/50 rounded-xl text-sm text-white placeholder-gray-600 focus:border-cyan-500/50"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No Conversations</h3>
          <p className="text-sm text-gray-600 mb-6">
            {search ? 'No conversations match your search' : 'Start a chat to see your history here'}
          </p>
          <button
            onClick={() => navigate('/chat')}
            className="px-5 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
          >
            Start New Chat
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSessions.map((session, idx) => {
            const sid = session.session_id || session.id
            const title = session.title || session.topic || session.first_message || `Chat Session`
            const msgCount = session.message_count || session.messages?.length || 0
            const date = session.created_at || session.timestamp || session.date

            return (
              <div
                key={sid || idx}
                className="glass-card rounded-xl p-4 card-hover group animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-navy-700/80 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-cyan-400/60" />
                  </div>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/chat/${sid}`)}
                  >
                    <p className="text-sm font-medium text-white truncate group-hover:text-cyan-400 transition-colors">
                      {title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {formatDate(date)}
                      </span>
                      {msgCount > 0 && (
                        <span className="text-xs text-gray-600">
                          {msgCount} message{msgCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {deleteConfirm === sid ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(sid)}
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-1 bg-navy-600 text-gray-400 rounded-lg text-xs font-medium hover:bg-navy-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(sid)}
                        className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/chat/${sid}`)}
                      className="p-2 rounded-lg text-gray-600 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
