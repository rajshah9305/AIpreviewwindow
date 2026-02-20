import { generateUIComponents } from './lib/generator.js'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

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
    
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Failed to generate components',
      details: error.stack
    })
  }
}
