import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

// ملاحظة: الباك-إند لهذه الميزة يرجّع { status, message, data }
// (مو { success, ... } زي التقارير، ومو data مباشرة زي بعض الموديولات الثانية)

export default {
  namespaced: true,

  state: () => ({
    templates: [],
    currentTemplate: null,
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 20,
      total: 0,
    },
    filters: {
      status: '',
      client_id: '',
    },
  }),

  getters: {
    templates: state => state.templates,
    currentTemplate: state => state.currentTemplate,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination,
    templateFilters: state => state.filters,

    templateStats: state => {
      const templates = state.templates || []
      return {
        total: templates.length,
        active: templates.filter(t => t.status === 'active').length,
        completed: templates.filter(t => t.status === 'completed').length,
        cancelled: templates.filter(t => t.status === 'cancelled').length,
      }
    },
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
    SET_TEMPLATES(state, payload) {
      if (payload && Array.isArray(payload.data)) {
        state.templates = payload.data
        state.pagination = {
          current_page: payload.current_page || 1,
          last_page: payload.last_page || 1,
          per_page: payload.per_page || 20,
          total: payload.total || 0,
        }
      } else if (Array.isArray(payload)) {
        state.templates = payload
      } else {
        state.templates = []
      }
    },
    SET_CURRENT_TEMPLATE(state, template) {
      state.currentTemplate = template
    },
    ADD_TEMPLATE(state, template) {
      if (!Array.isArray(state.templates)) state.templates = []
      state.templates.unshift(template)
    },
    UPDATE_TEMPLATE(state, updated) {
      const index = state.templates.findIndex(t => t.id === updated.id)
      if (index !== -1) state.templates.splice(index, 1, updated)
    },
    REMOVE_TEMPLATE(state, id) {
      state.templates = state.templates.filter(t => t.id !== id)
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    CLEAR_FILTERS(state) {
      state.filters = { status: '', client_id: '' }
    },
  },

  actions: {
    async fetchTemplates({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const query = { ...state.filters, ...params }
        Object.keys(query).forEach(key => {
          if (query[key] === '' || query[key] === null || query[key] === undefined) {
            delete query[key]
          }
        })

        const response = await axios.get('/admin/recurring-invoices', { params: query })

        if (!response.data.status) {
          throw new Error(response.data.message || i18n.global.t('common.error'))
        }

        commit('SET_TEMPLATES', response.data.data)
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('common.error')
        commit('SET_ERROR', message)
        commit('SET_TEMPLATES', [])
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async fetchTemplate({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get(`/admin/recurring-invoices/${id}`)
        if (!response.data.status) {
          throw new Error(response.data.message)
        }
        commit('SET_CURRENT_TEMPLATE', response.data.data)
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('common.error')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async createTemplate({ commit }, data) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.post('/admin/recurring-invoices', data)
        if (!response.data.status) {
          throw new Error(response.data.message)
        }
        commit('ADD_TEMPLATE', response.data.data)
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('common.error')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async updateTemplate({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.put(`/admin/recurring-invoices/${id}`, data)
        if (!response.data.status) {
          throw new Error(response.data.message)
        }
        commit('UPDATE_TEMPLATE', response.data.data)
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('common.error')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async deleteTemplate({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.delete(`/admin/recurring-invoices/${id}`)
        if (!response.data.status) {
          throw new Error(response.data.message)
        }
        commit('REMOVE_TEMPLATE', id)
        return true
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('common.error')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    async generateNow({ commit, dispatch }, id) {
      try {
        const response = await axios.post(`/admin/recurring-invoices/${id}/generate-now`)
        if (!response.data.status) {
          throw new Error(response.data.message)
        }
        await dispatch('fetchTemplate', id)
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('common.error')
        commit('SET_ERROR', message)
        throw new Error(message)
      }
    },

    async cancelTemplate({ commit }, id) {
      try {
        const response = await axios.post(`/admin/recurring-invoices/${id}/cancel`)
        if (!response.data.status) {
          throw new Error(response.data.message)
        }
        commit('UPDATE_TEMPLATE', response.data.data)
        return response.data.data
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('common.error')
        commit('SET_ERROR', message)
        throw new Error(message)
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
    },
  },
}