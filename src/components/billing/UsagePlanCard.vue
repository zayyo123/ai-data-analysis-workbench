<script setup lang="ts">
import { computed } from 'vue'
import type { AuthUser, BillingPlan, UsageSummary, UserPlan } from '@/types/auth'

const props = defineProps<{
  user: AuthUser | null
  usage: UsageSummary | null
  plans: BillingPlan[]
  loading?: boolean
}>()

const emit = defineEmits<{
  upgrade: [plan: Exclude<UserPlan, 'FREE'>]
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

const paidPlans = computed(() => props.plans.filter((plan) => plan.id !== 'FREE'))

function upgradePlan(plan: BillingPlan): void {
  if (plan.id === 'FREE') return
  emit('upgrade', plan.id)
}
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

      <div
        v-if="isLoggedIn && paidPlans.length"
        class="plan-grid"
      >
        <div
          v-for="plan in paidPlans"
          :key="plan.id"
          class="plan-option"
        >
          <div class="plan-option-header">
            <strong>{{ plan.name }}</strong>
            <span>${{ plan.priceMonthly }}/mo</span>
          </div>
          <p class="muted plan-feature">
            {{ plan.features.slice(0, 2).join(' · ') }}
          </p>
          <el-button
            size="small"
            type="primary"
            :disabled="usage?.plan === plan.id"
            :loading="loading && usage?.plan !== plan.id"
            @click="upgradePlan(plan)"
          >
            {{ usage?.plan === plan.id ? '当前套餐' : `升级 ${plan.name}` }}
          </el-button>
        </div>
      </div>
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

.plan-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.plan-option {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  padding: 10px;
}

.plan-option-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.plan-option-header span,
.plan-feature {
  font-size: 12px;
}
</style>
