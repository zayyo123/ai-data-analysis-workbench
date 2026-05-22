import type { FilterCondition } from '@/types/chart'
import type { DataRow } from '@/types/dataset'

export function applyFilters(rows: DataRow[], filters: FilterCondition[]): DataRow[] {
  if (filters.length === 0) return rows

  return rows.filter((row) =>
    filters.every((filter) => {
      const value = row[filter.field]
      if (filter.operator === 'eq') return value === filter.value
      if (filter.operator === 'contains') return String(value ?? '').includes(String(filter.value ?? ''))
      if (filter.operator === 'in' && Array.isArray(filter.value)) return filter.value.includes(value)
      if (filter.operator === 'range' && Array.isArray(filter.value)) {
        const numericValue = Number(value)
        const [min, max] = filter.value.map(Number)
        return Number.isFinite(numericValue) && numericValue >= min && numericValue <= max
      }
      return true
    }),
  )
}
