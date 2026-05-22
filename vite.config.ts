import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 图表工作台需要 ECharts，charts chunk 会按路由懒加载，不进入首页首屏。
    // 将警戒线调到 650KB，避免把可接受的分析页依赖误报为构建风险。
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('/vue-router/') || id.includes('/pinia/')) return 'vue-router'
          if (id.includes('/echarts/') || id.includes('/zrender/')) return 'charts'
          if (id.includes('/papaparse/')) return 'csv-parser'
          if (id.includes('/xlsx/')) return 'excel-parser'
        },
      },
    },
  },
})
