const TOKEN_STORAGE_KEY = 'ai-data-analysis-workbench:auth-token'

export interface ApiErrorBody {
  error?: {
    code?: string
    message?: string
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getApiBaseUrl(): string {
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:4000/api'
}

export function getStoredToken(): string {
  return localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export async function apiRequest<TResponse>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<TResponse> {
  const token = options.token ?? getStoredToken()
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorBody: ApiErrorBody = {}
    try {
      errorBody = (await response.json()) as ApiErrorBody
    } catch {
      errorBody = {}
    }
    throw new ApiError(errorBody.error?.message ?? '服务端请求失败', response.status, errorBody.error?.code)
  }

  return (await response.json()) as TResponse
}
