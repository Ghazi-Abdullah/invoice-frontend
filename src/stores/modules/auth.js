import axios from '../../api/axios'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    permissions: [],
    menus: [],
    is_admin: false,
    isLoading: false,
    loginError: null
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    permissions: state => state.permissions || [],
    menus: state => state.menus,
    is_admin: state => state.is_admin,
    isAdmin: state => {
      console.log('🛡️ isAdmin getter:', {
        state_is_admin: state.is_admin,
        user_is_admin: state.user?.is_admin,
        user: state.user
      })
      return state.is_admin || state.user?.is_admin === true || state.user?.is_admin === 1
    },
    isLoading: state => state.isLoading,
    loginError: state => state.loginError,
    isAuthenticated: state => !!state.token,
    hasPermission: state => permission => {
      console.log(`🔐 التحقق من الصلاحية "${permission}":`, {
        isAdmin: state.is_admin,
        permissions: state.permissions,
        user: state.user
      })

      // Super Admin لديه جميع الصلاحيات
      if (state.is_admin || state.user?.is_admin === true || state.user?.is_admin === 1) {
        console.log(`✅ Super Admin - يملك صلاحية "${permission}" تلقائياً`)
        return true
      }

      // المستخدم العادي يتحقق من قائمة الصلاحيات
      const hasPerm = Array.isArray(state.permissions) && state.permissions.includes(permission)
      console.log(`🔍 النتيجة:`, hasPerm)
      return hasPerm
    }
  },
  mutations: {
    SET_USER(state, user) {
      console.log('👤 تحديث بيانات المستخدم:', user)
      state.user = user

      // تحديث is_admin من بيانات المستخدم
      if (user && (user.is_admin === true || user.is_admin === 1 || user.role === 'admin')) {
        state.is_admin = true
        console.log('👑 تم تعيين is_admin = true من بيانات المستخدم')
      }
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_PERMISSIONS(state, permissions) {
      console.log('📋 تحديث الصلاحيات:', permissions)
      state.permissions = Array.isArray(permissions) ? permissions : []
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_IS_ADMIN(state, isAdmin) {
      console.log('👑 تحديث is_admin إلى:', isAdmin)
      state.is_admin = Boolean(isAdmin)
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_LOGIN_ERROR(state, error) {
      state.loginError = error
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.permissions = []
      state.menus = []
      state.is_admin = false
      state.loginError = null
    }
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_LOGIN_ERROR', null)

      console.log('🔐 محاولة تسجيل الدخول:', credentials)

      try {
        const response = await axios.post('/admin/login', credentials)
        console.log('✅ استجابة تسجيل الدخول:', response.data)

        if (response.data.status && response.data.data) {
          const { user, token, permissions, is_admin } = response.data.data

          // حفظ التوكن في localStorage
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))

          // تحديث axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // تحديث حالة Vuex
          commit('SET_USER', user)
          commit('SET_TOKEN', token)
          commit('SET_PERMISSIONS', permissions || [])
          commit('SET_IS_ADMIN', is_admin || false)
          commit('SET_LOGIN_ERROR', null)

          // تحميل القوائم بعد تسجيل الدخول
          await dispatch('loadMenus')

          commit('SET_LOADING', false)
          return { success: true, data: response.data.data }
        } else {
          const errorMsg = response.data.message || 'فشل تسجيل الدخول'
          commit('SET_LOGIN_ERROR', errorMsg)
          commit('SET_LOADING', false)
          return { success: false, message: errorMsg }
        }
      } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error)

        let errorMessage = 'حدث خطأ أثناء تسجيل الدخول'
        if (error.response) {
          if (error.response.status === 401) {
            errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        commit('SET_LOGIN_ERROR', errorMessage)
        commit('SET_LOADING', false)
        return { success: false, message: errorMessage }
      }
    },

    async logout({ commit }) {
      commit('SET_LOADING', true)
      try {
        await axios.post('/admin/logout')
        commit('CLEAR_AUTH')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        commit('SET_LOADING', false)
        return { success: true, message: 'تم تسجيل الخروج بنجاح' }
      } catch (error) {
        console.error('❌ خطأ في تسجيل الخروج:', error)
        // حتى لو فشل الطلب، نقوم بتنظيف البيانات المحلية
        commit('CLEAR_AUTH')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        commit('SET_LOADING', false)
        return { success: true, message: 'تم تسجيل الخروج محلياً' }
      }
    },

    async checkAuth({ commit, state }) {
      if (!state.token) {
        return false
      }

      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/admin/me')

        if (response.data.status && response.data.data) {
          const { user, permissions, is_admin } = response.data.data

          commit('SET_USER', user)
          commit('SET_PERMISSIONS', permissions || [])
          commit('SET_IS_ADMIN', is_admin || false)

          // تحديث التوكن في localStorage إذا لزم الأمر
          localStorage.setItem('user', JSON.stringify(user))

          commit('SET_LOADING', false)
          return true
        } else {
          commit('CLEAR_AUTH')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete axios.defaults.headers.common['Authorization']
          commit('SET_LOADING', false)
          return false
        }
      } catch (error) {
        console.error('❌ خطأ في التحقق من المصادقة:', error)
        commit('CLEAR_AUTH')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        commit('SET_LOADING', false)
        return false
      }
    },

    async loadMenus({ commit, rootState }) {
      try {
        // تحميل القوائم بناءً على صلاحيات المستخدم
        const menus = [
          {
            id: 1,
            title: 'لوحة التحكم',
            icon: 'home',
            route: '/dashboard',
            permission: 'view_dashboard'
          },
          {
            id: 2,
            title: 'العملاء',
            icon: 'users',
            route: '/clients',
            permission: 'view_clients',
            children: [
              {
                id: 21,
                title: 'جميع العملاء',
                route: '/clients',
                permission: 'view_clients'
              },
              {
                id: 22,
                title: 'إضافة عميل',
                route: '/clients/create',
                permission: 'create_client'
              }
            ]
          },
          {
            id: 3,
            title: 'الفواتير',
            icon: 'file-invoice',
            route: '/invoices',
            permission: 'view_invoices',
            children: [
              {
                id: 31,
                title: 'جميع الفواتير',
                route: '/invoices',
                permission: 'view_invoices'
              },
              {
                id: 32,
                title: 'إنشاء فاتورة',
                route: '/invoices/create',
                permission: 'create_invoice'
              }
            ]
          },
          {
            id: 4,
            title: 'التقارير',
            icon: 'chart-bar',
            route: '/reports',
            permission: 'view_reports'
          }
        ]

        // إضافة قوائم الإدارة للمسؤولين
        if (rootState.auth.is_admin || (Array.isArray(rootState.auth.permissions) && rootState.auth.permissions.includes('view_admin_groups'))) {
          menus.push({
            id: 5,
            title: 'الإدارة',
            icon: 'cog',
            route: '/admin',
            permission: 'view_admin_groups',
            children: [
              {
                id: 51,
                title: 'المستخدمون',
                route: '/admin/users',
                permission: 'view_users'
              },
              {
                id: 52,
                title: 'المجموعات',
                route: '/admin/groups',
                permission: 'view_admin_groups'
              },
              {
                id: 53,
                title: 'الصلاحيات',
                route: '/admin/permissions',
                permission: 'manage_permissions'
              }
            ]
          })
        }

        commit('SET_MENUS', menus)
      } catch (error) {
        console.error('❌ خطأ في تحميل القوائم:', error)
      }
    },

    clearError({ commit }) {
      commit('SET_LOGIN_ERROR', null)
    }
  }
}
