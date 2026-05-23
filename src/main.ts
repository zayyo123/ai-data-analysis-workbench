import 'element-plus/dist/index.css'
import '@/assets/styles/base.css'

import { ElAlert } from 'element-plus/es/components/alert/index'
import { ElButton } from 'element-plus/es/components/button/index'
import { ElDialog } from 'element-plus/es/components/dialog/index'
import { ElEmpty } from 'element-plus/es/components/empty/index'
import { ElForm, ElFormItem } from 'element-plus/es/components/form/index'
import { ElIcon } from 'element-plus/es/components/icon/index'
import { ElInput } from 'element-plus/es/components/input/index'
import { ElInputNumber } from 'element-plus/es/components/input-number/index'
import { ElLink } from 'element-plus/es/components/link/index'
import { ElOption, ElSelect } from 'element-plus/es/components/select/index'
import { ElProgress } from 'element-plus/es/components/progress/index'
import { ElSegmented } from 'element-plus/es/components/segmented/index'
import { ElTable, ElTableColumn } from 'element-plus/es/components/table/index'
import { ElTag } from 'element-plus/es/components/tag/index'
import { createApp } from 'vue'
import { pinia } from '@/app/pinia'
import { router } from '@/app/router'
import { useAuthStore } from '@/stores/authStore'
import App from './App.vue'

const app = createApp(App)

const elementPlusComponents = [
  ElAlert,
  ElButton,
  ElDialog,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElLink,
  ElOption,
  ElProgress,
  ElSegmented,
  ElSelect,
  ElTable,
  ElTableColumn,
  ElTag,
]

app.use(pinia).use(router)
elementPlusComponents.forEach((component) => app.use(component))

void useAuthStore().restoreSession()

app.mount('#app')
