/**
 * Application-wide constants
 * Centralized configuration for magic numbers and strings
 */

export const APP_CONFIG = {
  NAME: 'RAJ AI UI',
  TAGLINE: 'Next-Gen Component Engine',
  MAX_INSTRUCTION_LENGTH: 500,
  MIN_INSTRUCTION_LENGTH: 10,
  MAX_HISTORY_ITEMS: 50,
} as const

export const STORAGE_KEYS = {
  AI_SETTINGS: 'aiSettings',
  GENERATION_HISTORY: 'generationHistory',
  GENERATION_STATE: 'generationState',
} as const

export const ROUTES = {
  HOME: '/',
  GENERATOR: '/generator',
  HISTORY: '/history',
  SETTINGS: '/settings',
} as const

export const TOAST_DURATION = {
  DEFAULT: 4000,
  SHORT: 2000,
  LONG: 6000,
} as const

export const ANIMATION_DELAYS = {
  STAGGER_BASE: 100,
  NAVIGATION_DELAY: 1500,
} as const


export const LOADING_VARIATIONS = [
  { id: 'loading-1', name: 'Minimalist' },
  { id: 'loading-2', name: 'Statement' },
  { id: 'loading-3', name: 'Sophisticated' },
  { id: 'loading-4', name: 'Expressive' },
  { id: 'loading-5', name: 'Contemporary' },
] as const
