import type { DataRow, DataValue } from '@/types/dataset'

/**
 * 将解析器输出的原始行数据转换为项目统一数据格式。
 * 这里只做结构清洗，不做字段类型判断，避免解析层和分析层耦合。
 */
export function normalizeRows(rows: Record<string, unknown>[]): DataRow[] {
  const fieldMap = createUniqueFieldMap(rows[0] ?? {})

  return rows
    .map((row) => {
      const normalizedRow: DataRow = {}

      Object.entries(row).forEach(([rawKey, rawValue]) => {
        const fieldName = fieldMap.get(rawKey) ?? rawKey.trim()
        if (!fieldName) return
        normalizedRow[fieldName] = normalizeValue(rawValue)
      })

      return normalizedRow
    })
    .filter((row) => Object.keys(row).length > 0)
}

function createUniqueFieldMap(firstRow: Record<string, unknown>): Map<string, string> {
  const usedNames = new Map<string, number>()
  const fieldMap = new Map<string, string>()

  Object.keys(firstRow).forEach((rawKey) => {
    const baseName = rawKey.trim()
    if (!baseName) return

    const usedCount = usedNames.get(baseName) ?? 0
    usedNames.set(baseName, usedCount + 1)
    fieldMap.set(rawKey, usedCount === 0 ? baseName : `${baseName}_${usedCount + 1}`)
  })

  return fieldMap
}

function normalizeValue(value: unknown): DataValue {
  if (value === '' || value === undefined || value === null) return null
  if (typeof value === 'string') return value.trim() === '' ? null : value.trim()
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (typeof value === 'boolean') return value
  return String(value)
}
