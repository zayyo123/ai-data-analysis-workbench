import { prisma } from '../../prisma.js'
import type { AuthUser } from '../../auth.js'

const FREE_DAILY_AI_LIMIT = 5
const FREE_PROJECT_LIMIT = 10
const BILLING_PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    priceMonthly: 0,
    aiDailyLimit: FREE_DAILY_AI_LIMIT,
    projectLimit: FREE_PROJECT_LIMIT,
    features: ['本地分析', '最多 10 个云端项目', '每日 5 次 AI 分析', 'Markdown 报告导出'],
  },
  {
    id: 'PRO',
    name: 'Pro',
    priceMonthly: 29,
    aiDailyLimit: null,
    projectLimit: null,
    features: ['云端项目不限量', 'AI 分析不限次', '历史报告归档', '适合个人和顾问交付'],
  },
  {
    id: 'TEAM',
    name: 'Team',
    priceMonthly: 99,
    aiDailyLimit: null,
    projectLimit: null,
    features: ['团队空间预留', '云端项目不限量', '统一用量管理', '适合小团队商业化使用'],
  },
] as const

export type BillingPlanId = (typeof BILLING_PLANS)[number]['id']

export class UsageLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UsageLimitError'
  }
}

export class ProjectLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProjectLimitError'
  }
}

export function listBillingPlans() {
  return BILLING_PLANS
}

export async function getUsageSummary(user: AuthUser) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [aiUsedToday, projectCount] = await Promise.all([
    prisma.usageLog.aggregate({
      where: {
        userId: user.id,
        action: 'ai.analyze',
        createdAt: { gte: today },
      },
      _sum: { amount: true },
    }),
    prisma.project.count({
      where: { userId: user.id },
    }),
  ])

  return {
    plan: user.plan,
    aiDailyLimit: user.plan === 'FREE' ? FREE_DAILY_AI_LIMIT : null,
    aiUsedToday: aiUsedToday._sum.amount ?? 0,
    projectLimit: user.plan === 'FREE' ? FREE_PROJECT_LIMIT : null,
    projectCount,
  }
}

export async function assertCanUseAi(user: AuthUser): Promise<void> {
  if (user.plan !== 'FREE') return

  const usage = await getUsageSummary(user)
  if (usage.aiUsedToday >= FREE_DAILY_AI_LIMIT) {
    // 免费版先在服务端做硬限制，避免前端绕过用量提示后仍能继续消耗 AI 额度。
    throw new UsageLimitError('免费版今日 AI 分析次数已用完，请升级到 Pro')
  }
}

export async function assertCanCreateProject(user: AuthUser): Promise<void> {
  if (user.plan !== 'FREE') return

  const projectCount = await prisma.project.count({
    where: { userId: user.id },
  })

  if (projectCount >= FREE_PROJECT_LIMIT) {
    // 项目数量限制必须放在服务端执行，避免用户绕过前端后继续占用云端存储资源。
    throw new ProjectLimitError('免费版最多保存 10 个云端项目，请升级到 Pro 后继续创建')
  }
}

export async function recordUsage(user: AuthUser, action: string, amount = 1) {
  return prisma.usageLog.create({
    data: {
      userId: user.id,
      action,
      amount,
    },
  })
}

export async function upgradeUserPlan(user: AuthUser, plan: Exclude<BillingPlanId, 'FREE'>) {
  // MVP 阶段先提供 Mock 升级闭环，真实支付接入后这里应校验支付回调或订阅状态。
  return prisma.user.update({
    where: { id: user.id },
    data: { plan },
  })
}
