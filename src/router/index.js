import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores'

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
    redirect: '/dashboard', // ✅ توجيه تلقائي للداشبورد
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'clients', name: 'Clients', component: Clients },
      { path: 'clients/create', name: 'CreateClient', component: CreateClient },
      { path: 'clients/:id', name: 'ClientDetails', component: ClientDetails },
      { path: 'invoices', name: 'Invoices', component: Invoices },
      { path: 'invoices/create', name: 'CreateInvoice', component: CreateInvoice },
      { path: 'invoices/:id/edit', name: 'EditInvoice', component: EditInvoice },
      { path: 'invoices/:id', name: 'InvoiceDetails', component: InvoiceDetails },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Reports/Index.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
