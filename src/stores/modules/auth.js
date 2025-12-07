

import api from '@/api/axios'

const state = {
  user: null,
  token: null,
  permissions: []
}

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
  hasPermission: (state) => (permission) => state.permissions.includes(permission)
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    state.permissions = []
  }
}

const actions = {
  async login({ commit }, credentials) {
    const response = await api.post('/login', credentials)
    const { user, token } = response.data.data

    localStorage.setItem('userInfo', JSON.stringify({ user, token }))

    commit('SET_USER', user)
    commit('SET_TOKEN', token)

    return response
  },

  async register({ commit }, userData) {
    const response = await api.post('/register', userData)
    const { user, token } = response.data.data

    localStorage.setItem('userInfo', JSON.stringify({ user, token }))

    commit('SET_USER', user)
    commit('SET_TOKEN', token)

    return response
  },

  logout({ commit }) {
    commit('CLEAR_AUTH')
    localStorage.removeItem('userInfo')
  },

  initialize({ commit }) {
    const userInfo = localStorage.getItem('userInfo')

    if (userInfo) {
      const parsed = JSON.parse(userInfo)
      commit('SET_USER', parsed.user)
      commit('SET_TOKEN', parsed.token)
    } else {
      commit('CLEAR_AUTH')
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
