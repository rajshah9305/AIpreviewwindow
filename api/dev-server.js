import express from 'express'
import cors from 'cors'
import generateHandler from './generate.js'
import healthHandler from './health.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Wrap Vercel handlers for Express
app.post('/api/generate', (req, res) => {
  generateHandler(req, res)
})

app.get('/api/health', (req, res) => {
  healthHandler(req, res)
})

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`🚀 Development API server running on http://localhost:${PORT}`)
    console.log(`📡 Endpoints:`)
    console.log(`   POST http://localhost:${PORT}/api/generate`)
    console.log(`   GET  http://localhost:${PORT}/api/health`)
  }
})
