import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
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
  },

  getters: {
    invoices: state => {
      if (state.invoices && state.invoices.data) {
        return state.invoices.data
      }
      return Array.isArray(state.invoices) ? state.invoices : []
    },
    currentInvoice: state => state.currentInvoice,
    loading: state => state.loading,
    pagination: state => state.pagination
  },

  mutations: {
    SET_INVOICES(state, responseData) {
      console.log('🧾 Setting invoices in Vuex:', responseData)

      if (responseData && responseData.data) {
        state.invoices = responseData.data
        if (responseData.current_page) {
          state.pagination = {
            current_page: responseData.current_page,
            last_page: responseData.last_page,
            per_page: responseData.per_page,
            total: responseData.total,
            from: responseData.from,
            to: responseData.to
          }
        }
      } else if (responseData && Array.isArray(responseData)) {
        state.invoices = responseData
        state.pagination = {
          current_page: 1,
          last_page: 1,
          per_page: responseData.length,
          total: responseData.length,
          from: 1,
          to: responseData.length
        }
      } else {
        state.invoices = []
        state.pagination = { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 }
      }
    },

    SET_CURRENT_INVOICE(state, invoice) {
      state.currentInvoice = invoice
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    ADD_INVOICE(state, invoice) {
      if (!Array.isArray(state.invoices)) {
        state.invoices = []
      }
      state.invoices.unshift(invoice)
    },

    UPDATE_INVOICE(state, updatedInvoice) {
      const index = state.invoices.findIndex(i => i.id === updatedInvoice.id)
      if (index !== -1) {
        state.invoices.splice(index, 1, updatedInvoice)
      }
    },

    DELETE_INVOICE(state, id) {
      state.invoices = state.invoices.filter(i => i.id !== id)
    }
  },

  actions: {
    async fetchInvoices({ commit }, params = {}) {
      commit('SET_LOADING', true)
      console.log('🚀 Fetching invoices with params:', params)

      try {
        const response = await axios.get('/api/invoices', {
          params: {
            page: params.page || 1,
            status: params.status || '',
            client_id: params.client_id || '',
            search: params.search || ''
          }
        })

        console.log('✅ Invoices API Response:', response.data)

        if (response.data.status) {
          commit('SET_INVOICES', response.data.data)
          return response.data.data
        } else {
          console.error('❌ API response not successful:', response.data.message)
          commit('SET_INVOICES', [])
          throw new Error(response.data.message)
        }
      } catch (error) {
        console.error('❌ Error fetching invoices:', error)
        commit('SET_INVOICES', [])
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchInvoice({ commit }, id) {
      try {
        console.log(`📄 Fetching invoice with ID: ${id}`)
        const response = await axios.get(`/api/invoices/${id}`)

        if (response.data.status) {
          commit('SET_CURRENT_INVOICE', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to fetch invoice')
        }
      } catch (error) {
        console.error('❌ Error fetching invoice:', error)
        throw error
      }
    },

    async createInvoice({ commit }, invoiceData) {
      try {
        console.log('📝 Creating invoice:', invoiceData)
        const response = await axios.post('/api/invoices', invoiceData)

        if (response.data.status) {
          commit('ADD_INVOICE', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to create invoice')
        }
      } catch (error) {
        console.error('❌ Error creating invoice:', error)

        // إعادة الخطأ بالتفاصيل للـ component
        if (error.response && error.response.data) {
          throw error.response.data
        }
        throw error
      }
    },

    async updateInvoice({ commit }, { id, data }) {
      try {
        console.log('📝 Updating invoice:', { id, data })
        const response = await axios.put(`/api/invoices/${id}`, data)

        if (response.data.status) {
          commit('UPDATE_INVOICE', response.data.data)
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update invoice')
        }
      } catch (error) {
        console.error('❌ Error updating invoice:', error)

        if (error.response && error.response.data) {
          throw error.response.data
        }
        throw error
      }
    },

    async deleteInvoice({ commit }, id) {
      try {
        const response = await axios.delete(`/api/invoices/${id}`)

        if (response.data.status) {
          commit('DELETE_INVOICE', id)
          return true
        } else {
          throw new Error(response.data.message || 'Failed to delete invoice')
        }
      } catch (error) {
        console.error('❌ Error deleting invoice:', error)
        throw error
      }
    },

    async updateInvoiceStatus({ commit, dispatch }, { id, status }) {
      try {
        console.log(`🔄 Updating invoice ${id} status to ${status}`)
        const response = await axios.put(`/api/invoices/${id}/status`, { status })

        if (response.data.status) {
          // إعادة تحميل الفاتورة الحالية
          await dispatch('fetchInvoice', id)
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update invoice status')
        }
      } catch (error) {
        console.error('❌ Error updating invoice status:', error)
        throw error
      }
    }
  }
}
