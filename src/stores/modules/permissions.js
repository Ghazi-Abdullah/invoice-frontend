import axios from '../../api/axios'

export default {
  namespaced: true, // إضافة namespaced

  state: {
    permissions: [],
    menusWithPermissions: [],
    isLoading: false,
    error: null
  },

  getters: {
    permissions: (state) => state.permissions,
    menusWithPermissions: (state) => state.menusWithPermissions,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error
  },

  mutations: {
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions
    },
    SET_MENUS_WITH_PERMISSIONS(state, menus) {
      state.menusWithPermissions = menus
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
    async getPermissions({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/api/admin/permissions')

        if (response.data.status) {
          commit('SET_PERMISSIONS', response.data.data)
          return response.data.data
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

    async getMenusWithPermissions({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/api/admin/permissions/menus')

        if (response.data.status) {
          commit('SET_MENUS_WITH_PERMISSIONS', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to fetch menus')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createPermission({ dispatch }, permissionData) {
      try {
        const response = await axios.post('/api/admin/permissions', permissionData)

        if (response.data.status) {
          await dispatch('getPermissions')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to create permission')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    },

    async updatePermission({ dispatch }, { id, data }) {
      try {
        const response = await axios.put(`/api/admin/permissions/${id}`, data)

        if (response.data.status) {
          await dispatch('getPermissions')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update permission')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    },

    async deletePermission({ dispatch }, id) {
      try {
        const response = await axios.delete(`/api/admin/permissions/${id}`)

        if (response.data.status) {
          await dispatch('getPermissions')
          return true
        } else {
          throw new Error(response.data.message || 'Failed to delete permission')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    }
  }
}
