import type { Dataset, DataRow, FieldSchema } from '@/types/dataset'
import { apiRequest } from './httpClient'

export interface ServerDataset {
  id: string
  name: string
  fileName: string
  fileType: Dataset['fileType']
  rowCount: number
  fieldCount: number
  fields: FieldSchema[]
  sampleRows: DataRow[]
  createdAt: string
  updatedAt: string
}

export async function createRemoteDataset(dataset: Dataset): Promise<ServerDataset> {
  const response = await apiRequest<{ dataset: ServerDataset }>('/datasets', {
    method: 'POST',
    body: JSON.stringify({
      name: dataset.name,
      fileName: dataset.fileName,
      fileType: dataset.fileType,
      rowCount: dataset.rowCount,
      fields: dataset.fields,
      sampleRows: dataset.rows.slice(0, 20),
    }),
  })

  return response.dataset
}

export async function getRemoteDataset(datasetId: string): Promise<Dataset> {
  const response = await apiRequest<{ dataset: ServerDataset }>(`/datasets/${datasetId}`)
  return normalizeServerDataset(response.dataset)
}

export function deleteRemoteDataset(datasetId: string): Promise<{ ok: true }> {
  return apiRequest<{ ok: true }>(`/datasets/${datasetId}`, {
    method: 'DELETE',
  })
}

export function normalizeServerDataset(dataset: ServerDataset): Dataset {
  return {
    id: dataset.id,
    name: dataset.name,
    fileName: dataset.fileName,
    fileType: dataset.fileType,
    fields: dataset.fields,
    // 后端 MVP 为控制 SQLite 体积只保存样本行；恢复项目时用样本快照支撑预览、图表和报告。
    rows: dataset.sampleRows,
    rowCount: dataset.rowCount,
    createdAt: new Date(dataset.createdAt).getTime(),
    updatedAt: new Date(dataset.updatedAt).getTime(),
  }
}
