import { z } from 'zod'

export const MAX_DATASET_ROW_COUNT = 1_000_000
export const MAX_DATASET_FIELD_COUNT = 200
export const MAX_DATASET_SAMPLE_ROWS = 20

export const createDatasetSchema = z.object({
  name: z.string().min(1).max(120),
  fileName: z.string().min(1).max(180),
  fileType: z.enum(['csv', 'excel']),
  rowCount: z.number().int().nonnegative().max(MAX_DATASET_ROW_COUNT),
  fields: z.array(z.unknown()).max(MAX_DATASET_FIELD_COUNT).default([]),
  sampleRows: z.array(z.unknown()).max(MAX_DATASET_SAMPLE_ROWS).default([]),
})

export type CreateDatasetInput = z.infer<typeof createDatasetSchema>
