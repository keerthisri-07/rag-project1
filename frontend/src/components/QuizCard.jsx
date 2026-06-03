import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react'

export default function QuizCard({ questions, type = 'mcq' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResults, setShowResults] = useState({})
  const [completed, setCompleted] = useState(false)

  if (!questions || questions.length === 0) return null

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(showResults).length

  // Calculate score
  const score = Object.entries(showResults).reduce((acc, [idx, shown]) => {
    if (!shown) return acc
    const q = questions[parseInt(idx)]
    const selected = selectedAnswers[parseInt(idx)]
    if (!q || selected === undefined) return acc
    const correctAnswer = q.correct_answer || q.answer
    if (type === 'mcq') {
      return acc + (selected === correctAnswer ? 1 : 0)
    }
    return acc
  }, 0)

  const handleSelect = (questionIdx, answer) => {
    if (showResults[questionIdx]) return // Already answered
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: answer }))
  }

  const handleSubmitAnswer = (questionIdx) => {
    setShowResults((prev) => ({ ...prev, [questionIdx]: true }))
    if (answeredCount + 1 >= totalQuestions) {
      setTimeout(() => setCompleted(true), 500)
    }
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSelectedAnswers({})
    setShowResults({})
    setCompleted(false)
  }

  const isCorrect = (questionIdx) => {
    const q = questions[questionIdx]
    const selected = selectedAnswers[questionIdx]
    const correctAnswer = q.correct_answer || q.answer
    return selected === correctAnswer
  }

  // Score summary
  if (completed) {
    const percentage = Math.round((score / totalQuestions) * 100)
    return (
      <div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
        <p className="text-4xl font-bold gradient-text mb-2">
          {score}/{totalQuestions}
        </p>
        <p className="text-gray-400 mb-1">{percentage}% Correct</p>
        <div className="w-full h-3 bg-navy-700 rounded-full overflow-hidden my-4 max-w-xs mx-auto">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              percentage >= 80
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : percentage >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                : 'bg-gradient-to-r from-red-500 to-red-400'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <button
          onClick={handleReset}
          className="mt-4 px-6 py-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-400">
          Question {currentIndex + 1} of {totalQuestions}
        </p>
        <p className="text-sm font-medium text-cyan-400">
          {answeredCount} answered
        </p>
      </div>
      <div className="w-full h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-2xl p-6 animate-fade-in" key={currentIndex}>
        <p className="text-white font-medium mb-5 leading-relaxed">
          {currentQuestion.question}
        </p>

        {/* MCQ Options */}
        {type === 'mcq' && currentQuestion.options && (
          <div className="space-y-2.5">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIndex] === option
              const isAnswered = showResults[currentIndex]
              const correctAnswer = currentQuestion.correct_answer || currentQuestion.answer
              const optIsCorrect = option === correctAnswer

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(currentIndex, option)}
                  disabled={isAnswered}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isAnswered
                      ? optIsCorrect
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : isSelected
                        ? 'bg-red-500/15 border-red-500/40 text-red-400'
                        : 'bg-navy-800/50 border-navy-500/30 text-gray-500'
                      : isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                      : 'bg-navy-800/50 border-navy-500/30 text-gray-300 hover:bg-navy-700/50 hover:border-navy-400/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                    {isAnswered && optIsCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !optIsCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 ml-auto flex-shrink-0" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Quiz (text input) */}
        {type === 'quiz' && (
          <div className="space-y-3">
            <textarea
              value={selectedAnswers[currentIndex] || ''}
              onChange={(e) => handleSelect(currentIndex, e.target.value)}
              disabled={showResults[currentIndex]}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 bg-navy-800 border border-navy-500 rounded-xl text-sm text-white placeholder-gray-600 resize-none h-24 focus:border-cyan-500"
            />
            {showResults[currentIndex] && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-400 mb-1">Expected Answer:</p>
                <p className="text-sm text-gray-300">
                  {currentQuestion.correct_answer || currentQuestion.answer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Explanation */}
        {showResults[currentIndex] && currentQuestion.explanation && (
          <div className="mt-4 bg-navy-800/60 rounded-xl p-4 border border-navy-500/30">
            <p className="text-xs font-semibold text-purple-400 mb-1">Explanation:</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-navy-500/30">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {!showResults[currentIndex] ? (
            <button
              onClick={() => handleSubmitAnswer(currentIndex)}
              disabled={selectedAnswers[currentIndex] === undefined}
              className="px-5 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentIndex >= totalQuestions - 1}
              className="flex items-center gap-2 px-5 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
