// src/stores/modules/clients.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: () => ({
    clients: [],
    currentClient: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      search: '',
      date_from: '',
      date_to: '',
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
    stats: {
      total_clients: 0,
      active_clients: 0,
      total_invoices: 0,
      total_revenue: 0
    }
  }),

  getters: {
    clients: state => state.clients || [],
    currentClient: state => state.currentClient,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination,
    clientStats: state => state.stats,
    clientFilters: state => state.filters,

    clientById: state => id => {
      return state.clients.find(client => Number(client.id) === Number(id)) || null
    }
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_CLIENTS(state, payload) {
      if (payload?.data) {
        if (Array.isArray(payload.data)) {
          state.clients = payload.data
        } else if (payload.data.data) {
          state.clients = payload.data.data
          state.pagination = {
            current_page: payload.data.current_page || 1,
            last_page: payload.data.last_page || 1,
            per_page: payload.data.per_page || 10,
            total: payload.data.total || 0,
            from: payload.data.from || 0,
            to: payload.data.to || 0
          }
        } else {
          state.clients = payload.data.clients || []
        }
      } else {
        state.clients = []
      }
    },

    SET_CURRENT_CLIENT(state, client) {
      state.currentClient = client
    },

    SET_CLIENT_STATS(state, stats) {
      state.stats = {
        total_clients: stats.total_clients || 0,
        active_clients: stats.active_clients || 0,
        total_invoices: stats.total_invoices || 0,
        total_revenue: stats.total_revenue || 0
      }
    },

    ADD_CLIENT(state, client) {
      state.clients.unshift(client)
      state.stats.total_clients += 1
      if (client.status === 'active') {
        state.stats.active_clients += 1
      }
    },

    UPDATE_CLIENT(state, updatedClient) {
      const index = state.clients.findIndex(c => c.id === updatedClient.id)
      if (index !== -1) {
        const oldClient = state.clients[index]
        if (oldClient.status !== updatedClient.status) {
          if (oldClient.status === 'active') state.stats.active_clients -= 1
          if (updatedClient.status === 'active') state.stats.active_clients += 1
        }
        state.clients.splice(index, 1, updatedClient)
      }
    },

    DELETE_CLIENT(state, id) {
      const index = state.clients.findIndex(c => c.id === id)
      if (index !== -1) {
        const client = state.clients[index]
        state.stats.total_clients -= 1
        if (client.status === 'active') state.stats.active_clients -= 1
        state.clients.splice(index, 1)
      }
    },

    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },

    CLEAR_FILTERS(state) {
      state.filters = {
        status: '',
        search: '',
        date_from: '',
        date_to: '',
        page: 1,
        per_page: 10
      }
    },

    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    // جلب العملاء مع التصفية والترقيم
    async fetchClients({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const query = {
          page: params.page || state.filters.page || 1,
          search: params.search || state.filters.search || '',
          status: params.status || state.filters.status || '',
          date_from: params.date_from || state.filters.date_from || '',
          date_to: params.date_to || state.filters.date_to || '',
          per_page: params.per_page || state.filters.per_page || 10,
          include_stats: true,
          ...params
        }

        const response = await axios.get('/admin/clients', { params: query })

        if (response.data) {
          commit('SET_CLIENTS', response.data)

          if (response.data.stats) {
            commit('SET_CLIENT_STATS', response.data.stats)
          } else if (Array.isArray(state.clients)) {
            // حساب الإحصائيات محلياً في حالة عدم وجودها من API
            const stats = {
              total_clients: state.clients.length,
              active_clients: state.clients.filter(c => c.status === 'active' || c.is_active).length,
              total_invoices: state.clients.reduce((sum, c) => sum + (c.invoices_count || 0), 0),
              total_revenue: state.clients.reduce((sum, c) => sum + (c.total_spent || 0), 0)
            }
            commit('SET_CLIENT_STATS', stats)
          }
          return response.data
        } else {
          commit('SET_CLIENTS', { data: [] })
          throw new Error(i18n.t('clients.empty_response'))
        }
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('clients.fetch_failed')
        commit('SET_ERROR', message)
        commit('SET_CLIENTS', { data: [] })
        commit('SET_CLIENT_STATS', { total_clients: 0, active_clients: 0, total_invoices: 0, total_revenue: 0 })
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // جلب عميل واحد
    async fetchClient({ commit }, id) {
      commit('SET_LOADING', true)
      NProgress.start()

      try {
        const response = await axios.get(`/admin/clients/${id}`)
        const client = response.data.data || response.data
        commit('SET_CURRENT_CLIENT', client)
        return client
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('clients.fetch_one_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // إنشاء عميل جديد
    async createClient({ commit }, clientData) {
      commit('SET_LOADING', true)
      NProgress.start()

      try {
        const response = await axios.post('/admin/clients', clientData)
        const client = response.data.data || response.data
        commit('ADD_CLIENT', client)
        return client
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('clients.create_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحديث عميل
    async updateClient({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      NProgress.start()

      try {
        const response = await axios.put(`/admin/clients/${id}`, data)
        const updatedClient = response.data.data || response.data
        commit('UPDATE_CLIENT', updatedClient)
        return updatedClient
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('clients.update_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // حذف عميل
    async deleteClient({ commit }, id) {
      commit('SET_LOADING', true)
      NProgress.start()

      try {
        await axios.delete(`/admin/clients/${id}`)
        commit('DELETE_CLIENT', id)
        return true
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('clients.delete_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // قائمة مبسطة (للاستخدام في select boxes)
    async getSimpleList() {
      try {
        const response = await axios.get('/admin/clients/list/simple')
        return response.data.data || response.data || []
      } catch (error) {
        // لا نعرض رسائل للمستخدم في هذه الحالة، فقط نرمي الخطأ
        throw new Error(error.response?.data?.message || i18n.t('clients.simple_list_failed'))
      }
    },

    // تحديث المرشحات
    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    // مسح المرشحات
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    },

    // مسح الخطأ
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
