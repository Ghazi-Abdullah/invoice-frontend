import axios from '@/api/axios'

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
    SET_PROFILE(state, { user, permissions }) {
      state.user = user
      state.permissions = permissions || []
    },
    UPDATE_USER(state, userData) {
      state.user = { ...state.user, ...userData }
    }
  },

  actions: {
    async fetchProfile({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await axios.get('/admin/users/profile/me')
        if (response.data?.status === true) {
          const data = response.data.data
          commit('SET_PROFILE', {
            user: data.user || data,
            permissions: data.permissions || []
          })
        } else {
          throw new Error(response.data?.message || 'فشل تحميل الملف الشخصي')
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message
        commit('SET_ERROR', errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * تحديث الملف الشخصي
     * @param {Object} payload - يحتوي على الحقول: name, email, phone, company_name, imgFile (اختياري)
     */
    async updateProfile({ commit }, payload) {
      commit('SET_LOADING', true)
      try {
        const formData = new FormData()
        formData.append('name', payload.name)
        formData.append('email', payload.email)
        formData.append('phone', payload.phone || '')
        formData.append('company_name', payload.company_name || '')

        if (payload.imgFile) {
          formData.append('img', payload.imgFile)
        }

        // إضافة _method لتقليد PUT
        formData.append('_method', 'PUT')

        const response = await axios.post('/admin/users/profile/update', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })

        if (response.data?.status) {
          commit('UPDATE_USER', response.data.data)
          return true
        }
        return false
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'فشل تحديث الملف الشخصي'
        commit('SET_ERROR', errorMessage)
        return false
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async changePassword({ commit }, passwords) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.put('/admin/users/profile/change-password', passwords)
        if (response.data?.status) {
          return true
        }
        return false
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'فشل تغيير كلمة المرور'
        commit('SET_ERROR', errorMessage)
        return false
      } finally {
        commit('SET_LOADING', false)
      }
    }
  }
}
