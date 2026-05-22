import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { requireAuth } from '../../auth.js'
import { env } from '../../config/env.js'
import { sendError } from '../../utils/errors.js'
import { toPublicUser } from '../auth/auth.service.js'
import { getUsageSummary, listBillingPlans, upgradeUserPlan } from './billing.service.js'

const upgradePlanSchema = z.object({
  plan: z.enum(['PRO', 'TEAM']),
})

export async function billingRoutes(app: FastifyInstance) {
  app.get('/plans', async () => ({
    plans: listBillingPlans(),
  }))

  app.get('/usage', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      return { usage: await getUsageSummary(user) }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })

  app.post('/upgrade', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const parsed = upgradePlanSchema.safeParse(request.body)
      if (!parsed.success) return sendError(reply, 400, '套餐参数不正确', 'VALIDATION_ERROR')

      const updatedUser = await upgradeUserPlan(user, parsed.data.plan)
      const publicUser = toPublicUser(updatedUser)
      // 用户套餐写入 JWT，Mock 升级后必须签发新 token，确保后续 AI 限额判断立即生效。
      const token = app.jwt.sign(publicUser, { expiresIn: env.JWT_EXPIRES_IN })
      return {
        token,
        user: publicUser,
        usage: await getUsageSummary(publicUser),
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
        return sendError(reply, 404, '用户不存在', 'USER_NOT_FOUND')
      }

      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })
}
