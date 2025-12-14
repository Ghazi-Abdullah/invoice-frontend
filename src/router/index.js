import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores'

const routes = [
<<<<<<< HEAD
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
=======
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
  },
  {
    path: '/register',
    name: 'Register',
<<<<<<< HEAD
<<<<<<< Updated upstream
    component: Register,
=======
    component: () => import('@/views/Register.vue'),
>>>>>>> Stashed changes
    meta: { requiresGuest: true }
=======
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
  },
  {
<<<<<<< Updated upstream
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('../views/invoices/Index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/create',
    name: 'CreateInvoice',
    component: () => import('../views/invoices/Create.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetails',
    component: () => import('../views/invoices/Show.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices/:id/edit',
    name: 'EditInvoice',
    component: () => import('../views/invoices/Edit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('../views/Clients.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports/Index.vue'),
    meta: { requiresAuth: true }
<<<<<<< HEAD
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
=======
  },
  {
    path: '/permissions',
    name: 'PermissionManagement',
    component: () => import('../views/PermissionManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/users',
    name: 'UserManagement',
    component: () => import('../views/UserManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

<<<<<<< HEAD
<<<<<<< Updated upstream
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
=======
// Navigation guard للتحقق من المصادقة والصلاحيات
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73

  // إذا كان المستخدم غير مسجل
  if (!token && to.meta.requiresAuth) {
    return next('/login')
  }
<<<<<<< HEAD
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
=======

  // إذا كان المستخدم مسجل ويحاول الدخول لصفحات الضيوف
  if (token && to.meta.guest) {
    return next('/dashboard')
  }

  // إذا كان المستخدم مسجل
  if (token) {
    // تحميل بيانات المستخدم إذا لم تكن محملة
    if (!store.state.auth.user) {
      try {
        await store.dispatch('auth/fetchUser')
      } catch (error) {
        store.commit('auth/LOGOUT')
        return next('/login')
      }
    }

    // التحقق من صلاحيات الأدمن
    if (to.meta.requiresAdmin) {
      const user = store.state.auth.user
      const isAdmin = user?.roles?.some(role => role.name === 'admin') || false

      if (!isAdmin) {
        return next('/dashboard')
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
      }
    }
  }

<<<<<<< HEAD
  // guest only
  if (to.matched.some(record => record.meta.requiresGuest)) {
    const isAuthenticated = await store.dispatch('auth/checkAuth')

    if (isAuthenticated) {
      return next('/')
    }
  }

  next()
>>>>>>> Stashed changes
=======
  next()
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
})

export default router
