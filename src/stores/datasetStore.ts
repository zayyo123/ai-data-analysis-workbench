import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Dataset, FieldType } from '@/types/dataset'
import { parseCsvFile } from '@/services/parser/csvParser'
import { parseExcelFile } from '@/services/parser/excelParser'
import { profileDatasetFields, profileField } from '@/utils/fieldDetect'
import { createId } from '@/utils/id'

export const useDatasetStore = defineStore('dataset', () => {
  const currentDataset = ref<Dataset | null>(null)
  const loading = ref(false)
  const error = ref('')

  const hasDataset = computed(() => Boolean(currentDataset.value))

  async function parseFile(file: File): Promise<void> {
    loading.value = true
    error.value = ''

    try {
      validateFile(file)
      const fileType = getFileType(file.name)
      const result = fileType === 'csv' ? await parseCsvFile(file) : await parseExcelFile(file)
      const now = Date.now()
      const dataset: Dataset = {
        id: createId('dataset'),
        name: file.name.replace(/\.[^.]+$/, ''),
        fileName: file.name,
        fileType,
        sheetName: result.selectedSheetName,
        rows: result.rows,
        fields: profileDatasetFields(result.rows),
        rowCount: result.rows.length,
        createdAt: now,
        updatedAt: now,
      }
      currentDataset.value = dataset
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : '文件解析失败'
      throw caughtError
    } finally {
      loading.value = false
    }
  }

  function updateFieldType(fieldName: string, type: FieldType): void {
    if (!currentDataset.value) return

    const values = currentDataset.value.rows.map((row) => row[fieldName])
    currentDataset.value.fields = currentDataset.value.fields.map((field) =>
      field.name === fieldName ? profileField(fieldName, values, type) : field,
    )
    currentDataset.value.updatedAt = Date.now()
  }

  function clearDataset(): void {
    currentDataset.value = null
    error.value = ''
  }

  return {
    currentDataset,
    loading,
    error,
    hasDataset,
    parseFile,
    updateFieldType,
    clearDataset,
  }
})

function validateFile(file: File): void {
  if (file.size === 0) throw new Error('文件为空，请上传包含表头和数据行的 CSV 或 Excel 文件')
  const fileType = getFileType(file.name)
  if (!fileType) throw new Error('暂时只支持 CSV、XLS 和 XLSX 文件')
}

function getFileType(fileName: string): 'csv' | 'excel' {
  const lowerName = fileName.toLowerCase()
  if (lowerName.endsWith('.csv')) return 'csv'
  if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) return 'excel'
  throw new Error('暂时只支持 CSV、XLS 和 XLSX 文件')
}
