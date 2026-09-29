import axios from '@/api/axios'

export default {
  namespaced: true,
  state: () => ({
    properties: [],
  }),
  mutations: {
    SET_PROPERTIES(state, properties) {
      state.properties = properties
    },
  },
  actions: {
    async fetchAllProperties({ commit }) {
      const response = await axios.get('/admin/properties', { params: { per_page: 100 } })
      commit('SET_PROPERTIES', response.data?.data?.data || response.data?.data || [])
      return response.data
    },
    async fetchProperty(_, id) {
      const response = await axios.get(`/admin/properties/${id}`)
      return response.data
    },
    async createProperty(_, payload) {
      const response = await axios.post('/admin/properties', payload)
      return response.data
    },
    async updateProperty(_, { id, payload }) {
      const response = await axios.put(`/admin/properties/${id}`, payload)
      return response.data
    },
    async deleteProperty(_, id) {
      const response = await axios.delete(`/admin/properties/${id}`)
      return response.data
    },
  },
}
