import axios from '../../api/axios'

export default {
  namespaced: true,
  state: {
    users: [],
    user: null,
    groups: [],
    isLoading: false
  },
  getters: {
    users: (state) => state.users,
    user: (state) => state.user,
    groups: (state) => state.groups,
    isLoading: (state) => state.isLoading
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_GROUPS(state, groups) {
      state.groups = groups
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    }
  },
  actions: {
    async getUsers({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/api/admin/users')
        console.log('Users response:', response.data)
        if (response.data.status) {
          commit('SET_USERS', response.data.data)
        }
        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        console.error('Error fetching users:', error)
        throw error
      }
    },

    async getUser({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`/api/admin/users/${id}`)
        if (response.data.status) {
          commit('SET_USER', response.data.data)
        }
        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        console.error('Error fetching user:', error)
        throw error
      }
    },

    async createUser({ dispatch }, data) {
      try {
        const response = await axios.post('/api/admin/users', data)
        await dispatch('getUsers')
        return response.data
      } catch (error) {
        console.error('Error creating user:', error)
        throw error
      }
    },

    async updateUser({ dispatch }, { id, data }) {
      try {
        const response = await axios.put(`/api/admin/users/${id}`, data)
        await dispatch('getUsers')
        return response.data
      } catch (error) {
        console.error('Error updating user:', error)
        throw error
      }
    },

    async deleteUser({ dispatch }, id) {
      try {
        const response = await axios.delete(`/api/admin/users/${id}`)
        await dispatch('getUsers')
        return response.data
      } catch (error) {
        console.error('Error deleting user:', error)
        throw error
      }
    },

    async getUserGroups({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/api/admin/users/groups/list')
        console.log('Groups response:', response.data)
        if (response.data.status) {
          commit('SET_GROUPS', response.data.data)
        }
        commit('SET_LOADING', false)
        return response.data
      } catch (error) {
        commit('SET_LOADING', false)
        console.error('Error fetching groups:', error)
        throw error
      }
    }
  }
}
