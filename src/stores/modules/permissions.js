import axios from '../../api/axios'

export default {
  namespaced: true,

  state: {
    permissions: [],
    permissionsList: [],
    menus: [],
    isLoading: false,
    error: null
  },

  getters: {
    permissions: (state) => state.permissions,
    permissionsList: (state) => state.permissionsList,
    menus: (state) => state.menus,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error
  },

  mutations: {
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions
    },
    SET_PERMISSIONS_LIST(state, permissions) {
      state.permissionsList = permissions
    },
    SET_MENUS(state, menus) {
      state.menus = menus
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
    async getPermissions({ commit }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/permissions', { params })

        if (response.data.status) {
          // التعامل مع البيانات المجمعة وغير المجمعة
          const permissions = response.data.data?.data || response.data.data || []
          commit('SET_PERMISSIONS', permissions)
          return permissions
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

    async getAllPermissions({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/permissions/all')

        if (response.data.status) {
          const permissions = response.data.data || []
          commit('SET_PERMISSIONS_LIST', permissions)
          return permissions
        } else {
          throw new Error(response.data.message || 'Failed to fetch all permissions')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getMenus({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/permissions/menus')

        if (response.data.status) {
          const menus = response.data.data || []
          commit('SET_MENUS', menus)
          return menus
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
        const response = await axios.post('/admin/permissions', permissionData)

        if (response.data.status) {
          await dispatch('getAllPermissions')
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
        const response = await axios.put(`/admin/permissions/${id}`, data)

        if (response.data.status) {
          await dispatch('getAllPermissions')
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
        const response = await axios.delete(`/admin/permissions/${id}`)

        if (response.data.status) {
          await dispatch('getAllPermissions')
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
