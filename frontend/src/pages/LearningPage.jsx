import { useState } from 'react'
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  ListChecks,
  Briefcase,
  Sparkles,
  ChevronDown,
  RotateCcw,
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import QuizCard from '../components/QuizCard'
import { summarizeTopic, generateQuiz, generateMCQ, generateInterviewQuestions } from '../services/api'

const cloudTopics = [
  'Cloud Computing Fundamentals',
  'AWS Services',
  'Microsoft Azure',
  'Google Cloud Platform',
  'Docker & Containerization',
  'Kubernetes & Orchestration',
  'Cloud Security',
  'Cloud Networking',
  'Serverless Computing',
  'Virtualization',
  'DevOps & CI/CD',
  'Cloud Storage & Databases',
]

const tabs = [
  { id: 'summary', label: 'Topic Summary', icon: BookOpen },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle },
  { id: 'mcq', label: 'MCQ Test', icon: ListChecks },
  { id: 'interview', label: 'Interview Prep', icon: Briefcase },
]

export default function LearningPage() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [activeTab, setActiveTab] = useState('summary')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [numQuestions, setNumQuestions] = useState(5)
  const [difficulty, setDifficulty] = useState('intermediate')

  // Results state
  const [summary, setSummary] = useState(null)
  const [quizData, setQuizData] = useState(null)
  const [mcqData, setMcqData] = useState(null)
  const [interviewData, setInterviewData] = useState(null)

  const handleGenerate = async () => {
    if (!selectedTopic) return

    setLoading(true)
    setError(null)

    try {
      switch (activeTab) {
        case 'summary': {
          const res = await summarizeTopic(selectedTopic)
          setSummary(res.data.summary || res.data.content || res.data)
          break
        }
        case 'quiz': {
          const res = await generateQuiz(selectedTopic, numQuestions)
          setQuizData(res.data.questions || res.data.quiz || res.data)
          break
        }
        case 'mcq': {
          const res = await generateMCQ(selectedTopic, numQuestions)
          setMcqData(res.data.questions || res.data.mcq || res.data)
          break
        }
        case 'interview': {
          const res = await generateInterviewQuestions(selectedTopic, difficulty)
          setInterviewData(res.data.questions || res.data.interview || res.data)
          break
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to generate content')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSummary(null)
    setQuizData(null)
    setMcqData(null)
    setInterviewData(null)
    setError(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Learning Hub</h2>
          <p className="text-xs text-gray-500">Master cloud computing with AI-generated content</p>
        </div>
      </div>

      {/* Topic Selection */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Select a Topic
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {cloudTopics.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSelectedTopic(topic)
                handleReset()
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                selectedTopic === topic
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-navy-800/50 text-gray-400 border border-navy-500/30 hover:bg-navy-700/50 hover:text-gray-300 hover:border-navy-400/50'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {selectedTopic && (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                      : 'bg-navy-800/50 text-gray-400 border border-navy-500/30 hover:bg-navy-700/50 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Controls */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Topic
                </p>
                <p className="text-sm text-cyan-400 font-medium">{selectedTopic}</p>
              </div>

              {(activeTab === 'quiz' || activeTab === 'mcq') && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Questions
                  </p>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="px-3 py-2 bg-navy-800 border border-navy-500 rounded-lg text-sm text-white"
                  >
                    {[3, 5, 7, 10].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              {activeTab === 'interview' && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Difficulty
                  </p>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="px-3 py-2 bg-navy-800 border border-navy-500 rounded-lg text-sm text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2 ml-auto">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 bg-navy-700/50 text-gray-400 rounded-xl text-sm font-medium hover:bg-navy-700 hover:text-gray-300 transition-colors border border-navy-500/30"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && <LoadingSpinner text={`Generating ${activeTab}...`} />}

          {/* Results */}
          {!loading && (
            <div className="animate-fade-in">
              {/* Summary Result */}
              {activeTab === 'summary' && summary && (
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    {selectedTopic} - Summary
                  </h3>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {typeof summary === 'string' ? summary : JSON.stringify(summary, null, 2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Quiz Result */}
              {activeTab === 'quiz' && quizData && (
                <QuizCard
                  questions={Array.isArray(quizData) ? quizData : [quizData]}
                  type="quiz"
                />
              )}

              {/* MCQ Result */}
              {activeTab === 'mcq' && mcqData && (
                <QuizCard
                  questions={Array.isArray(mcqData) ? mcqData : [mcqData]}
                  type="mcq"
                />
              )}

              {/* Interview Questions */}
              {activeTab === 'interview' && interviewData && (
                <div className="space-y-4">
                  {(Array.isArray(interviewData) ? interviewData : [interviewData]).map(
                    (item, idx) => (
                      <InterviewCard key={idx} item={item} index={idx} />
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function InterviewCard({ item, index }) {
  const [showAnswer, setShowAnswer] = useState(false)

  const question = item.question || item.q || (typeof item === 'string' ? item : '')
  const answer = item.answer || item.a || item.expected_answer || ''
  const difficultyLevel = item.difficulty || ''

  const diffColors = {
    beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
  }

  return (
    <div className="glass-card rounded-2xl p-5 animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-xs font-bold text-purple-400">Q{index + 1}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="text-sm font-medium text-white leading-relaxed">{question}</p>
            {difficultyLevel && (
              <span
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize flex-shrink-0 border ${
                  diffColors[difficultyLevel.toLowerCase()] || diffColors.intermediate
                }`}
              >
                {difficultyLevel}
              </span>
            )}
          </div>

          {answer && (
            <>
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex items-center gap-1 text-xs font-medium text-cyan-500/70 hover:text-cyan-400 transition-colors mb-2"
              >
                {showAnswer ? 'Hide' : 'Show'} Answer
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${showAnswer ? 'rotate-180' : ''}`}
                />
              </button>

              {showAnswer && (
                <div className="bg-navy-800/60 rounded-xl p-4 border border-navy-500/30 animate-fade-in">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {answer}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
