<script setup lang="ts">
defineProps<{
  output: string
  generating: boolean
  canSave: boolean
  error?: string
}>()

const emit = defineEmits<{
  generate: []
  stop: []
  save: []
  clear: []
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
</style>
