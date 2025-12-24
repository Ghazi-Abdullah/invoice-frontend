import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    invoices: [],
    currentInvoice: null,
    loading: false,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      from: 0,
      to: 0
    }
  }),

  getters: {
    invoices: state => {
      return Array.isArray(state.invoices) ? state.invoices : []
    },
    currentInvoice: state => state.currentInvoice,
    loading: state => state.loading,
    pagination: state => state.pagination,

    invoiceById: (state) => (id) => {
      if (!Array.isArray(state.invoices)) return null
      return state.invoices.find(invoice => Number(invoice.id) === Number(id))
    }
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_INVOICES(state, response) {
      console.log('📊 SET_INVOICES mutation called with:', response)

      if (response && response.data) {
        // إذا كان الرد يحتوي على pagination
        if (response.data.data) {
          // بيانات مع pagination
          state.invoices = response.data.data || []
          state.pagination = {
            current_page: response.data.current_page || 1,
            last_page: response.data.last_page || 1,
            per_page: response.data.per_page || 10,
            total: response.data.total || 0,
            from: response.data.from || 0,
            to: response.data.to || 0
          }
        } else {
          // بيانات بدون هيكل محدد
          state.invoices = response.data.invoices || response.data || []
          state.pagination = {}
        }
      } else {
        // افتراضياً، مصفوفة فارغة
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
    }
  },

  actions: {
    async fetchInvoices({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      console.log('📋 Fetching invoices with params:', params)

      try {
        const response = await axios.get('/admin/invoices', {
          params: {
            page: params.page || state.pagination.current_page || 1,
            per_page: params.per_page || state.pagination.per_page || 10,
            search: params.search || '',
            status: params.status || '',
            date_from: params.date_from || '',
            date_to: params.date_to || '',
            ...params
          }
        })

        console.log('✅ Invoices API Response:', response.data)

        if (response.data) {
          commit('SET_INVOICES', response.data)
          return response.data
        } else {
          console.error('❌ API response empty')
          commit('SET_INVOICES', { data: [] })
          throw new Error('No data received from API')
        }
      } catch (error) {
        console.error('❌ Error fetching invoices:', error)
        commit('SET_INVOICES', { data: [] })

        let errorMessage = 'حدث خطأ في جلب بيانات الفواتير'
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        throw new Error(errorMessage)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchInvoice({ commit }, id) {
      try {
        console.log(`🚀 Fetching invoice with ID: ${id}`)
        const response = await axios.get(`/admin/invoices/${id}`)
        console.log('✅ Invoice details:', response.data)

        const invoice = response.data.data || response.data
        commit('SET_CURRENT_INVOICE', invoice)
        return invoice
      } catch (error) {
        console.error('❌ Error fetching invoice:', error)
        throw error
      }
    },

    async createInvoice({ commit }, invoiceData) {
      try {
        console.log('🚀 Creating invoice:', invoiceData)
        const response = await axios.post('/admin/invoices', invoiceData)
        console.log('✅ Invoice created:', response.data)

        const invoice = response.data.data || response.data
        commit('ADD_INVOICE', invoice)
        return invoice
      } catch (error) {
        console.error('❌ Error creating invoice:', error)
        console.error('❌ Error details:', error.response?.data || error.message)
        throw error
      }
    },

    async updateInvoice({ commit }, { id, data }) {
      try {
        console.log(`🚀 Updating invoice ${id}:`, data)
        const response = await axios.put(`/admin/invoices/${id}`, data)
        console.log('✅ Invoice updated:', response.data)

        const updatedInvoice = response.data.data || response.data
        commit('UPDATE_INVOICE', updatedInvoice)
        return updatedInvoice
      } catch (error) {
        console.error('❌ Error updating invoice:', error)
        throw error
      }
    },

    async deleteInvoice({ commit }, id) {
      try {
        console.log(`🚀 Deleting invoice ${id}`)
        await axios.delete(`/admin/invoices/${id}`)
        console.log('✅ Invoice deleted')
        commit('DELETE_INVOICE', id)
        return true
      } catch (error) {
        console.error('❌ Error deleting invoice:', error)
        throw error
      }
    },

    async updateInvoiceStatus({ commit }, { id, status }) {
      try {
        console.log(`🚀 Updating invoice ${id} status to: ${status}`)

        let response;
        if (status === 'paid') {
          response = await axios.put(`/admin/invoices/${id}/mark-paid`)
        } else if (status === 'sent') {
          response = await axios.post(`/admin/invoices/${id}/send`)
        } else {
          response = await axios.put(`/admin/invoices/${id}`, { status })
        }

        console.log('✅ Invoice status updated:', response.data)

        const updatedInvoice = response.data.data || response.data
        commit('UPDATE_INVOICE', updatedInvoice)
        return updatedInvoice
      } catch (error) {
        console.error('❌ Error updating invoice status:', error)
        throw error
      }
    }
  }
}
