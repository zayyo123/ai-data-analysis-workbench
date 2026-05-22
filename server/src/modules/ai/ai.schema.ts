import { z } from 'zod'

export const analyzeSchema = z.object({
  projectId: z.string().min(1),
  datasetSummary: z.unknown(),
  dashboardSummary: z.unknown(),
  analysisType: z.string().min(1).default('summary'),
})

export type AnalyzeInput = z.infer<typeof analyzeSchema>
