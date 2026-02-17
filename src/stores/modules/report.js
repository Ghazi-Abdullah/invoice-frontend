import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    reports: {
      invoices: { items: [], stats: {}, pagination: {} },
      clients: { items: [], stats: {} },
      revenue: { items: [], stats: {} },
      overdue: { items: [], stats: {} }
    },
    loading: false,
    exportLoading: false,
    error: null,
    filters: {
      start_date: '',
      end_date: '',
      status: '',
      client_id: '',
      user_id: '',
      per_page: 20,
      page: 1
    },
    exportedFiles: [],
    activeTab: 'invoices',
    showExportModal: false,
    showExportedFiles: false,
    clients: []
  }),

  getters: {
    invoicesReport: (state) => state.reports.invoices,
    clientsReport: (state) => state.reports.clients,
    revenueReport: (state) => state.reports.revenue,
    overdueReport: (state) => state.reports.overdue,
    invoiceStats: (state) => state.reports.invoices.stats,
    clientStats: (state) => state.reports.clients.stats,
    revenueStats: (state) => state.reports.revenue.stats,
    overdueStats: (state) => state.reports.overdue.stats,
    isLoading: (state) => state.loading,
    isExporting: (state) => state.exportLoading,
    reportError: (state) => state.error,
    reportFilters: (state) => state.filters,
    exportedFiles: (state) => state.exportedFiles,
    activeTab: (state) => state.activeTab,
    showExportModal: (state) => state.showExportModal,
    showExportedFiles: (state) => state.showExportedFiles,
    clients: (state) => state.clients,
    overdueCount: (state) => state.reports.overdue.stats?.total_overdue || 0
  },

  mutations: {
    SET_ACTIVE_TAB(state, tab) {
      state.activeTab = tab
    },
    SET_SHOW_EXPORT_MODAL(state, value) {
      state.showExportModal = value
    },
    SET_SHOW_EXPORTED_FILES(state, value) {
      state.showExportedFiles = value
    },
    SET_CLIENTS(state, clients) {
      state.clients = clients
    },
    SET_INVOICES_REPORT(state, data) {
      state.reports.invoices = {
        items: data.items || [],
        stats: data.stats || {},
        pagination: data.pagination || {}
      }
    },
    SET_CLIENTS_REPORT(state, data) {
      state.reports.clients = {
        items: data.items || [],
        stats: data.stats || {}
      }
    },
    SET_REVENUE_REPORT(state, data) {
      state.reports.revenue = {
        items: data.items || [],
        stats: data.stats || {}
      }
    },
    SET_OVERDUE_REPORT(state, data) {
      state.reports.overdue = {
        items: data.items || [],
        stats: data.stats || {}
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_EXPORT_LOADING(state, loading) {
      state.exportLoading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    SET_EXPORTED_FILES(state, files) {
      state.exportedFiles = files
    },
    ADD_EXPORTED_FILE(state, file) {
      state.exportedFiles.unshift(file)
    },
    REMOVE_EXPORTED_FILE(state, fileName) {
      state.exportedFiles = state.exportedFiles.filter(file => file.name !== fileName)
    },
    RESET_FILTERS(state) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      state.filters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
        user_id: '',
        per_page: 20,
        page: 1
      }
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    // تحميل العملاء
    async loadClients({ commit }) {
      try {
        const response = await axios.get('/admin/clients', {
          params: { per_page: 100, is_active: true }
        })
        commit('SET_CLIENTS', response.data?.data?.filter(c => c && c.id) || [])
      } catch (error) {
        console.error('Failed to load clients:', error)
        commit('SET_CLIENTS', [])
      }
    },

    // تحميل التقرير حسب التبويب النشط
    async loadReport({ state, commit, dispatch }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        switch (state.activeTab) {
          case 'invoices':
            await dispatch('getInvoicesReport')
            break
          case 'clients':
            await dispatch('getClientsReport')
            break
          case 'revenue':
            await dispatch('getRevenueReport')
            break
          case 'overdue':
            await dispatch('getOverdueReport')
            break
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // تغيير التبويب
    switchTab({ commit, dispatch }, tab) {
      commit('SET_ACTIVE_TAB', tab)
      commit('SET_FILTERS', { page: 1 })
      dispatch('loadReport')
    },

    // تغيير الصفحة
    handlePageChange({ commit, dispatch }, page) {
      commit('SET_FILTERS', { page })
      dispatch('loadReport')
    },

    // إعادة تعيين الفلاتر
    resetFilters({ commit, dispatch }) {
      commit('RESET_FILTERS')
      dispatch('loadReport')
    },

    // تحديث الفلاتر
    updateFilters({ commit, dispatch }, filters) {
      commit('SET_FILTERS', filters)
      dispatch('loadReport')
    },

    // جلب تقرير الفواتير
    async getInvoicesReport({ commit, state }) {
      try {
        const response = await axios.get('/admin/reports/invoices', { params: state.filters })
        if (response.data?.success) {
          commit('SET_INVOICES_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير الفواتير')
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    // جلب تقرير العملاء
    async getClientsReport({ commit, state }) {
      try {
        const response = await axios.get('/admin/reports/clients', { params: state.filters })
        if (response.data?.success) {
          commit('SET_CLIENTS_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير العملاء')
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    // جلب تقرير الإيرادات
    async getRevenueReport({ commit, state }) {
      try {
        const response = await axios.get('/admin/reports/revenue', { params: state.filters })
        if (response.data?.success) {
          commit('SET_REVENUE_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير الإيرادات')
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    // جلب تقرير المتأخرات
    async getOverdueReport({ commit, state }) {
      try {
        const response = await axios.get('/admin/reports/overdue', { params: state.filters })
        if (response.data?.success) {
          commit('SET_OVERDUE_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير المتأخرات')
        }
      } catch (error) {
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    // تصدير التقرير (دالة مشتركة)
    async exportReport({ commit }, { type, download, filters, lang }) {
      commit('SET_EXPORT_LOADING', true)
      try {
        const params = { ...filters, download: download ? '1' : '0', lang }
        const response = await axios.get(`/admin/reports/export/${type}`, {
          params,
          responseType: download ? 'blob' : 'json'
        })

        if (download) {
          // استخراج اسم الملف من الهيدر إذا أمكن
          const contentDisposition = response.headers['content-disposition']
          let filename = `report.${type}.xlsx`
          if (contentDisposition) {
            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
            if (match && match[1]) {
              filename = match[1].replace(/['"]/g, '')
            }
          }
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(url)
          return { success: true }
        } else {
          commit('SET_EXPORTED_FILES', response.data.data)
          return { success: true, data: response.data.data }
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Export failed')
        throw error
      } finally {
        commit('SET_EXPORT_LOADING', false)
      }
    },

    // دالة للتصدير المباشر (تستخدمها المكونات)
    async handleDirectExport({ state, dispatch }, payload) {
      return await dispatch('exportReport', {
        type: state.activeTab,
        download: true,
        filters: state.filters,
        lang: payload?.lang || 'ar'
      })
    },

    // دالة للتصدير إلى الخادم
    async handleServerExport({ state, commit, dispatch }) {
      const result = await dispatch('exportReport', {
        type: state.activeTab,
        download: false,
        filters: state.filters
      })
      if (result?.success) {
        commit('SET_SHOW_EXPORTED_FILES', true)
        await dispatch('getExportedFiles')
      }
      return result
    },

    // جلب الملفات المصدرة
    async getExportedFiles({ commit }) {
      try {
        const response = await axios.get('/admin/reports/exported-files')
        if (response.data?.success) {
          commit('SET_EXPORTED_FILES', response.data.data)
          return response.data.data
        }
        return []
      } catch (error) {
        console.error('Error fetching exported files:', error)
        return []
      }
    },

    // حذف ملف مصدر
    async deleteExportedFile({ commit }, fileName) {
      try {
        const response = await axios.delete('/admin/reports/exported-files/delete', {
          data: { file_name: fileName }
        })
        if (response.data?.success) {
          commit('REMOVE_EXPORTED_FILE', fileName)
          return true
        }
        return false
      } catch (error) {
        console.error('Error deleting exported file:', error)
        throw error
      }
    },

    // إرسال تذكير
    async sendReminder({ dispatch, state }, invoiceId) {
      try {
        const response = await axios.post(`/admin/reports/send-reminder/${invoiceId}`)
        if (response.data.success) {
          await dispatch('getOverdueReport', state.filters)
          return true
        }
        return false
      } catch (error) {
        throw error
      }
    },

    // تعليم الفاتورة كمدفوعة
    async markAsPaid({ dispatch, state }, invoiceId) {
      try {
        const response = await axios.post(`/admin/reports/mark-paid/${invoiceId}`)
        if (response.data.success) {
          setTimeout(async () => {
            await dispatch('getOverdueReport', state.filters)
          }, 1000)
          return true
        }
        return false
      } catch (error) {
        throw error
      }
    },

    // دوال التحكم في النوافذ
    openExportModal({ commit }) {
      commit('SET_SHOW_EXPORT_MODAL', true)
    },
    closeExportModal({ commit }) {
      commit('SET_SHOW_EXPORT_MODAL', false)
    },
    toggleExportedFiles({ commit, state }) {
      commit('SET_SHOW_EXPORTED_FILES', !state.showExportedFiles)
    },

    // دالة التهيئة
    async init({ dispatch }) {
      await dispatch('loadClients')
      await dispatch('getExportedFiles')
      await dispatch('loadReport')
    }
  }
}
