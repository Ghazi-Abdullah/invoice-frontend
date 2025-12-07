import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './plugins/i18n'

import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import store from './stores'

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
