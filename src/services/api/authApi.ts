import type { AuthUser } from '@/types/auth'
import { apiRequest } from './httpClient'

export interface AuthResponse {
  token: string
  user: AuthUser
}

export function registerWithEmail(input: { email: string; password: string; name?: string }): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function loginWithEmail(input: { email: string; password: string }): Promise<AuthResponse> {
  return apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function fetchCurrentUser(): Promise<{ user: AuthUser }> {
  return apiRequest<{ user: AuthUser }>('/auth/me')
}
