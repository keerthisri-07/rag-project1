import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

// ===== System =====
export const getStatus = () => api.get('/status')

// ===== Chat =====
export const sendMessage = (sessionId, message) =>
  api.post('/chat/message', { sessionId, message })

export const getChatHistory = () => api.get('/chat/history')

export const getChatSession = (sessionId) =>
  api.get(`/chat/session/${sessionId}`)

export const deleteChatSession = (sessionId) =>
  api.delete(`/chat/session/${sessionId}`)

// ===== Learning =====
export const summarizeTopic = (topic) =>
  api.post('/learning/summarize', { topic })

export const generateQuiz = (topic, numQuestions = 5) =>
  api.post('/learning/quiz', { topic, numQuestions })

export const generateMCQ = (topic, numQuestions = 5) =>
  api.post('/learning/mcq', { topic, numQuestions })

export const generateInterviewQuestions = (topic, difficulty = 'intermediate') =>
  api.post('/learning/interview', { topic, difficulty })

// ===== Evaluation =====
export const runEvaluation = () => api.post('/evaluation/run')

export const getEvaluationResults = () => api.get('/evaluation/results')

export const getLatestResult = () => api.get('/evaluation/latest')

// ===== Documents =====
export const getDocuments = () => api.get('/documents')

export const getDocumentStats = () => api.get('/documents/stats')

export default api
