import 'element-plus/dist/index.css'
import '@/assets/styles/base.css'

import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import { pinia } from '@/app/pinia'
import { router } from '@/app/router'
import App from './App.vue'

createApp(App).use(pinia).use(router).use(ElementPlus).mount('#app')
