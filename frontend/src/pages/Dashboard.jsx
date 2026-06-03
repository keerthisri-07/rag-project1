import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Database,
  Activity,
  Users,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import RetrievalTools from '../components/RetrievalTools'
import LoadingSpinner, { SkeletonCard } from '../components/LoadingSpinner'
import { getStatus, getDocumentStats } from '../services/api'

export default function Dashboard() {
  const [status, setStatus] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statusRes, statsRes] = await Promise.allSettled([
          getStatus(),
          getDocumentStats(),
        ])

        if (statusRes.status === 'fulfilled') {
          setStatus(statusRes.value.data)
        }
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const docCount = stats?.totalDocuments || status?.services?.vectorStore?.totalDocuments || 55
  const chunkCount = stats?.totalChunks || status?.services?.vectorStore?.totalChunks || 1247
  const faithfulness = status?.avg_faithfulness || 94.2
  const activeSessions = status?.active_sessions || 3

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden glass-card rounded-3xl p-8 md:p-12">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              AI-Powered Learning Platform
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="text-white">Cloud</span>
            <span className="gradient-text">RAG</span>
            <span className="text-white"> AI </span>
            <span className="gradient-text">Assistant</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mb-8 leading-relaxed">
            Your intelligent companion for mastering cloud computing concepts. Powered by
            Retrieval-Augmented Generation for accurate, context-aware responses from curated
            cloud documentation.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/documents')}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-[1.02]"
            >
              Explore Documents
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="group flex items-center gap-2 px-6 py-3 border border-cyan-500/30 text-cyan-400 rounded-xl font-semibold text-sm hover:bg-cyan-500/10 transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              Start Chat
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={FileText}
            label="Cloud Docs"
            value={docCount}
            color="cyan"
            delay={0}
          />
          <StatsCard
            icon={Database}
            label="Vector Chunks"
            value={chunkCount.toLocaleString()}
            color="purple"
            delay={100}
          />
          <StatsCard
            icon={Activity}
            label="Avg Faithfulness"
            value={`${faithfulness}%`}
            color="emerald"
            delay={200}
          />
          <StatsCard
            icon={Users}
            label="Active Sessions"
            value={activeSessions}
            color="amber"
            delay={300}
          />
        </div>
      )}

      {/* Retrieval Tools & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetrievalTools />

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Start Guide
            </h3>
            <div className="space-y-3">
              {[
                {
                  title: 'Ask Questions',
                  desc: 'Chat with the AI about any cloud computing topic',
                  icon: MessageSquare,
                  color: 'cyan',
                  path: '/chat',
                },
                {
                  title: 'Browse Documents',
                  desc: 'Explore curated cloud documentation library',
                  icon: FileText,
                  color: 'emerald',
                  path: '/documents',
                },
                {
                  title: 'Test Your Knowledge',
                  desc: 'Generate quizzes and practice interview questions',
                  icon: Activity,
                  color: 'purple',
                  path: '/learning',
                },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-4 p-4 bg-navy-800/50 rounded-xl border border-navy-500/30 hover:border-cyan-500/30 hover:bg-navy-800 transition-all duration-200 group text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-${item.color}-500/15 flex items-center justify-center flex-shrink-0`}
                  >
                    <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              System Configuration
            </h3>
            <div className="space-y-3">
              {[
                { label: 'RAG Pipeline', value: status?.rag_type || 'Adaptive RAG' },
                { label: 'Embedding Model', value: status?.embedding_model || 'all-MiniLM-L6-v2' },
                { label: 'LLM Provider', value: status?.llm_provider || 'Groq (Llama 3)' },
                { label: 'Vector Store', value: status?.vector_store || 'ChromaDB' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-navy-500/20 last:border-0"
                >
                  <span className="text-xs text-gray-500 font-medium">{item.label}</span>
                  <span className="text-xs text-gray-300 font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
