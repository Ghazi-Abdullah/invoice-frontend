// src/stores/modules/auth.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

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
    isAdmin: state => state.is_admin || state.user?.is_admin === true || state.user?.is_admin === 1,
    isLoading: state => state.isLoading,
    loginError: state => state.loginError,
    isAuthenticated: state => !!state.token,

    hasPermission: state => permission => {
      if (state.is_admin || state.user?.is_admin === true || state.user?.is_admin === 1) {
        return true
      }
      return Array.isArray(state.permissions) && state.permissions.includes(permission)
    }
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user
      if (user && (user.is_admin === true || user.is_admin === 1 || user.role === 'admin')) {
        state.is_admin = true
      }
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = Array.isArray(permissions) ? permissions : []
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_IS_ADMIN(state, isAdmin) {
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
    // تسجيل الدخول// تسجيل الدخول
    async login({ commit, dispatch }, credentials) {
      commit('SET_LOADING', true)
      commit('SET_LOGIN_ERROR', null)
      NProgress.start()

      try {
        const response = await axios.post('/admin/login', credentials)

        if (response.data.status && response.data.data) {
          // ✅ الدخول لم يعد يُصدر توكن مباشرة — الباك يرسل OTP
          // وينتظر خطوة verifyOtp لإتمام تسجيل الدخول فعلياً
          if (response.data.data.requires_otp) {
            commit('SET_LOGIN_ERROR', null)
            return {
              success: true,
              requiresOtp: true,
              email: response.data.data.email,
              message: response.data.message,
            }
          }

          // مسار احتياطي فقط (غير متوقع الوصول له بعد تفعيل OTP الإلزامي)
          const { user, token, permissions, is_admin } = response.data.data
          if (token) {
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            commit('SET_USER', user)
            commit('SET_TOKEN', token)
            commit('SET_PERMISSIONS', permissions || [])
            commit('SET_IS_ADMIN', is_admin || false)
            await dispatch('loadMenus')
          }
          return { success: true, data: response.data.data }
        } else {
          const message = response.data.message || i18n.global.t('auth.login_failed')
          commit('SET_LOGIN_ERROR', message)
          return { success: false, message }
        }
      } catch (error) {
        let message = i18n.global.t('auth.login_error')
        if (error.response) {
          if (error.response.status === 401) {
            message = i18n.global.t('auth.invalid_credentials')
          } else if (error.response.data?.message) {
            message = error.response.data.message
          }
        }
        commit('SET_LOGIN_ERROR', message)
        return { success: false, message }
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تسجيل الخروج
    async logout({ commit }) {
      commit('SET_LOADING', true)
      NProgress.start()

      try {
        await axios.post('/admin/logout')
      } catch {
        // تجاهل أخطاء الخروج
      } finally {
        commit('CLEAR_AUTH')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        NProgress.done()
        commit('SET_LOADING', false)
        // التعديل هنا:
        window.location.href = '/login'
      }

      return { success: true, message: i18n.global.t('auth.logout_success') }
    },


    // إرسال/إعادة إرسال رمز التحقق (OTP) — لا يحتاج نتيجة user_id بعد الآن
    async sendOtp({ commit }, email) {
      commit('SET_LOADING', true)
      commit('SET_LOGIN_ERROR', null)
      NProgress.start()

      try {
        const response = await axios.post('/admin/send-otp', { email })

        if (response.data.status) {
          // ✅ الباك لا يرجّع أي بيانات (data: null دائماً) لمنع كشف
          // وجود الحساب من عدمه — نستخدم البريد نفسه لاحقاً بـ verifyOtp
          return { success: true, email }
        } else {
          const message = response.data.message || i18n.global.t('auth.otp_send_failed')
          commit('SET_LOGIN_ERROR', message)
          return { success: false, message }
        }
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('auth.otp_send_error')
        commit('SET_LOGIN_ERROR', message)
        return { success: false, message }
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // التحقق من رمز OTP — بالبريد الإلكتروني بدل user_id
    async verifyOtp({ commit, dispatch }, { email, otp }) {
      commit('SET_LOADING', true)
      commit('SET_LOGIN_ERROR', null)
      NProgress.start()

      try {
        const response = await axios.post('/admin/verify-otp', { email, otp })

        if (response.data.status && response.data.data) {
          const { user, token, permissions, is_admin } = response.data.data

          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          commit('SET_USER', user)
          commit('SET_TOKEN', token)
          commit('SET_PERMISSIONS', permissions || [])
          commit('SET_IS_ADMIN', is_admin || false)
          commit('SET_LOGIN_ERROR', null)

          await dispatch('loadMenus')
          return { success: true }
        } else {
          const message = response.data.message || i18n.global.t('auth.invalid_otp')
          commit('SET_LOGIN_ERROR', message)
          return { success: false, message }
        }
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('auth.otp_verify_error')
        commit('SET_LOGIN_ERROR', message)
        return { success: false, message }
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // التحقق من حالة المصادقة
    async checkAuth({ commit, state }) {
      if (!state.token) return false

      commit('SET_LOADING', true)
      NProgress.start()

      try {
        const response = await axios.get('/admin/me')

        if (response.data.status && response.data.data) {
          const { user, permissions, is_admin } = response.data.data
          commit('SET_USER', user)
          commit('SET_PERMISSIONS', permissions || [])
          commit('SET_IS_ADMIN', is_admin || false)
          localStorage.setItem('user', JSON.stringify(user))
          return true
        } else {
          commit('CLEAR_AUTH')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete axios.defaults.headers.common['Authorization']
          return false
        }
      } catch {
        commit('CLEAR_AUTH')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        return false
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحميل القوائم الجانبية
    async loadMenus({ commit, rootState }) {
      const baseMenus = [
        {
          id: 1,
          title: i18n.global.t('nav.dashboard'),
          icon: 'home',
          route: '/dashboard',
          permission: 'view_dashboard'
        },
        {
          id: 2,
          title: i18n.global.t('nav.clients'),
          icon: 'users',
          route: '/clients',
          permission: 'view_clients',
          children: [
            { id: 21, title: i18n.global.t('nav.all_clients'), route: '/clients', permission: 'view_clients' },
            { id: 22, title: i18n.global.t('nav.add_client'), route: '/clients/create', permission: 'create_client' }
          ]
        },
        {
          id: 3,
          title: i18n.global.t('nav.invoices'),
          icon: 'file-invoice',
          route: '/invoices',
          permission: 'view_invoices',
          children: [
            { id: 31, title: i18n.global.t('nav.all_invoices'), route: '/invoices', permission: 'view_invoices' },
            { id: 32, title: i18n.global.t('nav.create_invoice'), route: '/invoices/create', permission: 'create_invoice' }
          ]
        },
        {
          id: 4,
          title: i18n.global.t('nav.reports'),
          icon: 'chart-bar',
          route: '/reports',
          permission: 'view_reports'
        }
      ]

      const isAdmin = rootState.auth.is_admin ||
        (Array.isArray(rootState.auth.permissions) && rootState.auth.permissions.includes('view_admin_groups'))

      if (isAdmin) {
        baseMenus.push({
          id: 5,
          title: i18n.global.t('nav.admin'),
          icon: 'cog',
          route: '/admin',
          permission: 'view_admin_groups',
          children: [
            { id: 51, title: i18n.global.t('nav.users'), route: '/admin/users', permission: 'view_users' },
            { id: 52, title: i18n.global.t('nav.groups'), route: '/admin/groups', permission: 'view_admin_groups' },
            { id: 53, title: i18n.global.t('nav.permissions'), route: '/admin/permissions', permission: 'manage_permissions' }
          ]
        })
      }

      commit('SET_MENUS', baseMenus)
    },

    clearError({ commit }) {
      commit('SET_LOGIN_ERROR', null)
    }
  }
}
