import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    // البيانات الرئيسية
    permissions: [],
    menus: [],
    parentPermissions: [],
    currentPermission: null,

    // حالات التحميل والأخطاء
    loading: false,
    error: null,

    // التصفية والترتيب
    filters: {
      search: '',
      status: 'all',
      menu_id: '',
      parent_id: '',
      page: 1,
      per_page: 10
    },

    // الترقيم
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    },

    // النماذج
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
    // بيانات أساسية
    permissions: (state) => Array.isArray(state.permissions) ? state.permissions : [],
    menus: (state) => state.menus,
    parentPermissions: (state) => state.parentPermissions,
    currentPermission: (state) => state.currentPermission,

    // حالة النظام
    isLoading: (state) => state.loading,
    error: (state) => state.error,

    // تصفية وترتيب
    filters: (state) => state.filters,
    pagination: (state) => state.pagination,

    // نموذج
    form: (state) => state.form,

    // بحث عن صلاحية معينة
    permissionById: (state) => (id) => {
      if (!Array.isArray(state.permissions)) return null
      return state.permissions.find(permission => Number(permission.id) === Number(id))
    }
  },

  mutations: {
    // تحميل البيانات
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    CLEAR_ERROR(state) {
      state.error = null
    },

    // البيانات الرئيسية
    SET_PERMISSIONS(state, response) {
      console.log('📊 SET_PERMISSIONS mutation:', response)

      if (response && response.data) {
        // إذا كان الرد يحتوي على pagination
        if (response.data.data) {
          state.permissions = response.data.data || []
          state.pagination = {
            current_page: response.data.current_page || 1,
            last_page: response.data.last_page || 1,
            per_page: response.data.per_page || 10,
            total: response.data.total || 0,
            from: response.data.from || 0,
            to: response.data.to || 0
          }
        } else {
          state.permissions = response.data || []
          state.pagination = {}
        }
      } else {
        state.permissions = []
        state.pagination = {}
      }
    },

    SET_MENUS(state, response) {
      if (response && response.data) {
        state.menus = Array.isArray(response.data) ? response.data : response.data.data || []
      } else {
        state.menus = []
      }
    },

    SET_PARENT_PERMISSIONS(state, response) {
      if (response && response.data) {
        state.parentPermissions = Array.isArray(response.data) ? response.data : response.data.data || []
      } else {
        state.parentPermissions = []
      }
    },

    SET_CURRENT_PERMISSION(state, permission) {
      state.currentPermission = permission
    },

    // التصفية والترتيب
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

    // إدارة الصلاحيات
    ADD_PERMISSION(state, permission) {
      if (!Array.isArray(state.permissions)) {
        state.permissions = []
      }
      state.permissions.unshift(permission)
    },

    UPDATE_PERMISSION(state, updatedPermission) {
      if (Array.isArray(state.permissions)) {
        const index = state.permissions.findIndex(p => p.id === updatedPermission.id)
        if (index !== -1) {
          state.permissions.splice(index, 1, updatedPermission)
        }
      }
    },

    DELETE_PERMISSION(state, id) {
      if (Array.isArray(state.permissions)) {
        state.permissions = state.permissions.filter(p => p.id !== id)
      }
    },

    // إدارة النموذج
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

    // تحميل بيانات النموذج من صلاحية موجودة
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
    // جلب الصلاحيات - التصحيح: استخدم اسم واحد فقط
    async fetchPermissions({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const apiParams = {
        page: params.page || state.filters.page,
        per_page: params.per_page || state.filters.per_page,
        search: params.search || state.filters.search,
        status: state.filters.status !== 'all' ? state.filters.status : '',
        menu_id: state.filters.menu_id,
        parent_id: state.filters.parent_id,
        ...params
      }

      try {
        const response = await axios.get('/admin/permissions', { params: apiParams })
        commit('SET_PERMISSIONS', response.data)
        return response.data
      } catch (error) {
        const errorMsg = error.response?.data?.message || 'فشل في تحميل الصلاحيات'
        commit('SET_ERROR', errorMsg)
        throw new Error(errorMsg)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // إضافة اسم بديل لـ fetchPermissions لتجنب الخطأ
    async getPermissions(context, params) {
      return context.dispatch('fetchPermissions', params)
    },

    // بقية الإجراءات
    async fetchPermission({ commit }, id) {
      try {
        const response = await axios.get(`/admin/permissions/${id}`)
        const permission = response.data.data || response.data
        commit('SET_CURRENT_PERMISSION', permission)
        return permission
      } catch (error) {
        throw new Error(error.response?.data?.message || 'فشل في جلب الصلاحية')
      }
    },

    async createPermission({ commit, dispatch }, permissionData) {
      try {
        const response = await axios.post('/admin/permissions', permissionData)
        const permission = response.data.data || response.data
        commit('ADD_PERMISSION', permission)
        await dispatch('fetchPermissions')
        return permission
      } catch (error) {
        throw new Error(error.response?.data?.message || 'فشل في إنشاء الصلاحية')
      }
    },

    async updatePermission({ commit, dispatch }, { id, data }) {
      try {
        const response = await axios.put(`/admin/permissions/${id}`, data)
        const permission = response.data.data || response.data
        commit('UPDATE_PERMISSION', permission)
        await dispatch('fetchPermissions')
        return permission
      } catch (error) {
        throw new Error(error.response?.data?.message || 'فشل في تحديث الصلاحية')
      }
    },

    async deletePermission({ commit, dispatch }, id) {
      try {
        await axios.delete(`/admin/permissions/${id}`)
        commit('DELETE_PERMISSION', id)
        await dispatch('fetchPermissions')
        return true
      } catch (error) {
        throw new Error(error.response?.data?.message || 'فشل في حذف الصلاحية')
      }
    },

    async fetchMenus({ commit }) {
      try {
        const response = await axios.get('/admin/permissions/menus')
        commit('SET_MENUS', response.data)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'فشل في جلب القوائم')
      }
    },

    async fetchParentPermissions({ commit }) {
      try {
        const response = await axios.get('/admin/permissions/parent-permissions')
        commit('SET_PARENT_PERMISSIONS', response.data)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'فشل في جلب الصلاحيات الرئيسية')
      }
    },

    // إجراءات محلية
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
