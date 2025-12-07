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
    }
  },

  actions: {
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
      }
    },

    async deleteClient({ commit }, id) {
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

  }
}
