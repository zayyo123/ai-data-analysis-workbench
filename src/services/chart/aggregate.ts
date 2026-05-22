import type { AggregateMethod, FilterCondition } from '@/types/chart'
import type { DataRow } from '@/types/dataset'
import { applyFilters } from './filter'

export interface AggregateOptions {
  xField: string
  yField?: string
  method: AggregateMethod
  topN?: number
  sort?: 'asc' | 'desc' | 'none'
  filters?: FilterCondition[]
}

export interface AggregateResultItem {
  name: string
  value: number
}

/**
 * 按字段聚合数据，输出图表可直接消费的数据结构。
 * 聚合函数必须保持纯函数，不能修改 rows，方便单元测试和 Web Worker 复用。
 */
export function aggregateRows(rows: DataRow[], options: AggregateOptions): AggregateResultItem[] {
  const filteredRows = applyFilters(rows, options.filters ?? [])
  const groupMap = new Map<string, number[]>()

  filteredRows.forEach((row) => {
    const groupName = String(row[options.xField] ?? '未填写')
    const rawValue = options.method === 'count' ? 1 : options.yField ? row[options.yField] : 1
    const numericValue = Number(rawValue)

    if (options.method !== 'count' && !Number.isFinite(numericValue)) return

    const values = groupMap.get(groupName) ?? []
    values.push(options.method === 'count' ? 1 : numericValue)
    groupMap.set(groupName, values)
  })

  const result = Array.from(groupMap.entries()).map(([name, values]) => ({
    name,
    value: roundNumber(calculateAggregateValue(values, options.method)),
  }))

  const sorted = sortResult(result, options.sort)
  return sorted.slice(0, options.topN ?? sorted.length)
}

function calculateAggregateValue(values: number[], method: AggregateMethod): number {
  if (values.length === 0) return 0
  if (method === 'count') return values.length
  if (method === 'sum') return values.reduce((sum, value) => sum + value, 0)
  if (method === 'avg') return values.reduce((sum, value) => sum + value, 0) / values.length
  if (method === 'max') return Math.max(...values)
  if (method === 'min') return Math.min(...values)
  return 0
}

function sortResult(result: AggregateResultItem[], sort: AggregateOptions['sort']): AggregateResultItem[] {
  if (sort === 'asc') return [...result].sort((a, b) => a.value - b.value)
  if (sort === 'none') return result
  return [...result].sort((a, b) => b.value - a.value)
}

function roundNumber(value: number): number {
  return Math.round(value * 100) / 100
}
