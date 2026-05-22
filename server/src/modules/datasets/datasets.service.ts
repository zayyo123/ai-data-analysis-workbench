import { prisma } from '../../prisma.js'
import type { AuthUser } from '../../auth.js'
import { MAX_DATASET_SAMPLE_ROWS, type CreateDatasetInput } from './datasets.schema.js'

export async function createDataset(user: AuthUser, input: CreateDatasetInput) {
  return prisma.dataset.create({
    data: {
      userId: user.id,
      name: input.name,
      fileName: input.fileName,
      fileType: input.fileType,
      rowCount: input.rowCount,
      fieldCount: input.fields.length,
      fieldsJson: JSON.stringify(input.fields),
      // 服务端再次截断样本行，确保后续 schema 调整时存储层仍然不会写入过大的明细快照。
      sampleJson: JSON.stringify(input.sampleRows.slice(0, MAX_DATASET_SAMPLE_ROWS)),
    },
  })
}

export async function listDatasets(user: AuthUser) {
  return prisma.dataset.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function getDataset(user: AuthUser, datasetId: string) {
  return prisma.dataset.findFirst({
    where: { id: datasetId, userId: user.id },
  })
}

export async function deleteDataset(user: AuthUser, datasetId: string) {
  return prisma.dataset.deleteMany({
    where: { id: datasetId, userId: user.id },
  })
}

export function serializeDataset(dataset: Awaited<ReturnType<typeof createDataset>>) {
  return {
    ...dataset,
    fields: JSON.parse(dataset.fieldsJson) as unknown[],
    sampleRows: JSON.parse(dataset.sampleJson) as unknown[],
    fieldsJson: undefined,
    sampleJson: undefined,
  }
}
