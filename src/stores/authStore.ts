import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { changePassword, fetchCurrentUser, loginWithEmail, registerWithEmail, updateProfile } from '@/services/api/authApi'
import { fetchBillingPlans, fetchUsageSummary, upgradeBillingPlan } from '@/services/api/billingApi'
import { clearStoredToken, getApiErrorMessage, getStoredToken, isUnauthorizedApiError, setStoredToken } from '@/services/api/httpClient'
import type { AuthUser, BillingPlan, UsageSummary, UserPlan } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(getStoredToken())
  const user = ref<AuthUser | null>(null)
  const usage = ref<UsageSummary | null>(null)
  const billingPlans = ref<BillingPlan[]>([])
  const loading = ref(false)
  const error = ref('')
  const sessionRestored = ref(false)
  let restoreSessionPromise: Promise<void> | null = null

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const usageLabel = computed(() => {
    if (!usage.value) return '未同步用量'
    const projectText = usage.value.projectLimit === null ? '项目不限量' : `项目 ${usage.value.projectCount}/${usage.value.projectLimit}`
    if (usage.value.aiDailyLimit === null) return `${usage.value.plan} 套餐：AI 不限次，${projectText}`
    return `${usage.value.plan} 套餐：今日 AI ${usage.value.aiUsedToday}/${usage.value.aiDailyLimit}，${projectText}`
  })

  async function register(input: { email: string; password: string; name?: string }): Promise<void> {
    await runAuthRequest(async () => registerWithEmail(input))
  }

  async function login(input: { email: string; password: string }): Promise<void> {
    await runAuthRequest(async () => loginWithEmail(input))
  }

  async function restoreSession(): Promise<void> {
    if (sessionRestored.value) return
    if (restoreSessionPromise) return restoreSessionPromise

    restoreSessionPromise = runSessionRestore()
    await restoreSessionPromise
  }

  async function runSessionRestore(): Promise<void> {
    if (!token.value) {
      sessionRestored.value = true
      restoreSessionPromise = null
      return
    }

    loading.value = true
    error.value = ''
    try {
      const response = await fetchCurrentUser()
      user.value = response.user
      await refreshUsage()
      await loadBillingPlans()
    } catch (caughtError) {
      logout()
      error.value = isUnauthorizedApiError(caughtError) ? '登录已过期，请重新登录' : getApiErrorMessage(caughtError, '账号会话恢复失败')
    } finally {
      loading.value = false
      sessionRestored.value = true
      restoreSessionPromise = null
    }
  }

  async function refreshUsage(): Promise<void> {
    if (!token.value) return
    try {
      const response = await fetchUsageSummary()
      usage.value = response.usage
    } catch (caughtError) {
      if (isUnauthorizedApiError(caughtError)) {
        logout()
        error.value = '登录已过期，请重新登录'
        return
      }
      error.value = getApiErrorMessage(caughtError, '用量同步失败')
    }
  }

  async function loadBillingPlans(): Promise<void> {
    try {
      const response = await fetchBillingPlans()
      billingPlans.value = response.plans
    } catch (caughtError) {
      error.value = getApiErrorMessage(caughtError, '套餐信息同步失败')
    }
  }

  async function upgradePlan(plan: Exclude<UserPlan, 'FREE'>): Promise<void> {
    if (!token.value) {
      error.value = '请先登录后再升级套餐'
      return
    }

    loading.value = true
    error.value = ''
    try {
      const response = await upgradeBillingPlan(plan)
      token.value = response.token
      user.value = response.user
      usage.value = response.usage
      setStoredToken(response.token)
    } catch (caughtError) {
      if (isUnauthorizedApiError(caughtError)) {
        logout()
        error.value = '登录已过期，请重新登录'
        return
      }
      error.value = getApiErrorMessage(caughtError, '套餐升级失败')
      throw caughtError
    } finally {
      loading.value = false
    }
  }

  async function updateAccountProfile(input: { name: string }): Promise<void> {
    if (!token.value) {
      error.value = '请先登录后再更新账户资料'
      return
    }

    loading.value = true
    error.value = ''
    try {
      const response = await updateProfile(input)
      applyAuthenticatedSession(response)
    } catch (caughtError) {
      handleAuthenticatedMutationError(caughtError, '账户资料更新失败')
      throw caughtError
    } finally {
      loading.value = false
    }
  }

  async function updateAccountPassword(input: { currentPassword: string; newPassword: string }): Promise<void> {
    if (!token.value) {
      error.value = '请先登录后再修改密码'
      return
    }

    loading.value = true
    error.value = ''
    try {
      const response = await changePassword(input)
      applyAuthenticatedSession(response)
    } catch (caughtError) {
      handleAuthenticatedMutationError(caughtError, '密码修改失败')
      throw caughtError
    } finally {
      loading.value = false
    }
  }

  function logout(): void {
    token.value = ''
    user.value = null
    usage.value = null
    sessionRestored.value = true
    clearStoredToken()
  }

  async function runAuthRequest(request: () => Promise<{ token: string; user: AuthUser }>): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      const response = await request()
      applyAuthenticatedSession(response)
      sessionRestored.value = true
      await refreshUsage()
      await loadBillingPlans()
    } catch (caughtError) {
      error.value = getApiErrorMessage(caughtError, '账号请求失败')
      throw caughtError
    } finally {
      loading.value = false
    }
  }

  function applyAuthenticatedSession(response: { token: string; user: AuthUser }): void {
    token.value = response.token
    user.value = response.user
    sessionRestored.value = true
    setStoredToken(response.token)
  }

  function handleAuthenticatedMutationError(caughtError: unknown, fallback: string): void {
    if (isUnauthorizedApiError(caughtError)) {
      logout()
      error.value = '登录已过期，请重新登录'
      return
    }

    error.value = getApiErrorMessage(caughtError, fallback)
  }

  return {
    token,
    user,
    usage,
    billingPlans,
    loading,
    error,
    sessionRestored,
    isAuthenticated,
    usageLabel,
    register,
    login,
    restoreSession,
    refreshUsage,
    loadBillingPlans,
    upgradePlan,
    updateAccountProfile,
    updateAccountPassword,
    logout,
  }
})
