import ReportApi from '@/api/report'

export default {
  namespaced: true,

  state: {
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
  },

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
    SET_INVOICES_REPORT(state, data) {
      state.reports.invoices = data.data || []
      state.reportStats.invoices = data.stats || {}
    },

    SET_CLIENTS_REPORT(state, data) {
      state.reports.clients = data.data || []
      state.reportStats.clients = data.stats || {}
    },

    SET_REVENUE_REPORT(state, data) {
      state.reports.revenue = data.data || []
      state.reportStats.revenue = data.stats || {}
    },

    SET_OVERDUE_REPORT(state, data) {
      state.reports.overdue = data.data || []
      state.reportStats.overdue = data.stats || {}
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
<<<<<<< HEAD
        let endpoint
        switch (reportType) {
          case 'invoices':
            endpoint = '/admin/reports/invoices'
            break
          case 'clients':
            endpoint = '/admin/reports/invoices/clients'
            break
          case 'revenue':
            endpoint = '/admin/reports/invoices/revenue'
            break
          case 'overdue':
            endpoint = '/admin/reports/invoices/overdue'
            break
          default:
            throw new Error('نوع التقرير غير معروف')
        }

        console.log('📡 جلب التقرير:', endpoint, 'مع الفلاتر:', filters)

        const response = await axios.get(endpoint, { params: filters })

=======
        const response = await ReportApi.getInvoiceReport(params)
>>>>>>> b6d1335e33cfc3f277e9b11cc891f6f9da45361f
        if (response.data.success) {
          commit('SET_INVOICES_REPORT', response.data.data)
        } else {
          commit('SET_ERROR', response.data.message || 'فشل في تحميل تقرير الفواتير')
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل تقرير الفواتير')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getClientsReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        const response = await ReportApi.getClientReport(params)
        if (response.data.success) {
          commit('SET_CLIENTS_REPORT', response.data.data)
        } else {
          commit('SET_ERROR', response.data.message || 'فشل في تحميل تقرير العملاء')
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل تقرير العملاء')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getRevenueReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        const response = await ReportApi.getRevenueReport(params)
        if (response.data.success) {
          commit('SET_REVENUE_REPORT', response.data.data)
        } else {
          commit('SET_ERROR', response.data.message || 'فشل في تحميل تقرير الإيرادات')
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل تقرير الإيرادات')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getOverdueReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        const response = await ReportApi.getOverdueReport(params)
        if (response.data.success) {
          commit('SET_OVERDUE_REPORT', response.data.data)
        } else {
          commit('SET_ERROR', response.data.message || 'فشل في تحميل تقرير المتأخرات')
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل تقرير المتأخرات')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async exportReport({ state }, type) {
      try {
        const response = await ReportApi.exportReport(type, state.filters)

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
        throw new Error(error.response?.data?.message || 'فشل في تصدير التقرير')
      }
    },

    async sendReminder({ commit }, invoiceId) {
      commit('SET_LOADING', true)

      try {
        const response = await ReportApi.sendReminder(invoiceId)
        return response.data
      } catch (error) {
        throw new Error(error.response?.data?.message || 'فشل في إرسال التذكير')
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async markAsPaid({ commit, dispatch }, invoiceId) {
      commit('SET_LOADING', true)

      try {
        const response = await ReportApi.markAsPaid(invoiceId)

        // تحديث تقرير المتأخرات بعد ثانية
        setTimeout(() => {
          dispatch('getOverdueReport')
        }, 1000)

        return response.data
      } catch (error) {
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
