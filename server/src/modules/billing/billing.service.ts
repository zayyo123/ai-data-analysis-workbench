import { prisma } from '../../prisma.js'
import type { AuthUser } from '../../auth.js'

const FREE_DAILY_AI_LIMIT = 5

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
    throw new Error('免费版今日 AI 分析次数已用完，请升级到 Pro')
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
