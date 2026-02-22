/**
 * Validation utilities
 * Centralized validation logic with clear error messages
 */

import { APP_CONFIG } from '../config/constants'
import type { AISettings } from '../types'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const validateInstruction = (instruction: string): void => {
  const trimmed = instruction.trim()
  
  if (!trimmed) {
    throw new ValidationError('Please enter an instruction')
  }
  
  if (trimmed.length < APP_CONFIG.MIN_INSTRUCTION_LENGTH) {
    throw new ValidationError(
      `Please provide a more detailed instruction (at least ${APP_CONFIG.MIN_INSTRUCTION_LENGTH} characters)`
    )
  }
  
  if (trimmed.length > APP_CONFIG.MAX_INSTRUCTION_LENGTH) {
    throw new ValidationError(
      `Instruction is too long (maximum ${APP_CONFIG.MAX_INSTRUCTION_LENGTH} characters)`
    )
  }
}

export const validateSettings = (settings: AISettings | null): void => {
  if (!settings) {
    throw new ValidationError('Please configure your AI settings first')
  }
  
  if (!settings.apiKey?.trim()) {
    throw new ValidationError('API key is required')
  }
  
  if (!settings.modelName?.trim()) {
    throw new ValidationError('Model name is required')
  }
  
  if (!settings.baseUrl?.trim()) {
    throw new ValidationError('Base URL is required')
  }
}

export const validateSettingsForm = (settings: AISettings): Record<string, string> => {
  const errors: Record<string, string> = {}
  
  if (!settings.modelName.trim()) {
    errors.modelName = 'Model name is required'
  }
  
  if (!settings.apiKey.trim()) {
    errors.apiKey = 'API key is required'
  }
  
  if (!settings.baseUrl.trim()) {
    errors.baseUrl = 'Base URL is required'
  }
  
  return errors
}
