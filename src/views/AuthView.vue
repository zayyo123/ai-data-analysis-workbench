<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const mode = computed(() => (route.name === 'register' ? 'register' : 'login'))
const title = computed(() => (mode.value === 'register' ? '创建团队账号' : '登录工作台'))
const subtitle = computed(() =>
  mode.value === 'register' ? '注册后可同步项目、记录 AI 用量，并逐步接入商业套餐。' : '登录后使用服务端项目保存和 AI 分析额度。',
)

const form = reactive({
  name: '',
  email: '',
  password: '',
})

async function submit(): Promise<void> {
  if (mode.value === 'register') {
    await authStore.register({
      name: form.name.trim() || undefined,
      email: form.email.trim(),
      password: form.password,
    })
  } else {
    await authStore.login({
      email: form.email.trim(),
      password: form.password,
    })
  }

  await router.push('/')
}
</script>

<template>
  <main class="app-shell auth-page">
    <section class="auth-panel">
      <div class="auth-copy">
        <h1>{{ title }}</h1>
        <p>{{ subtitle }}</p>
      </div>

      <el-form
        class="auth-form"
        label-position="top"
        @submit.prevent="submit"
      >
        <el-form-item
          v-if="mode === 'register'"
          label="姓名"
        >
          <el-input
            v-model="form.name"
            placeholder="例如：Zayyo"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="form.email"
            type="email"
            placeholder="you@example.com"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="至少 8 位"
            show-password
          />
        </el-form-item>

        <el-alert
          v-if="authStore.error"
          :title="authStore.error"
          type="error"
          :closable="false"
        />

        <div class="auth-actions">
          <el-button @click="router.push('/')">
            返回首页
          </el-button>
          <el-button
            type="primary"
            native-type="submit"
            :loading="authStore.loading"
          >
            {{ mode === 'register' ? '注册并进入' : '登录' }}
          </el-button>
        </div>

        <p class="auth-switch">
          <span>{{ mode === 'register' ? '已有账号？' : '还没有账号？' }}</span>
          <el-link
            type="primary"
            @click="router.push(mode === 'register' ? '/login' : '/register')"
          >
            {{ mode === 'register' ? '去登录' : '去注册' }}
          </el-link>
        </p>
      </el-form>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-panel {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1fr);
  width: min(860px, 100%);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
}

.auth-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #0f766e;
  color: #ffffff;
  padding: 36px;
}

.auth-copy h1 {
  margin: 0 0 12px;
  font-size: 28px;
}

.auth-copy p {
  margin: 0;
  color: #ccfbf1;
  line-height: 1.8;
}

.auth-form {
  padding: 32px;
}

.auth-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.auth-switch {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 20px 0 0;
  color: #6b7280;
  font-size: 13px;
}

@media (max-width: 760px) {
  .auth-panel {
    grid-template-columns: 1fr;
  }
}
</style>
