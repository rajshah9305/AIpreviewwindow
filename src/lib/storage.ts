/**
 * LocalStorage abstraction layer
 * Provides type-safe storage operations with error handling
 */

import { STORAGE_KEYS, APP_CONFIG } from '../config/constants'
import type { AISettings, GenerationResult } from '../types'

class StorageService {
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return null
    }
  }

  private setItem<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
      return false
    }
  }

  private removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error)
      return false
    }
  }

  // Settings operations
  saveSettings(settings: AISettings): boolean {
    return this.setItem(STORAGE_KEYS.AI_SETTINGS, settings)
  }

  loadSettings(): AISettings | null {
    return this.getItem<AISettings>(STORAGE_KEYS.AI_SETTINGS)
  }

  clearSettings(): boolean {
    return this.removeItem(STORAGE_KEYS.AI_SETTINGS)
  }

  // History operations
  saveToHistory(result: GenerationResult): boolean {
    const history = this.loadHistory()
    history.unshift(result)
    const trimmedHistory = history.slice(0, APP_CONFIG.MAX_HISTORY_ITEMS)
    return this.setItem(STORAGE_KEYS.GENERATION_HISTORY, trimmedHistory)
  }

  loadHistory(): GenerationResult[] {
    return this.getItem<GenerationResult[]>(STORAGE_KEYS.GENERATION_HISTORY) || []
  }

  clearHistory(): boolean {
    return this.removeItem(STORAGE_KEYS.GENERATION_HISTORY)
  }

  // Cleanup operations
  cleanupOldState(): boolean {
    return this.removeItem(STORAGE_KEYS.GENERATION_STATE)
  }
}

export const storage = new StorageService()
