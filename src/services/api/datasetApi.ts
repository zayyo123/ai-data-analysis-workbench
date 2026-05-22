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
