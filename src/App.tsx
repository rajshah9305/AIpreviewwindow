import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Generator from './pages/Generator'
import Settings from './pages/Settings'
import History from './pages/History'
import { GenerationProvider } from './contexts/GenerationContext'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <GenerationProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/generator" replace />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Layout>
        </GenerationProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
