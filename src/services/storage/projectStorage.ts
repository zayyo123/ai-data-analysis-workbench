import type { AnalysisProject } from '@/types/project'

const PROJECT_STORAGE_KEY = 'ai-data-analysis-workbench:projects'

/**
 * 第一阶段只保存项目配置，不保存大体量 rows。
 * 数据集持久化后续迁移到 IndexedDB，避免 localStorage 超限。
 */
export function saveProjects(projects: AnalysisProject[]): void {
  localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects))
}

export function loadProjects(): AnalysisProject[] {
  const rawValue = localStorage.getItem(PROJECT_STORAGE_KEY)
  if (!rawValue) return []

  try {
    return JSON.parse(rawValue) as AnalysisProject[]
  } catch {
    return []
  }
}
