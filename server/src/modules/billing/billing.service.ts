import { prisma } from '../../prisma.js'
import type { AuthUser } from '../../auth.js'

const FREE_DAILY_AI_LIMIT = 5
const BILLING_PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    priceMonthly: 0,
    aiDailyLimit: FREE_DAILY_AI_LIMIT,
    features: ['本地分析', '云端项目保存', '每日 5 次 AI 分析', 'Markdown 报告导出'],
  },
  {
    id: 'PRO',
    name: 'Pro',
    priceMonthly: 29,
    aiDailyLimit: null,
    features: ['AI 分析不限次', '历史报告归档', '优先接入真实 AI 服务', '适合个人和顾问交付'],
  },
  {
    id: 'TEAM',
    name: 'Team',
    priceMonthly: 99,
    aiDailyLimit: null,
    features: ['团队空间预留', '统一用量管理', '审计日志扩展位', '适合小团队商业化使用'],
  },
] as const

export type BillingPlanId = (typeof BILLING_PLANS)[number]['id']

export class UsageLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UsageLimitError'
  }
}

export function listBillingPlans() {
  return BILLING_PLANS
}

export async function getUsageSummary(user: AuthUser) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const aiUsedToday = await prisma.usageLog.aggregate({
    where: {
      userId: user.id,
      action: 'ai.analyze',
      createdAt: { gte: today },
    },
    _sum: { amount: true },
  })

  return {
    plan: user.plan,
    aiDailyLimit: user.plan === 'FREE' ? FREE_DAILY_AI_LIMIT : null,
    aiUsedToday: aiUsedToday._sum.amount ?? 0,
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
