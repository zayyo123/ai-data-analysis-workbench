<script setup lang="ts">
import type { FilterCondition } from '@/types/chart'

defineProps<{
  filters: FilterCondition[]
}>()

const emit = defineEmits<{
  remove: [index: number]
  clear: []
}>()
</script>

<template>
  <div
    v-if="filters.length > 0"
    class="filter-bar"
  >
    <el-tag
      v-for="(filter, index) in filters"
      :key="`${filter.field}-${index}`"
      closable
      @close="emit('remove', index)"
    >
      {{ filter.field }} = {{ filter.value }}
    </el-tag>
    <el-button
      size="small"
      text
      @click="emit('clear')"
    >
      清空筛选
    </el-button>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
