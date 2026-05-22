import { describe, expect, it } from 'vitest'
import type { FieldSchema } from '@/types/dataset'
import { recommendCharts } from './recommendCharts'

describe('recommendCharts', () => {
  it('根据字段类型推荐趋势和分类对比图', () => {
    const fields: FieldSchema[] = [
      { name: '订单日期', type: 'date', nullable: false, nullCount: 0, uniqueCount: 3, sampleValues: [] },
      { name: '地区', type: 'category', nullable: false, nullCount: 0, uniqueCount: 3, sampleValues: [] },
      { name: '销售额', type: 'number', nullable: false, nullCount: 0, uniqueCount: 3, sampleValues: [] },
    ]

    const recommendations = recommendCharts(fields)

    expect(recommendations.some((item) => item.config.title.includes('销售额趋势'))).toBe(true)
    expect(recommendations.some((item) => item.config.title.includes('地区销售额对比'))).toBe(true)
  })
})
