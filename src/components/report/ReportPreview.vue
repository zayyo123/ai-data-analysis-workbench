<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

<template>
  <article class="report-preview">
    <pre>{{ content }}</pre>
  </article>
</template>

<style scoped>
.report-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 24px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: inherit;
  line-height: 1.8;
}
</style>
