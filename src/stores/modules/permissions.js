// src/stores/modules/permissions.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: () => ({
    permissions: [],
    menus: [],
    parentPermissions: [],
    currentPermission: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      status: 'all',
      menu_id: '',
      parent_id: '',
      page: 1,
      per_page: 10
    },
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    },
    form: {
      id: null,
      title: '',
      description_en: '',
      description_ar: '',
      admin_menu_id: '',
      admin_sub_menu_id: '',
      parent_id: '',
      is_parent: false,
      is_active: true
    }
  }),

  getters: {
    permissions: state => state.permissions || [],
    menus: state => state.menus,
    parentPermissions: state => state.parentPermissions,
    currentPermission: state => state.currentPermission,
    isLoading: state => state.loading,
    error: state => state.error,
    filters: state => state.filters,
    pagination: state => state.pagination,
    form: state => state.form,

    permissionById: state => id => {
      return state.permissions.find(p => Number(p.id) === Number(id)) || null
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
    SET_PERMISSIONS(state, payload) {
      if (payload?.data) {
        if (payload.data.data) {
          state.permissions = payload.data.data
          state.pagination = {
            current_page: payload.data.current_page || 1,
            last_page: payload.data.last_page || 1,
            per_page: payload.data.per_page || 10,
            total: payload.data.total || 0,
            from: payload.data.from || 0,
            to: payload.data.to || 0
          }
        } else {
          state.permissions = payload.data
          state.pagination = {}
        }
      } else {
        state.permissions = []
        state.pagination = {}
      }
    },
    SET_MENUS(state, payload) {
      state.menus = payload?.data ? (Array.isArray(payload.data) ? payload.data : payload.data.data || []) : []
    },
    SET_PARENT_PERMISSIONS(state, payload) {
      state.parentPermissions = payload?.data ? (Array.isArray(payload.data) ? payload.data : payload.data.data || []) : []
    },
    SET_CURRENT_PERMISSION(state, permission) {
      state.currentPermission = permission
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    RESET_FILTERS(state) {
      state.filters = {
        search: '',
        status: 'all',
        menu_id: '',
        parent_id: '',
        page: 1,
        per_page: 10
      }
    },
    ADD_PERMISSION(state, permission) {
      state.permissions.unshift(permission)
    },
    UPDATE_PERMISSION(state, updatedPermission) {
      const index = state.permissions.findIndex(p => p.id === updatedPermission.id)
      if (index !== -1) {
        state.permissions.splice(index, 1, updatedPermission)
      }
    },
    DELETE_PERMISSION(state, id) {
      state.permissions = state.permissions.filter(p => p.id !== id)
    },
    SET_FORM_DATA(state, formData) {
      state.form = { ...state.form, ...formData }
    },
    RESET_FORM(state) {
      state.form = {
        id: null,
        title: '',
        description_en: '',
        description_ar: '',
        admin_menu_id: '',
        admin_sub_menu_id: '',
        parent_id: '',
        is_parent: false,
        is_active: true
      }
    },
    LOAD_FORM_FROM_PERMISSION(state, permission) {
      state.form = {
        id: permission.id,
        title: permission.title,
        description_en: permission.description_en || '',
        description_ar: permission.description_ar || '',
        admin_menu_id: permission.admin_menu_id || '',
        admin_sub_menu_id: permission.admin_sub_menu_id || '',
        parent_id: permission.parent_id || '',
        is_parent: permission.is_parent || false,
        is_active: permission.is_active !== undefined ? permission.is_active : true
      }
    }
  },

  actions: {
    async fetchPermissions({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const query = {
          page: params.page || state.filters.page,
          per_page: params.per_page || state.filters.per_page,
          search: params.search || state.filters.search,
          status: state.filters.status !== 'all' ? state.filters.status : '',
          menu_id: state.filters.menu_id,
          parent_id: state.filters.parent_id,
          ...params
        }

        const response = await axios.get('/admin/permissions', { params: query })
        commit('SET_PERMISSIONS', response.data)
        return response.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.fetch_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async fetchPermission({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get(`/admin/permissions/${id}`)
        const permission = response.data.data || response.data
        commit('SET_CURRENT_PERMISSION', permission)
        return permission
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.fetch_one_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async createPermission({ commit }, permissionData) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.post('/admin/permissions', permissionData)
        const permission = response.data.data || response.data
        commit('ADD_PERMISSION', permission)
        return permission
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.create_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async updatePermission({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.put(`/admin/permissions/${id}`, data)
        const permission = response.data.data || response.data
        commit('UPDATE_PERMISSION', permission)
        return permission
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.update_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async deletePermission({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        await axios.delete(`/admin/permissions/${id}`)
        commit('DELETE_PERMISSION', id)
        return true
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.delete_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async fetchMenus({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get('/admin/permissions/menus')
        commit('SET_MENUS', response.data)
        return response.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.menus_fetch_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async fetchParentPermissions({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get('/admin/permissions/parent-permissions')
        commit('SET_PARENT_PERMISSIONS', response.data)
        return response.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.parent_fetch_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    resetFilters({ commit }) {
      commit('RESET_FILTERS')
    },

    updateFormData({ commit }, formData) {
      commit('SET_FORM_DATA', formData)
    },

    resetForm({ commit }) {
      commit('RESET_FORM')
    },

    loadPermissionIntoForm({ commit }, permission) {
      commit('LOAD_FORM_FROM_PERMISSION', permission)
    },

    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
