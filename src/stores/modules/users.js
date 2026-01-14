// src/store/modules/users.js
import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    users: [],
    currentUser: null,
    groups: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    },
    filters: {
      search: '',
      page: 1
    }
  }),

  getters: {
    users: state => state.users,
    currentUser: state => state.currentUser,
    groups: state => state.groups,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination,
    userFilters: state => state.filters,

    userById: (state) => (id) => {
      return state.users.find(user => Number(user.id) === Number(id))
    },

    userStats: (state) => {
      const users = state.users
      return {
        total: users.length,
        active: users.filter(user => user.status === 'active' || user.is_active === true).length,
        inactive: users.filter(user => user.status === 'inactive' || user.is_active === false).length,
        suspended: users.filter(user => user.status === 'suspended').length
      }
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

    SET_USERS(state, data) {
      // حفظ بيانات المستخدمين
      state.users = data.users || data.data || []

      // حفظ بيانات الترقيم إذا وجدت
      if (data.pagination) {
        state.pagination = data.pagination
      } else if (data.meta) {
        state.pagination = {
          current_page: data.meta.current_page,
          last_page: data.meta.last_page,
          per_page: data.meta.per_page,
          total: data.meta.total,
          from: data.meta.from,
          to: data.meta.to
        }
      }
    },

    SET_CURRENT_USER(state, user) {
      state.currentUser = user
    },

    SET_GROUPS(state, groups) {
      state.groups = groups
    },

    ADD_USER(state, user) {
      state.users.unshift(user)
    },

    UPDATE_USER(state, updatedUser) {
      const index = state.users.findIndex(u => u.id === updatedUser.id)
      if (index !== -1) {
        state.users.splice(index, 1, updatedUser)
      }
    },

    DELETE_USER(state, id) {
      state.users = state.users.filter(u => u.id !== id)
    },

    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },

    CLEAR_FILTERS(state) {
      state.filters = {
        search: '',
        page: 1
      }
    }
  },

  actions: {
    async getUsers({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const filters = { ...state.filters, ...params }

        const response = await axios.get('/admin/users', { params: filters })

        if (response.data) {
          commit('SET_USERS', response.data)
        } else {
          commit('SET_ERROR', 'لا توجد بيانات في الاستجابة')
        }

        return response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          'حدث خطأ في جلب بيانات المستخدمين'

        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getUserGroups({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/groups/simple-list')

        if (response.data) {
          const groups = response.data.data || response.data
          commit('SET_GROUPS', groups)
        } else {
          commit('SET_ERROR', 'فشل في تحميل المجموعات: لا توجد بيانات')
        }

        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل المجموعات')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createUser({ commit, dispatch }, userData) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.post('/admin/users', userData)

        if (response.data) {
          // إعادة تحميل قائمة المستخدمين بعد الإضافة
          await dispatch('getUsers')
        } else {
          commit('SET_ERROR', 'فشل في إنشاء المستخدم: لا توجد بيانات')
        }

        return response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message ||
          'فشل في إنشاء المستخدم'

        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors
          if (validationErrors) {
            const errorList = Object.values(validationErrors).flat().join(', ')
            commit('SET_ERROR', errorList)
          } else {
            commit('SET_ERROR', errorMessage)
          }
        } else {
          commit('SET_ERROR', errorMessage)
        }
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateUser({ commit, dispatch }, { id, data }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.put(`/admin/users/${id}`, data)

        if (response.data) {
          // إعادة تحميل قائمة المستخدمين بعد التحديث
          await dispatch('getUsers')
        } else {
          commit('SET_ERROR', 'فشل في تحديث المستخدم: لا توجد بيانات')
        }

        return response.data
      } catch (error) {
        const errorMessage = error.response?.data?.message ||
          'فشل في تحديث المستخدم'

        if (error.response?.status === 422) {
          const validationErrors = error.response.data.errors
          if (validationErrors) {
            const errorList = Object.values(validationErrors).flat().join(', ')
            commit('SET_ERROR', errorList)
          } else {
            commit('SET_ERROR', errorMessage)
          }
        } else {
          commit('SET_ERROR', errorMessage)
        }
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteUser({ commit, dispatch }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.delete(`/admin/users/${id}`)

        if (response.data) {
          // إعادة تحميل قائمة المستخدمين بعد الحذف
          await dispatch('getUsers')
        } else {
          commit('SET_ERROR', 'فشل في حذف المستخدم: لا توجد بيانات')
        }

        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في حذف المستخدم')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    },

    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
