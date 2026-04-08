import { useState, useEffect, useCallback, useMemo } from 'react'
import { storage } from '../lib/storage'
import type { GenerationResult } from '../types'

export function useHistory() {
  const [history,        setHistory]        = useState<GenerationResult[]>([])
  const [selectedResult, setSelectedResult] = useState<GenerationResult | null>(null)
  const [searchQuery,    setSearchQuery]    = useState('')

  useEffect(() => { setHistory(storage.loadHistory()) }, [])

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return q ? history.filter(r => r.instruction.toLowerCase().includes(q)) : history
  }, [history, searchQuery])

  const clearHistory = useCallback(() => {
    storage.clearHistory()
    setHistory([])
    setSelectedResult(null)
  }, [])

  return {
    history: filteredHistory,
    selectedResult,
    searchQuery,
    isEmpty: history.length === 0,
    setSelectedResult,
    setSearchQuery,
    clearHistory,
  }
}
