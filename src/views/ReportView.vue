<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ReportPreview from '@/components/report/ReportPreview.vue'
import { buildMarkdownReport } from '@/services/report/reportBuilder'
import { exportHtmlReport } from '@/services/report/exportHtml'
import { exportMarkdown } from '@/services/report/exportMarkdown'
import { getRemoteDataset } from '@/services/api/datasetApi'
import { getApiErrorMessage, isUnauthorizedApiError } from '@/services/api/httpClient'
import { useAuthStore } from '@/stores/authStore'
import { useDatasetStore } from '@/stores/datasetStore'
import { useProjectStore } from '@/stores/projectStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const datasetStore = useDatasetStore()
const projectStore = useProjectStore()
const loading = ref(false)
const error = ref('')

onMounted(() => {
  void restoreReportContext()
})

const reportContent = computed(() => {
  if (!projectStore.currentProject || !datasetStore.currentDataset) return ''
  return buildMarkdownReport(projectStore.currentProject, datasetStore.currentDataset)
})

function handleMarkdownExport(): void {
  if (!projectStore.currentProject || !reportContent.value) return
  exportMarkdown(`${projectStore.currentProject.name}-分析报告`, reportContent.value)
}

function handleHtmlExport(): void {
  if (!projectStore.currentProject || !reportContent.value) return
  exportHtmlReport(`${projectStore.currentProject.name}-分析报告`, reportContent.value)
}

async function restoreReportContext(): Promise<void> {
  const projectId = String(route.params.projectId)
  loading.value = true
  error.value = ''

  try {
    projectStore.loadProject(projectId)

    if (authStore.isAuthenticated) {
      await projectStore.loadRemoteProject(projectId)
    }

    if (!projectStore.currentProject) return

    if (authStore.isAuthenticated && datasetStore.currentDataset?.id !== projectStore.currentProject.datasetId) {
      datasetStore.setCurrentDataset(await getRemoteDataset(projectStore.currentProject.datasetId))
    }

    await projectStore.refreshCurrentReports()
  } catch (caughtError) {
    if (isUnauthorizedApiError(caughtError)) {
      authStore.logout()
    }
    error.value = getApiErrorMessage(caughtError, '报告恢复失败，请回到工作台重新打开项目')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div class="brand">
        <h1 class="brand-title">
          报告预览
        </h1>
        <p class="brand-subtitle">
          Markdown 报告可直接下载和二次编辑
        </p>
      </div>
      <div class="toolbar">
        <el-button @click="router.back()">
          返回工作台
        </el-button>
        <el-button
          :disabled="!reportContent"
          @click="handleMarkdownExport"
        >
          导出 Markdown
        </el-button>
        <el-button
          type="primary"
          :disabled="!reportContent"
          @click="handleHtmlExport"
        >
          导出 HTML
        </el-button>
      </div>
    </header>

    <section class="page">
      <el-alert
        v-if="error"
        class="report-error"
        :title="error"
        type="warning"
        :closable="false"
      />
      <el-empty
        v-if="loading"
        description="正在恢复报告内容"
      />
      <el-empty
        v-else-if="!reportContent"
        description="请先上传数据并创建项目"
      />
      <ReportPreview
        v-else
        :content="reportContent"
      />
    </section>
  </main>
</template>

<style scoped>
.report-error {
  margin-bottom: 12px;
}
</style>
