import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchCurrentUser, loginWithEmail, registerWithEmail } from '@/services/api/authApi'
import { fetchUsageSummary } from '@/services/api/billingApi'
import { clearStoredToken, getStoredToken, setStoredToken } from '@/services/api/httpClient'
import type { AuthUser, UsageSummary } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStoredToken())
  const user = ref<AuthUser | null>(null)
  const usage = ref<UsageSummary | null>(null)
  const loading = ref(false)
  const error = ref('')

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const usageLabel = computed(() => {
    if (!usage.value) return '未同步用量'
    if (usage.value.aiDailyLimit === null) return `${usage.value.plan} 套餐：AI 不限次`
    return `${usage.value.plan} 套餐：今日 AI ${usage.value.aiUsedToday}/${usage.value.aiDailyLimit}`
  })

  async function register(input: { email: string; password: string; name?: string }): Promise<void> {
    await runAuthRequest(async () => registerWithEmail(input))
  }

  async function login(input: { email: string; password: string }): Promise<void> {
    await runAuthRequest(async () => loginWithEmail(input))
  }

  async function restoreSession(): Promise<void> {
    if (!token.value) return

    loading.value = true
    error.value = ''
    try {
      const response = await fetchCurrentUser()
      user.value = response.user
      await refreshUsage()
    } catch {
      logout()
    } finally {
      loading.value = false
    }
  }

  async function refreshUsage(): Promise<void> {
    if (!token.value) return
    const response = await fetchUsageSummary()
    usage.value = response.usage
  }

  function logout(): void {
    token.value = ''
    user.value = null
    usage.value = null
    clearStoredToken()
  }

  async function runAuthRequest(request: () => Promise<{ token: string; user: AuthUser }>): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      const response = await request()
      token.value = response.token
      user.value = response.user
      setStoredToken(response.token)
      await refreshUsage()
    } catch (caughtError) {
      error.value = caughtError instanceof Error ? caughtError.message : '账号请求失败'
      throw caughtError
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    user,
    usage,
    loading,
    error,
    isAuthenticated,
    usageLabel,
    register,
    login,
    restoreSession,
    refreshUsage,
    logout,
  }
})
