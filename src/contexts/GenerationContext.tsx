import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GenerationResult } from '../types'
import { generateComponents, loadSettings, saveToHistory } from '../services/api'

interface GenerationContextType {
  instruction: string
  setInstruction: (instruction: string) => void
  loading: boolean
  result: GenerationResult | null
  error: string | null
  handleGenerate: () => Promise<void>
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined)

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Load persisted state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('generationState')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        if (state.result) setResult(state.result)
        if (state.instruction) setInstruction(state.instruction)
      } catch (e) {
        console.error('Failed to load generation state:', e)
      }
    }
  }, [])
  
  // Persist result to localStorage
  useEffect(() => {
    if (result) {
      localStorage.setItem('generationState', JSON.stringify({ result, instruction }))
    }
  }, [result, instruction])
  
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
    
    setLoading(true)
    setError(null)
    
    try {
      const generatedResult = await generateComponents({
        instruction: instruction.trim(),
        settings,
      })
      
      setResult(generatedResult)
      saveToHistory(generatedResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate components')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <GenerationContext.Provider
      value={{
        instruction,
        setInstruction,
        loading,
        result,
        error,
        handleGenerate,
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
