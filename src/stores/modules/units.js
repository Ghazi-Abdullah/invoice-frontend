import axios from '@/api/axios'

export default {
  namespaced: true,
  state: () => ({
    units: [],
  }),
  mutations: {
    SET_UNITS(state, units) {
      state.units = units
    },
  },
  actions: {
    async fetchUnitsByFloor({ commit }, floorId) {
      const response = await axios.get('/admin/units', { params: { floor_id: floorId, per_page: 100 } })
      commit('SET_UNITS', response.data?.data?.data || response.data?.data || [])
      return response.data
    },
    async createUnit(_, payload) {
      const response = await axios.post('/admin/units', payload)
      return response.data
    },
    async updateUnit(_, { id, payload }) {
      const response = await axios.put(`/admin/units/${id}`, payload)
      return response.data
    },
    async deleteUnit(_, id) {
      const response = await axios.delete(`/admin/units/${id}`)
      return response.data
    },
  },
}
