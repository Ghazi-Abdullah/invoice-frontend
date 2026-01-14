import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    reports: {
      invoices: [],
      clients: [],
      revenue: [],
      overdue: []
    },
    reportStats: {
      invoices: {},
      clients: {},
      revenue: {},
      overdue: {}
    },
    loading: false,
    error: null,
    filters: {
      start_date: '',
      end_date: '',
      status: '',
      client_id: ''
    }
  }),

  getters: {
    invoicesReport: (state) => state.reports.invoices,
    clientsReport: (state) => state.reports.clients,
    revenueReport: (state) => state.reports.revenue,
    overdueReport: (state) => state.reports.overdue,

    invoiceStats: (state) => state.reportStats.invoices,
    clientStats: (state) => state.reportStats.clients,
    revenueStats: (state) => state.reportStats.revenue,
    overdueStats: (state) => state.reportStats.overdue,

    isLoading: (state) => state.loading,
    reportError: (state) => state.error,
    reportFilters: (state) => state.filters,
    overdueCount: (state) => state.reportStats.overdue.total_overdue || 0
  },

  mutations: {
    SET_INVOICES_REPORT(state, response) {
      if (response && response.success && response.data) {
        state.reports.invoices = response.data.data || []
        state.reportStats.invoices = response.data.stats || {}
      } else {
        state.reports.invoices = []
        state.reportStats.invoices = {}
      }
    },

    SET_CLIENTS_REPORT(state, response) {
      if (response && response.success && response.data) {
        state.reports.clients = response.data.data || []
        state.reportStats.clients = response.data.stats || {}
      } else {
        state.reports.clients = []
        state.reportStats.clients = {}
      }
    },

    SET_REVENUE_REPORT(state, response) {
      if (response && response.success && response.data) {
        state.reports.revenue = response.data.data || []
        state.reportStats.revenue = response.data.stats || {}
      } else {
        state.reports.revenue = []
        state.reportStats.revenue = {}
      }
    },

    SET_OVERDUE_REPORT(state, response) {
      if (response && response.success && response.data) {
        state.reports.overdue = response.data.data || []
        state.reportStats.overdue = response.data.stats || {}
      } else {
        state.reports.overdue = []
        state.reportStats.overdue = {}
      }
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },

    RESET_FILTERS(state) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      state.filters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: ''
      }
    },

    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    async getInvoicesReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        const response = await axios.get('/admin/reports/invoices', { params })
        console.log('✅ Invoices Report API Response:', response.data)

        if (response.data) {
          commit('SET_INVOICES_REPORT', response.data)
          return response.data
        } else {
          console.error('❌ API response empty')
          commit('SET_INVOICES_REPORT', { data: [] })
          throw new Error('No data received from API')
        }
      } catch (error) {
        console.error('❌ Error fetching invoices report:', error)
        commit('SET_INVOICES_REPORT', { data: [] })
        let errorMessage = 'فشل في تحميل تقرير الفواتير'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getClientsReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        const response = await axios.get('/admin/reports/clients', { params })
        console.log('✅ Clients Report API Response:', response.data)

        if (response.data) {
          commit('SET_CLIENTS_REPORT', response.data)
          return response.data
        } else {
          console.error('❌ API response empty')
          commit('SET_CLIENTS_REPORT', { data: [] })
          throw new Error('No data received from API')
        }
      } catch (error) {
        console.error('❌ Error fetching clients report:', error)
        commit('SET_CLIENTS_REPORT', { data: [] })
        let errorMessage = 'فشل في تحميل تقرير العملاء'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getRevenueReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        const response = await axios.get('/admin/reports/revenue', { params })
        console.log('✅ Revenue Report API Response:', response.data)

        if (response.data) {
          commit('SET_REVENUE_REPORT', response.data)
          return response.data
        } else {
          console.error('❌ API response empty')
          commit('SET_REVENUE_REPORT', { data: [] })
          throw new Error('No data received from API')
        }
      } catch (error) {
        console.error('❌ Error fetching revenue report:', error)
        commit('SET_REVENUE_REPORT', { data: [] })
        let errorMessage = 'فشل في تحميل تقرير الإيرادات'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getOverdueReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        const response = await axios.get('/admin/reports/overdue', { params })
        console.log('✅ Overdue Report API Response:', response.data)

        if (response.data) {
          commit('SET_OVERDUE_REPORT', response.data)
          return response.data
        } else {
          console.error('❌ API response empty')
          commit('SET_OVERDUE_REPORT', { data: [] })
          throw new Error('No data received from API')
        }
      } catch (error) {
        console.error('❌ Error fetching overdue report:', error)
        commit('SET_OVERDUE_REPORT', { data: [] })
        let errorMessage = 'فشل في تحميل تقرير المتأخرات'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async exportReport({ state }, type) {
      try {
        const response = await axios.get(`/admin/reports/export/${type}`, {
          params: state.filters,
          responseType: 'blob'
        })

        // إنشاء رابط تنزيل
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url

        // استخراج اسم الملف
        const contentDisposition = response.headers['content-disposition']
        let fileName = `report_${type}_${new Date().toISOString().split('T')[0]}.xlsx`

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/)
          if (fileNameMatch && fileNameMatch.length === 2) {
            fileName = fileNameMatch[1]
          }
        }

        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        return { success: true, fileName }
      } catch (error) {
        console.error('❌ Error exporting report:', error)
        throw new Error(error.response?.data?.message || 'فشل في تصدير التقرير')
      }
    },

    async sendReminder({ commit }, invoiceId) {
      commit('SET_LOADING', true)

      try {
        console.log(`🚀 Sending reminder for invoice: ${invoiceId}`)
        const response = await axios.post(`/admin/reports/send-reminder/${invoiceId}`)
        console.log('✅ Reminder sent:', response.data)
        return response.data
      } catch (error) {
        console.error('❌ Error sending reminder:', error)
        throw new Error(error.response?.data?.message || 'فشل في إرسال التذكير')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async markAsPaid({ commit, dispatch }, invoiceId) {
      commit('SET_LOADING', true)

      try {
        console.log(`🚀 Marking invoice as paid: ${invoiceId}`)
        const response = await axios.post(`/admin/reports/mark-paid/${invoiceId}`)
        console.log('✅ Invoice marked as paid:', response.data)

        // تحديث تقرير المتأخرات بعد ثانية
        setTimeout(() => {
          dispatch('getOverdueReport')
        }, 1000)

        return response.data
      } catch (error) {
        console.error('❌ Error marking invoice as paid:', error)
        throw new Error(error.response?.data?.message || 'فشل في تسديد الفاتورة')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    resetFilters({ commit }) {
      commit('RESET_FILTERS')
    },

    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
