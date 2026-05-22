<script setup lang="ts">
import type { FieldSchema, FieldType } from '@/types/dataset'

defineProps<{
  fields: FieldSchema[]
}>()

const emit = defineEmits<{
  updateType: [fieldName: string, type: FieldType]
}>()

const fieldTypes: FieldType[] = ['text', 'number', 'date', 'category', 'boolean', 'unknown']
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">
        字段列表
      </h2>
      <span class="muted">{{ fields.length }} 个字段</span>
    </div>
    <div class="field-list">
      <el-empty
        v-if="fields.length === 0"
        description="上传数据后展示字段"
      />
      <div
        v-for="field in fields"
        v-else
        :key="field.name"
        class="field-card"
      >
        <div class="field-card-main">
          <strong>{{ field.name }}</strong>
          <span>空值 {{ field.nullCount }} · 唯一 {{ field.uniqueCount }}</span>
        </div>
        <el-select
          :model-value="field.type"
          size="small"
          @change="(value: FieldType) => emit('updateType', field.name, value)"
        >
          <el-option
            v-for="type in fieldTypes"
            :key="type"
            :label="type"
            :value="type"
          />
        </el-select>
        <div
          v-if="field.stats?.topValues"
          class="field-tags"
        >
          <el-tag
            v-for="item in field.stats.topValues.slice(0, 3)"
            :key="item.value"
            size="small"
            type="info"
          >
            {{ item.value }} {{ item.count }}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.field-list {
  display: flex;
  max-height: calc(100vh - 150px);
  flex-direction: column;
  gap: 10px;
  overflow: auto;
  padding: 12px;
}

.field-card {
  display: grid;
  gap: 8px;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  padding: 10px;
}

.field-card-main {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.field-card-main strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-card-main span {
  color: #6b7280;
  font-size: 12px;
}

.field-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
</style>
