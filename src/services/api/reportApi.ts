import type { AiReport } from '@/types/project'
import { apiRequest } from './httpClient'

interface ServerAiReport {
  id: string
  type: AiReport['type']
  promptTitle: string
  content: string
  createdAt: string
}

export async function listRemoteReports(projectId: string): Promise<AiReport[]> {
  const response = await apiRequest<{ reports: ServerAiReport[] }>(`/reports/${projectId}`)
  return response.reports.map((report) => ({
    id: report.id,
    type: report.type,
    promptTitle: report.promptTitle,
    content: report.content,
    finished: true,
    createdAt: new Date(report.createdAt).getTime(),
  }))
}
