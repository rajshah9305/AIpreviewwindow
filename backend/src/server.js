import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { generateUIComponents } from './generator.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post('/api/generate', async (req, res) => {
  try {
    const { instruction, settings } = req.body
    
    if (!instruction?.trim()) {
      return res.status(400).json({ message: 'Instruction is required' })
    }
    
    if (!settings?.apiKey?.trim()) {
      return res.status(400).json({ message: 'API key is required in settings' })
    }

    if (!settings?.modelName?.trim()) {
      return res.status(400).json({ message: 'Model name is required in settings' })
    }

    if (!settings?.baseUrl?.trim()) {
      return res.status(400).json({ message: 'Base URL is required in settings' })
    }
    
    const result = await generateUIComponents(instruction, settings)
    res.json(result)
  } catch (error) {
    console.error('Generation error:', error)
    res.status(500).json({ 
      message: error.message || 'Failed to generate components' 
    })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})
