import { useState, useEffect, useCallback } from 'react'
import { storage } from '../lib/storage'
import { validateSettingsForm } from '../lib/validation'
import type { AISettings } from '../types'

const DEFAULT_SETTINGS: AISettings = { modelName: '', apiKey: '', baseUrl: '' }

export function useSettings() {
  const [settings,   setSettings]   = useState<AISettings>(DEFAULT_SETTINGS)
  const [errors,     setErrors]     = useState<Record<string, string>>({})
  const [isModified, setIsModified] = useState(false)
  const [isSaved,    setIsSaved]    = useState(false)

  useEffect(() => {
    const loaded = storage.loadSettings()
    if (loaded) setSettings(loaded)
  }, [])

  const updateField = useCallback((field: keyof AISettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setIsModified(true)
    setErrors(prev => { const next = { ...prev }; delete next[field]; return next })
  }, [])

  const save = useCallback((): boolean => {
    const validationErrors = validateSettingsForm(settings)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return false }
    const ok = storage.saveSettings(settings)
    if (ok) {
      setIsModified(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
    return ok
  }, [settings])

  return { settings, errors, isModified, isSaved, updateField, save }
}
