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
}
