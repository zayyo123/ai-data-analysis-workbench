import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../../auth.js'
import { prisma } from '../../prisma.js'
import { sendError } from '../../utils/errors.js'
import { loginSchema, registerSchema } from './auth.schema.js'
import { registerUser, toPublicUser, validateLogin } from './auth.service.js'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) return sendError(reply, 400, '注册参数不正确', 'VALIDATION_ERROR')

    try {
      const user = await registerUser(parsed.data)
      const publicUser = toPublicUser(user)
      const token = app.jwt.sign(publicUser)
      return { token, user: publicUser }
    } catch (error) {
      return sendError(reply, 409, error instanceof Error ? error.message : '注册失败', 'REGISTER_FAILED')
    }
  })

  app.post('/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) return sendError(reply, 400, '登录参数不正确', 'VALIDATION_ERROR')

    try {
      const user = await validateLogin(parsed.data)
      const publicUser = toPublicUser(user)
      const token = app.jwt.sign(publicUser)
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
