import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    },
    filters: {
      status: '',
      date_from: '',
      date_to: '',
      search: ''
    }
  }),

  getters: {
    invoices: state => state.invoices,
    currentInvoice: state => state.currentInvoice,
    loading: state => state.loading,
    error: state => state.error,
    pagination: state => state.pagination,
    invoiceFilters: state => state.filters,

    invoiceById: (state) => (id) => {
      return state.invoices.find(invoice => Number(invoice.id) === Number(id))
    },

    invoiceStats: (state) => {
      const invoices = state.invoices
      return {
        total: invoices.length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        sent: invoices.filter(inv => inv.status === 'sent').length,
        overdue: invoices.filter(inv => inv.status === 'overdue').length,
        draft: invoices.filter(inv => inv.status === 'draft').length,
        totalAmount: invoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0)
      }
    }
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_INVOICES(state, data) {
      console.log('📊 SET_INVOICES mutation called with:', data)

      // تحسين معالجة البيانات لتناسب هيكل Laravel
      if (data && data.data) {
        // إذا كان الرد يحتوي على pagination من Laravel
        if (Array.isArray(data.data)) {
          // بيانات مع pagination
          state.invoices = data.data
          state.pagination = {
            current_page: data.current_page || 1,
            last_page: data.last_page || 1,
            per_page: data.per_page || 10,
            total: data.total || 0,
            from: data.from || 0,
            to: data.to || 0
          }
        } else {
          // بيانات بدون هيكل محدد
          state.invoices = data.data
          state.pagination = {
            current_page: 1,
            last_page: 1,
            per_page: data.data.length,
            total: data.data.length,
            from: 1,
            to: data.data.length
          }
        }
      } else if (Array.isArray(data)) {
        // بيانات مباشرة كمصفوفة
        state.invoices = data
        state.pagination = {
          current_page: 1,
          last_page: 1,
          per_page: data.length,
          total: data.length,
          from: 1,
          to: data.length
        }
      } else {
        console.warn('⚠️ Unexpected data structure in SET_INVOICES:', data)
        state.invoices = []
        state.pagination = {}
      }

      console.log('✅ Invoices set to:', state.invoices)
      console.log('✅ Pagination set to:', state.pagination)
    },

    SET_CURRENT_INVOICE(state, invoice) {
      state.currentInvoice = invoice
    },

    ADD_INVOICE(state, invoice) {
      if (!Array.isArray(state.invoices)) {
        state.invoices = []
      }
      state.invoices.unshift(invoice)
    },

    UPDATE_INVOICE(state, updatedInvoice) {
      if (Array.isArray(state.invoices)) {
        const index = state.invoices.findIndex(i => i.id === updatedInvoice.id)
        if (index !== -1) {
          state.invoices.splice(index, 1, updatedInvoice)
        }
      }
    },

    DELETE_INVOICE(state, id) {
      if (Array.isArray(state.invoices)) {
        state.invoices = state.invoices.filter(i => i.id !== id)
      }
    },

    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },

    CLEAR_FILTERS(state) {
      state.filters = {
        status: '',
        date_from: '',
        date_to: '',
        search: ''
      }
    },

    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    async fetchInvoices({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
<<<<<<< HEAD
        const response = await axios.get('/admin/invoices', {
          params: {
            page: params.page || 1,
            status: params.status || '',
            client_id: params.client_id || '',
            search: params.search || ''
          }
        })
=======
        const filters = { ...state.filters, ...params }
        console.log('📋 Fetching invoices with params:', filters)
>>>>>>> b6d1335e33cfc3f277e9b11cc891f6f9da45361f

        const response = await axios.get('/admin/invoices', { params: filters })
        console.log('✅ Invoices API Response:', response.data)

        // معالجة الاستجابة بناءً على هيكل Laravel
        if (response.data) {
          if (response.data.status === true || response.data.success === true) {
            // هيكل Laravel مع status/success
            const data = response.data.data || response.data

            // إذا كان data يحتوي على pagination (كما في Laravel Paginator)
            if (data && data.data) {
              commit('SET_INVOICES', data)
            } else {
              commit('SET_INVOICES', data)
            }
          } else if (response.data.data) {
            // إذا كان هناك data مباشرة
            commit('SET_INVOICES', response.data)
          } else if (Array.isArray(response.data)) {
            // إذا كانت الاستجابة مصفوفة مباشرة
            commit('SET_INVOICES', response.data)
          } else {
            console.warn('⚠️ Unknown response structure:', response.data)
            commit('SET_ERROR', 'هيكل البيانات غير متوقع')
            commit('SET_INVOICES', [])
          }
        } else {
          commit('SET_ERROR', 'لا توجد بيانات في الاستجابة')
          commit('SET_INVOICES', [])
        }

        return response.data
      } catch (error) {
        console.error('❌ Error fetching invoices:', error)
        console.error('Error details:', error.response?.data || error.message)

        const errorMessage = error.response?.data?.message ||
                            error.response?.data?.error ||
                            'حدث خطأ في جلب بيانات الفواتير'

        commit('SET_ERROR', errorMessage)
        commit('SET_INVOICES', [])
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchInvoice({ commit }, id) {
<<<<<<< HEAD
      try {
        console.log(`📄 Fetching invoice with ID: ${id}`)
        const response = await axios.get(`/admin/invoices/${id}`)
=======
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
>>>>>>> b6d1335e33cfc3f277e9b11cc891f6f9da45361f

      try {
        console.log(`🚀 Fetching invoice with ID: ${id}`)
        const response = await axios.get(`/admin/invoices/${id}`)
        console.log('✅ Invoice details:', response.data)

        if (response.data) {
          const invoice = response.data.data || response.data
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في تحميل الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        console.error('❌ Error fetching invoice:', error)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createInvoice({ commit }, invoiceData) {
<<<<<<< HEAD
      try {
        console.log('📝 Creating invoice:', invoiceData)
        const response = await axios.post('/admin/invoices', invoiceData)
=======
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
>>>>>>> b6d1335e33cfc3f277e9b11cc891f6f9da45361f

      try {
        console.log('🚀 Creating invoice:', invoiceData)
        const response = await axios.post('/admin/invoices', invoiceData)
        console.log('✅ Invoice created:', response.data)

        if (response.data) {
          const invoice = response.data.data || response.data
          commit('ADD_INVOICE', invoice)
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في إنشاء الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        console.error('❌ Error creating invoice:', error)
        console.error('Error details:', error.response?.data || error.message)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في إنشاء الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateInvoice({ commit }, { id, data }) {
<<<<<<< HEAD
      try {
        console.log('📝 Updating invoice:', { id, data })
        const response = await axios.put(`/admin/invoices/${id}`, data)
=======
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
>>>>>>> b6d1335e33cfc3f277e9b11cc891f6f9da45361f

      try {
        console.log(`🚀 Updating invoice ${id}:`, data)
        const response = await axios.put(`/admin/invoices/${id}`, data)
        console.log('✅ Invoice updated:', response.data)

        if (response.data) {
          const invoice = response.data.data || response.data
          commit('UPDATE_INVOICE', invoice)
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في تحديث الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        console.error('❌ Error updating invoice:', error)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحديث الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteInvoice({ commit }, id) {
<<<<<<< HEAD
      try {
        const response = await axios.delete(`/admin/invoices/${id}`)
=======
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
>>>>>>> b6d1335e33cfc3f277e9b11cc891f6f9da45361f

      try {
        console.log(`🚀 Deleting invoice ${id}`)
        const response = await axios.delete(`/admin/invoices/${id}`)
        console.log('✅ Invoice deleted:', response.data)

        if (response.data) {
          commit('DELETE_INVOICE', id)
        } else {
          commit('SET_ERROR', 'فشل في حذف الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        console.error('❌ Error deleting invoice:', error)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في حذف الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

<<<<<<< HEAD
    async updateInvoiceStatus({ commit, dispatch }, { id, status }) {
      try {
        console.log(`🔄 Updating invoice ${id} status to ${status}`)
        const response = await axios.put(`/admin/invoices/${id}/status`, { status })
=======
    async updateInvoiceStatus({ commit }, { id, status, payment_date = null }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
>>>>>>> b6d1335e33cfc3f277e9b11cc891f6f9da45361f

      try {
        console.log(`🚀 Updating invoice ${id} status to: ${status}`)

        let response
        if (status === 'paid') {
          const data = payment_date ? { payment_date } : {}
          response = await axios.put(`/admin/invoices/${id}/mark-paid`, data)
        } else if (status === 'sent') {
          response = await axios.post(`/admin/invoices/${id}/send`)
        } else {
          response = await axios.put(`/admin/invoices/${id}`, { status })
        }

        console.log('✅ Invoice status updated:', response.data)

        if (response.data) {
          const invoice = response.data.data || response.data
          commit('UPDATE_INVOICE', invoice)
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في تحديث حالة الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        console.error('❌ Error updating invoice status:', error)
        if (error.response?.data?.message) {
          commit('SET_ERROR', error.response.data.message)
        } else {
          commit('SET_ERROR', 'فشل في تحديث حالة الفاتورة')
        }
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    },

    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
