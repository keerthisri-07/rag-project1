import { useState } from 'react'
import { Copy, Check, User, Bot, ChevronDown, ChevronUp } from 'lucide-react'
import SourceCard from './SourceCard'

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false)
  const [showSources, setShowSources] = useState(false)

  const isUser = message.role === 'user'
  const sources = message.sources || message.context || []
  const confidence = message.confidence

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = message.content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatTimestamp = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      className={`flex gap-3 animate-fade-in ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
            : 'bg-gradient-to-br from-cyan-500 to-teal-500'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`${
            isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'
          } px-5 py-3 shadow-lg`}
        >
          <div className="text-sm text-white leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>

        {/* Meta info */}
        <div
          className={`flex items-center gap-3 mt-1.5 px-2 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {message.timestamp && (
            <span className="text-[10px] text-gray-600">
              {formatTimestamp(message.timestamp)}
            </span>
          )}

          {/* Confidence badge */}
          {!isUser && confidence !== undefined && (
            <span
              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                confidence >= 0.8
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : confidence >= 0.5
                  ? 'bg-yellow-500/10 text-yellow-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {(confidence * 100).toFixed(0)}% confident
            </span>
          )}

          {/* Copy button */}
          {!isUser && (
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-600 hover:text-gray-400 transition-colors"
              title="Copy message"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Sources toggle */}
          {!isUser && sources.length > 0 && (
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1 text-[10px] font-medium text-cyan-500/70 hover:text-cyan-400 transition-colors"
            >
              {sources.length} source{sources.length !== 1 ? 's' : ''}
              {showSources ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          )}
        </div>

        {/* Sources */}
        {!isUser && showSources && sources.length > 0 && (
          <div className="mt-2 space-y-2 w-full">
            {sources.map((source, idx) => (
              <SourceCard key={idx} source={source} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
