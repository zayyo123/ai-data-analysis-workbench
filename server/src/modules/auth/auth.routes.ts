import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../../auth.js'
import { env } from '../../config/env.js'
import { prisma } from '../../prisma.js'
import { sendError } from '../../utils/errors.js'
import { loginSchema, registerSchema } from './auth.schema.js'
import { registerUser, toPublicUser, validateLogin } from './auth.service.js'

interface RateLimitBucket {
  count: number
  resetAt: number
}

const authRateLimitBuckets = new Map<string, RateLimitBucket>()

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const rateLimitResult = checkAuthRateLimit(request.ip, request.headers['x-forwarded-for'])
    if (!rateLimitResult.allowed) {
      reply.header('Retry-After', String(rateLimitResult.retryAfterSeconds))
      return sendError(reply, 429, '请求过于频繁，请稍后再试', 'RATE_LIMITED')
    }

    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) return sendError(reply, 400, '注册参数不正确', 'VALIDATION_ERROR')

    try {
      const user = await registerUser(parsed.data)
      const publicUser = toPublicUser(user)
      const token = app.jwt.sign(publicUser, { expiresIn: env.JWT_EXPIRES_IN })
      return { token, user: publicUser }
    } catch (error) {
      return sendError(reply, 409, error instanceof Error ? error.message : '注册失败', 'REGISTER_FAILED')
    }
  })

  app.post('/login', async (request, reply) => {
    const rateLimitResult = checkAuthRateLimit(request.ip, request.headers['x-forwarded-for'])
    if (!rateLimitResult.allowed) {
      reply.header('Retry-After', String(rateLimitResult.retryAfterSeconds))
      return sendError(reply, 429, '请求过于频繁，请稍后再试', 'RATE_LIMITED')
    }

    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) return sendError(reply, 400, '登录参数不正确', 'VALIDATION_ERROR')

    try {
      const user = await validateLogin(parsed.data)
      const publicUser = toPublicUser(user)
      const token = app.jwt.sign(publicUser, { expiresIn: env.JWT_EXPIRES_IN })
      return { token, user: publicUser }
    } catch (error) {
      return sendError(reply, 401, error instanceof Error ? error.message : '登录失败', 'LOGIN_FAILED')
    }
  })

  app.get('/me', async (request, reply) => {
    try {
      const authUser = await requireAuth(request)
      const user = await prisma.user.findUnique({
        where: { id: authUser.id },
      })
      if (!user) return sendError(reply, 404, '用户不存在', 'USER_NOT_FOUND')
      return { user: toPublicUser(user) }
    } catch {
      return sendError(reply, 401, '登录已过期，请重新登录', 'UNAUTHORIZED')
    }
  })
}

function checkAuthRateLimit(
  requestIp: string,
  forwardedFor: string | string[] | undefined,
): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
  const now = Date.now()
  const key = buildRateLimitKey(requestIp, forwardedFor)
  const currentBucket = authRateLimitBuckets.get(key)

  if (!currentBucket || currentBucket.resetAt <= now) {
    authRateLimitBuckets.set(key, {
      count: 1,
      resetAt: now + env.AUTH_RATE_LIMIT_WINDOW_MS,
    })
    return { allowed: true }
  }

  if (currentBucket.count >= env.AUTH_RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((currentBucket.resetAt - now) / 1000)),
    }
  }

  currentBucket.count += 1
  return { allowed: true }
}

function buildRateLimitKey(requestIp: string, forwardedFor: string | string[] | undefined): string {
  const forwardedValue = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor
  // 认证限流以 IP 为粒度，优先使用反向代理传入的首个客户端地址，适配 Docker/Nginx 部署。
  return forwardedValue?.split(',')[0]?.trim() || requestIp
}
