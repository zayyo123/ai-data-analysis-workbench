import * as XLSX from 'xlsx'
import type { ParseResult } from '@/types/dataset'
import { normalizeRows } from './normalizeRows'

export async function parseExcelFile(file: File, sheetName?: string): Promise<ParseResult> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const selectedSheetName = sheetName ?? workbook.SheetNames[0]

  if (!selectedSheetName) {
    throw new Error('Excel 文件没有可读取的 Sheet')
  }

  const sheet = workbook.Sheets[selectedSheetName]
  const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null })
  const rows = normalizeRows(rawRows)

  if (rows.length === 0) {
    throw new Error('Excel Sheet 为空或缺少有效表头')
  }

  return {
    rows,
    sheetNames: workbook.SheetNames,
    selectedSheetName,
  }
}
