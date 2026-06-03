import { useState } from 'react'
import { ChevronDown, ChevronUp, FileText, Hash } from 'lucide-react'

const categoryColors = {
  aws: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  azure: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  gcp: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  docker: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
  kubernetes: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  security: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  virtualization: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  general: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' },
}

export default function SourceCard({ source, index }) {
  const [expanded, setExpanded] = useState(false)

  const category = (source.category || source.metadata?.category || 'general').toLowerCase()
  const colors = categoryColors[category] || categoryColors.general
  const title = source.title || source.metadata?.title || source.document || `Source ${index + 1}`
  const score = source.score || source.similarity_score || 0
  const content = source.content || source.text || source.chunk_text || ''

  // Score color
  const getScoreColor = (s) => {
    if (s >= 0.8) return 'text-emerald-400'
    if (s >= 0.6) return 'text-yellow-400'
    if (s >= 0.4) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBarColor = (s) => {
    if (s >= 0.8) return 'from-emerald-500 to-emerald-400'
    if (s >= 0.6) return 'from-yellow-500 to-yellow-400'
    if (s >= 0.4) return 'from-orange-500 to-orange-400'
    return 'from-red-500 to-red-400'
  }

  return (
    <div className="bg-navy-800/60 border border-navy-500/40 rounded-xl p-4 card-hover animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FileText className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate mb-1">{title}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase tracking-wider ${colors.bg} ${colors.text} border ${colors.border}`}
              >
                {category}
              </span>
              {score > 0 && (
                <span className={`text-xs font-mono font-semibold ${getScoreColor(score)}`}>
                  {(score * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors flex-shrink-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Confidence Score Bar */}
      {score > 0 && (
        <div className="mt-3">
          <div className="h-1 bg-navy-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(score)} transition-all duration-500`}
              style={{ width: `${score * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Expanded Content */}
      {expanded && content && (
        <div className="mt-3 pt-3 border-t border-navy-500/30">
          <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap">
            {content.length > 500 ? `${content.substring(0, 500)}...` : content}
          </p>
          {source.metadata?.chunk_index !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-gray-600">
              <Hash className="w-3 h-3" />
              <span className="text-[10px] font-mono">Chunk {source.metadata.chunk_index}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
