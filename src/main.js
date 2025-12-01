import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

import Vue3Toastify from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { toast } from 'vue3-toastify'

import auth from './stores/modules/auth'

const store = createStore({
  modules: {
    auth
  }
})

const app = createApp(App)

app.use(store)
app.use(i18n)
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  rtl: true
})

app.config.globalProperties.$toast = toast

app.mount('#app')

export { toast }

console.log('✅ App initialized successfully')


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
