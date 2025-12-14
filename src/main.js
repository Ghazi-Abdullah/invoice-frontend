import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
<<<<<<< HEAD
<<<<<<< Updated upstream
import i18n from './plugins/i18n'

<<<<<<< HEAD
=======
import store from './stores'
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

<<<<<<< HEAD
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
=======
// استخدام Vuex و Router
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
app.use(store)
app.use(router)
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
app.use(i18n)  // ⬅️ ربط i18n


// Toastify
>>>>>>> Stashed changes
=======

// استخدام Toastify
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  rtl: true,
})

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
// دالة التحقق من الصلاحيات
=======
// دالة مساعدة للتحقق من الصلاحيات
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
app.config.globalProperties.$hasPermission = function (permission) {
  const user = this.$store.state.auth.user
  if (!user) return false

<<<<<<< HEAD
  // admin له كل الصلاحيات
=======
  // Admin لديه كل الصلاحيات
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
  if (user.roles?.some(role => role.name === 'admin')) {
    return true
  }

  return user.permissions?.includes(permission) || false
}

<<<<<<< HEAD
// دالة هل المستخدم Admin؟
=======
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
app.config.globalProperties.$isAdmin = function () {
  const user = this.$store.state.auth.user
  return user?.roles?.some(role => role.name === 'admin') || false
}

<<<<<<< HEAD
// ربط $toast
>>>>>>> Stashed changes
=======
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
app.config.globalProperties.$toast = toast

// تشغيل التطبيق
app.mount('#app')

console.log('✅ تم تهيئة التطبيق بنجاح')
