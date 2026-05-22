import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../../auth.js'
import { sendError } from '../../utils/errors.js'
import { UsageLimitError } from '../billing/billing.service.js'
import { analyzeSchema } from './ai.schema.js'
import { analyzeProject } from './ai.service.js'

export async function aiRoutes(app: FastifyInstance) {
  app.post('/analyze', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const parsed = analyzeSchema.safeParse(request.body)
      if (!parsed.success) return sendError(reply, 400, 'AI 分析参数不正确', 'VALIDATION_ERROR')

      const report = await analyzeProject(user, parsed.data)
      return { report }
    } catch (error) {
      if (error instanceof UsageLimitError) {
        return sendError(reply, 429, error.message, 'USAGE_LIMIT_EXCEEDED')
      }

      return sendError(reply, 400, error instanceof Error ? error.message : 'AI 分析失败', 'AI_ANALYZE_FAILED')
    }
  })
}
