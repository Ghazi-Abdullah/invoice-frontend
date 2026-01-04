import axios from '@/api/axios'

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
    clients: state => {
      return Array.isArray(state.clients) ? state.clients : []
    },
    currentClient: state => state.currentClient,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination,
    clientStats: state => state.stats,
    clientFilters: state => state.filters,

    clientById: (state) => (id) => {
      if (!Array.isArray(state.clients)) return null
      return state.clients.find(client => Number(client.id) === Number(id))
    }
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_CLIENTS(state, response) {
      console.log('📊 SET_CLIENTS mutation called with:', response)

      if (response && response.data) {
        // إذا كان الرد يحتوي على pagination
        if (response.data.data) {
          // بيانات مع pagination
          state.clients = response.data.data || []
          state.pagination = {
            current_page: response.data.current_page || 1,
            last_page: response.data.last_page || 1,
            per_page: response.data.per_page || 10,
            total: response.data.total || 0,
            from: response.data.from || 0,
            to: response.data.to || 0
          }
        } else {
          // بيانات بدون هيكل محدد
          state.clients = response.data.clients || response.data || []
          state.pagination = {}
        }
      } else {
        // افتراضياً، مصفوفة فارغة
        state.clients = []
        state.pagination = {}
      }

      console.log('✅ Clients set to:', state.clients)
      console.log('✅ Pagination set to:', state.pagination)
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
      if (!Array.isArray(state.clients)) {
        state.clients = []
      }
      state.clients.unshift(client)
      // تحديث الإحصائيات
      state.stats.total_clients += 1
      if (client.status === 'active') {
        state.stats.active_clients += 1
      }
    },

    UPDATE_CLIENT(state, updatedClient) {
      if (Array.isArray(state.clients)) {
        const index = state.clients.findIndex(c => c.id === updatedClient.id)
        if (index !== -1) {
          const oldClient = state.clients[index]
          // تحديث الإحصائيات إذا تغيرت الحالة
          if (oldClient.status !== updatedClient.status) {
            if (oldClient.status === 'active') {
              state.stats.active_clients -= 1
            }
            if (updatedClient.status === 'active') {
              state.stats.active_clients += 1
            }
          }
          state.clients.splice(index, 1, updatedClient)
        }
      }
    },

    DELETE_CLIENT(state, id) {
      if (Array.isArray(state.clients)) {
        const client = state.clients.find(c => c.id === id)
        if (client) {
          // تحديث الإحصائيات
          state.stats.total_clients -= 1
          if (client.status === 'active') {
            state.stats.active_clients -= 1
          }
          // حذف العميل
          state.clients = state.clients.filter(c => c.id !== id)
        }
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
    async fetchClients({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      console.log('📋 Fetching clients with params:', params)

      try {
        const response = await axios.get('/admin/clients', {
          params: {
            page: params.page || state.filters.page || 1,
            search: params.search || state.filters.search || '',
            status: params.status || state.filters.status || '',
            date_from: params.date_from || state.filters.date_from || '',
            date_to: params.date_to || state.filters.date_to || '',
            per_page: params.per_page || state.filters.per_page || 10,
            include_stats: true, // إضافة هذا لطلب الإحصائيات
            ...params
          }
        })

        console.log('✅ Clients API Response:', response.data)

        if (response.data) {
          commit('SET_CLIENTS', response.data)

          // تحديث الإحصائيات إذا كانت موجودة في الرد
          if (response.data.stats) {
            commit('SET_CLIENT_STATS', response.data.stats)
          } else {
            // حساب الإحصائيات محلياً إذا لم تكن موجودة في الرد
            const stats = {
              total_clients: state.clients.length,
              active_clients: state.clients.filter(c => c.status === 'active' || c.is_active).length,
              total_invoices: state.clients.reduce((sum, client) => sum + (client.invoices_count || 0), 0),
              total_revenue: state.clients.reduce((sum, client) => sum + (client.total_spent || 0), 0)
            }
            commit('SET_CLIENT_STATS', stats)
          }

          return response.data
        } else {
          console.error('❌ API response empty')
          commit('SET_CLIENTS', { data: [] })
          throw new Error('No data received from API')
        }
      } catch (error) {
        console.error('❌ Error fetching clients:', error)
        commit('SET_CLIENTS', { data: [] })
        commit('SET_CLIENT_STATS', {
          total_clients: 0,
          active_clients: 0,
          total_invoices: 0,
          total_revenue: 0
        })

        let errorMessage = 'حدث خطأ في جلب بيانات العملاء'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchClient({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        console.log(`🚀 Fetching client with ID: ${id}`)
        const response = await axios.get(`/admin/clients/${id}`)
        console.log('✅ Client details:', response.data)

        const client = response.data.data || response.data
        commit('SET_CURRENT_CLIENT', client)
        return client
      } catch (error) {
        console.error('❌ Error fetching client:', error)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل بيانات العميل')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createClient({ commit }, clientData) {
      commit('SET_LOADING', true)
      try {
        console.log('🚀 Creating client:', clientData)
        const response = await axios.post('/admin/clients', clientData)
        console.log('✅ Client created:', response.data)

        const client = response.data.data || response.data
        commit('ADD_CLIENT', client)
        return client
      } catch (error) {
        console.error('❌ Error creating client:', error)
        console.error('❌ Error details:', error.response?.data || error.message)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في إنشاء العميل')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateClient({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      try {
        console.log(`🚀 Updating client ${id}:`, data)
        const response = await axios.put(`/admin/clients/${id}`, data)
        console.log('✅ Client updated:', response.data)

        const updatedClient = response.data.data || response.data
        commit('UPDATE_CLIENT', updatedClient)
        return updatedClient
      } catch (error) {
        console.error('❌ Error updating client:', error)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحديث العميل')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteClient({ commit }, id) {
      commit('SET_LOADING', true)
      try {
        console.log(`🚀 Deleting client ${id}`)
        await axios.delete(`/admin/clients/${id}`)
        console.log('✅ Client deleted')
        commit('DELETE_CLIENT', id)
        return true
      } catch (error) {
        console.error('❌ Error deleting client:', error)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في حذف العميل')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getSimpleList({ commit }) {
      try {
        console.log('🚀 Fetching simple client list...')
        const response = await axios.get('/admin/clients/list/simple')
        console.log('✅ Simple list:', response.data)

        return response.data.data || response.data || []
      } catch (error) {
        console.error('❌ Error fetching simple client list:', error)
        throw error
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
