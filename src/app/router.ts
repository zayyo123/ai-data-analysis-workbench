import { createRouter, createWebHistory } from 'vue-router'

const AuthView = () => import('@/views/AuthView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const ReportView = () => import('@/views/ReportView.vue')
const WorkbenchView = () => import('@/views/WorkbenchView.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: AuthView },
    { path: '/register', name: 'register', component: AuthView },
    { path: '/workbench/:projectId', name: 'workbench', component: WorkbenchView },
    { path: '/report/:projectId', name: 'report', component: ReportView },
  ],
})
