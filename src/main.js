import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

// استخدام Vuex و Router
app.use(store)
app.use(router)

// استخدام Toastify
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  rtl: true,
})

// دالة مساعدة للتحقق من الصلاحيات
app.config.globalProperties.$hasPermission = function (permission) {
  const user = this.$store.state.auth.user
  if (!user) return false

  // Admin لديه كل الصلاحيات
  if (user.roles?.some(role => role.name === 'admin')) {
    return true
  }

  return user.permissions?.includes(permission) || false
}

app.config.globalProperties.$isAdmin = function () {
  const user = this.$store.state.auth.user
  return user?.roles?.some(role => role.name === 'admin') || false
}

app.config.globalProperties.$toast = toast

app.mount('#app')

console.log('✅ تم تهيئة التطبيق بنجاح')
