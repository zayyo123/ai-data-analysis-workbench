import type { AuthUser, BillingPlan, UsageSummary, UserPlan } from '@/types/auth'
import { apiRequest } from './httpClient'

export function fetchUsageSummary(): Promise<{ usage: UsageSummary }> {
  return apiRequest<{ usage: UsageSummary }>('/billing/usage')
}

export function fetchBillingPlans(): Promise<{ plans: BillingPlan[] }> {
  return apiRequest<{ plans: BillingPlan[] }>('/billing/plans')
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
