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
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <GenerationProvider>
            <Layout>
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                  <div className="h-[450px] sm:h-[500px] md:h-[550px]">
                    <LoadingSkeleton />
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Navigate to="/generator" replace />} />
                  <Route path="/generator" element={<Generator />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/history" element={<History />} />
                  <Route path="*" element={<Navigate to="/generator" replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </GenerationProvider>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
