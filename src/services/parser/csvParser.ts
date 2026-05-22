import Papa from 'papaparse'
import type { ParseResult } from '@/types/dataset'
import { normalizeRows } from './normalizeRows'

export async function parseCsvFile(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(new Error(result.errors[0]?.message ?? 'CSV 解析失败'))
          return
        }

        if (result.data.length === 0) {
          reject(new Error('CSV 文件为空或没有可解析的数据行'))
          return
        }

        const rows = normalizeRows(result.data)
        if (rows.length === 0 || Object.keys(rows[0] ?? {}).length === 0) {
          reject(new Error('CSV 缺少有效表头'))
          return
        }

        resolve({ rows })
      },
      error: (error) => reject(error),
    })
  })
}
