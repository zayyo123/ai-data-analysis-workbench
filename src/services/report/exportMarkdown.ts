import { saveAs } from 'file-saver'

export function exportMarkdown(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  saveAs(blob, filename.endsWith('.md') ? filename : `${filename}.md`)
}
