<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus/es/components/message/index'
import { ElMessageBox } from 'element-plus/es/components/message-box/index'
import UsagePlanCard from '@/components/billing/UsagePlanCard.vue'
import FileDropzone from '@/components/upload/FileDropzone.vue'
import { sampleDatasets, type SampleDataset } from '@/data/sampleDatasets'
import { createRemoteDataset, deleteRemoteDataset } from '@/services/api/datasetApi'
import { ApiError, getApiErrorMessage, isUnauthorizedApiError } from '@/services/api/httpClient'
import { createRemoteProject } from '@/services/api/projectApi'
import { useAuthStore } from '@/stores/authStore'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useDatasetStore } from '@/stores/datasetStore'
import { useProjectStore } from '@/stores/projectStore'
import type { UserPlan } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()
const datasetStore = useDatasetStore()
const dashboardStore = useDashboardStore()
const projectStore = useProjectStore()
const accountDialogVisible = ref(false)
const profileForm = reactive({
  name: '',
})
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

onMounted(() => {
  if (authStore.isAuthenticated) {
    void projectStore.refreshRemoteProjects()
    void authStore.loadBillingPlans()
  }
})

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      void projectStore.refreshRemoteProjects()
      void authStore.loadBillingPlans()
    }
  },
)

async function handleFileSelect(file: File): Promise<void> {
  await datasetStore.parseFile(file)
  if (!datasetStore.currentDataset) return

  await createProjectFromCurrentDataset()
}

async function loadSampleDataset(sample: SampleDataset): Promise<void> {
  await datasetStore.loadCsvText(sample.csv, sample.fileName, sample.name)
  if (!datasetStore.currentDataset) return

  await createProjectFromCurrentDataset()
}

async function createProjectFromCurrentDataset(): Promise<void> {
  if (!datasetStore.currentDataset) return

  dashboardStore.resetDashboard(`${datasetStore.currentDataset.name} 分析看板`)

  if (authStore.isAuthenticated) {
    let remoteDatasetId = ''
    const localDatasetId = datasetStore.currentDataset.id

    try {
      const remoteDataset = await createRemoteDataset(datasetStore.currentDataset)
      remoteDatasetId = remoteDataset.id
      datasetStore.updateDatasetId(remoteDataset.id)
      const remoteProject = await createRemoteProject({
        name: datasetStore.currentDataset.name,
        datasetId: remoteDataset.id,
        dashboard: dashboardStore.dashboard,
      })
      projectStore.upsertProject(remoteProject)
      await authStore.refreshUsage()
      await router.push(`/workbench/${remoteProject.id}`)
      return
    } catch (caughtError) {
      if (remoteDatasetId) {
        // 项目创建失败时清理刚写入的云端数据集，避免额度限制或网络错误留下不可见的孤立数据。
        try {
          await deleteRemoteDataset(remoteDatasetId)
        } catch {
          // 清理失败不阻断本地兜底；后端级回收可以在后续任务中通过孤立数据集清理器补强。
        }
        datasetStore.updateDatasetId(localDatasetId)
      }

      if (isUnauthorizedApiError(caughtError)) {
        authStore.logout()
      }

      const message = isUnauthorizedApiError(caughtError)
        ? '登录已过期，云端保存已关闭'
        : getApiErrorMessage(caughtError, '服务端同步失败')
      if (caughtError instanceof ApiError && caughtError.code === 'PROJECT_LIMIT_EXCEEDED') {
        await authStore.refreshUsage()
        ElMessage.warning(`${message}，已切换为本地演示模式；升级 Pro 后可继续云端保存`)
      } else {
        ElMessage.warning(`${message}，已切换为本地演示模式`)
      }
    }
  }

  const project = projectStore.createProject(datasetStore.currentDataset.name, datasetStore.currentDataset.id, dashboardStore.dashboard)
  await router.push(`/workbench/${project.id}`)
}

function openProject(projectId: string): void {
  projectStore.loadProject(projectId)
  void router.push(`/workbench/${projectId}`)
}

