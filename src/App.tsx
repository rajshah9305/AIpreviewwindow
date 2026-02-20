import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Generator from './pages/Generator'
import Settings from './pages/Settings'
import History from './pages/History'
import DesignSystem from './pages/DesignSystem'
import { GenerationProvider } from './contexts/GenerationContext'
import { ToastProvider } from './components/ToastContainer'

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <GenerationProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/generator" replace />} />
                <Route path="/generator" element={<Generator />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/history" element={<History />} />
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="*" element={<Navigate to="/generator" replace />} />
              </Routes>
            </Layout>
          </GenerationProvider>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
