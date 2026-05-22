import type { DashboardConfig } from './chart'

export interface AnalysisProject {
  id: string
  name: string
  datasetId: string
  dashboard: DashboardConfig
  aiReports: AiReport[]
  createdAt: number
  updatedAt: number
}

export interface AiReport {
  id: string
  type: 'summary' | 'trend' | 'risk' | 'business' | 'full-report'
  promptTitle: string
  content: string
  finished: boolean
  createdAt: number
}
