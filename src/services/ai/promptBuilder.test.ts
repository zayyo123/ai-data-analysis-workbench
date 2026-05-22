import { describe, expect, it } from 'vitest'
import type { DashboardConfig } from '@/types/chart'
import type { Dataset } from '@/types/dataset'
import { buildAnalysisPrompt } from './promptBuilder'

describe('buildAnalysisPrompt', () => {
  it('只包含摘要信息，不包含全量 rows 明细', () => {
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
    const dashboard: DashboardConfig = { title: '看板', description: '', charts: [], filters: [] }

    const prompt = buildAnalysisPrompt(dataset, dashboard)

    expect(prompt).toContain('字段摘要')
    expect(prompt).not.toContain('"销售额":100')
  })
})
