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
<<<<<<< Updated upstream
  // Auth Routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
=======
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
>>>>>>> Stashed changes
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
<<<<<<< Updated upstream
    component: Register,
=======
    component: () => import('@/views/Register.vue'),
>>>>>>> Stashed changes
    meta: { requiresGuest: true }
  },

  // Dashboard Route
  {
<<<<<<< Updated upstream
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
=======
    path: '/',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { permission: 'dashboard' }
      },

      // Client Routes
      {
        path: 'clients',
        name: 'Clients',
        component: () => import('@/views/Clients.vue'),
        meta: { permission: 'view_clients' }
      },
      {
        path: 'clients/create',
        name: 'CreateClient',
        component: () => import('@/views/CreateClient.vue'),
        meta: { permission: 'create_client' }
      },
      {
        path: 'clients/:id',
        name: 'ClientDetails',
        component: () => import('@/views/ClientDetails.vue'),
        meta: { permission: 'view_clients' }
      },
      {
        path: 'clients/:id/edit',
        name: 'EditClient',
        component: () => import('@/views/EditClient.vue'),
        meta: { permission: 'edit_client' }
      },

      // Invoice Routes
      {
        path: 'invoices',
        name: 'Invoices',
        component: () => import('@/views/Invoices.vue'),
        meta: { permission: 'view_invoices' }
      },
      {
        path: 'invoices/create',
        name: 'CreateInvoice',
        component: () => import('@/views/CreateInvoice.vue'),
        meta: { permission: 'create_invoice' }
      },
      {
        path: 'invoices/:id',
        name: 'InvoiceDetails',
        component: () => import('@/views/InvoiceDetails.vue'),
        meta: { permission: 'view_invoice_details' }
      },
      {
        path: 'invoices/:id/edit',
        name: 'EditInvoice',
        component: () => import('@/views/invoices/Edit.vue'),
        meta: { permission: 'edit_invoice' }
      },

      // Reports
      {
        path: 'reports/sales',
        name: 'SalesReport',
        component: () => import('@/views/Reports/SalesReport.vue'),
        meta: { permission: 'view_sales_report' }
      },

      // Admin Routes
      {
        path: 'admin/groups',
        name: 'AdminGroups',
        component: () => import('@/views/Admin/Groups.vue'),
        meta: { permission: 'manage_user_groups' }
      },
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('@/views/Admin/Users.vue'),
        meta: { permission: 'manage_users' }
      },
      {
        path: 'admin/permissions',
        name: 'AdminPermissions',
        component: () => import('@/views/Admin/Permissions.vue'),
        meta: { permission: 'manage_permissions' }
      }
    ]
  },

  // Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
>>>>>>> Stashed changes
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

<<<<<<< Updated upstream
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
=======
// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isAuthenticated = await store.dispatch('auth/checkAuth')

    if (!isAuthenticated) {
      return next('/login')
    }

    // permission required
    if (to.meta.permission) {
      const hasPermission = store.getters['auth/hasPermission'](to.meta.permission)

      if (!hasPermission) {
        return next('/')
      }
    }
  }

  // guest only
  if (to.matched.some(record => record.meta.requiresGuest)) {
    const isAuthenticated = await store.dispatch('auth/checkAuth')

    if (isAuthenticated) {
      return next('/')
    }
  }

  next()
>>>>>>> Stashed changes
})

export default router
