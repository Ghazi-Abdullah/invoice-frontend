import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard للتحقق من المصادقة والصلاحيات
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')

  // إذا كان المستخدم غير مسجل
  if (!token && to.meta.requiresAuth) {
    return next('/login')
  }

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
      }
    }
  }

  next()
})

export default router
