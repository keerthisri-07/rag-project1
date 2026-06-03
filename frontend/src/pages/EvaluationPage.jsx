import { useState, useEffect } from 'react'
import {
  BarChart3,
  Play,
  TrendingUp,
  Target,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts'
import LoadingSpinner from '../components/LoadingSpinner'
import { runEvaluation, getLatestResult } from '../services/api'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-800 border border-navy-500 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(3) : p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function EvaluationPage() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      setFetching(true)
      const res = await getLatestResult()
      if (res.data && Object.keys(res.data).length > 0) {
        setResults(res.data)
      }
    } catch {
      // No previous results
    } finally {
      setFetching(false)
    }
  }

  const handleRunEvaluation = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await runEvaluation()
      if (res.data && res.data.results) {
        setResults(res.data.results)
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Evaluation failed')
    } finally {
      setLoading(false)
    }
  }

  // Extract metrics (handle both CamelCase from Mongoose schema and snake_case fallbacks)
  const retrievalMetrics = results?.retrievalMetrics || results?.retrieval_metrics || results?.retrieval || {}
  const answerMetrics = results?.answerMetrics || results?.answer_quality || results?.answer_metrics || {}
  const perQuery = results?.queryResults || results?.per_query_results || results?.details || []

  // Prepare chart data
  const retrievalChartData = [
    {
      name: 'Precision@5',
      value: retrievalMetrics.precisionAt5 || retrievalMetrics.precision_at_5 || retrievalMetrics.precision || 0,
      color: '#22d3ee',
    },
    {
      name: 'Recall@5',
      value: retrievalMetrics.recallAt5 || retrievalMetrics.recall_at_5 || retrievalMetrics.recall || 0,
      color: '#14b8a6',
    },
    {
      name: 'MRR',
      value: retrievalMetrics.mrr || retrievalMetrics.mean_reciprocal_rank || 0,
      color: '#a78bfa',
    },
  ]

  const radarData = [
    {
      metric: 'Relevance',
      value: (answerMetrics.relevanceScore || answerMetrics.relevance || answerMetrics.answer_relevance || 0) * 100,
    },
    {
      metric: 'Faithfulness',
      value: (answerMetrics.faithfulnessScore || answerMetrics.faithfulness || 0) * 100,
    },
    {
      metric: 'Context',
      value: (answerMetrics.contextUtilization || answerMetrics.context_utilization || answerMetrics.context_precision || 0) * 100,
    },
    {
      metric: 'Completeness',
      value: (answerMetrics.completenessScore || answerMetrics.completeness || answerMetrics.answer_completeness || 0) * 100,
    },
  ]

  if (fetching) return <LoadingSpinner text="Loading evaluation data..." />

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">RAG Evaluation</h2>
            <p className="text-xs text-gray-500">Analyze retrieval and answer quality metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {results && (
            <button
              onClick={fetchResults}
              className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Refresh results"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleRunEvaluation}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run Evaluation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner text="Running evaluation pipeline... This may take a minute." size="lg" />}

      {/* No Results */}
      {!loading && !results && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Evaluation Data</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Run an evaluation to see retrieval precision, recall, MRR, and answer quality metrics
            for your RAG pipeline.
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Precision@5',
                value: retrievalMetrics.precision_at_5 || retrievalMetrics.precision || 0,
                icon: Target,
                color: 'cyan',
              },
              {
                label: 'Recall@5',
                value: retrievalMetrics.recall_at_5 || retrievalMetrics.recall || 0,
                icon: Eye,
                color: 'emerald',
              },
              {
                label: 'Faithfulness',
                value: answerMetrics.faithfulness || 0,
                icon: CheckCircle2,
                color: 'purple',
              },
              {
                label: 'Relevance',
                value: answerMetrics.relevance || answerMetrics.answer_relevance || 0,
                icon: TrendingUp,
                color: 'amber',
              },
            ].map((m) => (
              <div key={m.label} className="glass-card rounded-2xl p-5 card-hover">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-${m.color}-500/15 flex items-center justify-center`}>
                    <m.icon className={`w-4 h-4 text-${m.color}-400`} />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {m.label}
                  </p>
                </div>
                <p className={`text-3xl font-bold text-${m.color}-400`}>
                  {(m.value * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Retrieval Metrics Bar Chart */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                Retrieval Metrics
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retrievalChartData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#1e293b' }}
                    />
                    <YAxis
                      domain={[0, 1]}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#1e293b' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {retrievalChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Answer Quality Radar Chart */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                Answer Quality
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid stroke="#1e293b" />
                    <PolarAngleAxis
                      dataKey="metric"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      domain={[0, 100]}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                      axisLine={false}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#22d3ee"
                      fill="#22d3ee"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Per-Query Results */}
          {perQuery.length > 0 && (
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Per-Query Results
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-navy-500/30">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Query
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Precision
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Recall
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Faithfulness
                      </th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Relevance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {perQuery.map((row, idx) => {
                      const expected = row.expectedTopics || []
                      const retrieved = row.retrievedTopics || []
                      const relevantSet = new Set(expected.map(t => t.toLowerCase()))
                      const retrievedSet = new Set(retrieved.map(t => t.toLowerCase()))
                      
                      let hits = 0
                      retrievedSet.forEach(item => {
                        if (relevantSet.has(item)) hits++
                      })
                      
                      const precision = retrievedSet.size > 0 ? hits / Math.min(5, retrievedSet.size) : 0
                      const recall = relevantSet.size > 0 ? hits / relevantSet.size : 0
                      const scores = row.scores || {}
                      
                      return (
                        <tr
                          key={idx}
                          className="border-b border-navy-500/15 hover:bg-navy-800/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-gray-300 max-w-xs truncate" title={row.query}>
                            {row.query || row.question || `Query ${idx + 1}`}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <MetricBadge value={precision} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <MetricBadge value={recall} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <MetricBadge value={scores.faithfulness !== undefined ? scores.faithfulness : row.faithfulness} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <MetricBadge value={scores.relevance !== undefined ? scores.relevance : (row.relevance || row.answer_relevance)} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MetricBadge({ value }) {
  if (value === undefined || value === null) return <span className="text-gray-600">-</span>

  const percentage = (value * 100).toFixed(1)
  const color =
    value >= 0.8
      ? 'text-emerald-400 bg-emerald-500/10'
      : value >= 0.5
      ? 'text-yellow-400 bg-yellow-500/10'
      : 'text-red-400 bg-red-500/10'

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${color}`}>
      {percentage}%
    </span>
  )
}
