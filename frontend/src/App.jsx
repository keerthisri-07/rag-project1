import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ChatPage from './pages/ChatPage'
import ChatHistory from './pages/ChatHistory'
import LearningPage from './pages/LearningPage'
import EvaluationPage from './pages/EvaluationPage'
import DocumentManager from './pages/DocumentManager'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:sessionId" element={<ChatPage />} />
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/evaluation" element={<EvaluationPage />} />
        <Route path="/documents" element={<DocumentManager />} />
        <Route path="/history" element={<ChatHistory />} />
      </Routes>
    </Layout>
  )
}

export default App
