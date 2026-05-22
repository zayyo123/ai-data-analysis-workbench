import type { DataRow, DataValue, FieldSchema, FieldStats, FieldType } from '@/types/dataset'

/**
 * 使用启发式规则识别字段类型。
 * 该函数不追求数据库级精确，而是保证常见业务数据在演示场景下稳定可用。
 */
export function detectFieldType(values: unknown[]): FieldType {
  const validValues = values.filter((value) => !isEmptyValue(value))
  if (validValues.length === 0) return 'unknown'

  const booleanLikeCount = validValues.filter(isBooleanLike).length
  const numberLikeCount = validValues.filter(isNumberLike).length
  const dateLikeCount = validValues.filter(isDateLike).length
  const uniqueCount = new Set(validValues.map(String)).size

  if (booleanLikeCount / validValues.length >= 0.9) return 'boolean'
  if (numberLikeCount / validValues.length >= 0.8) return 'number'
  if (dateLikeCount / validValues.length >= 0.8) return 'date'
  // 小样本数据常见于开源示例和面试演示，唯一值比例会偏高。
  // 因此同时保留“重复率规则”和“小基数规则”，让地区、品类这类维度字段能稳定识别为分类。
  if (uniqueCount <= 30 && (uniqueCount / validValues.length <= 0.5 || uniqueCount <= 10)) return 'category'

  return 'text'
}

export function profileDatasetFields(rows: DataRow[]): FieldSchema[] {
  const fieldNames = Object.keys(rows[0] ?? {})

  return fieldNames.map((fieldName) => {
    const values = rows.map((row) => row[fieldName])
    const type = detectFieldType(values)
    return profileField(fieldName, values, type)
  })
}

/**
 * 统计字段质量信息。
 * 这里保持纯函数，后续可以安全迁移到 Web Worker 中执行。
 */
export function profileField(fieldName: string, values: DataValue[], type = detectFieldType(values)): FieldSchema {
  const nullCount = values.filter(isEmptyValue).length
  const validValues = values.filter((value) => !isEmptyValue(value))
  const uniqueValues = Array.from(new Set(validValues.map(String)))

  return {
    name: fieldName,
    type,
    nullable: nullCount > 0,
    nullCount,
    uniqueCount: uniqueValues.length,
    sampleValues: validValues.slice(0, 5) as DataValue[],
    stats: buildFieldStats(validValues, type),
  }
}

function buildFieldStats(values: unknown[], type: FieldType): FieldStats | undefined {
  if (type === 'number') {
    const numbers = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b)
    if (numbers.length === 0) return undefined
    const mid = Math.floor(numbers.length / 2)
    const median = numbers.length % 2 === 0 ? (numbers[mid - 1] + numbers[mid]) / 2 : numbers[mid]
    return {
      min: numbers[0],
      max: numbers[numbers.length - 1],
      mean: numbers.reduce((sum, value) => sum + value, 0) / numbers.length,
      median,
    }
  }

  if (type === 'date') {
    const dates = values.map((value) => new Date(String(value))).filter((date) => Number.isFinite(date.getTime()))
    const timestamps = dates.map((date) => date.getTime()).sort((a, b) => a - b)
    if (timestamps.length === 0) return undefined
    return {
      earliest: new Date(timestamps[0]).toISOString().slice(0, 10),
      latest: new Date(timestamps[timestamps.length - 1]).toISOString().slice(0, 10),
    }
  }

  if (type === 'category' || type === 'boolean') {
    const countMap = new Map<string, number>()
    values.forEach((value) => {
      const key = String(value)
      countMap.set(key, (countMap.get(key) ?? 0) + 1)
    })
    return {
      topValues: Array.from(countMap.entries())
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    }
  }

  return undefined
}

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined || value === ''
}

function isNumberLike(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value !== 'string') return false
  return value.trim() !== '' && Number.isFinite(Number(value))
}

function isDateLike(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const text = value.trim()
  if (!/^\d{4}[-/]\d{1,2}[-/]\d{1,2}/.test(text)) return false
  return Number.isFinite(new Date(text).getTime())
}

function isBooleanLike(value: unknown): boolean {
  const text = String(value).trim().toLowerCase()
  return ['true', 'false', 'yes', 'no', '是', '否', '1', '0'].includes(text)
}
