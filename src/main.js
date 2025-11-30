import './assets/main.css'

import { createApp } from 'vue'
import store from './stores'
import vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

const app = createApp(App)

// استخدام Vuex
app.use(store)

// تهيئة حالة المصادقة
store.dispatch('auth/initialize')

app.use(i18n)
app.use(router)
app.use(vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored'
})

app.mount('#app')

console.log('✅ App initialized successfully') // للتأكد من التشغيل


/*import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

// إنشاء التطبيق والمخازن
const app = createApp(App)
const pinia = createPinia()

// ترتيب تركيب الإضافات
app.use(pinia)
app.use(i18n)
app.use(router)
app.use(vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored'
})

// تحميل التطبيق
app.mount('#app')*/
