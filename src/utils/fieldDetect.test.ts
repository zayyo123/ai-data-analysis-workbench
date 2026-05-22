import { describe, expect, it } from 'vitest'
import { detectFieldType, profileField } from './fieldDetect'

describe('detectFieldType', () => {
  it('识别数值字段', () => {
    expect(detectFieldType(['1200', '5600', '3200'])).toBe('number')
  })

  it('识别日期字段', () => {
    expect(detectFieldType(['2026-01-01', '2026-01-02', '2026-01-03'])).toBe('date')
  })

  it('识别分类字段', () => {
    expect(detectFieldType(['华东', '华南', '华东', '华北', '华东', '华南'])).toBe('category')
  })

  it('生成字段统计', () => {
    const field = profileField('销售额', [100, 200, 300], 'number')

    expect(field.stats?.min).toBe(100)
    expect(field.stats?.max).toBe(300)
    expect(field.stats?.mean).toBe(200)
  })
})
