// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import LoadingSkeleton from './components/LoadingSkeleton'
import { GenerationProvider } from './contexts/GenerationContext'
import { ToastProvider } from './components/ToastContainer'

// Lazy load pages for code splitting
const Generator = lazy(() => import('./pages/Generator'))
const Settings = lazy(() => import('./pages/Settings'))
const History = lazy(() => import('./pages/History'))

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <GenerationProvider>
          <ToastProvider>
            <Layout>
              <Suspense fallback={<LoadingSkeleton />}>
                <Routes>
                  <Route path="/" element={<Generator />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/history" element={<History />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </ToastProvider>
        </GenerationProvider>
      </ErrorBoundary>
    </Router>
  )
}

export default App
