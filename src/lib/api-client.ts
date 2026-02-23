import type { GenerationRequest, GenerationResult } from '../types'

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message)
    this.name = 'APIError'
    Object.setPrototypeOf(this, APIError.prototype)
  }
}

class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new APIError(
          error.message || `Request failed with status ${response.status}`,
          response.status,
          error.details
        )
      }

      return response.json()
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      if (error instanceof Error) {
        throw new APIError(error.message)
      }
      throw new APIError('An unexpected error occurred')
    }
  }

  async generateComponents(request: GenerationRequest): Promise<GenerationResult> {
    return this.request<GenerationResult>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }
}

export const apiClient = new APIClient()
