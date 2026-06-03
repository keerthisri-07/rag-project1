import { useState } from 'react'
import {
  Zap,
  RefreshCw,
  Shield,
  Layers,
  ArrowUpDown,
  Expand,
  Settings2,
  Activity,
} from 'lucide-react'

export default function RetrievalTools() {
  const [mode, setMode] = useState('adaptive')
  const [options, setOptions] = useState({
    hybrid: true,
    rerank: true,
    expand: false,
  })
  const [config, setConfig] = useState({
    topK: 5,
    pool: 10,
    minScore: 0.3,
  })

  const modes = [
    { id: 'standard', label: 'Standard', icon: Zap },
    { id: 'adaptive', label: 'Adaptive', icon: RefreshCw },
    { id: 'corrective', label: 'Corrective', icon: Shield },
  ]

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Retrieval Tools Panel */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Settings2 className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Retrieval Tools
          </h3>
        </div>

        {/* Mode Selector */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Mode</p>
          <div className="flex gap-2">
            {modes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  mode === id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10'
                    : 'bg-navy-600/50 text-gray-400 border border-navy-500/50 hover:bg-navy-600 hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Options</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'hybrid', label: 'Hybrid', icon: Layers },
              { key: 'rerank', label: 'Rerank', icon: ArrowUpDown },
              { key: 'expand', label: 'Expand', icon: Expand },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => toggleOption(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  options[key]
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-navy-600/50 text-gray-500 border border-navy-500/50 hover:bg-navy-600 hover:text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Config Inputs */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'topK', label: 'TOP K', min: 1, max: 20 },
            { key: 'pool', label: 'POOL', min: 5, max: 50 },
            { key: 'minScore', label: 'MIN', min: 0, max: 1, step: 0.05 },
          ].map(({ key, label, min, max, step }) => (
            <div key={key}>
              <p className="text-[10px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                {label}
              </p>
              <input
                type="number"
                value={config[key]}
                min={min}
                max={max}
                step={step || 1}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-3 py-2 bg-navy-800 border border-navy-500 rounded-lg text-sm text-white text-center font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30 transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Retrieval Debugger */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Retrieval Debugger
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-navy-800/80 rounded-xl p-3 text-center border border-navy-500/30">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Mode</p>
            <p className="text-sm font-bold text-cyan-400 capitalize">{mode}</p>
          </div>
          <div className="bg-navy-800/80 rounded-xl p-3 text-center border border-navy-500/30">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Top K</p>
            <p className="text-sm font-bold text-purple-400">{config.topK}</p>
          </div>
          <div className="bg-navy-800/80 rounded-xl p-3 text-center border border-navy-500/30">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Pool</p>
            <p className="text-sm font-bold text-emerald-400">{config.pool}</p>
          </div>
        </div>

        {/* Active Badges */}
        <div className="flex flex-wrap gap-2">
          {options.hybrid && (
            <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/20">
              Hybrid Search
            </span>
          )}
          {options.rerank && (
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/20">
              Reranking
            </span>
          )}
          {options.expand && (
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
              Query Expansion
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
