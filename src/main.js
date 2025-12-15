import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import i18n from './plugins/i18n'

// Toastify
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Font Awesome (Vue 3)
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUser,
  faFileInvoice,
  faUsers,
  faChartBar,
  faCog,
  faSignOutAlt,
  faHome,
  faPlus,
  faEdit,
  faTrash,
  faCheckCircle,
  faMoneyBillWave,
  faCircle,
  faChevronDown,
  faUserPlus,
  faFolder
} from '@fortawesome/free-solid-svg-icons'

// إضافة الأيقونات
library.add(
  faUser,
  faFileInvoice,
  faUsers,
  faChartBar,
  faCog,
  faSignOutAlt,
  faHome,
  faPlus,
  faEdit,
  faTrash,
  faCheckCircle,
  faMoneyBillWave,
  faCircle,
  faChevronDown,
  faUserPlus,
  faFolder
)

// إنشاء التطبيق
const app = createApp(App)

// تسجيل FontAwesome كمكوّن عام
app.component('font-awesome-icon', FontAwesomeIcon)

// Vuex + Router + i18n
app.use(store)
app.use(router)
app.use(i18n)

// Toastify
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

// هل المستخدم Admin؟
app.config.globalProperties.$isAdmin = function () {
  const user = this.$store.state.auth.user
  return user?.roles?.some(role => role.name === 'admin') || false
}

// ربط toast عالميًا
app.config.globalProperties.$toast = toast

// تشغيل التطبيق
app.mount('#app')

console.log('✅ تم تهيئة التطبيق بنجاح')
