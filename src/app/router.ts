import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ReportView from '@/views/ReportView.vue'
import WorkbenchView from '@/views/WorkbenchView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/workbench/:projectId', name: 'workbench', component: WorkbenchView },
    { path: '/report/:projectId', name: 'report', component: ReportView },
  ],
})
