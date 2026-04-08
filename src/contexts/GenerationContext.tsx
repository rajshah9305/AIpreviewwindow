import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { apiClient } from '../lib/api-client'
import { storage } from '../lib/storage'
import { validateInstruction, validateSettings, ValidationError } from '../lib/validation'
import type { GenerationResult } from '../types'

interface GenerationContextValue {
  instruction: string
  setInstruction: (v: string) => void
  loading: boolean
  result: GenerationResult | null
  error: string | null
  clearError: () => void
  handleGenerate: () => Promise<void>
  clearResult: () => void
}

const GenerationContext = createContext<GenerationContextValue | undefined>(undefined)

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [instruction, setInstruction] = useState('')
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState<GenerationResult | null>(null)
  const [error,       setError]       = useState<string | null>(null)

  useEffect(() => { storage.cleanupOldState() }, [])

  const handleGenerate = useCallback(async () => {
    try {
      const settings = storage.loadSettings()
      validateSettings(settings)
      validateInstruction(instruction)

      setLoading(true)
      setError(null)
      setResult(null)

      const generated = await apiClient.generateComponents({ instruction: instruction.trim(), settings: settings! })
      setResult(generated)
      storage.saveToHistory(generated)
    } catch (err) {
      setError(err instanceof ValidationError || err instanceof Error ? err.message : 'Failed to generate components')
    } finally {
      setLoading(false)
    }
  }, [instruction])

  const clearError  = useCallback(() => setError(null), [])
  const clearResult = useCallback(() => setResult(null), [])

  return (
    <GenerationContext.Provider value={{ instruction, setInstruction, loading, result, error, clearError, handleGenerate, clearResult }}>
      {children}
    </GenerationContext.Provider>
  )
}

export function useGeneration(): GenerationContextValue {
  const ctx = useContext(GenerationContext)
  if (!ctx) throw new Error('useGeneration must be used within GenerationProvider')
  return ctx
}
