import axios from './axios'

export default {
  // Get dashboard statistics
  getStats() {
    return axios.get('/admin/dashboard/stats')
  },

  // Get recent data
  getRecent() {
    return axios.get('/admin/dashboard/recent')
  },

  // Get charts data
  getCharts(params = {}) {
    return axios.get('/admin/dashboard/charts', { params })
  },

  // Get performance overview
  getOverview() {
    return axios.get('/admin/dashboard/overview')
  },

  // Export dashboard data
  exportData(format = 'excel') {
    return axios.get(`/admin/dashboard/export?format=${format}`, {
      responseType: 'blob'
    })
  }
}
