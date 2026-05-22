<script setup lang="ts">
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts'
import { GridComponent, GraphicComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { init, use, type ECharts } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ChartConfig, FilterCondition } from '@/types/chart'
import type { DataRow } from '@/types/dataset'
import { aggregateRows, type AggregateResultItem } from '@/services/chart/aggregate'
import { buildChartOption } from '@/services/chart/optionBuilder'

use([BarChart, LineChart, PieChart, ScatterChart, GridComponent, GraphicComponent, TitleComponent, TooltipComponent, CanvasRenderer])

const props = defineProps<{
  config: ChartConfig
  rows: DataRow[]
  filters?: FilterCondition[]
}>()

const emit = defineEmits<{
  filter: [filter: FilterCondition]
}>()

const chartEl = ref<HTMLDivElement | null>(null)
let chart: ECharts | null = null

const chartData = computed(() => buildChartData())

function buildChartData(): AggregateResultItem[] {
  if (props.config.type === 'metric') {
    const field = props.config.yField ?? props.config.xField
    const total = field
      ? props.rows.reduce((sum, row) => {
          const value = Number(row[field])
          return Number.isFinite(value) ? sum + value : sum
        }, 0)
      : 0
    return [{ name: props.config.title, value: Math.round(total * 100) / 100 }]
  }

  if (!props.config.xField) return []
  return aggregateRows(props.rows, {
    xField: props.config.xField,
    yField: props.config.yField,
    method: props.config.aggregate,
    topN: props.config.topN,
    sort: props.config.sort,
    filters: props.filters,
  })
}

function renderChart(): void {
  if (!chartEl.value) return
  if (!chart) {
    chart = init(chartEl.value)
    chart.on('click', (params) => {
      if (!props.config.xField || params.name === undefined) return
      emit('filter', {
        field: props.config.xField,
        operator: 'eq',
        value: params.name,
      })
    })
  }
  chart.setOption(buildChartOption(props.config, chartData.value), true)
}

watch([() => props.config, () => props.rows, () => props.filters], () => nextTick(renderChart), { deep: true })

onMounted(() => {
  renderChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chart?.dispose()
})

function resizeChart(): void {
  chart?.resize()
}
</script>

<template>
  <el-empty
    v-if="chartData.length === 0"
    description="图表配置不完整"
  />
  <div
    v-else
    ref="chartEl"
    class="chart-surface"
  />
</template>
