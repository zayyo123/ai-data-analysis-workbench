import { describe, expect, it } from 'vitest'
import type { Dataset } from '@/types/dataset'
import type { AnalysisProject } from '@/types/project'
import { buildHtmlReportDocument } from './exportHtml'
import { buildMarkdownReport } from './reportBuilder'

describe('buildMarkdownReport', () => {
  it('生成包含项目、字段和 AI 结论的 Markdown 报告', () => {
    const dataset: Dataset = {
      id: 'dataset_1',
      name: 'sales',
      fileName: 'sales.csv',
      fileType: 'csv',
      fields: [{ name: '销售额', type: 'number', nullable: false, nullCount: 0, uniqueCount: 1, sampleValues: [100] }],
      rows: [{ 销售额: 100 }],
      rowCount: 1,
      createdAt: 1,
      updatedAt: 1,
    }
    const project: AnalysisProject = {
      id: 'project_1',
      name: '销售分析',
      datasetId: 'dataset_1',
      dashboard: { title: '看板', description: '', charts: [], filters: [] },
      aiReports: [{ id: 'ai_1', type: 'summary', promptTitle: '摘要', content: '核心发现', finished: true, createdAt: 1 }],
      createdAt: 1,
      updatedAt: 1,
    }

    const report = buildMarkdownReport(project, dataset)

    expect(report).toContain('# 销售分析')
    expect(report).toContain('销售额')
    expect(report).toContain('核心发现')
  })

  it('生成可离线打开且会转义原始 HTML 的报告页面', () => {
    const html = buildHtmlReportDocument('# 销售分析\n\n<script>alert("xss")</script>\n\n- 核心发现')

    expect(html).toContain('<!doctype html>')
    expect(html).toContain('<html lang="zh-CN">')
    expect(html).toContain('销售分析')
    expect(html).toContain('核心发现')
    expect(html).not.toContain('<script>alert("xss")</script>')
    expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
  })
})
