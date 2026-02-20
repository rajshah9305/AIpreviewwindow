import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GenerationResult } from '../types'
import { generateComponents, loadSettings, saveToHistory, cleanupOldState } from '../services/api'

interface GenerationContextType {
  instruction: string
  setInstruction: (instruction: string) => void
  loading: boolean
  result: GenerationResult | null
  error: string | null
  clearError: () => void
  handleGenerate: () => Promise<void>
  clearResult: () => void
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined)

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Clean up old persisted state on mount to ensure fresh start
  useEffect(() => {
    cleanupOldState()
  }, [])
  
  const handleGenerate = async () => {
    const settings = loadSettings()
    
    if (!settings || !settings.apiKey) {
      setError('Please configure your AI settings first')
      return
    }
    
    if (!instruction.trim()) {
      setError('Please enter an instruction')
      return
    }
    
    if (instruction.trim().length < 10) {
      setError('Please provide a more detailed instruction (at least 10 characters)')
      return
    }
    
    setLoading(true)
    setError(null)
    setResult(null)
    
    try {
      const generatedResult = await generateComponents({
        instruction: instruction.trim(),
        settings,
      })
      
      setResult(generatedResult)
      saveToHistory(generatedResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate components'
      setError(errorMessage)
      console.error('Generation error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const clearError = () => {
    setError(null)
  }
  
  const clearResult = () => {
    setResult(null)
  }
  
  return (
    <GenerationContext.Provider
      value={{
        instruction,
        setInstruction,
        loading,
        result,
        error,
        clearError,
        handleGenerate,
        clearResult,
      }}
    >
      {children}
    </GenerationContext.Provider>
  )
}

export function useGeneration() {
  const context = useContext(GenerationContext)
  if (context === undefined) {
    throw new Error('useGeneration must be used within a GenerationProvider')
  }
  return context
}
