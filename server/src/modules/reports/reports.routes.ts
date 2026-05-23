import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../../auth.js'
import { sendError } from '../../utils/errors.js'
import { deleteProjectReport, listProjectReports } from './reports.service.js'

export async function reportRoutes(app: FastifyInstance) {
  app.get('/:projectId', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const { projectId } = request.params as { projectId: string }
      return { reports: await listProjectReports(user, projectId) }
    } catch (error) {
      return sendError(reply, 400, error instanceof Error ? error.message : '报告读取失败', 'REPORT_LIST_FAILED')
    }
  })

  app.delete('/:reportId', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const { reportId } = request.params as { reportId: string }
      const result = await deleteProjectReport(user, reportId)
      if (result.count === 0) return sendError(reply, 404, '报告不存在', 'REPORT_NOT_FOUND')
      return { ok: true }
    } catch (error) {
      return sendError(reply, 400, error instanceof Error ? error.message : '报告删除失败', 'REPORT_DELETE_FAILED')
    }
  })
}
