// store/modules/permissions.js
import axios from '@/api/axios'

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
    permissions: (state) => state.permissions,
    allPermissions: (state) => state.allPermissions,
    menus: (state) => state.menus,
    loading: (state) => state.loading,
    error: (state) => state.error,
    modal: (state) => state.modal,
    form: (state) => state.form,
    searchQuery: (state) => state.searchQuery,

    filteredPermissions: (state) => {
      if (!state.searchQuery.trim()) {
        return state.permissions
      }

      const search = state.searchQuery.toLowerCase()
      return state.permissions.filter(
        (permission) =>
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
      if (index !== -1) {
        state.permissions.splice(index, 1, permission)
      }

      const allIndex = state.allPermissions.findIndex(p => p.id === permission.id)
      if (allIndex !== -1) {
        state.allPermissions.splice(allIndex, 1, permission)
      }
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

      try {
        const response = await axios.get('/admin/permissions', { params })

        if (response.data.status) {
          const permissions = response.data.data?.data || response.data.data || []
          commit('SET_PERMISSIONS', permissions)
          return permissions
        } else {
          throw new Error(response.data.message || 'فشل في جلب الصلاحيات')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'فشل في تحميل الصلاحيات'
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchAllPermissions({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/permissions/all')

        if (response.data.status) {
          const permissions = response.data.data || []
          commit('SET_ALL_PERMISSIONS', permissions)
          return permissions
        } else {
          throw new Error(response.data.message || 'فشل في جلب جميع الصلاحيات')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'فشل في تحميل الصلاحيات'
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchMenus({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/permissions/menus')

        if (response.data.status) {
          const menus = response.data.data || []
          commit('SET_MENUS', menus)
          return menus
        } else {
          throw new Error(response.data.message || 'فشل في جلب القوائم')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'فشل في تحميل القوائم'
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createPermission({ commit, dispatch }, permissionData) {
      commit('SET_MODAL', { submitting: true })
      commit('CLEAR_ERROR')

      try {
        const response = await axios.post('/admin/permissions', permissionData)

        if (response.data.status) {
          const permission = response.data.data

          // إضافة الصلاحية الجديدة
          commit('ADD_PERMISSION', permission)

          // إغلاق المودال وتنظيف النموذج
          commit('SET_MODAL', { show: false, editing: false })
          commit('CLEAR_FORM')

          return permission
        } else {
          throw new Error(response.data.message || 'فشل في إنشاء الصلاحية')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'فشل في إنشاء الصلاحية'
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_MODAL', { submitting: false })
      }
    },

    async updatePermission({ commit, dispatch }, { id, data }) {
      commit('SET_MODAL', { submitting: true })
      commit('CLEAR_ERROR')

      try {
        const response = await axios.put(`/admin/permissions/${id}`, data)

        if (response.data.status) {
          const permission = response.data.data

          // تحديث الصلاحية
          commit('UPDATE_PERMISSION', permission)

          // إغلاق المودال وتنظيف النموذج
          commit('SET_MODAL', { show: false, editing: false })
          commit('CLEAR_FORM')

          return permission
        } else {
          throw new Error(response.data.message || 'فشل في تحديث الصلاحية')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'فشل في تحديث الصلاحية'
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_MODAL', { submitting: false })
      }
    },

    async deletePermission({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.delete(`/admin/permissions/${id}`)

        if (response.data.status) {
          commit('DELETE_PERMISSION', id)
          return true
        } else {
          throw new Error(response.data.message || 'فشل في حذف الصلاحية')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'فشل في حذف الصلاحية'
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

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
