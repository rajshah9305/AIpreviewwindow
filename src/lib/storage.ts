import { STORAGE_KEYS, APP_CONFIG } from '../config/constants'
import type { AISettings, GenerationResult } from '../types'

function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function setItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export const storage = {
  saveSettings:  (s: AISettings): boolean => setItem(STORAGE_KEYS.AI_SETTINGS, s),
  loadSettings:  (): AISettings | null     => getItem<AISettings>(STORAGE_KEYS.AI_SETTINGS),
  clearSettings: (): boolean               => removeItem(STORAGE_KEYS.AI_SETTINGS),

  saveToHistory(result: GenerationResult): boolean {
    const history = this.loadHistory()
    history.unshift(result)
    return setItem(STORAGE_KEYS.GENERATION_HISTORY, history.slice(0, APP_CONFIG.MAX_HISTORY_ITEMS))
  },
  loadHistory:  (): GenerationResult[] => getItem<GenerationResult[]>(STORAGE_KEYS.GENERATION_HISTORY) ?? [],
  clearHistory: (): boolean            => removeItem(STORAGE_KEYS.GENERATION_HISTORY),

  cleanupOldState: (): boolean => removeItem(STORAGE_KEYS.GENERATION_STATE),
}
