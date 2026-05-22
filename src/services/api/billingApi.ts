import type { UsageSummary } from '@/types/auth'
import { apiRequest } from './httpClient'

export function fetchUsageSummary(): Promise<{ usage: UsageSummary }> {
  return apiRequest<{ usage: UsageSummary }>('/billing/usage')
}
