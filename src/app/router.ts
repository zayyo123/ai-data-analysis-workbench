import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const AuthView = () => import('@/views/AuthView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const ReportView = () => import('@/views/ReportView.vue')
const WorkbenchView = () => import('@/views/WorkbenchView.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: AuthView, meta: { guestOnly: true } },
    { path: '/register', name: 'register', component: AuthView, meta: { guestOnly: true } },
    { path: '/workbench/:projectId', name: 'workbench', component: WorkbenchView },
    { path: '/report/:projectId', name: 'report', component: ReportView },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  await authStore.restoreSession()

  // 已登录用户再次进入登录/注册页时直接回首页，避免演示时看到重复登录表单。
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'home' }
  }

  return true
})