async function deleteProject(projectId: string, projectName: string): Promise<void> {
  try {
    await ElMessageBox.confirm(`确定删除「${projectName}」吗？此操作会同步删除云端项目。`, '删除项目', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await projectStore.deleteProject(projectId)
    ElMessage.success('项目已删除')
  } catch (caughtError) {
    if (caughtError === 'cancel' || caughtError === 'close') return
    ElMessage.error(projectStore.syncError || '项目删除失败')
  }
}

function logout(): void {
  authStore.logout()
  ElMessage.success('已退出登录')
}

function openAccountSettings(): void {
  profileForm.name = authStore.user?.name ?? ''
  resetPasswordForm()
  accountDialogVisible.value = true
}

async function saveProfile(): Promise<void> {
  const name = profileForm.name.trim()
  if (!name) {
    ElMessage.warning('请输入账户昵称')
    return
  }

  try {
    await authStore.updateAccountProfile({ name })
    ElMessage.success('账户资料已更新')
  } catch {
    ElMessage.error(authStore.error || '账户资料更新失败')
  }
}

async function savePassword(): Promise<void> {
  if (passwordForm.newPassword.length < 8) {
    ElMessage.warning('新密码至少需要 8 位')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.warning('两次输入的新密码不一致')
    return
  }

  try {
    await authStore.updateAccountPassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    resetPasswordForm()
    ElMessage.success('密码已修改，请妥善保存新密码')
  } catch {
    ElMessage.error(authStore.error || '密码修改失败')
  }
}

function resetPasswordForm(): void {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

async function upgradePlan(plan: Exclude<UserPlan, 'FREE'>): Promise<void> {
  try {
    await authStore.upgradePlan(plan)
    ElMessage.success(`已升级到 ${plan} 套餐`)
  } catch {
    ElMessage.error(authStore.error || '套餐升级失败')
  }
}
</script>

<template>
  <main class="app-shell">
    <header class="topbar">
      <div class="brand">
        <h1 class="brand-title">
          AI Data Analysis Workbench
        </h1>
        <p class="brand-subtitle">
          上传数据，生成图表，查看 AI 分析，导出报告
        </p>
      </div>
      <div class="toolbar">
        <el-tag
          v-if="authStore.isAuthenticated"
          type="success"
        >
          {{ authStore.usageLabel }}
        </el-tag>
        <template v-if="authStore.isAuthenticated">
          <span class="account-summary">
            <strong>{{ authStore.user?.name || '已登录用户' }}</strong>
            <span>{{ authStore.user?.email }}</span>
          </span>
          <el-button @click="openAccountSettings">
            账户设置
          </el-button>
          <el-button @click="logout">
            退出
          </el-button>
        </template>
        <template v-else>
          <el-button @click="router.push('/login')">
            登录
          </el-button>
          <el-button
            type="primary"
            @click="router.push('/register')"
          >
            注册
          </el-button>
        </template>
        <el-link
          href="https://github.com/zayyo123/ai-data-analysis-workbench"
          target="_blank"
        >
          GitHub
        </el-link>
      </div>
    </header>

    <el-dialog
      v-model="accountDialogVisible"
      title="账户设置"
      width="520px"
    >
      <div class="account-settings">
        <el-form label-position="top">
          <el-form-item label="邮箱">
            <el-input
              :model-value="authStore.user?.email"
              disabled
            />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input
              v-model="profileForm.name"
              maxlength="80"
              show-word-limit
              placeholder="用于项目协作和演示账号展示"
            />
          </el-form-item>
          <el-button
            type="primary"
            :loading="authStore.loading"
            @click="saveProfile"
          >
            保存资料
          </el-button>
        </el-form>

        <div class="account-divider" />

        <el-form label-position="top">
          <el-form-item label="当前密码">
            <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              show-password
              autocomplete="current-password"
            />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <el-form-item label="确认新密码">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
              autocomplete="new-password"
            />
          </el-form-item>
          <el-button
            :loading="authStore.loading"
            @click="savePassword"
          >
            修改密码
          </el-button>
        </el-form>
      </div>
    </el-dialog>

    <section class="page home-grid">
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            开始分析
          </h2>
          <span class="muted">{{ authStore.isAuthenticated ? '云端保存已开启' : '未登录时使用本地模式' }}</span>
        </div>
        <div class="panel-body">
          <FileDropzone
            :loading="datasetStore.loading"
            @select="handleFileSelect"
          />
          <el-alert
            v-if="datasetStore.error"
            class="upload-error"
            :title="datasetStore.error"
            type="error"
            :closable="false"
          />
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            最近项目
          </h2>
          <span class="muted">{{ projectStore.projects.length }} 个</span>
        </div>
        <div class="panel-body">
          <el-alert
            v-if="projectStore.syncError"
            class="upload-error"
            :title="projectStore.syncError"
            type="warning"
            :closable="false"
          />
          <el-empty
            v-if="projectStore.projects.length === 0"
            description="上传数据后会自动创建项目"
          />
          <div
            v-else
            class="project-list"
          >
            <div
              v-for="project in projectStore.projects"
              :key="project.id"
              class="project-item"
            >
              <button
                class="project-open"
                @click="openProject(project.id)"
              >
                <strong>{{ project.name }}</strong>
                <span>{{ new Date(project.updatedAt).toLocaleString() }}</span>
              </button>
              <el-button
                class="project-delete"
                size="small"
                type="danger"
                plain
                @click="deleteProject(project.id, project.name)"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <UsagePlanCard
        :user="authStore.user"
        :usage="authStore.usage"
        :usage-logs="authStore.usageLogs"
        :plans="authStore.billingPlans"
        :loading="authStore.loading"
        @upgrade="upgradePlan"
      />

      <div class="panel sample-panel">
        <div class="panel-header">
          <h2 class="panel-title">
            示例数据
          </h2>
          <span class="muted">一键体验完整链路</span>
        </div>
        <div class="panel-body sample-grid">
          <button
            v-for="sample in sampleDatasets"
            :key="sample.fileName"
            class="sample-card"
            @click="loadSampleDataset(sample)"
          >
            <strong>{{ sample.name }}</strong>
            <span>{{ sample.description }}</span>
          </button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 16px;
}

.sample-panel {
  grid-column: 1 / -1;
}

.sample-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.upload-error {
  margin-top: 12px;
}

.account-settings {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.account-divider {
  height: 1px;
  background: #e5e7eb;
}

.account-summary {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
  line-height: 1.2;
}

.account-summary strong {
  max-width: 180px;
  overflow: hidden;
  color: #111827;
  font-size: 13px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-summary span {
  max-width: 180px;
  overflow: hidden;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 10px;
}

.project-item:hover {
  border-color: #2563eb;
}

.project-open {
  display: flex;
  min-width: 0;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
}

.project-open span {
  color: #6b7280;
  font-size: 12px;
}

.project-delete {
  flex: none;
}

.sample-card {
  display: flex;
  min-height: 104px;
  cursor: pointer;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 14px;
  text-align: left;
}

.sample-card:hover {
  border-color: #2563eb;
  background: #f8fbff;
}

.sample-card span {
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 900px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
</style>
