import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../../auth.js'
import { sendError } from '../../utils/errors.js'
import { ProjectLimitError } from '../billing/billing.service.js'
import { createProjectSchema, updateProjectSchema } from './projects.schema.js'
import { createProject, deleteProject, getProject, listProjects, serializeProject, updateProject } from './projects.service.js'

export async function projectRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const parsed = createProjectSchema.safeParse(request.body)
      if (!parsed.success) return sendError(reply, 400, '项目参数不正确', 'VALIDATION_ERROR')
      const project = await createProject(user, parsed.data)
      return { project: serializeProject(project) }
    } catch (error) {
      if (error instanceof ProjectLimitError) {
        return sendError(reply, 429, error.message, 'PROJECT_LIMIT_EXCEEDED')
      }

      return sendError(reply, 400, error instanceof Error ? error.message : '项目创建失败', 'PROJECT_CREATE_FAILED')
    }
  })

  app.get('/', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const projects = await listProjects(user)
      return { projects: projects.map(serializeProject) }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })

  app.get('/:id', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const { id } = request.params as { id: string }
      const project = await getProject(user, id)
      if (!project) return sendError(reply, 404, '项目不存在', 'PROJECT_NOT_FOUND')
      return { project: serializeProject(project) }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })

  app.put('/:id', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const { id } = request.params as { id: string }
      const parsed = updateProjectSchema.safeParse(request.body)
      if (!parsed.success) return sendError(reply, 400, '项目参数不正确', 'VALIDATION_ERROR')
      const project = await updateProject(user, id, parsed.data)
      return { project: serializeProject(project) }
    } catch (error) {
      return sendError(reply, 400, error instanceof Error ? error.message : '项目更新失败', 'PROJECT_UPDATE_FAILED')
    }
  })

  app.delete('/:id', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const { id } = request.params as { id: string }
      await deleteProject(user, id)
      return { ok: true }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })
}
