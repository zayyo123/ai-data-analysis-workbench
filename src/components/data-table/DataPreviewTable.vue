<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DataRow, FieldSchema } from '@/types/dataset'

const props = defineProps<{
  fields: FieldSchema[]
  rows: DataRow[]
}>()

const keyword = ref('')

const visibleRows = computed(() => {
  const trimmedKeyword = keyword.value.trim()
  const sourceRows = trimmedKeyword
    ? props.rows.filter((row) => Object.values(row).some((value) => String(value ?? '').includes(trimmedKeyword)))
    : props.rows

  return sourceRows.slice(0, 100)
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">
        数据预览
      </h2>
      <el-input
        v-model="keyword"
        clearable
        placeholder="搜索前 100 行预览数据"
        style="width: 240px"
      />
    </div>
    <div class="panel-body">
      <el-empty
        v-if="rows.length === 0"
        description="暂无数据"
      />
      <el-table
        v-else
        :data="visibleRows"
        border
        height="460"
        size="small"
      >
        <el-table-column
          v-for="field in fields"
          :key="field.name"
          :prop="field.name"
          :label="field.name"
          min-width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span :class="{ empty: row[field.name] === null }">{{ row[field.name] ?? '--' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <p class="muted table-note">
        当前展示 {{ visibleRows.length }} 行，完整数据 {{ rows.length }} 行。
      </p>
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: inline-flex;
  min-width: 28px;
  justify-content: center;
  border-radius: 4px;
  background: #fef3c7;
  color: #92400e;
}

.table-note {
  margin: 10px 0 0;
  font-size: 12px;
}
</style>
