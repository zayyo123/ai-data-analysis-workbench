export type DatasetFileType = 'csv' | 'excel'

export type FieldType = 'text' | 'number' | 'date' | 'category' | 'boolean' | 'unknown'

export type DataValue = string | number | boolean | null

export type DataRow = Record<string, DataValue>

export interface Dataset {
  id: string
  name: string
  fileName: string
  fileType: DatasetFileType
  sheetName?: string
  fields: FieldSchema[]
  rows: DataRow[]
  rowCount: number
  createdAt: number
  updatedAt: number
}

export interface FieldSchema {
  name: string
  type: FieldType
  nullable: boolean
  nullCount: number
  uniqueCount: number
  sampleValues: DataValue[]
  stats?: FieldStats
}

export interface FieldStats {
  min?: number
  max?: number
  mean?: number
  median?: number
  earliest?: string
  latest?: string
  topValues?: Array<{
    value: string
    count: number
  }>
}

export interface ParseResult {
  rows: DataRow[]
  sheetNames?: string[]
  selectedSheetName?: string
}
