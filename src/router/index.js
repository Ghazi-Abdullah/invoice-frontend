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
    component: () => import('@/views/Login.vue'),
    meta: { guest: true, requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { guest: true, requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('@/views/Invoices.vue'),
    meta: { requiresAuth: true, permission: 'view_invoices' }
  },
  {
    path: '/invoices/create',
    name: 'CreateInvoice',
    component: () => import('@/views/CreateInvoice.vue'),
    meta: { requiresAuth: true, permission: 'create_invoice' }
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetails',
    component: () => import('@/views/InvoiceDetails.vue'),
    meta: { requiresAuth: true, permission: 'view_invoices' }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('@/views/Clients.vue'),
    meta: { requiresAuth: true, permission: 'view_clients' }
  },
  {
    path: '/clients/create',
    name: 'CreateClient',
    component: () => import('@/views/CreateClient.vue'),
    meta: { requiresAuth: true, permission: 'create_client' }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetails',
    component: () => import('@/views/ClientDetails.vue'),
    meta: { requiresAuth: true, permission: 'view_clients' }
  },
  {
    path: '/clients/:id/edit',
    name: 'EditClient',
    component: () => import('@/views/EditClient.vue'),
    meta: { requiresAuth: true, permission: 'edit_client' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports/Index.vue'),
    meta: { requiresAuth: true, permission: 'view_reports' }
  },
  {
    path: '/reports/sales',
    name: 'SalesReport',
    component: () => import('@/views/Reports/SalesReport.vue'),
    meta: { requiresAuth: true, permission: 'view_sales_report' }
  },
  {
    path: '/admin',
    redirect: '/admin/users'
  },
  {
    path: '/admin/permissions',
    name: 'AdminPermissions',
    component: () => import('@/views/Admin/Permissions.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      permission: 'administration'
    }
  },
  {
    path: '/admin/groups',
    name: 'AdminGroups',
    component: () => import('@/views/Admin/Groups.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      permission: 'administration'
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/views/Admin/Users.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      permission: 'administration'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  },
  {
    path: '/admin/assign-permissions',
    name: 'AssignPermissions',
    component: () => import('@/views/Admin/AssignPermissions.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard - محسن
router.beforeEach(async (to, from, next) => {
  // الحصول على التوكن
  const token = localStorage.getItem('token')

  // إذا كانت الصفحة تتطلب مصادقة
  if (to.meta.requiresAuth) {
    if (!token) {
      // إذا لم يكن هناك توكن، توجيه للصفحة الرئيسية
      return next('/login')
    }

    try {
      // التحقق من صحة التوكن وجلب بيانات المستخدم
      const isAuthenticated = await store.dispatch('auth/checkAuth')

      if (!isAuthenticated) {
        // إذا لم يكن المستخدم مصادقًا
        store.commit('auth/CLEAR_AUTH')
        localStorage.removeItem('token')
        return next('/login')
      }

      // التحقق من الصلاحيات إذا كانت مطلوبة
      if (to.meta.permission) {
        const hasPermission = store.getters['auth/hasPermission'](to.meta.permission)
        if (!hasPermission) {
          // إذا لم يكن لديه الصلاحية
          return next('/dashboard')
        }
      }

      // السماح بالوصول
      next()
    } catch (error) {
      console.error('Authentication error:', error)
      store.commit('auth/CLEAR_AUTH')
      localStorage.removeItem('token')
      return next('/login')
    }
  }
  // إذا كانت الصفحة للضيوف فقط
  else if (to.meta.requiresGuest) {
    if (token) {
      // إذا كان المستخدم مصادقًا، توجيه للصفحة الرئيسية
      return next('/dashboard')
    }
    next()
  }
  // المسارات العامة
  else {
    next()
  }
})

export default router
