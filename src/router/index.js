import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores' // استيراد Vuex store

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'

// Auth Views
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

// Dashboard Views
import Dashboard from '@/views/Dashboard.vue'

// Client Views
import Clients from '@/views/Clients.vue'
import ClientDetails from '@/views/ClientDetails.vue'
import CreateClient from '@/views/CreateClient.vue'

// Invoice Views
import Invoices from '@/views/invoices/Index.vue'
import CreateInvoice from '@/views/invoices/Create.vue'
import EditInvoice from '@/views/invoices/Edit.vue'
import InvoiceDetails from '@/views/invoices/Show.vue'

const routes = [
  // Auth Routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },

  // Protected Routes with AppLayout
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '/dashboard', name: 'Dashboard', component: Dashboard },
      { path: '/clients', name: 'Clients', component: Clients },
      { path: '/clients/create', name: 'CreateClient', component: CreateClient },
      { path: '/clients/:id', name: 'ClientDetails', component: ClientDetails },
      { path: '/invoices', name: 'Invoices', component: Invoices },
      { path: '/invoices/create', name: 'CreateInvoice', component: CreateInvoice },
      { path: '/invoices/:id/edit', name: 'EditInvoice', component: EditInvoice },
      { path: '/invoices/:id', name: 'InvoiceDetails', component: InvoiceDetails }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // التحقق من حالة المصادقة باستخدام Vuex store
  const isAuthenticated = store.getters['auth/isAuthenticated']

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router


/*import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/modules/auth'

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'

// Auth Views
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

// Dashboard Views
import Dashboard from '@/views/Dashboard.vue'

// Client Views
import Clients from '@/views/Clients.vue'
import ClientDetails from '@/views/ClientDetails.vue'
import CreateClient from '@/views/CreateClient.vue'

// Invoice Views
import Invoices from '@/views/invoices/Index.vue'
import CreateInvoice from '@/views/invoices/Create.vue'
import EditInvoice from '@/views/invoices/Edit.vue'
import InvoiceDetails from '@/views/invoices/Show.vue'

const routes = [
  // Auth Routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },

  // Protected Routes with AppLayout
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '/dashboard', name: 'Dashboard', component: Dashboard },
      { path: '/clients', name: 'Clients', component: Clients },
      { path: '/clients/create', name: 'CreateClient', component: CreateClient },
      { path: '/clients/:id', name: 'ClientDetails', component: ClientDetails },
      { path: '/invoices', name: 'Invoices', component: Invoices },
      { path: '/invoices/create', name: 'CreateInvoice', component: CreateInvoice },
      { path: '/invoices/:id/edit', name: 'EditInvoice', component: EditInvoice },
      { path: '/invoices/:id', name: 'InvoiceDetails', component: InvoiceDetails }
    ]
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router*/
