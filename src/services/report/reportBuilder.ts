import type { Dataset } from '@/types/dataset'
import type { AnalysisProject } from '@/types/project'

/**
 * 生成 Markdown 报告。
 * Markdown 是第一阶段最稳定的导出格式，后续 PDF/HTML 都可以基于同一份报告结构扩展。
 */
export function buildMarkdownReport(project: AnalysisProject, dataset: Dataset): string {
  const latestAiReport = project.aiReports.at(-1)

  return `
# ${project.name}

## 数据集概览

- 数据集名称：${dataset.name}
- 原始文件：${dataset.fileName}
- 数据行数：${dataset.rowCount}
- 字段数量：${dataset.fields.length}

## 字段摘要

${dataset.fields.map((field) => `- ${field.name}：${field.type}，空值 ${field.nullCount}，唯一值 ${field.uniqueCount}`).join('\n')}

## Dashboard 图表

${project.dashboard.charts.map((chart) => `- ${chart.config.title}：${chart.config.type}`).join('\n') || '暂无图表。'}

## AI 分析结论

${latestAiReport?.content ?? '暂无 AI 分析结论。'}

---

生成时间：${new Date().toLocaleString()}
`.trim()
}
