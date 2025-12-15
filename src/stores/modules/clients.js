import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    clients: [],
    currentClient: null,
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    }
  }),

  getters: {
    clients: state => {
      return Array.isArray(state.clients) ? state.clients : []
    },
    currentClient: state => state.currentClient,
    loading: state => state.loading,
    pagination: state => state.pagination,

    clientById: (state) => (id) => {
      if (!Array.isArray(state.clients)) return null
      return state.clients.find(client => Number(client.id) === Number(id))
    }
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_CLIENTS(state, response) {
      console.log('📊 SET_CLIENTS mutation called with:', response)

      if (response && response.data) {
        // إذا كان الرد يحتوي على pagination
        if (Array.isArray(response.data)) {
          // بيانات بدون pagination
          state.clients = response.data
          state.pagination = {
            current_page: 1,
            last_page: 1,
            per_page: response.data.length,
            total: response.data.length,
            from: 1,
            to: response.data.length
          }
        } else if (response.data.data) {
          // بيانات مع pagination
          state.clients = response.data.data
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
          state.clients = response.data
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

    ADD_CLIENT(state, client) {
      if (!Array.isArray(state.clients)) {
        state.clients = []
      }
      state.clients.unshift(client)
    },

    UPDATE_CLIENT(state, updatedClient) {
      if (Array.isArray(state.clients)) {
        const index = state.clients.findIndex(c => c.id === updatedClient.id)
        if (index !== -1) {
          state.clients.splice(index, 1, updatedClient)
        }
      }
    },

    DELETE_CLIENT(state, id) {
      if (Array.isArray(state.clients)) {
        state.clients = state.clients.filter(c => c.id !== id)
      }
    }
  },

  actions: {
    async fetchClients({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      console.log('📋 Fetching clients with params:', params)

      try {
        const response = await axios.get('/api/clients', {
          params: {
            page: params.page || state.pagination.current_page || 1,
            search: params.search || '',
            per_page: params.per_page || state.pagination.per_page || 10,
            ...params
          }
        })

        console.log('✅ Clients API Response:', response.data)

        if (response.data) {
          commit('SET_CLIENTS', response.data)
          return response.data
        } else {
          console.error('❌ API response empty')
          commit('SET_CLIENTS', { data: [] })
          throw new Error('No data received from API')
        }
      } catch (error) {
        console.error('❌ Error fetching clients:', error)
        commit('SET_CLIENTS', { data: [] })

        let errorMessage = 'حدث خطأ في جلب بيانات العملاء'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchClient({ commit }, id) {
      try {
        console.log(`🚀 Fetching client with ID: ${id}`)
        const response = await axios.get(`/api/clients/${id}`)
        console.log('✅ Client details:', response.data)

        const client = response.data.data || response.data
        commit('SET_CURRENT_CLIENT', client)
        return client
      } catch (error) {
        console.error('❌ Error fetching client:', error)
        throw error
      }
    },

    async createClient({ commit }, clientData) {
      try {
        console.log('🚀 Creating client:', clientData)
        const response = await axios.post('/api/clients', clientData)
        console.log('✅ Client created:', response.data)

        const client = response.data.data || response.data
        commit('ADD_CLIENT', client)
        return client
      } catch (error) {
        console.error('❌ Error creating client:', error)
        console.error('❌ Error details:', error.response?.data || error.message)
        throw error
      }
    },

    async updateClient({ commit }, { id, data }) {
      try {
        console.log(`🚀 Updating client ${id}:`, data)
        const response = await axios.put(`/api/clients/${id}`, data)
        console.log('✅ Client updated:', response.data)

        const updatedClient = response.data.data || response.data
        commit('UPDATE_CLIENT', updatedClient)
        return updatedClient
      } catch (error) {
        console.error('❌ Error updating client:', error)
        throw error
      }
    },

    async deleteClient({ commit }, id) {
      try {
        console.log(`🚀 Deleting client ${id}`)
        await axios.delete(`/api/clients/${id}`)
        console.log('✅ Client deleted')
        commit('DELETE_CLIENT', id)
        return true
      } catch (error) {
        console.error('❌ Error deleting client:', error)
        throw error
      }
    },

    async getSimpleList({ commit }) {
      try {
        console.log('🚀 Fetching simple client list...')
        const response = await axios.get('/api/clients/list/simple')
        console.log('✅ Simple list:', response.data)

        return response.data.data || response.data || []
      } catch (error) {
        console.error('❌ Error fetching simple client list:', error)
        throw error
      }
    }
  }
}
