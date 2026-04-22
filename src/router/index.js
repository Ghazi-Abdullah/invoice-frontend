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
    component: () => import('@/views/Auth/Login.vue'),
    meta: { guest: true, requiresGuest: true }
  },
  {
    path: '/login-otp',
    name: 'LoginOtp',
    component: () => import('@/views/Auth/LoginOtp.vue'),
    meta: { guest: true, requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/Register.vue'),
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
    component: () => import('@/views/invoices/InvoicesIndex.vue'),
    meta: { requiresAuth: true, permission: 'view_invoices' }
  },
  {
    path: '/invoices/create',
    name: 'CreateInvoice',
    component: () => import('@/views/invoices/CreateInvoice.vue'),
    meta: { requiresAuth: true, permission: 'create_invoice' }
  },
  {
    path: '/invoices/:id',
    name: 'InvoiceDetails',
    component: () => import('@/views/invoices/InvoiceDetails.vue'),
    meta: { requiresAuth: true, permission: 'view_invoices' }
  },
  {
    path: '/invoices/:id/edit',
    name: 'EditInvoice',
    component: () => import('@/views/invoices/EditInvoice.vue'),
    meta: { requiresAuth: true, permission: 'edit_invoice' }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('@/views/Clients/ClientsIndex.vue'),
    meta: { requiresAuth: true, permission: 'view_clients' }
  },
  {
    path: '/clients/create',
    name: 'CreateClient',
    component: () => import('@/views/Clients/CreateClient.vue'),
    meta: { requiresAuth: true, permission: 'create_client' }
  },
  {
    path: '/clients/:id',
    name: 'ClientDetails',
    component: () => import('@/views/Clients/ClientDetails.vue'),
    meta: { requiresAuth: true, permission: 'view_clients' }
  },
  {
    path: '/clients/:id/edit',
    name: 'EditClient',
    component: () => import('@/views/Clients/EditClient.vue'),
    meta: { requiresAuth: true, permission: 'edit_client' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/views/Reports/ReportsIndex.vue'),
    meta: {
      requiresAuth: true,
      title: 'التقارير'
    }
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
    path: '/admin/assign-permissions',
    name: 'AssignPermissions',
    component: () => import('@/views/Admin/AssignPermissions.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/activitylog',
    name: 'activitylog',
    component: () => import('@/views/ActivityLog.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Auth/NotFound.vue')
  },
  {
    path: '/admin/otp',
    name: 'OTP',
    component: () => import('@/views/Admin/OTP.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation Guard - محسن ومبسط
router.beforeEach(async (to, from, next) => {
  console.log(`🛡️ Navigation Guard: ${from.path} -> ${to.path}`)

  // الحصول على التوكن
  const token = localStorage.getItem('token')

  // إذا كانت الصفحة تتطلب مصادقة
  if (to.meta.requiresAuth) {
    if (!token) {
      console.log('🚫 لا يوجد توكن، توجيه إلى /login')
      return next('/login')
    }

    try {
      // التحقق من صحة التوكن وجلب بيانات المستخدم
      const isAuthenticated = await store.dispatch('auth/checkAuth')

      if (!isAuthenticated) {
        console.log('❌ التوكن غير صالح، توجيه إلى /login')
        store.commit('auth/CLEAR_AUTH')
        localStorage.removeItem('token')
        return next('/login')
      }

      // التحقق من الصلاحيات إذا كانت مطلوبة
      if (to.meta.permission) {
        const hasPermission = store.getters['auth/hasPermission'](to.meta.permission)
        if (!hasPermission) {
          console.log(`⛔ لا تملك صلاحية ${to.meta.permission}، توجيه إلى /dashboard`)
          return next('/dashboard')
        }
      }

      // التحقق من صلاحية المدير إذا كانت مطلوبة
      if (to.meta.requiresAdmin && !store.getters['auth/is_admin']) {
        console.log('⛔ ليس لديك صلاحية مدير، توجيه إلى /dashboard')
        return next('/dashboard')
      }

      console.log('✅ التحقق من المصادقة والصلاحيات ناجح')
      next()

    } catch (error) {
      console.error('💥 خطأ في التحقق من المصادقة:', error)
      store.commit('auth/CLEAR_AUTH')
      localStorage.removeItem('token')
      return next('/login')
    }
  }
  // إذا كانت الصفحة للضيوف فقط
  else if (to.meta.requiresGuest) {
    if (token) {
      console.log('🔄 المستخدم مصادق بالفعل، توجيه إلى /dashboard')
      return next('/dashboard')
    }
    console.log('👋 صفحة ضيف، السماح بالدخول')
    next()
  }
  // المسارات العامة
  else {
    console.log('🛣️ صفحة عامة، السماح بالدخول')
    next()
  }
})

export default router
