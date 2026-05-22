<script setup lang="ts">
import type { DashboardConfig, FilterCondition } from '@/types/chart'
import type { DataRow } from '@/types/dataset'
import ChartRenderer from '@/components/chart/ChartRenderer.vue'

defineProps<{
  dashboard: DashboardConfig
  rows: DataRow[]
  selectedChartId?: string
}>()

const emit = defineEmits<{
  remove: [chartId: string]
  select: [chartId: string]
  filter: [filter: FilterCondition]
}>()
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <div>
        <h2 class="panel-title">
          {{ dashboard.title }}
        </h2>
        <p class="muted dashboard-desc">
          {{ dashboard.description }}
        </p>
      </div>
      <span class="muted">{{ dashboard.charts.length }} 个图表</span>
    </div>
    <div class="panel-body">
      <el-empty
        v-if="dashboard.charts.length === 0"
        description="从右侧推荐列表添加图表"
      />
      <div
        v-else
        class="dashboard-grid"
      >
        <div
          v-for="chart in dashboard.charts"
          :key="chart.id"
          data-testid="dashboard-chart-card"
          class="panel chart-card"
          :class="{ active: chart.id === selectedChartId }"
          @click="emit('select', chart.id)"
        >
          <div class="panel-header">
            <h3 class="panel-title">
              {{ chart.config.title }}
            </h3>
            <el-button
              size="small"
              text
              type="danger"
              @click.stop="emit('remove', chart.id)"
            >
              删除
            </el-button>
          </div>
          <div class="panel-body">
            <ChartRenderer
              :config="chart.config"
              :rows="rows"
              :filters="dashboard.filters"
              @filter="emit('filter', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-desc {
  margin: 4px 0 0;
  font-size: 12px;
}

.chart-card {
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.chart-card.active {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgb(37 99 235 / 12%);
}
</style>
