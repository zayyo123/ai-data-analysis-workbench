import type { DashboardConfig } from '@/types/chart'
import type { Dataset } from '@/types/dataset'

/**
 * 构造 AI 分析提示词。
 * 禁止传入全量明细数据，只允许传字段统计和图表摘要，避免上下文过长和数据泄露。
 */
export function buildAnalysisPrompt(dataset: Dataset, dashboard: DashboardConfig): string {
  const fieldSummary = dataset.fields
    .map((field) => {
      const stats = field.stats ? JSON.stringify(field.stats) : '无统计信息'
      return `- ${field.name}: 类型=${field.type}, 空值=${field.nullCount}, 唯一值=${field.uniqueCount}, 统计=${stats}`
    })
    .join('\n')

  const chartSummary = dashboard.charts
    .map((chart) => `- ${chart.config.title}: ${chart.config.type}, X=${chart.config.xField ?? '无'}, Y=${chart.config.yField ?? '无'}`)
    .join('\n')

  return `
你是一名数据分析师，请基于下面的数据摘要生成中文分析报告。

要求：
1. 先总结核心发现，再给出业务建议。
2. 不要编造原始数据中不存在的字段。
3. 如果数据不足，要明确说明限制。
4. 输出使用 Markdown。

数据集：
- 名称：${dataset.name}
- 文件：${dataset.fileName}
- 行数：${dataset.rowCount}
- 字段数：${dataset.fields.length}

字段摘要：
${fieldSummary || '暂无字段'}

Dashboard 图表：
${chartSummary || '暂无图表'}
`.trim()
}
