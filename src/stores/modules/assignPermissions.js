// src/stores/modules/permissions.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: {
    permissions: [],
    allPermissions: [],
    menus: [],
    loading: false,
    error: null,
    modal: {
      show: false,
      editing: false,
      submitting: false
    },
    form: {
      title: '',
      description_ar: '',
      description_en: '',
      is_parent: false
    },
    searchQuery: ''
  },

  getters: {
    permissions: state => state.permissions,
    allPermissions: state => state.allPermissions,
    menus: state => state.menus,
    loading: state => state.loading,
    error: state => state.error,
    modal: state => state.modal,
    form: state => state.form,
    searchQuery: state => state.searchQuery,

    filteredPermissions: state => {
      if (!state.searchQuery.trim()) return state.permissions

      const search = state.searchQuery.toLowerCase()
      return state.permissions.filter(
        permission =>
          (permission.title && permission.title.toLowerCase().includes(search)) ||
          (permission.description_ar && permission.description_ar.toLowerCase().includes(search)) ||
          (permission.description_en && permission.description_en.toLowerCase().includes(search))
      )
    }
  },

  mutations: {
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions
    },
    SET_ALL_PERMISSIONS(state, permissions) {
      state.allPermissions = permissions
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_MODAL(state, modalData) {
      state.modal = { ...state.modal, ...modalData }
    },
    SET_FORM(state, formData) {
      state.form = { ...state.form, ...formData }
    },
    CLEAR_FORM(state) {
      state.form = {
        title: '',
        description_ar: '',
        description_en: '',
        is_parent: false
      }
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },
    ADD_PERMISSION(state, permission) {
      state.permissions.unshift(permission)
      state.allPermissions.unshift(permission)
    },
    UPDATE_PERMISSION(state, permission) {
      const index = state.permissions.findIndex(p => p.id === permission.id)
      if (index !== -1) state.permissions.splice(index, 1, permission)

      const allIndex = state.allPermissions.findIndex(p => p.id === permission.id)
      if (allIndex !== -1) state.allPermissions.splice(allIndex, 1, permission)
    },
    DELETE_PERMISSION(state, id) {
      state.permissions = state.permissions.filter(p => p.id !== id)
      state.allPermissions = state.allPermissions.filter(p => p.id !== id)
    }
  },

  actions: {
    async fetchPermissions({ commit }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get('/admin/permissions', { params })
        const permissions = response.data.data?.data || response.data.data || []
        commit('SET_PERMISSIONS', permissions)
        return permissions
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.fetch_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async fetchAllPermissions({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get('/admin/permissions/all')
        const permissions = response.data.data || []
        commit('SET_ALL_PERMISSIONS', permissions)
        return permissions
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.fetch_all_failed')
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
        const menus = response.data.data || []
        commit('SET_MENUS', menus)
        return menus
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.menus_fetch_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async createPermission({ commit }, permissionData) {
      commit('SET_MODAL', { submitting: true })
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.post('/admin/permissions', permissionData)
        commit('ADD_PERMISSION', response.data.data)
        commit('SET_MODAL', { show: false, editing: false })
        commit('CLEAR_FORM')
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.create_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_MODAL', { submitting: false })
      }
    },

    async updatePermission({ commit }, { id, data }) {
      commit('SET_MODAL', { submitting: true })
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.put(`/admin/permissions/${id}`, data)
        commit('UPDATE_PERMISSION', response.data.data)
        commit('SET_MODAL', { show: false, editing: false })
        commit('CLEAR_FORM')
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('permissions.update_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_MODAL', { submitting: false })
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

    // UI actions (لا تحتاج إلى NProgress أو ترجمة)
    openCreateModal({ commit }) {
      commit('CLEAR_FORM')
      commit('CLEAR_ERROR')
      commit('SET_MODAL', { show: true, editing: false })
    },

    openEditModal({ commit }, permission) {
      commit('SET_FORM', {
        title: permission.title,
        description_ar: permission.description_ar,
        description_en: permission.description_en,
        is_parent: permission.is_parent || false
      })
      commit('CLEAR_ERROR')
      commit('SET_MODAL', { show: true, editing: true })
    },

    closeModal({ commit }) {
      commit('SET_MODAL', { show: false, editing: false })
      commit('CLEAR_FORM')
      commit('CLEAR_ERROR')
    },

    setSearchQuery({ commit }, query) {
      commit('SET_SEARCH_QUERY', query)
    }
  }
}
