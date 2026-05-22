<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus/es/components/message/index'
import AiAnalysisPanel from '@/components/ai/AiAnalysisPanel.vue'
import UsagePlanCard from '@/components/billing/UsagePlanCard.vue'
import ChartConfigPanel from '@/components/chart/ChartConfigPanel.vue'
import ChartRecommendationList from '@/components/chart/ChartRecommendationList.vue'
import DataPreviewTable from '@/components/data-table/DataPreviewTable.vue'
import FieldListPanel from '@/components/data-table/FieldListPanel.vue'
import DashboardCanvas from '@/components/dashboard/DashboardCanvas.vue'
import FilterBar from '@/components/dashboard/FilterBar.vue'
import FileDropzone from '@/components/upload/FileDropzone.vue'
import { getRemoteDataset } from '@/services/api/datasetApi'
import { getApiErrorMessage, isUnauthorizedApiError } from '@/services/api/httpClient'
import { useAuthStore } from '@/stores/authStore'
import { useAiStore } from '@/stores/aiStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useDatasetStore } from '@/stores/datasetStore'
import { useProjectStore } from '@/stores/projectStore'
import type { ChartRecommendation, FilterCondition } from '@/types/chart'
import type { UserPlan } from '@/types/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const aiStore = useAiStore()
const datasetStore = useDatasetStore()
const dashboardStore = useDashboardStore()
const projectStore = useProjectStore()

const dataset = computed(() => datasetStore.currentDataset)

onMounted(() => {
  void restoreProjectContext()
  if (authStore.isAuthenticated) {
    void authStore.loadBillingPlans()
  }
})

async function restoreProjectContext(): Promise<void> {
  const projectId = String(route.params.projectId)
  projectStore.loadProject(projectId)

  if (authStore.isAuthenticated) {
    await projectStore.loadRemoteProject(projectId)
  }

  if (projectStore.currentProject) {
    dashboardStore.replaceDashboard(projectStore.currentProject.dashboard)
    await restoreProjectDataset(projectStore.currentProject.datasetId)
    await projectStore.refreshCurrentReports()
  }
}

async function restoreProjectDataset(datasetId: string): Promise<void> {
  if (datasetStore.currentDataset?.id === datasetId) return
  if (!authStore.isAuthenticated) return

  try {
    datasetStore.setCurrentDataset(await getRemoteDataset(datasetId))
  } catch (caughtError) {
    if (isUnauthorizedApiError(caughtError)) {
      authStore.logout()
    }

    const message = isUnauthorizedApiError(caughtError)
      ? '登录已过期，已切换为本地模式'
      : getApiErrorMessage(caughtError, '远程数据集读取失败')
    ElMessage.warning(`${message}，请重新上传数据文件`)
  }
}

async function handleFileSelect(file: File): Promise<void> {
  await datasetStore.parseFile(file)
  if (!datasetStore.currentDataset) return
  dashboardStore.resetDashboard(`${datasetStore.currentDataset.name} 分析看板`)
  if (!projectStore.currentProject) {
    projectStore.createProject(datasetStore.currentDataset.name, datasetStore.currentDataset.id, dashboardStore.dashboard)
  }
}

function addRecommendation(recommendation: ChartRecommendation): void {
  dashboardStore.addChart(recommendation.config)
  projectStore.saveCurrentProject(dashboardStore.dashboard)
}

function selectChart(chartId: string): void {
  dashboardStore.selectedChartId = chartId
}

function updateChart(chartId: string, patch: Parameters<typeof dashboardStore.updateChart>[1]): void {
  dashboardStore.updateChart(chartId, patch)
  projectStore.saveCurrentProject(dashboardStore.dashboard)
}

function removeChart(chartId: string): void {
  dashboardStore.removeChart(chartId)
  projectStore.saveCurrentProject(dashboardStore.dashboard)
}

function addFilter(filter: FilterCondition): void {
  dashboardStore.addFilter(filter)
  projectStore.saveCurrentProject(dashboardStore.dashboard)
}

function saveProject(): void {
  projectStore.saveCurrentProject(dashboardStore.dashboard)
}

function saveAiReport(): void {
  aiStore.saveCurrentReport()
  projectStore.saveCurrentProject(dashboardStore.dashboard)
}

async function upgradePlan(plan: Exclude<UserPlan, 'FREE'>): Promise<void> {
  try {
    await authStore.upgradePlan(plan)
    ElMessage.success(`已升级到 ${plan} 套餐`)
  } catch {
    ElMessage.error(authStore.error || '套餐升级失败')
  }
}
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div class="brand">
        <h1 class="brand-title">
          数据分析工作台
        </h1>
        <p class="brand-subtitle">
          {{ dataset?.fileName ?? '请上传 CSV / Excel 文件开始分析' }}
          <span v-if="dataset && dataset.rows.length < dataset.rowCount">
            · 云端快照 {{ dataset.rows.length }}/{{ dataset.rowCount }} 行
          </span>
        </p>
      </div>
      <div class="toolbar">
        <el-button @click="router.push('/')">
          返回首页
        </el-button>
        <el-button
          :disabled="!dataset"
          @click="saveProject"
        >
          保存项目
        </el-button>
        <el-button
          type="primary"
          :disabled="!dataset"
          @click="router.push(`/report/${route.params.projectId}`)"
        >
          导出报告
        </el-button>
      </div>
    </header>

    <section
      v-if="!dataset"
      class="page"
    >
      <FileDropzone
        :loading="datasetStore.loading"
        @select="handleFileSelect"
      />
      <el-alert
        v-if="datasetStore.error"
        style="margin-top: 12px"
        :title="datasetStore.error"
        type="error"
        :closable="false"
      />
    </section>

    <section
      v-else
      data-testid="workbench-content"
      class="page workbench-grid"
    >
      <aside class="stack">
        <FieldListPanel
          :fields="dataset.fields"
          @update-type="datasetStore.updateFieldType"
        />
      </aside>

      <main class="stack">
        <FilterBar
          :filters="dashboardStore.dashboard.filters"
          @remove="dashboardStore.removeFilter"
          @clear="dashboardStore.clearFilters"
        />
        <DataPreviewTable
          :fields="dataset.fields"
          :rows="dataset.rows"
        />
        <DashboardCanvas
          :dashboard="dashboardStore.dashboard"
          :rows="dataset.rows"
          :selected-chart-id="dashboardStore.selectedChartId"
          @remove="removeChart"
          @select="selectChart"
          @filter="addFilter"
        />
      </main>

      <aside class="stack">
        <ChartRecommendationList
          :fields="dataset.fields"
          @add="addRecommendation"
        />
        <ChartConfigPanel
          :chart="dashboardStore.selectedChart"
          :fields="dataset.fields"
          @update="updateChart"
        />
        <AiAnalysisPanel
          :output="aiStore.output"
          :generating="aiStore.generating"
          :can-save="aiStore.canSave"
          :error="aiStore.error"
          :reports="projectStore.currentProject?.aiReports"
          @generate="aiStore.generateAnalysis"
          @stop="aiStore.stopGeneration"
          @save="saveAiReport"
          @load-report="aiStore.loadReport"
          @clear="aiStore.clearCurrentOutput"
        />
        <UsagePlanCard
          :user="authStore.user"
          :usage="authStore.usage"
          :plans="authStore.billingPlans"
          :loading="authStore.loading"
          @upgrade="upgradePlan"
        />
      </aside>
    </section>
  </main>
</template>
