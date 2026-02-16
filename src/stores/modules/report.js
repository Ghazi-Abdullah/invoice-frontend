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
    exportedFiles: []
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

    overdueCount: (state) => state.reports.overdue.stats?.total_overdue || 0
  },

  mutations: {
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
    async getInvoicesReport({ commit, state }, data = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      const params = { ...state.filters, ...data }

      try {
        console.log('📤 Fetching invoices report...')
        const response = await axios.get('/admin/reports/invoices', { params })

        console.log('✅ Invoices report response:', response.data)

        if (response.data && response.data.success) {
          commit('SET_INVOICES_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير الفواتير')
        }
      } catch (error) {
        console.error('❌ Error fetching invoices report:', error)
        const errorMessage = error.response?.data?.message || error.message || 'فشل في تحميل تقرير الفواتير'
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
        console.log('📤 Fetching clients report...')
        const response = await axios.get('/admin/reports/clients', { params })

        console.log('✅ Clients report response:', response.data)

        if (response.data && response.data.success) {
          commit('SET_CLIENTS_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير العملاء')
        }
      } catch (error) {
        console.error('❌ Error fetching clients report:', error)
        const errorMessage = error.response?.data?.message || error.message || 'فشل في تحميل تقرير العملاء'
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
        console.log('📤 Fetching revenue report...')
        const response = await axios.get('/admin/reports/revenue', { params })

        console.log('✅ Revenue report response:', response.data)

        if (response.data && response.data.success) {
          commit('SET_REVENUE_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير الإيرادات')
        }
      } catch (error) {
        console.error('❌ Error fetching revenue report:', error)
        const errorMessage = error.response?.data?.message || error.message || 'فشل في تحميل تقرير الإيرادات'
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
        console.log('📤 Fetching overdue report...')
        const response = await axios.get('/admin/reports/overdue', { params })

        console.log('✅ Overdue report response:', response.data)

        if (response.data && response.data.success) {
          commit('SET_OVERDUE_REPORT', response.data.data)
          return response.data
        } else {
          throw new Error(response.data?.message || 'فشل في تحميل تقرير المتأخرات')
        }
      } catch (error) {
        console.error('❌ Error fetching overdue report:', error)
        const errorMessage = error.response?.data?.message || error.message || 'فشل في تحميل تقرير المتأخرات'
        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async exportReport({ commit, state, dispatch }, { type, download = false }) {
      commit('SET_EXPORT_LOADING', true)
      commit('CLEAR_ERROR')

      const params = {
        ...state.filters,
        download: download ? '1' : '0'
      }

      try {
        const endpoint = `/admin/reports/export/${type}`
        console.log(`📤 Exporting ${type} report...`, { endpoint, params })

        if (download) {
          // تحميل مباشر
          const response = await axios.get(endpoint, {
            params,
            responseType: 'blob'
          })

          // إنشاء رابط تحميل
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url

          // استخراج اسم الملف
          const contentDisposition = response.headers['content-disposition']
          let fileName = `${type}_report_${new Date().toISOString().split('T')[0]}.xlsx`

          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename\*?=["']?(?:UTF-\d["']*)?([^;\r\n"]*)["']?;?/i)
            if (fileNameMatch && fileNameMatch[1]) {
              fileName = decodeURI(fileNameMatch[1])
            } else {
              const fileNameMatch2 = contentDisposition.match(/filename=["']?([^"]+)["']?/i)
              if (fileNameMatch2 && fileNameMatch2[1]) {
                fileName = fileNameMatch2[1]
              }
            }
          }

          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          link.remove()
          window.URL.revokeObjectURL(url)

          return { success: true, fileName, directDownload: true }
        } else {
          // حفظ في الخادم
          const response = await axios.get(endpoint, { params })

          if (response.data && response.data.success) {
            // جلب الملفات المحدثة
            await dispatch('getExportedFiles')
            return response.data
          } else {
            throw new Error(response.data?.message || 'فشل في تصدير التقرير')
          }
        }
      } catch (error) {
        console.error(`❌ Error exporting ${type} report:`, error)

        let errorMessage = 'فشل في تصدير التقرير'
        if (error.response) {
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message
          } else if (error.response.status === 413) {
            errorMessage = 'حجم البيانات كبير جداً، حاول تطبيق المزيد من الفلاتر'
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        commit('SET_ERROR', errorMessage)
        throw new Error(errorMessage)
      } finally {
        commit('SET_EXPORT_LOADING', false)
      }
    },

    async getExportedFiles({ commit }) {
      try {
        console.log('📤 Fetching exported files...')
        const response = await axios.get('/admin/reports/exported-files')

        console.log('✅ Exported files response:', response.data)

        if (response.data && response.data.success) {
          commit('SET_EXPORTED_FILES', response.data.data)
          return response.data.data
        }

        return []
      } catch (error) {
        console.error('❌ Error fetching exported files:', error)
        return []
      }
    },

    async deleteExportedFile({ commit }, fileName) {
      try {
        const response = await axios.delete('/admin/reports/exported-files/delete', {
          data: { file_name: fileName }
        })

        if (response.data && response.data.success) {
          commit('REMOVE_EXPORTED_FILE', fileName)
          return true
        }

        return false
      } catch (error) {
        console.error('❌ Error deleting exported file:', error)
        throw error
      }
    },

    async updateFilters({ commit }, filters) {
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
