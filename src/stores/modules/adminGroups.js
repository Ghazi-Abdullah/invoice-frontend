// src/stores/modules/adminGroups.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: {
    adminGroups: [],
    adminGroup: null,
    availablePermissions: [],
    isLoading: false,
    error: null
  },

  getters: {
    adminGroups: state => state.adminGroups,
    adminGroup: state => state.adminGroup,
    availablePermissions: state => state.availablePermissions,
    isLoading: state => state.isLoading,
    error: state => state.error
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
      NProgress.start()

      try {
        const response = await axios.get('/admin/groups')
        const groups = response.data.data?.data || response.data.data || []
        commit('SET_ADMIN_GROUPS', groups)
        return groups
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('adminGroups.fetch_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async getAdminGroup({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get(`/admin/groups/${id}`)
        commit('SET_ADMIN_GROUP', response.data.data)
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('adminGroups.fetch_group_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async getAvailablePermissions({ commit }, groupId) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get(`/admin/groups/${groupId}/available-permissions`)
        const data = response.data.data
        const permissions = data.permissions || []
        const selectedPermissions = data.selected_permissions || []
        commit('SET_AVAILABLE_PERMISSIONS', permissions)
        return { permissions, selectedPermissions }
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('adminGroups.permissions_fetch_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async createAdminGroup({ dispatch }, data) {
      NProgress.start()

      try {
        const groupData = {
          title_en: data.title_en?.trim() || '',
          title_ar: data.title_ar?.trim() || '',
          description: data.description?.trim() || null,
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true
        }

        const response = await axios.post('/admin/groups', groupData)
        await dispatch('getAdminGroups')
        return response.data.data
      } catch (error) {
        let message = i18n.global.t('adminGroups.create_failed')
        if (error.response?.status === 422 && error.response.data.errors) {
          message = Object.values(error.response.data.errors).flat().join(', ')
        } else if (error.response?.data?.message) {
          message = error.response.data.message
        }
        throw new Error(message)
      } finally {
        NProgress.done()
      }
    },

    async updateAdminGroup({ dispatch }, { id, data }) {
      NProgress.start()

      try {
        const groupData = {
          title_en: data.title_en?.trim() || '',
          title_ar: data.title_ar?.trim() || '',
          description: data.description?.trim() || null,
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true
        }

        const response = await axios.put(`/admin/groups/${id}`, groupData)
        await dispatch('getAdminGroups')
        return response.data.data
      } catch (error) {
        let message = i18n.global.t('adminGroups.update_failed')
        if (error.response?.status === 422 && error.response.data.errors) {
          message = Object.values(error.response.data.errors).flat().join(', ')
        } else if (error.response?.data?.message) {
          message = error.response.data.message
        }
        throw new Error(message)
      } finally {
        NProgress.done()
      }
    },

    async updateGroupStatus({ dispatch }, { id, is_active }) {
      return await dispatch('updateAdminGroup', { id, data: { is_active } })
    },

    async updateGroupPermissions({ dispatch }, { id, permissions }) {
      NProgress.start()

      try {
        const response = await axios.put(`/admin/groups/${id}/permissions`, { permissions })
        await dispatch('getAdminGroups')
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('adminGroups.permissions_update_failed')
        throw new Error(message)
      } finally {
        NProgress.done()
      }
    },

    async deleteAdminGroup({ dispatch }, id) {
      NProgress.start()

      try {
        await axios.delete(`/admin/groups/${id}`)
        await dispatch('getAdminGroups')
        return true
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('adminGroups.delete_failed')
        throw new Error(message)
      } finally {
        NProgress.done()
      }
    },

    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
