import { describe, expect, it } from 'vitest'
import { normalizeRows } from './normalizeRows'

describe('normalizeRows', () => {
  it('归一化空值和字段名', () => {
    const rows = normalizeRows([{ ' 地区 ': ' 华东 ', 销售额: '', 利润: undefined }])

    expect(rows).toEqual([{ 地区: '华东', 销售额: null, 利润: null }])
  })
})
