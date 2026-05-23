import type { AuthUser, BillingPlan, UsageLog, UsageSummary, UserPlan } from '@/types/auth'
import { apiRequest } from './httpClient'

interface ServerUsageLog {
  id: string
  action: string
  amount: number
  createdAt: string
}

export function fetchUsageSummary(): Promise<{ usage: UsageSummary }> {
  return apiRequest<{ usage: UsageSummary }>('/billing/usage')
}

export function fetchBillingPlans(): Promise<{ plans: BillingPlan[] }> {
  return apiRequest<{ plans: BillingPlan[] }>('/billing/plans')
}

export async function fetchUsageLogs(): Promise<{ logs: UsageLog[] }> {
  const response = await apiRequest<{ logs: ServerUsageLog[] }>('/billing/usage/logs')
  return {
    logs: response.logs.map((log) => ({
      ...log,
      createdAt: new Date(log.createdAt).getTime(),
    })),
  }
}

export function upgradeBillingPlan(plan: Exclude<UserPlan, 'FREE'>): Promise<{
  token: string
  user: AuthUser
  usage: UsageSummary
}> {
  return apiRequest<{
    token: string
    user: AuthUser
    usage: UsageSummary
  }>('/billing/upgrade', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  })
}
