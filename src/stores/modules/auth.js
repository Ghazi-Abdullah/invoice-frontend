import axios from '../../api/axios'

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    permissions: [],
    menus: [],
    is_admin: false,
    isLoading: false
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    permissions: state => state.permissions,
    menus: state => state.menus,
    is_admin: state => state.is_admin,
    isLoading: state => state.isLoading,
    isAuthenticated: state => !!state.token,
    hasPermission: state => permission => {
      // إذا كان المستخدم مديراً، لديه جميع الصلاحيات
      if (state.is_admin) return true
      return state.permissions.includes(permission)
    }
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_IS_ADMIN(state, isAdmin) {
      state.is_admin = isAdmin
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.permissions = []
      state.menus = []
      state.is_admin = false
    }
  },
  actions: {
    async login({ commit, dispatch }, credentials) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.post('/api/login', credentials)

        if (response.data.status) {
          const { user, token, permissions, is_admin } = response.data.data

          commit('SET_USER', user)
          commit('SET_TOKEN', token)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_IS_ADMIN', is_admin || false)

          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }

        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        throw error.response?.data || error
      }
    },

    async logout({ commit }) {
      commit('SET_LOADING', true)
      try {
        await axios.post('/api/logout')
        commit('CLEAR_AUTH')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        commit('SET_LOADING', false)
        return { status: true, message: 'Logged out successfully' }
      } catch (error) {
        commit('SET_LOADING', false)
        throw error
      }
    },

    async checkAuth({ commit, state }) {
      if (!state.token) {
        return false
      }

      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/api/me')

        if (response.data.status) {
          const { user, permissions, is_admin } = response.data.data

          commit('SET_USER', user)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_IS_ADMIN', is_admin || false)

          if (!axios.defaults.headers.common['Authorization']) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
          }

          return true
        }

        commit('SET_LOADING', false)
        return false
      } catch (error) {
        console.error('Auth check error:', error)
        commit('CLEAR_AUTH')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        commit('SET_LOADING', false)
        return false
      }
    },

    async register({ commit }, userData) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.post('/api/register', userData)

        if (response.data.status) {
          const { user, token, permissions, is_admin } = response.data.data

          commit('SET_USER', user)
          commit('SET_TOKEN', token)
          commit('SET_PERMISSIONS', permissions)
          commit('SET_IS_ADMIN', is_admin || false)

          localStorage.setItem('token', token)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }

        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        throw error.response?.data || error
      }
    }
  }
}
