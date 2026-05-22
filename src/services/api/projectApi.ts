import type { DashboardConfig } from '@/types/chart'
import type { AiReport, AnalysisProject } from '@/types/project'
import { apiRequest } from './httpClient'

export interface ServerProject {
  id: string
  name: string
  datasetId: string
  dashboard: DashboardConfig
  filters: unknown[]
  aiReports?: Array<{
    id: string
    type: AiReport['type']
    promptTitle: string
    content: string
    createdAt: string
  }>
  createdAt: string
  updatedAt: string
}

export async function createRemoteProject(input: {
  name: string
  datasetId: string
  dashboard: DashboardConfig
}): Promise<AnalysisProject> {
  const response = await apiRequest<{ project: ServerProject }>('/projects', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      datasetId: input.datasetId,
      dashboard: input.dashboard,
      filters: input.dashboard.filters,
    }),
  })

  return normalizeServerProject(response.project)
}

export async function updateRemoteProject(
  projectId: string,
  input: { name?: string; dashboard?: DashboardConfig },
): Promise<AnalysisProject> {
  const response = await apiRequest<{ project: ServerProject }>(`/projects/${projectId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: input.name,
      dashboard: input.dashboard,
      filters: input.dashboard?.filters,
    }),
  })

  return normalizeServerProject(response.project)
}

export async function listRemoteProjects(): Promise<AnalysisProject[]> {
  const response = await apiRequest<{ projects: ServerProject[] }>('/projects')
  return response.projects.map(normalizeServerProject)
}

export function normalizeServerProject(project: ServerProject): AnalysisProject {
  return {
    id: project.id,
    name: project.name,
    datasetId: project.datasetId,
    dashboard: project.dashboard,
    aiReports:
      project.aiReports?.map((report) => ({
        id: report.id,
        type: report.type,
        promptTitle: report.promptTitle,
        content: report.content,
        finished: true,
        createdAt: new Date(report.createdAt).getTime(),
      })) ?? [],
    createdAt: new Date(project.createdAt).getTime(),
    updatedAt: new Date(project.updatedAt).getTime(),
  }
}
