import axios from '@/api/axios'

export default {
  namespaced: true,
  state: () => ({
    floors: [],
  }),
  mutations: {
    SET_FLOORS(state, floors) {
      state.floors = floors
    },
  },
  actions: {
    async fetchFloorsByProperty({ commit }, propertyId) {
      const response = await axios.get('/admin/floors', { params: { property_id: propertyId, per_page: 100 } })
      commit('SET_FLOORS', response.data?.data?.data || response.data?.data || [])
      return response.data
    },
    async createFloor(_, payload) {
      const response = await axios.post('/admin/floors', payload)
      return response.data
    },
    async updateFloor(_, { id, payload }) {
      const response = await axios.put(`/admin/floors/${id}`, payload)
      return response.data
    },
    async deleteFloor(_, id) {
      const response = await axios.delete(`/admin/floors/${id}`)
      return response.data
    },
  },
}
