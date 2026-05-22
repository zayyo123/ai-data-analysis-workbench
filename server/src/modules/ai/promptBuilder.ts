export interface AnalysisPromptInput {
  datasetSummary: unknown
  dashboardSummary: unknown
  analysisType: string
}

/**
 * 后端统一构造 AI Prompt，避免前端直接拼接真实模型上下文。
 * 商业版后续可以在这里加入行业模板、品牌语气和更严格的数据脱敏。
 */
export function buildAnalysisPrompt(input: AnalysisPromptInput): string {
  return `
你是一名商业数据分析顾问，请基于下面摘要输出中文 Markdown 分析报告。

分析类型：${input.analysisType}

要求：
1. 先给出 3 条核心发现。
2. 再给出可执行的经营建议。
3. 不要编造摘要中不存在的字段。
4. 如果数据不足，要明确说明限制。

数据集摘要：
${JSON.stringify(input.datasetSummary, null, 2)}

Dashboard 摘要：
${JSON.stringify(input.dashboardSummary, null, 2)}
`.trim()
}
