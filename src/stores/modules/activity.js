// src/store/modules/activity.js
import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    logs: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    },
    filters: {
      search: '',
      action: '',
      user_id: '',
      date_from: '',
      date_to: '',
      page: 1
    }
  }),

  getters: {
    logs: state => state.logs,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination,
    filters: state => state.filters
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
    SET_LOGS(state, data) {
      console.log('📦 SET_LOGS received:', data) // للتشخيص

      if (data && data.data) {
        state.logs = data.data
        state.pagination = {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
          from: data.from,
          to: data.to
        }
      } else {
        state.logs = []
      }
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    RESET_FILTERS(state) {
      state.filters = {
        search: '',
        action: '',
        user_id: '',
        date_from: '',
        date_to: '',
        page: 1
      }
    }
  },

  actions: {
    async fetchLogs({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const filters = { ...state.filters, ...params }
        console.log('🔍 Fetching logs with filters:', filters)

        const response = await axios.get('/admin/activity-logs', { params: filters })
        console.log('✅ API response:', response.data)

        if (response.data && response.data.status) {
          commit('SET_LOGS', response.data.data)
        } else {
          commit('SET_ERROR', response.data?.message || 'فشل جلب البيانات')
        }
        return response.data
      } catch (error) {
        console.error('❌ Error fetching logs:', error)
        const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء جلب سجل النشاطات'
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    resetFilters({ commit }) {
      commit('RESET_FILTERS')
    }
  }
}
