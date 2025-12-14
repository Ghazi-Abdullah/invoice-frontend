import axios from '@/api/axios'

const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },

  SET_TOKEN(state, token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  },

  SET_AUTHENTICATED(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  },

  SET_LOADING(state, loading) {
    state.loading = loading
  },

  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }
}

const actions = {
  async login({ commit }, credentials) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.post('/api/login', credentials)
      const { token, user } = response.data

      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      commit('SET_AUTHENTICATED', true)

      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل تسجيل الدخول'
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.post('/api/register', userData)
      const { token, user } = response.data

      commit('SET_TOKEN', token)
      commit('SET_USER', user)
      commit('SET_AUTHENTICATED', true)

      return { success: true, user }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل التسجيل'
      return {
        success: false,
        error: errorMessage
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async logout({ commit }) {
    try {
      await axios.post('/api/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      commit('LOGOUT')
    }
  },

  async fetchUser({ commit, state }) {
    if (!state.token) {
      commit('LOGOUT')
      return
    }

    commit('SET_LOADING', true)
    try {
      // تحديث header axios بالتوكن قبل الطلب
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`

      const response = await axios.get('/api/user')
      commit('SET_USER', response.data)
      commit('SET_AUTHENTICATED', true)
    } catch (error) {
      console.error('Fetch user error:', error)

      // إذا كان الخطأ 401 (غير مصرح)، نقوم بتسجيل الخروج
      if (error.response?.status === 401) {
        commit('LOGOUT')
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // تحديث بيانات المستخدم
  async updateUser({ commit }, userData) {
    try {
      const response = await axios.put('/api/user', userData)
      commit('SET_USER', response.data)
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'فشل تحديث البيانات'
      return { success: false, error: errorMessage }
    }
  }
}

const getters = {
  user: state => state.user,
  token: state => state.token,
  isAuthenticated: state => state.isAuthenticated,
  loading: state => state.loading,
  isAdmin: state => {
    if (!state.user) return false
    return state.user.roles?.some(role => role.name === 'admin') || false
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
