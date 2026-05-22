<script setup lang="ts">
import { computed } from 'vue'
import type { ChartRecommendation } from '@/types/chart'
import type { FieldSchema } from '@/types/dataset'
import { recommendCharts } from '@/services/chart/recommendCharts'

const props = defineProps<{
  fields: FieldSchema[]
}>()

const emit = defineEmits<{
  add: [recommendation: ChartRecommendation]
}>()

const recommendations = computed(() => recommendCharts(props.fields))
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">
        图表推荐
      </h2>
      <span class="muted">{{ recommendations.length }} 条</span>
    </div>
    <div class="recommendation-list">
      <el-empty
        v-if="recommendations.length === 0"
        description="字段识别后展示推荐"
      />
      <div
        v-for="item in recommendations"
        v-else
        :key="item.id"
        class="recommendation-card"
      >
        <div>
          <strong>{{ item.config.title }}</strong>
          <p>{{ item.reason }}</p>
        </div>
        <div class="recommendation-actions">
          <el-tag size="small">
            {{ item.config.type }}
          </el-tag>
          <el-button
            size="small"
            type="primary"
            @click="emit('add', item)"
          >
            添加到看板
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommendation-list {
  display: flex;
  max-height: 360px;
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  padding: 12px;
}

.recommendation-card {
  display: grid;
  gap: 10px;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  padding: 10px;
}

.recommendation-card p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.5;
}

.recommendation-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
</style>
