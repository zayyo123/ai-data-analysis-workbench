import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardConfig } from '@/types/chart'
import type { AiReport, AnalysisProject } from '@/types/project'
import { loadProjects, saveProjects } from '@/services/storage/projectStorage'
import { createId } from '@/utils/id'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<AnalysisProject[]>(loadProjects())
  const currentProject = ref<AnalysisProject | null>(null)

  function createProject(name: string, datasetId: string, dashboard: DashboardConfig): AnalysisProject {
    const now = Date.now()
    const project: AnalysisProject = {
      id: createId('project'),
      name,
      datasetId,
      dashboard: cloneDashboard(dashboard),
      aiReports: [],
      createdAt: now,
      updatedAt: now,
    }
    projects.value.unshift(project)
    currentProject.value = project
    persist()
    return project
  }

  function saveCurrentProject(dashboard?: DashboardConfig): void {
    if (!currentProject.value) return
    if (dashboard) currentProject.value.dashboard = cloneDashboard(dashboard)
    currentProject.value.updatedAt = Date.now()
    projects.value = projects.value.map((project) => (project.id === currentProject.value?.id ? currentProject.value : project))
    persist()
  }

  function loadProject(projectId: string): void {
    currentProject.value = projects.value.find((project) => project.id === projectId) ?? null
  }

  function addAiReport(report: AiReport): void {
    if (!currentProject.value) return
    currentProject.value.aiReports.push(report)
    saveCurrentProject()
  }

  function deleteProject(projectId: string): void {
    projects.value = projects.value.filter((project) => project.id !== projectId)
    if (currentProject.value?.id === projectId) currentProject.value = null
    persist()
  }

  function persist(): void {
    saveProjects(projects.value)
  }

  return {
    projects,
    currentProject,
    createProject,
    saveCurrentProject,
    loadProject,
    addAiReport,
    deleteProject,
  }
})

function cloneDashboard(dashboard: DashboardConfig): DashboardConfig {
  // Pinia 返回的对象可能是响应式 Proxy，structuredClone 无法直接克隆。
  // Dashboard 配置只包含 JSON 安全数据，用序列化方式转成普通对象更稳定。
  return JSON.parse(JSON.stringify(dashboard)) as DashboardConfig
}
