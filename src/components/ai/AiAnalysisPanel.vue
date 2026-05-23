<script setup lang="ts">
import type { AiReport } from '@/types/project'

defineProps<{
  output: string
  generating: boolean
  canSave: boolean
  error?: string
  reports?: AiReport[]
}>()

const emit = defineEmits<{
  generate: []
  stop: []
  save: []
  clear: []
  loadReport: [report: AiReport]
  deleteReport: [report: AiReport]
}>()
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">
        AI 分析
      </h2>
      <div class="toolbar">
        <el-button
          v-if="!generating"
          size="small"
          type="primary"
          @click="emit('generate')"
        >
          生成 AI 分析
        </el-button>
        <el-button
          v-else
          size="small"
          type="warning"
          @click="emit('stop')"
        >
          停止
        </el-button>
      </div>
    </div>
    <div class="panel-body">
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
      />
      <div class="ai-output">
        <el-empty
          v-if="!output"
          description="AI 分析结果会显示在这里"
        />
        <pre v-else>{{ output }}</pre>
      </div>
      <div class="toolbar">
        <el-button
          size="small"
          :disabled="!canSave"
          @click="emit('save')"
        >
          保存到报告
        </el-button>
        <el-button
          size="small"
          :disabled="!output"
          @click="emit('clear')"
        >
          清空
        </el-button>
      </div>

      <div
        v-if="reports?.length"
        class="report-list"
      >
        <p class="muted report-list-title">
          已保存报告
        </p>
        <div
          v-for="report in reports.slice(0, 5)"
          :key="report.id"
          class="report-item"
        >
          <button
            class="report-open"
            @click="emit('loadReport', report)"
          >
            <strong>{{ report.promptTitle }}</strong>
            <span>{{ new Date(report.createdAt).toLocaleString() }}</span>
          </button>
          <el-button
            class="report-delete"
            size="small"
            type="danger"
            plain
            @click="emit('deleteReport', report)"
          >
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-output {
  min-height: 180px;
  max-height: 300px;
  overflow: auto;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  background: #f9fafb;
  padding: 12px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #1f2937;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.7;
}

.report-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 14px;
}

.report-list-title {
  margin: 0;
  font-size: 12px;
}

.report-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 10px;
}

.report-item:hover {
  border-color: #0f766e;
}

.report-open {
  display: flex;
  min-width: 0;
  cursor: pointer;
  flex-direction: column;
  gap: 3px;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
}

.report-open span {
  color: #6b7280;
  font-size: 12px;
}

.report-delete {
  flex: none;
}
</style>
