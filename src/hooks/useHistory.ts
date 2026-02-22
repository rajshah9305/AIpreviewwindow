import { useState, useEffect, useCallback, useMemo } from 'react'
import { storage } from '../lib/storage'
import type { GenerationResult } from '../types'

export const useHistory = () => {
  const [history, setHistory] = useState<GenerationResult[]>([])
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loaded = storage.loadHistory()
    setHistory(loaded)
    if (loaded.length > 0) {
      setSelectedResult(loaded[0])
    }
  }, [])

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) {
      return history
    }
    
    const query = searchQuery.toLowerCase()
    return history.filter((result) =>
      result.instruction.toLowerCase().includes(query)
    )
  }, [history, searchQuery])

  const clearHistory = useCallback(() => {
    storage.clearHistory()
    setHistory([])
    setSelectedResult(null)
  }, [])

  const isEmpty = history.length === 0

  return {
    history: filteredHistory,
    selectedResult,
    searchQuery,
    isEmpty,
    setSelectedResult,
    setSearchQuery,
    clearHistory,
  }
}
