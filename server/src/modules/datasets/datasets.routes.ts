import type { FastifyInstance } from 'fastify'
import { requireAuth } from '../../auth.js'
import { sendError } from '../../utils/errors.js'
import { createDatasetSchema } from './datasets.schema.js'
import { createDataset, deleteDataset, getDataset, listDatasets, serializeDataset } from './datasets.service.js'

export async function datasetRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const parsed = createDatasetSchema.safeParse(request.body)
      if (!parsed.success) return sendError(reply, 400, '数据集参数不正确', 'VALIDATION_ERROR')

      const dataset = await createDataset(user, parsed.data)
      return { dataset: serializeDataset(dataset) }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })

  app.get('/', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const datasets = await listDatasets(user)
      return { datasets: datasets.map(serializeDataset) }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })

  app.get('/:id', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const { id } = request.params as { id: string }
      const dataset = await getDataset(user, id)
      if (!dataset) return sendError(reply, 404, '数据集不存在', 'DATASET_NOT_FOUND')
      return { dataset: serializeDataset(dataset) }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })

  app.delete('/:id', async (request, reply) => {
    try {
      const user = await requireAuth(request)
      const { id } = request.params as { id: string }
      await deleteDataset(user, id)
      return { ok: true }
    } catch {
      return sendError(reply, 401, '请先登录', 'UNAUTHORIZED')
    }
  })
}
