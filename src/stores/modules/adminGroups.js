import axios from '../../api/axios'

export default {
  namespaced: true, // إضافة namespaced

  state: {
    adminGroups: [],
    adminGroup: null,
    availablePermissions: [],
    isLoading: false,
    error: null
  },

  getters: {
    adminGroups: (state) => state.adminGroups,
    adminGroup: (state) => state.adminGroup,
    availablePermissions: (state) => state.availablePermissions,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error
  },

  mutations: {
    SET_ADMIN_GROUPS(state, groups) {
      state.adminGroups = groups
    },
    SET_ADMIN_GROUP(state, group) {
      state.adminGroup = group
    },
    SET_AVAILABLE_PERMISSIONS(state, permissions) {
      state.availablePermissions = permissions
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    async getAdminGroups({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/api/admin/groups')

        if (response.data.status) {
          commit('SET_ADMIN_GROUPS', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to fetch groups')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getAdminGroup({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get(`/api/admin/groups/${id}`)

        if (response.data.status) {
          commit('SET_ADMIN_GROUP', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to fetch group')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getAvailablePermissions({ commit }, groupId) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get(`/api/admin/groups/${groupId}/available-permissions`)

        if (response.data.status) {
          return response.data // إرجاع البيانات كاملة
        } else {
          throw new Error(response.data.message || 'Failed to fetch permissions')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateGroupPermissions({ dispatch }, { id, permissions }) {
      try {
        const response = await axios.post(`/api/admin/groups/${id}/permissions`, { permissions })

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update permissions')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    },

    async createAdminGroup({ dispatch }, data) {
      try {
        const response = await axios.post('/api/admin/groups', data)

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to create group')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    },

    async updateAdminGroup({ dispatch }, { id, data }) {
      try {
        const response = await axios.put(`/api/admin/groups/${id}`, data)

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update group')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    },

    async deleteAdminGroup({ dispatch }, id) {
      try {
        const response = await axios.delete(`/api/admin/groups/${id}`)

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return true
        } else {
          throw new Error(response.data.message || 'Failed to delete group')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    },
  }
}
