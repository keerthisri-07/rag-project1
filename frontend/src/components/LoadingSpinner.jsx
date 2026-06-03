export default function LoadingSpinner({ text = 'Loading...', size = 'md' }) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-navy-500 border-t-cyan-400 animate-spin`}
        />
        <div
          className={`absolute inset-1 rounded-full border-2 border-navy-600 border-b-teal-400 animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {text && <p className="text-sm text-gray-400 animate-pulse">{text}</p>}
    </div>
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`glass-card rounded-2xl p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl skeleton" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 rounded skeleton" />
          <div className="h-6 w-16 rounded skeleton" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }) {
  return <div className={`${width} ${height} rounded skeleton`} />
}

export function SkeletonParagraph({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine
          key={i}
          width={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-4 px-5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-white">AI</span>
      </div>
      <div className="chat-bubble-assistant px-5 py-3">
        <div className="flex gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  )
}
