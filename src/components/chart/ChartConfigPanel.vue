<script setup lang="ts">
import type { AggregateMethod, ChartType, DashboardChart } from '@/types/chart'
import type { FieldSchema } from '@/types/dataset'

const props = defineProps<{
  chart: DashboardChart | null
  fields: FieldSchema[]
}>()

const emit = defineEmits<{
  update: [chartId: string, patch: Partial<DashboardChart['config']>]
}>()

const chartTypes: Array<{ label: string; value: ChartType }> = [
  { label: '柱状图', value: 'bar' },
  { label: '折线图', value: 'line' },
  { label: '面积图', value: 'area' },
  { label: '饼图', value: 'pie' },
  { label: '散点图', value: 'scatter' },
  { label: '指标卡', value: 'metric' },
]

const aggregateMethods: Array<{ label: string; value: AggregateMethod }> = [
  { label: '求和', value: 'sum' },
  { label: '平均值', value: 'avg' },
  { label: '计数', value: 'count' },
  { label: '最大值', value: 'max' },
  { label: '最小值', value: 'min' },
]

function updateChart(patch: Partial<DashboardChart['config']>): void {
  if (!props.chart) return
  emit('update', props.chart.id, patch)
}
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">
        图表配置
      </h2>
    </div>
    <div class="panel-body">
      <el-empty
        v-if="!chart"
        description="点击 Dashboard 中的图表进行配置"
      />
      <el-form
        v-else
        label-position="top"
        class="config-form"
      >
        <el-form-item label="图表标题">
          <el-input
            :model-value="chart.config.title"
            @input="(value: string) => updateChart({ title: value })"
          />
        </el-form-item>

        <el-form-item label="图表类型">
          <el-select
            :model-value="chart.config.type"
            @change="(value: ChartType) => updateChart({ type: value })"
          >
            <el-option
              v-for="type in chartTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="维度字段">
          <el-select
            clearable
            filterable
            :model-value="chart.config.xField"
            @change="(value: string) => updateChart({ xField: value })"
          >
            <el-option
              v-for="field in fields"
              :key="field.name"
              :label="`${field.name} · ${field.type}`"
              :value="field.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="数值字段">
          <el-select
            clearable
            filterable
            :model-value="chart.config.yField"
            @change="(value: string) => updateChart({ yField: value })"
          >
            <el-option
              v-for="field in fields"
              :key="field.name"
              :label="`${field.name} · ${field.type}`"
              :value="field.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="聚合方式">
          <el-select
            :model-value="chart.config.aggregate"
            @change="(value: AggregateMethod) => updateChart({ aggregate: value })"
          >
            <el-option
              v-for="method in aggregateMethods"
              :key="method.value"
              :label="method.label"
              :value="method.value"
            />
          </el-select>
        </el-form-item>

        <div class="config-row">
          <el-form-item label="Top N">
            <el-input-number
              :model-value="chart.config.topN ?? 10"
              :min="1"
              :max="50"
              @change="(value: number | undefined) => updateChart({ topN: value ?? 10 })"
            />
          </el-form-item>
          <el-form-item label="排序">
            <el-segmented
              :model-value="chart.config.sort ?? 'desc'"
              :options="[
                { label: '降序', value: 'desc' },
                { label: '升序', value: 'asc' },
                { label: '原始', value: 'none' },
              ]"
              @change="(value: 'asc' | 'desc' | 'none') => updateChart({ sort: value })"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.config-form {
  display: grid;
  gap: 2px;
}

.config-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}
</style>
