export type VariationStyle = 'minimal' | 'bold' | 'elegant' | 'playful' | 'modern'

export interface ComponentVariation {
  id: string
  name: string
  code: string
  style: VariationStyle
}

export interface GenerationResult {
  instruction: string
  variations: ComponentVariation[]
  timestamp: number
  modelName?: string
  provider?: string
}

export interface AISettings {
  modelName: string
  apiKey: string
  baseUrl: string
}

export interface GenerationRequest {
  instruction: string
  settings: AISettings
}
