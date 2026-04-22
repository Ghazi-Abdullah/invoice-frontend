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
      if (data && data.data) {
        if (Array.isArray(data.data)) {
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
      if (!Array.isArray(state.invoices)) state.invoices = []
      state.invoices.unshift(invoice)
    },
    UPDATE_INVOICE(state, updatedInvoice) {
      if (Array.isArray(state.invoices)) {
        const index = state.invoices.findIndex(i => i.id === updatedInvoice.id)
        if (index !== -1) state.invoices.splice(index, 1, updatedInvoice)
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
      state.filters = { status: '', date_from: '', date_to: '', search: '' }
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    async createInvoice({ commit, dispatch }, invoiceData) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        console.log('🚀 Creating invoice:', invoiceData)
        const response = await axios.post('/admin/invoices', invoiceData)
        console.log('✅ Invoice created:', response.data)

        let invoice = null
        if (response.data) {
          invoice = response.data.data || response.data
          commit('ADD_INVOICE', invoice)
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في إنشاء الفاتورة: لا توجد بيانات')
          return null
        }

        if (invoiceData.enable_stripe_checkout && invoice && invoice.id) {
          try {
            console.log('🎯 Stripe Checkout enabled, creating payment session for invoice:', invoice.id)
            const paymentResult = await dispatch('payments/createPaymentSession', invoice.id, { root: true })
            if (paymentResult && paymentResult.url) {
              return { invoice, redirectToStripe: true, stripeUrl: paymentResult.url }
            } else {
              console.warn('⚠️ Stripe session created but no URL returned')
              return { invoice, redirectToStripe: false }
            }
          } catch (stripeError) {
            console.error('❌ Failed to create Stripe session:', stripeError)
            commit('SET_ERROR', 'تم إنشاء الفاتورة ولكن حدث خطأ في Stripe: ' + (stripeError.message || ''))
            return { invoice, redirectToStripe: false, stripeError: stripeError.message }
          }
        }
        return { invoice, redirectToStripe: false }
      } catch (error) {
        console.error('❌ Error creating invoice:', error)
        commit('SET_ERROR', error.response?.data?.message || 'فشل في إنشاء الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchInvoices({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const filters = { ...state.filters, ...params }
        const response = await axios.get('/admin/invoices', { params: filters })
        if (response.data) {
          if (response.data.status === true || response.data.success === true) {
            const data = response.data.data || response.data
            commit('SET_INVOICES', data.data ? data : data)
          } else if (response.data.data) {
            commit('SET_INVOICES', response.data)
          } else if (Array.isArray(response.data)) {
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
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'حدث خطأ في جلب بيانات الفواتير'
        commit('SET_ERROR', errorMessage)
        commit('SET_INVOICES', [])
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchInvoice({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await axios.get(`/admin/invoices/${id}`)
        if (response.data) {
          const invoice = response.data.data || response.data
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في تحميل الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateInvoice({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await axios.put(`/admin/invoices/${id}`, data)
        if (response.data) {
          const invoice = response.data.data || response.data
          commit('UPDATE_INVOICE', invoice)
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في تحديث الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحديث الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async deleteInvoice({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        const response = await axios.delete(`/admin/invoices/${id}`)
        if (response.data) {
          commit('DELETE_INVOICE', id)
        } else {
          commit('SET_ERROR', 'فشل في حذف الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في حذف الفاتورة')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateInvoiceStatus({ commit }, { id, status, payment_date = null }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      try {
        let response
        if (status === 'paid') {
          response = await axios.put(`/admin/invoices/${id}/mark-paid`, payment_date ? { payment_date } : {})
        } else if (status === 'sent') {
          response = await axios.post(`/admin/invoices/${id}/send`)
        } else {
          response = await axios.put(`/admin/invoices/${id}`, { status })
        }
        if (response.data) {
          const invoice = response.data.data || response.data
          commit('UPDATE_INVOICE', invoice)
          commit('SET_CURRENT_INVOICE', invoice)
        } else {
          commit('SET_ERROR', 'فشل في تحديث حالة الفاتورة: لا توجد بيانات')
        }
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'فشل في تحديث حالة الفاتورة')
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
