import { useState, useEffect, useCallback } from 'react'
import { storage } from '../lib/storage'
import { validateSettingsForm } from '../lib/validation'
import type { AISettings } from '../types'

const DEFAULT_SETTINGS: AISettings = {
  modelName: '',
  apiKey: '',
  baseUrl: '',
}

export const useSettings = () => {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isModified, setIsModified] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const loaded = storage.loadSettings()
    if (loaded) {
      setSettings(loaded)
    }
  }, [])

  const updateField = useCallback((field: keyof AISettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setIsModified(true)
    
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  const validate = useCallback((): boolean => {
    const validationErrors = validateSettingsForm(settings)
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }, [settings])

  const save = useCallback((): boolean => {
    if (!validate()) {
      return false
    }

    const success = storage.saveSettings(settings)
    if (success) {
      setIsModified(false)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
    
    return success
  }, [settings, validate])

  return {
    settings,
    errors,
    isModified,
    isSaved,
    updateField,
    validate,
    save,
  }
}
