import api from '@/api/axios'

const state = {
  reports: {
    invoices: null,
    clients: null,
    sales: null,
    revenue: null,
    overdue: null,
    dashboard: null,
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
      let endpoint
      switch (reportType) {
        case 'invoices':
          endpoint = '/reports/invoices'
          break
        case 'clients':
          endpoint = '/reports/clients'
          break
        case 'sales':
          endpoint = '/reports/sales'
          break
        case 'revenue':
          endpoint = '/reports/revenue'
          break
        case 'overdue':
          endpoint = '/reports/overdue-invoices'
          break
        case 'dashboard':
          endpoint = '/dashboard/stats'
          break
        default:
          throw new Error('نوع التقرير غير معروف')
      }

      const response = await api.get(endpoint, { params: filters })

      if (response.data.success) {
        commit('SET_REPORT_DATA', { reportType, data: response.data.data })
      } else {
        throw new Error(response.data.message || 'فشل في جلب بيانات التقرير')
      }

      return response.data.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async exportReport({ commit }, { reportType, format, data }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const endpoint = `/reports/export/${format}`
      const response = await api.post(endpoint, {
        report_type: reportType,
        data: data,
      })

      if (response.data.success) {
        // تحميل الملف
        const link = document.createElement('a')
        link.href = response.data.download_url
        link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        throw new Error(response.data.message || 'فشل في تصدير التقرير')
      }

      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message)
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
  error: (state) => state.error,
  dashboardStats: (state) => state.reports.dashboard,
  invoicesReport: (state) => state.reports.invoices,
  clientsReport: (state) => state.reports.clients,
  salesReport: (state) => state.reports.sales,
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
