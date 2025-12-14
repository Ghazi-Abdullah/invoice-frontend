import './assets/main.css'

import { createApp } from 'vue'
<<<<<<< HEAD
=======
import store from '@/stores'
import vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

>>>>>>> 52f35b6ba5d8a545a94d197e783b869a4e34c3b7
import App from './App.vue'
import router from './router'
<<<<<<< Updated upstream
import i18n from './plugins/i18n'

<<<<<<< HEAD
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import store from './stores'

const app = createApp(App)

=======
import store from './stores'
import i18n from './plugins/i18n' // تأكد أن هذا موجود ويصدّر createI18n


// Toastify
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Font Awesome (متوافق مع Vue 3)
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUser, faFileInvoice, faUsers, faChartBar,
  faCog, faSignOutAlt, faHome, faPlus,
  faEdit, faTrash, faCheckCircle, faMoneyBillWave,
  faCircle, faChevronDown, faUserPlus, faFolder
} from '@fortawesome/free-solid-svg-icons'

// إضافة الأيقونات للمكتبة
library.add(
  faUser, faFileInvoice, faUsers, faChartBar,
  faCog, faSignOutAlt, faHome, faPlus,
  faEdit, faTrash, faCheckCircle, faMoneyBillWave,
  faCircle, faChevronDown, faUserPlus, faFolder
)

// إنشاء التطبيق
const app = createApp(App)

// إضافة FontAwesome كـ Global Component
app.component('font-awesome-icon', FontAwesomeIcon)

// Vuex + Router
>>>>>>> Stashed changes
app.use(store)
app.use(i18n)
app.use(router)
<<<<<<< Updated upstream
=======
app.use(i18n)  // ⬅️ ربط i18n


// Toastify
>>>>>>> Stashed changes
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  rtl: true
})

<<<<<<< Updated upstream
=======
// دالة التحقق من الصلاحيات
app.config.globalProperties.$hasPermission = function (permission) {
  const user = this.$store.state.auth.user
  if (!user) return false

  // admin له كل الصلاحيات
  if (user.roles?.some(role => role.name === 'admin')) {
    return true
  }

  return user.permissions?.includes(permission) || false
}

// دالة هل المستخدم Admin؟
app.config.globalProperties.$isAdmin = function () {
  const user = this.$store.state.auth.user
  return user?.roles?.some(role => role.name === 'admin') || false
}

// ربط $toast
>>>>>>> Stashed changes
app.config.globalProperties.$toast = toast

// تشغيل التطبيق
app.mount('#app')

export { toast }

=======
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

>>>>>>> 52f35b6ba5d8a545a94d197e783b869a4e34c3b7
console.log('✅ App initialized successfully')
