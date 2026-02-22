/**
 * Generation context
 * Manages component generation state and operations
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { apiClient } from '../lib/api-client'
import { storage } from '../lib/storage'
import { validateInstruction, validateSettings, ValidationError } from '../lib/validation'
import type { GenerationResult } from '../types'

interface GenerationContextValue {
  instruction: string
  setInstruction: (instruction: string) => void
  loading: boolean
  result: GenerationResult | null
  error: string | null
  clearError: () => void
  handleGenerate: () => Promise<void>
  clearResult: () => void
}

const GenerationContext = createContext<GenerationContextValue | undefined>(undefined)

export const GenerationProvider = ({ children }: { children: ReactNode }) => {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    storage.cleanupOldState()
  }, [])

  const handleGenerate = useCallback(async () => {
    try {
      const settings = storage.loadSettings()
      
      validateSettings(settings)
      validateInstruction(instruction)

      setLoading(true)
      setError(null)
      setResult(null)

      const generatedResult = await apiClient.generateComponents({
        instruction: instruction.trim(),
        settings: settings!,
      })

      setResult(generatedResult)
      storage.saveToHistory(generatedResult)
    } catch (err) {
      const errorMessage = err instanceof ValidationError || err instanceof Error
        ? err.message
        : 'Failed to generate components'
      setError(errorMessage)
      console.error('Generation error:', err)
    } finally {
      setLoading(false)
    }
  }, [instruction])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const clearResult = useCallback(() => {
    setResult(null)
  }, [])

  const value: GenerationContextValue = {
    instruction,
    setInstruction,
    loading,
    result,
    error,
    clearError,
    handleGenerate,
    clearResult,
  }

  return (
    <GenerationContext.Provider value={value}>
      {children}
    </GenerationContext.Provider>
  )
}

export const useGeneration = () => {
  const context = useContext(GenerationContext)
  if (!context) {
    throw new Error('useGeneration must be used within a GenerationProvider')
  }
  return context
}
