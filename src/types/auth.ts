export type UserPlan = 'FREE' | 'PRO' | 'TEAM'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  plan: UserPlan
}

export interface UsageSummary {
  plan: UserPlan
  aiDailyLimit: number | null
  aiUsedToday: number
  projectLimit: number | null
  projectCount: number
}

export interface BillingPlan {
  id: UserPlan
  name: string
  priceMonthly: number
  aiDailyLimit: number | null
  projectLimit: number | null
  features: string[]
}
