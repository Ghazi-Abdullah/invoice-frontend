import axios from './axios'

export default {
  getAll(params = {}) {
    return axios.get('/admin/branches', { params })
  },
  getActive() {
    return axios.get('/admin/branches/active')
  },
  getMyBranches() {
    return axios.get('/admin/branches/my-branches')
  },
  create(data) {
    return axios.post('/admin/branches', data)
  },
  update(id, data) {
    return axios.put(`/admin/branches/${id}`, data)
  },
  delete(id) {
    return axios.delete(`/admin/branches/${id}`)
  },
  assignBranches(data) {
    return axios.post('/admin/branches/assign', data)
  },
}