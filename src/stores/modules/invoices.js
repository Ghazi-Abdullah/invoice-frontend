import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

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

    invoiceById: state => id => {
      return state.invoices.find(invoice => Number(invoice.id) === Number(id)) || null
    },

    invoiceStats: state => {
      const invoices = state.invoices || []
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

    CLEAR_ERROR(state) {
      state.error = null
    },

    SET_INVOICES(state, data) {
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
        }
      } else if (Array.isArray(data)) {
        state.invoices = data
      } else {
        state.invoices = []
      }
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
    }
  },

  actions: {
    // جلب الفواتير مع التصفية والترقيم
    async fetchInvoices({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const filters = { ...state.filters, ...params }
        const response = await axios.get('/admin/invoices', { params: filters })
        const data = response.data.data || response.data
        commit('SET_INVOICES', data)
        return response.data
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('invoices.fetch_failed')
        commit('SET_ERROR', message)
        commit('SET_INVOICES', [])
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // جلب فاتورة واحدة
    async fetchInvoice({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.get(`/admin/invoices/${id}`)
        const invoice = response.data.data || response.data
        commit('SET_CURRENT_INVOICE', invoice)
        return invoice
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('invoices.fetch_one_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // إنشاء فاتورة جديدة
    async createInvoice({ commit, dispatch }, invoiceData) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.post('/admin/invoices', invoiceData)
        const invoice = response.data.data || response.data

        commit('ADD_INVOICE', invoice)
        commit('SET_CURRENT_INVOICE', invoice)

        // معالجة Stripe Checkout إذا كان مفعلاً
        if (invoiceData.enable_stripe_checkout && invoice?.id) {
          try {
            const paymentResult = await dispatch('payments/createPaymentSession', invoice.id, { root: true })
            if (paymentResult?.url) {
              return { invoice, redirectToStripe: true, stripeUrl: paymentResult.url }
            }
          } catch (stripeError) {
            console.warn('Stripe session creation failed:', stripeError)
            return { invoice, redirectToStripe: false, stripeError: stripeError.message }
          }
        }

        return { invoice, redirectToStripe: false }
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('invoices.create_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحديث فاتورة
    async updateInvoice({ commit }, { id, data }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const response = await axios.put(`/admin/invoices/${id}`, data)
        const invoice = response.data.data || response.data
        commit('UPDATE_INVOICE', invoice)
        commit('SET_CURRENT_INVOICE', invoice)
        return invoice
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('invoices.update_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // حذف فاتورة
    async deleteInvoice({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        await axios.delete(`/admin/invoices/${id}`)
        commit('DELETE_INVOICE', id)
        return true
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('invoices.delete_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحديث حالة الفاتورة
    async updateInvoiceStatus({ commit }, { id, status, payment_date = null }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        let response
        if (status === 'paid') {
          response = await axios.put(`/admin/invoices/${id}/mark-paid`, payment_date ? { payment_date } : {})
        } else if (status === 'sent') {
          response = await axios.post(`/admin/invoices/${id}/send`)
        } else {
          response = await axios.put(`/admin/invoices/${id}`, { status })
        }

        const invoice = response.data.data || response.data
        commit('UPDATE_INVOICE', invoice)
        commit('SET_CURRENT_INVOICE', invoice)
        return invoice
      } catch (error) {
        const message = error.response?.data?.message || i18n.t('invoices.status_update_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحديث المرشحات
    updateFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    // مسح المرشحات
    clearFilters({ commit }) {
      commit('CLEAR_FILTERS')
    },

    // مسح الخطأ
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  }
}
