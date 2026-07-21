// src/store/modules/activity.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: {
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
  },

  getters: {
    logs: state => state.logs,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination,
    filters: state => state.filters
  },

  mutations: {
    SET_LOGS(state, payload) {
      state.logs = payload.data || []
      state.pagination = {
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
        per_page: payload.per_page || 15,
        total: payload.total || 0,
        from: payload.from || 0,
        to: payload.to || 0
      }
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
      NProgress.start()

      try {
        const filters = { ...state.filters, ...params }
        const response = await axios.get('/admin/activity-logs', { params: filters })

        if (response.data?.status) {
          commit('SET_LOGS', response.data.data)
        } else {
          const errorMsg = response.data?.message || i18n.global.t('activity.fetch_failed')
          commit('SET_ERROR', errorMsg)
        }
        return response.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.global.t('activity.fetch_error')
        commit('SET_ERROR', message)
        throw error
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
    }
  }
}
