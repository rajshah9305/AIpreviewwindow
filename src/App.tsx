import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import LoadingSkeleton from './components/LoadingSkeleton'
import { GenerationProvider } from './contexts/GenerationContext'
import { ToastProvider } from './components/ToastContainer'
import { ROUTES } from './config/constants'

const Generator = lazy(() => import('./pages/Generator'))
const History   = lazy(() => import('./pages/History'))
const Settings  = lazy(() => import('./pages/Settings'))

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <GenerationProvider>
          <ToastProvider>
            <Layout>
              <Suspense fallback={<LoadingSkeleton />}>
                <Routes>
                  <Route path="/"          element={<Navigate to={ROUTES.GENERATOR} replace />} />
                  <Route path="/generator" element={<Generator />} />
                  <Route path="/history"   element={<History />} />
                  <Route path="/settings"  element={<Settings />} />
                  <Route path="*"          element={<Navigate to={ROUTES.GENERATOR} replace />} />
                </Routes>
              </Suspense>
            </Layout>
          </ToastProvider>
        </GenerationProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
