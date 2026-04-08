export const APP_CONFIG = {
  NAME: 'RAJ AI UI',
  TAGLINE: 'Component Engine',
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
  GENERATOR: '/generator',
  HISTORY: '/history',
  SETTINGS: '/settings',
} as const

export const ANIMATION_DELAYS = {
  STAGGER_BASE: 80,
} as const

export const LOADING_VARIATIONS = [
  { id: 'loading-1' },
  { id: 'loading-2' },
  { id: 'loading-3' },
  { id: 'loading-4' },
  { id: 'loading-5' },
] as const
