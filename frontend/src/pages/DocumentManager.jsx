import { useState, useEffect } from 'react'
import {
  FileText,
  Search,
  Grid3x3,
  List,
  Filter,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Database,
  Tag,
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import StatsCard from '../components/StatsCard'
import { getDocuments, getDocumentStats } from '../services/api'

const categoryConfig = {
  aws: { label: 'AWS', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  azure: { label: 'Azure', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  gcp: { label: 'GCP', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  docker: { label: 'Docker', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  kubernetes: { label: 'Kubernetes', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  security: { label: 'Security', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  virtualization: { label: 'Virtualization', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  networking: { label: 'Networking', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  general: { label: 'General', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
}

export default function DocumentManager() {
  const [documents, setDocuments] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [expandedDoc, setExpandedDoc] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [docsRes, statsRes] = await Promise.allSettled([
        getDocuments(),
        getDocumentStats(),
      ])

      if (docsRes.status === 'fulfilled') {
        const data = docsRes.value.data
        setDocuments(Array.isArray(data) ? data : data.documents || data.docs || [])
      }
      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data)
      }
    } catch (err) {
      setError('Failed to load documents')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories
  const categories = ['all', ...new Set(
    documents.map((d) => (d.category || d.metadata?.category || 'general').toLowerCase())
  )]

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      !search ||
      (doc.title || doc.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (doc.content || '').toLowerCase().includes(search.toLowerCase())

    const cat = (doc.category || doc.metadata?.category || 'general').toLowerCase()
    const matchesCategory = activeCategory === 'all' || cat === activeCategory

    return matchesSearch && matchesCategory
  })

  if (loading) return <LoadingSpinner text="Loading documents..." />

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
          <FileText className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Document Manager</h2>
          <p className="text-xs text-gray-500">Browse cloud computing documentation library</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            icon={FileText}
            label="Total Documents"
            value={stats.totalDocuments || documents.length}
            color="cyan"
          />
          <StatsCard
            icon={Database}
            label="Total Chunks"
            value={stats.totalChunks || 0}
            color="purple"
          />
          <StatsCard
            icon={Tag}
            label="Categories"
            value={categories.length - 1}
            color="emerald"
          />
          <StatsCard
            icon={BookOpen}
            label="Total Words"
            value={stats.totalWords?.toLocaleString() || '0'}
            color="amber"
          />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-11 pr-4 py-2.5 bg-navy-800/60 border border-navy-500/50 rounded-xl text-sm text-white placeholder-gray-600 focus:border-cyan-500/50"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((cat) => {
            const conf = categoryConfig[cat] || { label: cat, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' }
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                    : `${conf.color} hover:opacity-80`
                }`}
              >
                {cat === 'all' ? `All (${documents.length})` : `${conf.label || cat}`}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-xs text-gray-500">
        Showing {filteredDocs.length} of {documents.length} documents
      </p>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Documents Grid / List */}
      {filteredDocs.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No Documents Found</h3>
          <p className="text-sm text-gray-600">
            {search
              ? 'No documents match your search criteria'
              : 'No documents available in this category'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, idx) => (
            <DocumentCard
              key={doc.id || idx}
              doc={doc}
              index={idx}
              expanded={expandedDoc === (doc.id || idx)}
              onToggle={() =>
                setExpandedDoc(expandedDoc === (doc.id || idx) ? null : (doc.id || idx))
              }
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc, idx) => (
            <DocumentListItem
              key={doc.id || idx}
              doc={doc}
              index={idx}
              expanded={expandedDoc === (doc.id || idx)}
              onToggle={() =>
                setExpandedDoc(expandedDoc === (doc.id || idx) ? null : (doc.id || idx))
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DocumentCard({ doc, index, expanded, onToggle }) {
  const category = (doc.category || doc.metadata?.category || 'general').toLowerCase()
  const conf = categoryConfig[category] || categoryConfig.general
  const title = doc.title || doc.name || doc.filename || `Document ${index + 1}`
  const wordCount = doc.word_count || doc.metadata?.word_count || 0
  const difficulty = doc.difficulty || doc.metadata?.difficulty || ''
  const content = doc.content || doc.text || ''

  return (
    <div
      className="glass-card rounded-2xl p-5 card-hover animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 40}ms` }}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-navy-700/80 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5 h-5 text-cyan-400/60" />
        </div>
        <span
          className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider border ${conf.color}`}
        >
          {category}
        </span>
      </div>

      <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">{title}</h4>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        {wordCount > 0 && <span>{wordCount.toLocaleString()} words</span>}
        {difficulty && (
          <span className="capitalize px-2 py-0.5 bg-navy-700/50 rounded-full">{difficulty}</span>
        )}
      </div>

      {expanded && content && (
        <div className="mt-4 pt-4 border-t border-navy-500/30 animate-fade-in">
          <p className="text-xs text-gray-400 leading-relaxed">
            {content.length > 400 ? `${content.substring(0, 400)}...` : content}
          </p>
        </div>
      )}
    </div>
  )
}

function DocumentListItem({ doc, index, expanded, onToggle }) {
  const category = (doc.category || doc.metadata?.category || 'general').toLowerCase()
  const conf = categoryConfig[category] || categoryConfig.general
  const title = doc.title || doc.name || doc.filename || `Document ${index + 1}`
  const wordCount = doc.word_count || doc.metadata?.word_count || 0
  const content = doc.content || doc.text || ''

  return (
    <div
      className="glass-card rounded-xl p-4 card-hover animate-fade-in cursor-pointer"
      style={{ animationDelay: `${index * 30}ms` }}
      onClick={onToggle}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-navy-700/80 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-cyan-400/60" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{title}</p>
          <div className="flex items-center gap-3 mt-1">
            <span
              className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider border ${conf.color}`}
            >
              {category}
            </span>
            {wordCount > 0 && (
              <span className="text-xs text-gray-600">{wordCount.toLocaleString()} words</span>
            )}
          </div>
        </div>

        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </div>

      {expanded && content && (
        <div className="mt-3 pt-3 border-t border-navy-500/30 animate-fade-in ml-12">
          <p className="text-xs text-gray-400 leading-relaxed">
            {content.length > 600 ? `${content.substring(0, 600)}...` : content}
          </p>
        </div>
      )}
    </div>
  )
}
