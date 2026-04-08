import type { GenerationRequest, GenerationResult } from '../types'

class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'APIError'
    Object.setPrototypeOf(this, APIError.prototype)
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    })
  } catch (err) {
    throw new APIError(err instanceof Error ? err.message : 'Network error')
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string }
    throw new APIError(body.message ?? `Request failed (${response.status})`, response.status)
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  generateComponents: (req: GenerationRequest): Promise<GenerationResult> =>
    request<GenerationResult>('/api/generate', { method: 'POST', body: JSON.stringify(req) }),
}
