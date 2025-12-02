import './assets/main.css'

import { createApp } from 'vue'
import store from '@/stores'
import vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

const app = createApp(App)

// تخزين reference للتطبيق للنافذة لاستخدامه في axios interceptor
window.vueApp = app

// استخدام Vuex
app.use(store)

// تهيئة حالة المصادقة
store.dispatch('auth/initialize').then(() => {
  console.log('✅ Auth initialized')

  // اختبار الاتصال بعد تهيئة المصادقة
  setTimeout(async () => {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    console.log('🔐 Authentication status:', isAuthenticated)

    if (isAuthenticated) {
      console.log('👤 Current user:', store.getters['auth/currentUser'])
      console.log('🔑 Token exists:', !!store.state.auth.token)

      // اختبار الاتصال بالـ API
      const api = await import('@/api/axios')
      await api.default.testConnection()
    }
  }, 500)
}).catch(err => {
  console.error('❌ Auth initialization failed:', err)
})

app.use(i18n)
app.use(router)
app.use(vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored'
})

app.mount('#app')

console.log('✅ App initialized successfully')
