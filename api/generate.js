import { generateUIComponents } from './lib/generator.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ message: 'Method not allowed' })

  const { instruction, settings } = req.body ?? {}

  if (!instruction?.trim())       return res.status(400).json({ message: 'instruction is required' })
  if (!settings?.apiKey?.trim())  return res.status(400).json({ message: 'settings.apiKey is required' })
  if (!settings?.modelName?.trim()) return res.status(400).json({ message: 'settings.modelName is required' })
  if (!settings?.baseUrl?.trim()) return res.status(400).json({ message: 'settings.baseUrl is required' })

  try {
    const result = await generateUIComponents(instruction, settings)
    return res.status(200).json(result)
  } catch (err) {
    return res.status(500).json({ message: err.message ?? 'Generation failed' })
  }
}
