<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'

defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  select: [file: File]
}>()

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('select', file)
  input.value = ''
}

function handleDrop(event: DragEvent): void {
  const file = event.dataTransfer?.files?.[0]
  if (file) emit('select', file)
}
</script>

<template>
  <label
    class="dropzone"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <input
      data-testid="file-input"
      class="dropzone-input"
      type="file"
      accept=".csv,.xlsx,.xls"
      :disabled="loading"
      @change="handleFileChange"
    >
    <el-icon class="dropzone-icon"><UploadFilled /></el-icon>
    <strong>{{ loading ? '正在解析文件...' : '上传 CSV / Excel 数据文件' }}</strong>
    <span>点击选择文件，或把文件拖到这里</span>
  </label>
</template>

<style scoped>
.dropzone {
  display: flex;
  min-height: 220px;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  background: #f9fafb;
  color: #374151;
  transition:
    border-color 0.2s,
    background 0.2s;
}

.dropzone:hover {
  border-color: #2563eb;
  background: #eff6ff;
}

.dropzone-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.dropzone-icon {
  color: #2563eb;
  font-size: 36px;
}

.dropzone span {
  color: #6b7280;
  font-size: 13px;
}
</style>
