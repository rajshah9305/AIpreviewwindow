/**
 * API service layer
 * Re-exports from modular services for backward compatibility
 */

import { storage as storageService } from '../lib/storage'
import { apiClient as client } from '../lib/api-client'

export { storage } from '../lib/storage'
export { apiClient } from '../lib/api-client'

// Re-export for backward compatibility
export const generateComponents = client.generateComponents.bind(client)
export const saveSettings = storageService.saveSettings.bind(storageService)
export const loadSettings = storageService.loadSettings.bind(storageService)
export const clearSettings = storageService.clearSettings.bind(storageService)
export const saveToHistory = storageService.saveToHistory.bind(storageService)
export const loadHistory = storageService.loadHistory.bind(storageService)
export const clearHistory = storageService.clearHistory.bind(storageService)
export const cleanupOldState = storageService.cleanupOldState.bind(storageService)
