import { describe, expect, it } from 'vitest'
import { aggregateRows } from './aggregate'

describe('aggregateRows', () => {
  const rows = [
    { 地区: '华东', 销售额: 100 },
    { 地区: '华东', 销售额: 200 },
    { 地区: '华南', 销售额: 50 },
    { 地区: '华北', 销售额: '无效' },
  ]

  it('按分类求和并忽略非数值', () => {
    expect(aggregateRows(rows, { xField: '地区', yField: '销售额', method: 'sum' })).toEqual([
      { name: '华东', value: 300 },
      { name: '华南', value: 50 },
    ])
  })

  it('支持 Top N', () => {
    expect(aggregateRows(rows, { xField: '地区', yField: '销售额', method: 'sum', topN: 1 })).toEqual([
      { name: '华东', value: 300 },
    ])
  })
})
