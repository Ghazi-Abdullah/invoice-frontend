import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    reports: {
      invoices: null,
      clients: null,
      revenue: null,
      overdue: null,
    },
    loading: false,
    error: null,
  }),

  mutations: {
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
  },

  actions: {
    async fetchReport({ commit }, { reportType, filters = {} }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        let endpoint
        switch (reportType) {
          case 'invoices':
            endpoint = '/api/reports/invoices'
            break
          case 'clients':
            endpoint = '/api/reports/invoices/clients'
            break
          case 'revenue':
            endpoint = '/api/reports/invoices/revenue'
            break
          case 'overdue':
            endpoint = '/api/reports/invoices/overdue'
            break
          default:
            throw new Error('نوع التقرير غير معروف')
        }

        console.log('📡 جلب التقرير:', endpoint, 'مع الفلاتر:', filters)

        const response = await axios.get(endpoint, { params: filters })

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
        console.error('❌ خطأ في جلب التقرير:', errorMsg)
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
  },

  getters: {
    reportData: (state) => (reportType) => {
      return state.reports[reportType]
    },
    isLoading: (state) => state.loading,
    reportError: (state) => state.error,
    invoicesReport: (state) => state.reports.invoices,
    clientsReport: (state) => state.reports.clients,
    revenueReport: (state) => state.reports.revenue,
    overdueReport: (state) => state.reports.overdue,
  },
}
