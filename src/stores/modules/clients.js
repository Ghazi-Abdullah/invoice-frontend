<<<<<<< Updated upstream
import api from '@/api/axios'
import NProgress from 'nprogress'

export default {
  namespaced: true,

  state: {
    clients: {
      data: [],
      meta: {}
    },
    loading: false,
    error: null
  },

  getters: {
    clients: (state) => state.clients.data || [],
    pagination: (state) => state.clients.meta || {},
    clientById: (state) => (id) =>
      state.clients.data.find(client => client.id === Number(id)),
  },

  mutations: {
    SET_LOADING(state, status) {
      state.loading = status
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_CLIENTS(state, payload) {
      state.clients = payload
    },
    ADD_CLIENT(state, client) {
      state.clients.data.unshift(client)
    },
    UPDATE_CLIENT(state, updated) {
      const i = state.clients.data.findIndex(c => c.id === updated.id)
      if (i !== -1) state.clients.data.splice(i, 1, updated)
    },
    REMOVE_CLIENT(state, id) {
      state.clients.data = state.clients.data.filter(c => c.id !== Number(id))
=======
import axios from '@/api/axios'

export default {
  namespaced: true,
  state: {
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
  },

  getters: {
    clients: state => {
      // إرجاع المصفوفة بشكل صحيح
      return Array.isArray(state.clients) ? state.clients : []
    },
    currentClient: state => state.currentClient,
    loading: state => state.loading,
    pagination: state => state.pagination
  },

  mutations: {
    SET_CLIENTS(state, responseData) {
      console.log('🔄 Setting clients in Vuex:', responseData)

      // التعامل مع الـ pagination
      if (responseData && responseData.data && Array.isArray(responseData.data)) {
        state.clients = responseData.data
        if (responseData.current_page) {
          state.pagination = {
            current_page: responseData.current_page,
            last_page: responseData.last_page,
            per_page: responseData.per_page,
            total: responseData.total,
            from: responseData.from,
            to: responseData.to
          }
        }
      } else if (responseData && Array.isArray(responseData)) {
        // إذا كان array مباشر
        state.clients = responseData
      } else {
        state.clients = []
      }

      console.log('✅ Clients after setting:', state.clients)
    },

    SET_CURRENT_CLIENT(state, client) {
      state.currentClient = client
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    ADD_CLIENT(state, client) {
      if (!Array.isArray(state.clients)) {
        state.clients = []
      }
      state.clients.unshift(client)
    },

    UPDATE_CLIENT(state, updatedClient) {
      const index = state.clients.findIndex(c => c.id === updatedClient.id)
      if (index !== -1) {
        state.clients.splice(index, 1, updatedClient)
      }
    },

    DELETE_CLIENT(state, id) {
      state.clients = state.clients.filter(c => c.id !== id)
>>>>>>> Stashed changes
    }
  },

  actions: {
<<<<<<< Updated upstream
    async fetchClients({ commit }, params = {}) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      NProgress.start()

      try {
        const res = await api.get('/clients', { params })

        if (res.data?.success) {
          const data = res.data.data

          // Laravel pagination or direct array
          const formatted = Array.isArray(data)
            ? {
              data,
              meta: {
                total: data.length,
                current_page: 1,
                last_page: 1,
                per_page: data.length
              }
            }
            : {
              data: data.data || [],
              meta: {
                total: data.total || 0,
                current_page: data.current_page || 1,
                last_page: data.last_page || 1,
                per_page: data.per_page || 10
              }
            }

          commit('SET_CLIENTS', formatted)
        }
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
      } finally {
        commit('SET_LOADING', false)
        NProgress.done()
      }
    },

    async createClient({ commit }, formData) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      NProgress.start()
      try {
        const res = await api.post('/clients', formData)
        if (res.data?.success) {
          commit('ADD_CLIENT', res.data.data)
        }
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
      } finally {
        commit('SET_LOADING', false)
        NProgress.done()
      }
    },

    async updateClient({ commit }, { id, formData }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      NProgress.start()
      try {
        const res = await api.put(`/clients/${id}`, formData)
        if (res.data?.success) {
          commit('UPDATE_CLIENT', res.data.data)
        }
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
      } finally {
        commit('SET_LOADING', false)
        NProgress.done()
=======
    async fetchClients({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      console.log('📋 Fetching clients with params:', params)

      try {
        const response = await axios.get('/api/clients', {
          params: {
            page: params.page || 1,
            search: params.search || '',
            ...params
          }
        })

        console.log('✅ Clients API Response:', response.data)

        if (response.data.status) {
          commit('SET_CLIENTS', response.data.data)
          return response.data.data
        } else {
          console.error('❌ API response not successful:', response.data.message)
          commit('SET_CLIENTS', [])
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('❌ Error fetching clients:', error)
        commit('SET_CLIENTS', [])

        // عرض رسالة الخطأ للمستخدم
        let errorMessage = 'حدث خطأ في جلب البيانات'
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
        const response = await axios.get(`/api/clients/${id}`)

        if (response.data.status) {
          commit('SET_CURRENT_CLIENT', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('❌ Error fetching client:', error)
        throw error
      }
    },

    async createClient({ commit }, clientData) {
      try {
        const response = await axios.post('/api/clients', clientData)

        if (response.data.status) {
          commit('ADD_CLIENT', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('❌ Error creating client:', error)
        throw error
      }
    },

    async updateClient({ commit }, { id, data }) {
      try {
        const response = await axios.put(`/api/clients/${id}`, data)

        if (response.data.status) {
          commit('UPDATE_CLIENT', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('❌ Error updating client:', error)
        throw error
>>>>>>> Stashed changes
      }
    },

    async deleteClient({ commit }, id) {
<<<<<<< Updated upstream
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      NProgress.start()
      try {
        await api.delete(`/clients/${id}`)
        commit('REMOVE_CLIENT', id)
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message)
      } finally {
        commit('SET_LOADING', false)
        NProgress.done()
      }
    },

    async fetchClient(_, id) {
      try {
        const res = await api.get(`/clients/${id}`)
        return res.data?.success ? res.data.data : null
      } catch (error) {
        console.error("Error fetching client:", error)
        return null
      }


    }

=======
      try {
        const response = await axios.delete(`/api/clients/${id}`)

        if (response.data.status) {
          commit('DELETE_CLIENT', id)
          return true
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('❌ Error deleting client:', error)
        throw error
      }
    }
>>>>>>> Stashed changes
  }
}
