import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Generator from './pages/Generator'
import Settings from './pages/Settings'
import History from './pages/History'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/generator" replace />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
