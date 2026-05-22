import type { DashboardConfig } from '@/types/chart'
import type { Dataset } from '@/types/dataset'
import type { AiReport } from '@/types/project'
import { apiRequest } from './httpClient'

interface ServerAiReport {
  id: string
  type: AiReport['type']
  promptTitle: string
  content: string
  createdAt: string
}

export async function generateRemoteAnalysis(input: {
  projectId: string
  dataset: Dataset
  dashboard: DashboardConfig
}): Promise<AiReport> {
  const response = await apiRequest<{ report: ServerAiReport }>('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({
      projectId: input.projectId,
      analysisType: 'summary',
      datasetSummary: {
        name: input.dataset.name,
        rowCount: input.dataset.rowCount,
        fields: input.dataset.fields,
      },
      dashboardSummary: {
        title: input.dashboard.title,
        charts: input.dashboard.charts.map((chart) => chart.config),
        filters: input.dashboard.filters,
      },
    }),
  })

  return {
    id: response.report.id,
    type: response.report.type,
    promptTitle: response.report.promptTitle,
    content: response.report.content,
    finished: true,
    createdAt: new Date(response.report.createdAt).getTime(),
  }
}
