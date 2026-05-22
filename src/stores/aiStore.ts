import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { generateRemoteAnalysis } from '@/services/api/aiApi'
import { ApiError } from '@/services/api/httpClient'
import { createAiClient } from '@/services/ai/aiClient'
import { buildAnalysisPrompt } from '@/services/ai/promptBuilder'
import { useAuthStore } from '@/stores/authStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useDatasetStore } from '@/stores/datasetStore'
import { useProjectStore } from '@/stores/projectStore'
import type { AiReport } from '@/types/project'
import { createId } from '@/utils/id'

export const useAiStore = defineStore('ai', () => {
  const output = ref('')
  const generating = ref(false)
  const error = ref('')
  const abortController = ref<AbortController | null>(null)

  const canSave = computed(() => output.value.trim().length > 0 && !generating.value)

  async function generateAnalysis(): Promise<void> {
    const authStore = useAuthStore()
    const datasetStore = useDatasetStore()
    const dashboardStore = useDashboardStore()
    const projectStore = useProjectStore()
    if (!datasetStore.currentDataset) {
      error.value = '请先上传数据集'
      return
    }

    output.value = ''
    error.value = ''
    generating.value = true
    abortController.value = new AbortController()

    try {
      if (authStore.isAuthenticated && projectStore.currentProject) {
        const report = await generateRemoteAnalysis({
          projectId: projectStore.currentProject.id,
          dataset: datasetStore.currentDataset,
          dashboard: dashboardStore.dashboard,
        })
        output.value = report.content
        projectStore.addAiReport(report)
        await authStore.refreshUsage()
        return
      }

      const prompt = buildAnalysisPrompt(datasetStore.currentDataset, dashboardStore.dashboard)
      const client = createAiClient()

      for await (const chunk of client.generateAnalysisStream(prompt, abortController.value.signal)) {
        output.value += chunk
      }
    } catch (caughtError) {
      if (!abortController.value?.signal.aborted) {
        if (caughtError instanceof ApiError && caughtError.code === 'USAGE_LIMIT_EXCEEDED') {
          // 后端返回稳定错误码后，前端展示可行动提示，并刷新用量卡片保持状态一致。
          error.value = `${caughtError.message} 当前免费版每天可生成 5 次，升级 Pro 后可继续使用。`
          await authStore.refreshUsage()
        } else {
          error.value = caughtError instanceof Error ? caughtError.message : 'AI 分析生成失败'
        }
      }
    } finally {
      generating.value = false
      abortController.value = null
    }
  }

  function stopGeneration(): void {
    abortController.value?.abort()
    generating.value = false
  }

  function saveCurrentReport(): void {
    if (!output.value.trim()) return
    const projectStore = useProjectStore()
    const report: AiReport = {
      id: createId('ai_report'),
      type: 'summary',
      promptTitle: 'AI 数据分析摘要',
      content: output.value,
      finished: true,
      createdAt: Date.now(),
    }
    projectStore.addAiReport(report)
  }

  function clearCurrentOutput(): void {
    output.value = ''
    error.value = ''
  }

  function loadReport(report: AiReport): void {
    output.value = report.content
    error.value = ''
  }

  return {
    output,
    generating,
    error,
    canSave,
    generateAnalysis,
    stopGeneration,
    saveCurrentReport,
    loadReport,
    clearCurrentOutput,
  }
})
