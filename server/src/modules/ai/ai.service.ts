import { enableMockAi, env } from '../../config/env.js'
import { prisma } from '../../prisma.js'
import type { AuthUser } from '../../auth.js'
import { assertCanUseAi, recordUsage } from '../billing/billing.service.js'
import type { AnalyzeInput } from './ai.schema.js'
import { buildAnalysisPrompt } from './promptBuilder.js'

export async function analyzeProject(user: AuthUser, input: AnalyzeInput) {
  const project = await prisma.project.findFirst({
    where: { id: input.projectId, userId: user.id },
  })
  if (!project) throw new Error('项目不存在')

  await assertCanUseAi(user)

  const prompt = buildAnalysisPrompt({
    datasetSummary: input.datasetSummary ?? {},
    dashboardSummary: input.dashboardSummary ?? {},
    analysisType: input.analysisType,
  })
  const content = await generateAiContent(prompt)
  const tokenUsage = Math.ceil(prompt.length / 4) + Math.ceil(content.length / 4)

  const report = await prisma.aiReport.create({
    data: {
      userId: user.id,
      projectId: project.id,
      type: input.analysisType,
      promptTitle: 'AI 商业分析报告',
      content,
      tokenUsage,
    },
  })

  await recordUsage(user, 'ai.analyze', 1)

  return report
}

async function generateAiContent(prompt: string): Promise<string> {
  if (enableMockAi || !env.AI_API_BASE_URL || !env.AI_API_KEY) {
    return createMockAnalysis(prompt)
  }

  const response = await fetch(`${env.AI_API_BASE_URL}/analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.AI_API_KEY}`,
    },
    body: JSON.stringify({ prompt }),
  })

  if (!response.ok) {
    throw new Error('AI 服务请求失败')
  }

  const data = (await response.json()) as { content?: string }
  return data.content ?? createMockAnalysis(prompt)
}

function createMockAnalysis(_prompt: string): string {
  return `
## 核心发现

1. 当前数据已经具备基础经营分析条件，可以从趋势、分类贡献和异常波动三个方向观察。
2. Dashboard 中的图表配置能够帮助业务人员快速定位高贡献维度。
3. 如果后续接入更多历史数据，可以进一步形成周期对比和预测分析。

## 经营建议

- 优先关注贡献最高的地区、渠道或品类，并建立固定复盘节奏。
- 对利润率明显偏低的维度做二次拆解，判断是成本、折扣还是转化效率问题。
- 将这份报告作为周报模板，后续可以升级为自动定时生成。

## 商业化价值

该分析流程适合中小企业、店铺运营和咨询顾问使用，能把表格数据快速转化为可汇报的业务结论。
`.trim()
}
