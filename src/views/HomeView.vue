<script setup lang="ts">
import { useRouter } from 'vue-router'
import FileDropzone from '@/components/upload/FileDropzone.vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useDatasetStore } from '@/stores/datasetStore'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const datasetStore = useDatasetStore()
const dashboardStore = useDashboardStore()
const projectStore = useProjectStore()

async function handleFileSelect(file: File): Promise<void> {
  await datasetStore.parseFile(file)
  if (!datasetStore.currentDataset) return

  dashboardStore.resetDashboard(`${datasetStore.currentDataset.name} 分析看板`)
  const project = projectStore.createProject(datasetStore.currentDataset.name, datasetStore.currentDataset.id, dashboardStore.dashboard)
  await router.push(`/workbench/${project.id}`)
}

function openProject(projectId: string): void {
  projectStore.loadProject(projectId)
  void router.push(`/workbench/${projectId}`)
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
          上传数据，生成图表，看 AI 分析，导出报告
        </p>
      </div>
      <el-link
        href="https://github.com"
        target="_blank"
      >
        GitHub
      </el-link>
    </header>

    <section class="page home-grid">
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">
            开始分析
          </h2>
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
          <el-empty
            v-if="projectStore.projects.length === 0"
            description="上传数据后会自动创建项目"
          />
          <div
            v-else
            class="project-list"
          >
            <button
              v-for="project in projectStore.projects"
              :key="project.id"
              class="project-item"
              @click="openProject(project.id)"
            >
              <strong>{{ project.name }}</strong>
              <span>{{ new Date(project.updatedAt).toLocaleString() }}</span>
            </button>
          </div>
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

.upload-error {
  margin-top: 12px;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-item {
  display: flex;
  width: 100%;
  cursor: pointer;
  flex-direction: column;
  gap: 4px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 12px;
  text-align: left;
}

.project-item:hover {
  border-color: #2563eb;
}

.project-item span {
  color: #6b7280;
  font-size: 12px;
}

@media (max-width: 900px) {
  .home-grid {
    grid-template-columns: 1fr;
  }
}
</style>
