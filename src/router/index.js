import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores'
<<<<<<< HEAD

// Layouts
import AppLayout from '@/layouts/AppLayout.vue'
=======
>>>>>>> 52f35b6ba5d8a545a94d197e783b869a4e34c3b7

// Auth Views
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

// Dashboard Views
import Dashboard from '@/views/Dashboard.vue'

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

  // Dashboard Route
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },

  // Protected Routes - سيتم تحميلها بشكل متأخر
  {
    path: '/',
<<<<<<< HEAD
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
=======
    redirect: '/dashboard',
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('@/views/Clients.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/create',
    name: 'CreateClient',
    component: () => import('@/views/CreateClient.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetails',
    component: () => import('@/views/ClientDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('@/views/invoices/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/create',
    name: 'CreateInvoice',
    component: () => import('@/views/invoices/Create.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id/edit',
    name: 'EditInvoice',
    component: () => import('@/views/invoices/Edit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetails',
    component: () => import('@/views/invoices/Show.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports/Index.vue'),
    meta: { requiresAuth: true }
>>>>>>> 52f35b6ba5d8a545a94d197e783b869a4e34c3b7
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']

  console.log('Router guard:', {
    to: to.name,
    requiresAuth: to.meta.requiresAuth,
    requiresGuest: to.meta.requiresGuest,
    isAuthenticated
  })

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
