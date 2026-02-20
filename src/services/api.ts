import { GenerationRequest, GenerationResult, AISettings } from '../types'

export const generateComponents = async (request: GenerationRequest): Promise<GenerationResult> => {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to generate components')
  }
  
  return response.json()
}

export const saveSettings = (settings: AISettings): void => {
  localStorage.setItem('aiSettings', JSON.stringify(settings))
}

export const loadSettings = (): AISettings | null => {
  const stored = localStorage.getItem('aiSettings')
  return stored ? JSON.parse(stored) : null
}

export const clearSettings = (): void => {
  localStorage.removeItem('aiSettings')
}

export const saveToHistory = (result: GenerationResult): void => {
  const history = loadHistory()
  history.unshift(result)
  localStorage.setItem('generationHistory', JSON.stringify(history.slice(0, 50)))
}

export const loadHistory = (): GenerationResult[] => {
  const stored = localStorage.getItem('generationHistory')
  return stored ? JSON.parse(stored) : []
}

export const clearHistory = (): void => {
  localStorage.removeItem('generationHistory')
}

// Clean up old persisted generation state on app load
export const cleanupOldState = (): void => {
  localStorage.removeItem('generationState')
}
