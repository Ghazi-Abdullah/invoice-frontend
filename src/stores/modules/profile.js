// src/stores/modules/profile.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: () => ({
    user: null,
    permissions: [],
    loading: false,
    error: null
  }),

  getters: {
    user: state => state.user,
    permissions: state => state.permissions,
    loading: state => state.loading,
    error: state => state.error,

    initials: state => {
      if (!state.user?.name) return 'U'
      return state.user.name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_PROFILE(state, { user, permissions }) {
      state.user = user
      state.permissions = permissions || []
    },
    UPDATE_USER(state, userData) {
      state.user = { ...state.user, ...userData }
    }
  },

  actions: {
    // جلب الملف الشخصي
    async fetchProfile({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get('/admin/users/profile/me')

        if (response.data?.status) {
          const data = response.data.data
          commit('SET_PROFILE', {
            user: data.user || data,
            permissions: data.permissions || []
          })
        } else {
          throw new Error(response.data?.message || i18n.t('profile.fetch_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.t('profile.fetch_failed')
        commit('SET_ERROR', message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحديث الملف الشخصي
    async updateProfile({ commit }, payload) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('email', payload.email)
        formData.append('phone', payload.phone || '')
        formData.append('company_name', payload.company_name || '')
        formData.append('_method', 'PUT')

        if (payload.imgFile) {
          formData.append('img', payload.imgFile)
        }

        const response = await axios.post('/admin/users/profile/update', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (response.data?.status) {
          commit('UPDATE_USER', response.data.data)
          return true
        } else {
          throw new Error(response.data?.message || i18n.t('profile.update_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.t('profile.update_failed')
        commit('SET_ERROR', message)
        return false
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تغيير كلمة المرور
    async changePassword({ commit }, passwords) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.put('/admin/users/profile/change-password', passwords)

        if (response.data?.status) {
          return true
        } else {
          throw new Error(response.data?.message || i18n.t('profile.password_change_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.t('profile.password_change_failed')
        commit('SET_ERROR', message)
        return false
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // مسح الخطأ
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
