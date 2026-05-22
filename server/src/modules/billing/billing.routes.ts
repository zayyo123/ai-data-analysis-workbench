import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../../auth.js'
import { sendError } from '../../utils/errors.js'
import { getUsageSummary } from './billing.service.js'

export async function billingRoutes(app: FastifyInstance) {
  app.get('/usage', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      return { usage: await getUsageSummary(user) }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })
}
