import type { FastifyRequest } from 'fastify'

export interface AuthUser {
  id: string
  email: string
  plan: 'FREE' | 'PRO' | 'TEAM'
}

export async function requireAuth(request: FastifyRequest): Promise<AuthUser> {
  const payload = await request.jwtVerify<AuthUser>()
  return payload
}
