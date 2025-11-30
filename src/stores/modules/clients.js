import api from '@/api/axios'

const state = {
  clients: {
    data: [],
    meta: {}
  },
  loading: false,
  error: null
}

const getters = {
  totalClients: (state) => state.clients.meta?.total || 0,
  hasClients: (state) => state.clients.data?.length > 0,
  paginationInfo: (state) => ({
    currentPage: state.clients.meta?.current_page || 1,
    lastPage: state.clients.meta?.last_page || 1,
    perPage: state.clients.meta?.per_page || 10,
    total: state.clients.meta?.total || 0
  }),
  getClientById: (state) => (id) => {
    return state.clients.data.find(client => client.id === parseInt(id))
  },
  clientsForSelect: (state) => {
    return state.clients.data.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email
    }))
  }
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_CLIENTS(state, clients) {
    state.clients = clients
  },
  ADD_CLIENT(state, client) {
    state.clients.data.unshift(client)
  },
  UPDATE_CLIENT(state, updatedClient) {
    const index = state.clients.data.findIndex(client => client.id === updatedClient.id)
    if (index !== -1) {
      state.clients.data.splice(index, 1, updatedClient)
    }
  },
  REMOVE_CLIENT(state, id) {
    state.clients.data = state.clients.data.filter(client => client.id !== parseInt(id))
  }
}

const actions = {
  async fetchClients({ commit }, params = {}) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log('🔄 Fetching clients from API...')
      const response = await api.get('/clients', { params })
      console.log('📦 Full API Response:', response.data)

      if (response.data && response.data.success) {
        const apiData = response.data.data

        if (apiData && Array.isArray(apiData.data)) {
          commit('SET_CLIENTS', {
            data: apiData.data,
            meta: {
              current_page: apiData.current_page,
              last_page: apiData.last_page,
              per_page: apiData.per_page,
              total: apiData.total,
              from: apiData.from,
              to: apiData.to
            }
          })
        } else if (Array.isArray(apiData)) {
          commit('SET_CLIENTS', {
            data: apiData,
            meta: {
              current_page: 1,
              last_page: 1,
              per_page: apiData.length,
              total: apiData.length
            }
          })
        } else {
          console.warn('⚠️ Unexpected API structure:', response.data)
          commit('SET_CLIENTS', { data: [], meta: {} })
        }
      } else {
        console.warn('⚠️ API response not successful:', response.data)
        commit('SET_CLIENTS', { data: [], meta: {} })
      }

      console.log('✅ Final clients in store:', state.clients)
      return state.clients
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error fetching clients:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createClient({ commit, dispatch }, clientData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log('🔄 Creating client:', clientData)
      const response = await api.post('/clients', clientData)
      console.log('✅ Client created:', response.data)

      // Refresh the clients list
      await dispatch('fetchClients')
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error creating client:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateClient({ commit, dispatch }, { id, clientData }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await api.put(`/clients/${id}`, clientData)
      console.log('✏️ Client updated:', response.data)

      // Refresh the clients list
      await dispatch('fetchClients')
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error updating client:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteClient({ commit, dispatch }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      await api.delete(`/clients/${id}`)
      console.log('🗑️ Client deleted:', id)

      // Refresh the clients list
      await dispatch('fetchClients')
      return true
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error deleting client:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchClient({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🔄 Fetching client ${id} from API...`)
      const response = await api.get(`/clients/${id}`)
      console.log('📦 Client details:', response.data)

      if (response.data && response.data.success) {
        return response.data.data
      } else {
        throw new Error('Failed to fetch client details')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error fetching client:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
