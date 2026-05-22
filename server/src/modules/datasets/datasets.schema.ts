import { z } from 'zod'

export const createDatasetSchema = z.object({
  name: z.string().min(1).max(120),
  fileName: z.string().min(1).max(180),
  fileType: z.enum(['csv', 'excel']),
  rowCount: z.number().int().nonnegative(),
  fields: z.array(z.unknown()).default([]),
  sampleRows: z.array(z.unknown()).default([]),
})

export type CreateDatasetInput = z.infer<typeof createDatasetSchema>
