import express from 'express'
import cors from 'cors'
import generateHandler from './generate.js'
import healthHandler from './health.js'
import testConnectionHandler from './test-connection.js'

const app  = express()
const PORT = process.env.PORT ?? 3000

app.use(cors())
app.use(express.json())

app.post('/api/generate',        (req, res) => generateHandler(req, res))
app.get('/api/health',           (req, res) => healthHandler(req, res))
app.post('/api/test-connection', (req, res) => testConnectionHandler(req, res))

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
