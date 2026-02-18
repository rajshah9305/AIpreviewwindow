import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GenerationResult } from '../types'
import { generateComponents, loadSettings, saveToHistory } from '../services/api'

interface GenerationContextType {
  instruction: string
  setInstruction: (instruction: string) => void
  loading: boolean
  result: GenerationResult | null
  error: string | null
  progress: string | null
  handleGenerate: () => Promise<void>
}

const GenerationContext = createContext<GenerationContextType | undefined>(undefined)

export function GenerationProvider({ children }: { children: ReactNode }) {
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<string | null>(null)
  
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
    setProgress('Starting generation...')
    
    try {
      setProgress('Generating 5 unique variations...')
      
      const generatedResult = await generateComponents({
        instruction: instruction.trim(),
        settings,
      })
      
      setProgress('Finalizing...')
      setResult(generatedResult)
      saveToHistory(generatedResult)
      setProgress(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate components')
      setProgress(null)
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
        progress,
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
