<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
})

const renderedContent = computed(() => markdown.render(props.content))
</script>

<template>
  <!-- MarkdownIt 已关闭 html 选项，这里只渲染受控 Markdown 结果。 -->
  <article
    class="report-preview"
    v-html="renderedContent"
  />
</template>

<style scoped>
.report-preview {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 24px;
}

.report-preview :deep(h1) {
  margin-top: 0;
  font-size: 28px;
}

.report-preview :deep(h2) {
  margin-top: 28px;
  border-bottom: 1px solid #eef2f7;
  padding-bottom: 8px;
  font-size: 18px;
}

.report-preview :deep(li) {
  margin: 6px 0;
}

.report-preview :deep(p),
.report-preview :deep(li) {
  line-height: 1.8;
}
</style>
