import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { ChartConfig, DashboardChart, DashboardConfig, FilterCondition } from '@/types/chart'
import { createId } from '@/utils/id'

const DASHBOARD_STORAGE_KEY = 'ai-data-analysis-workbench:dashboard'

function createDefaultDashboard(): DashboardConfig {
  return {
    title: '未命名分析看板',
    description: '基于上传数据自动生成的分析看板',
    charts: [],
    filters: [],
  }
}

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboard = ref<DashboardConfig>(loadDashboard())
  const selectedChartId = ref<string>('')

  const selectedChart = computed(() => dashboard.value.charts.find((chart) => chart.id === selectedChartId.value) ?? null)

  function addChart(config: ChartConfig): void {
    const chart: DashboardChart = {
      id: config.id,
      config,
      layout: {
        x: 0,
        y: dashboard.value.charts.length,
        w: 1,
        h: 1,
      },
    }
    dashboard.value.charts.push(chart)
    selectedChartId.value = chart.id
  }

  function updateChart(chartId: string, patch: Partial<ChartConfig>): void {
    const chart = dashboard.value.charts.find((item) => item.id === chartId)
    if (!chart) return
    chart.config = { ...chart.config, ...patch }
  }

  function removeChart(chartId: string): void {
    dashboard.value.charts = dashboard.value.charts.filter((chart) => chart.id !== chartId)
    if (selectedChartId.value === chartId) selectedChartId.value = ''
  }

  function addFilter(filter: FilterCondition): void {
    dashboard.value.filters.push(filter)
  }

  function removeFilter(index: number): void {
    dashboard.value.filters.splice(index, 1)
  }

  function clearFilters(): void {
    dashboard.value.filters = []
  }

  function resetDashboard(title?: string): void {
    dashboard.value = {
      ...createDefaultDashboard(),
      title: title ?? '未命名分析看板',
    }
  }

  watch(
    dashboard,
    (value) => {
      localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  return {
    dashboard,
    selectedChartId,
    selectedChart,
    addChart,
    updateChart,
    removeChart,
    addFilter,
    removeFilter,
    clearFilters,
    resetDashboard,
  }
})

function loadDashboard(): DashboardConfig {
  const rawValue = localStorage.getItem(DASHBOARD_STORAGE_KEY)
  if (!rawValue) return createDefaultDashboard()

  try {
    return JSON.parse(rawValue) as DashboardConfig
  } catch {
    return createDefaultDashboard()
  }
}

export function createStarterChartConfig(title: string): ChartConfig {
  return {
    id: createId('chart'),
    type: 'bar',
    title,
    aggregate: 'sum',
    sort: 'desc',
    topN: 10,
  }
}
