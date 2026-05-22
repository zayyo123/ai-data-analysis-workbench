<script setup lang="ts">
import { computed } from 'vue'
import type { AuthUser, UsageSummary } from '@/types/auth'

const props = defineProps<{
  user: AuthUser | null
  usage: UsageSummary | null
}>()

const isLoggedIn = computed(() => Boolean(props.user))
const limitText = computed(() => {
  if (!props.usage) return '未同步'
  if (props.usage.aiDailyLimit === null) return '不限次'
  return `${props.usage.aiUsedToday}/${props.usage.aiDailyLimit}`
})

const usagePercent = computed(() => {
  if (!props.usage?.aiDailyLimit) return 0
  return Math.min(100, Math.round((props.usage.aiUsedToday / props.usage.aiDailyLimit) * 100))
})

const planDescription = computed(() => {
  if (!isLoggedIn.value) return '登录后可开启云端项目保存、AI 用量统计和团队套餐能力。'
  if (!props.usage) return '正在同步账号套餐和用量信息。'
  if (props.usage.aiDailyLimit === null) return '当前套餐适合高频分析、团队协作和自动化报告。'
  return '免费版适合演示和轻量分析，后续可升级为 Pro 解锁更高额度。'
})
</script>

<template>
  <div class="panel">
    <div class="panel-header">
      <h2 class="panel-title">
        套餐与用量
      </h2>
      <el-tag :type="isLoggedIn ? 'success' : 'info'">
        {{ usage?.plan ?? 'LOCAL' }}
      </el-tag>
    </div>
    <div class="panel-body usage-card">
      <div>
        <p class="usage-value">
          {{ limitText }}
        </p>
        <p class="muted usage-caption">
          今日 AI 分析额度
        </p>
      </div>

      <el-progress
        v-if="usage?.aiDailyLimit"
        :percentage="usagePercent"
        :stroke-width="8"
        :show-text="false"
      />

      <p class="usage-description">
        {{ planDescription }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.usage-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.usage-value {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
}

.usage-caption,
.usage-description {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.usage-description {
  color: #4b5563;
}
</style>
