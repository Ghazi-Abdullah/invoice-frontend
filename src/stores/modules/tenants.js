import axios from '@/api/axios'

export default {
  namespaced: true,
  actions: {
    async createTenant(_, payload) {
      const response = await axios.post('/admin/tenants', payload)
      return response.data
    },
    async updateTenant(_, { id, payload }) {
      const response = await axios.put(`/admin/tenants/${id}`, payload)
      return response.data
    },
    async deleteTenant(_, id) {
      const response = await axios.delete(`/admin/tenants/${id}`)
      return response.data
    },
  },
}
