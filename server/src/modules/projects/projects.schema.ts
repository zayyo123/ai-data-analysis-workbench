import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1).max(120),
  datasetId: z.string().min(1),
  dashboard: z.unknown(),
  filters: z.array(z.unknown()).default([]),
})

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  dashboard: z.unknown().optional(),
  filters: z.array(z.unknown()).optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
