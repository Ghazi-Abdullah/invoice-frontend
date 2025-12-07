import api from '@/api/axios'

const state = {
  reports: {
    invoices: null,
    clients: null,
    revenue: null,
    overdue: null,
  },
  loading: false,
  error: null,
}

const mutations = {
  SET_REPORT_DATA(state, { reportType, data }) {
    state.reports[reportType] = data
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  },
}

const actions = {
  async fetchReport({ commit }, { reportType, filters = {} }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      // إزالة /api من البداية لأن axios يضيفها تلقائياً
      let endpoint
      switch (reportType) {
        case 'invoices':
          endpoint = 'reports/invoices'
          break
        case 'clients':
          endpoint = 'reports/invoices/clients'
          break
        case 'revenue':
          endpoint = 'reports/invoices/revenue'
          break
        case 'overdue':
          endpoint = 'reports/invoices/overdue'
          break
        default:
          throw new Error('نوع التقرير غير معروف')
      }

      console.log('📡 Fetching report:', endpoint, 'with filters:', filters)

      const response = await api.get(endpoint, { params: filters })
      console.log('📦 API Response:', response.data)

      if (response.data.success) {
        const reportData = {
          ...response.data.data,
          stats: response.data.data.stats || {
            total_invoices: response.data.data.total_invoices || 0,
            total_amount: response.data.data.total_amount || 0,
            total_paid: response.data.data.total_paid || 0,
            total_due: response.data.data.total_due || 0,
            total_clients: response.data.data.total_clients || 0,
          }
        }

        commit('SET_REPORT_DATA', { reportType, data: reportData })
        return reportData
      } else {
        throw new Error(response.data.message || 'فشل في جلب بيانات التقرير')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      console.error('❌ Error fetching report:', errorMsg)
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async exportReportFile({ commit }, { reportType, format, filters = {} }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const endpoint = `reports/invoices/export/${reportType}/${format}`
      console.log('📤 Exporting:', endpoint, 'format:', format)

      const response = await api.get(endpoint, {
        responseType: 'blob',
        params: filters
      })

      // تحميل الملف
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      const timestamp = new Date().toISOString().split('T')[0]
      link.href = url
      link.download = `${reportType}_report_${timestamp}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      console.error('❌ Export error:', errorMsg)
      commit('SET_ERROR', errorMsg)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  clearReport({ commit }, reportType) {
    commit('SET_REPORT_DATA', { reportType, data: null })
    commit('CLEAR_ERROR')
  },
}

const getters = {
  reportData: (state) => (reportType) => {
    return state.reports[reportType]
  },
  isLoading: (state) => state.loading,
  reportError: (state) => state.error,
  invoicesReport: (state) => state.reports.invoices,
  clientsReport: (state) => state.reports.clients,
  revenueReport: (state) => state.reports.revenue,
  overdueReport: (state) => state.reports.overdue,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
