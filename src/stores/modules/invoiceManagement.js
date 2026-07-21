// src/stores/modules/invoiceManagement.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: {
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
    filters: {
      status: '',
      date: '',
      search: ''
    },
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    stats: {
      total: 0,
      paid: 0,
      sent: 0,
      overdue: 0
    },
    invoiceForm: {
      client_id: '',
      invoice_number: '',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          description: '',
          quantity: 1,
          unit_price: 0,
          tax_rate: 15,
          total: 0
        }
      ],
      notes: '',
      terms: '',
      status: 'draft'
    },
    formErrors: {}
  },

  getters: {
    invoices: state => state.invoices,
    currentInvoice: state => state.currentInvoice,
    loading: state => state.loading,
    error: state => state.error,
    filters: state => state.filters,
    pagination: state => state.pagination,
    stats: state => state.stats,
    invoiceForm: state => state.invoiceForm,
    formErrors: state => state.formErrors,

    hasInvoices: state => state.invoices && state.invoices.length > 0,

    invoiceSummary: state => {
      const items = state.invoiceForm.items || []
      const subtotal = items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0
        const price = parseFloat(item.unit_price) || 0
        return sum + (qty * price)
      }, 0)

      const tax = items.reduce((sum, item) => {
        const qty = parseFloat(item.quantity) || 0
        const price = parseFloat(item.unit_price) || 0
        const rate = parseFloat(item.tax_rate) || 0
        return sum + (qty * price * (rate / 100))
      }, 0)

      const total = subtotal + tax

      return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        itemsCount: items.length,
        averageTax: items.length > 0
          ? (items.reduce((sum, item) => sum + (parseFloat(item.tax_rate) || 0), 0) / items.length).toFixed(2)
          : '0.00'
      }
    },

    hasIncompleteItems: state => {
      return state.invoiceForm.items.some(
        item => !item.description || item.quantity <= 0 || item.unit_price < 0
      )
    }
  },

  mutations: {
    SET_INVOICES(state, { data, pagination }) {
      state.invoices = data
      if (pagination) {
        state.pagination = { ...state.pagination, ...pagination }
      }
    },

    SET_CURRENT_INVOICE(state, invoice) {
      state.currentInvoice = invoice
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

    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },

    SET_STATS(state, stats) {
      state.stats = { ...state.stats, ...stats }
    },

    SET_INVOICE_FORM(state, formData) {
      state.invoiceForm = { ...state.invoiceForm, ...formData }
    },

    SET_FORM_ERRORS(state, errors) {
      state.formErrors = errors
    },

    CLEAR_FORM_ERRORS(state) {
      state.formErrors = {}
    },

    CLEAR_INVOICE_FORM(state) {
      state.invoiceForm = {
        client_id: '',
        invoice_number: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 15, total: 0 }],
        notes: '',
        terms: '',
        status: 'draft'
      }
    },

    ADD_INVOICE_ITEM(state) {
      state.invoiceForm.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 15,
        total: 0
      })
    },

    REMOVE_INVOICE_ITEM(state, index) {
      if (state.invoiceForm.items.length > 1) {
        state.invoiceForm.items.splice(index, 1)
      }
    },

    UPDATE_INVOICE_ITEM(state, { index, data }) {
      const item = state.invoiceForm.items[index]
      if (item) {
        Object.assign(item, data)
        const qty = parseFloat(item.quantity) || 0
        const price = parseFloat(item.unit_price) || 0
        const rate = parseFloat(item.tax_rate) || 0
        const subtotal = qty * price
        item.total = subtotal + (subtotal * (rate / 100))
      }
    },

    ADD_INVOICE(state, invoice) {
      state.invoices.unshift(invoice)
    },

    UPDATE_INVOICE(state, invoice) {
      const index = state.invoices.findIndex(i => i.id === invoice.id)
      if (index !== -1) {
        state.invoices.splice(index, 1, invoice)
      }
      if (state.currentInvoice && state.currentInvoice.id === invoice.id) {
        state.currentInvoice = invoice
      }
    },

    DELETE_INVOICE(state, id) {
      state.invoices = state.invoices.filter(i => i.id !== id)
    }
  },

  actions: {
    // جلب الفواتير مع التصفية والترقيم
    async fetchInvoices({ commit, state }, params = {}) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const query = {
          page: params.page || state.pagination.current_page || 1,
          per_page: params.per_page || state.pagination.per_page || 10,
          ...state.filters,
          ...params
        }

        const response = await axios.get('/admin/invoices', { params: query })

        if (response.data.status) {
          const data = response.data.data?.data || response.data.data || []
          const pagination = response.data.data
            ? {
                current_page: response.data.data.current_page,
                last_page: response.data.data.last_page,
                per_page: response.data.data.per_page,
                total: response.data.data.total
              }
            : null

          commit('SET_INVOICES', { data, pagination })

          // حساب الإحصائيات
          if (data.length > 0) {
            const stats = {
              total: pagination?.total || data.length,
              paid: data.filter(i => i.status === 'paid').length,
              sent: data.filter(i => i.status === 'sent').length,
              overdue: data.filter(i => i.status === 'overdue').length
            }
            commit('SET_STATS', stats)
          }

          return { data, pagination }
        } else {
          throw new Error(response.data.message || i18n.global.t('invoices.fetch_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('invoices.fetch_failed')
        commit('SET_ERROR', message)
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

        if (response.data.status) {
          const invoice = response.data.data
          commit('SET_CURRENT_INVOICE', invoice)
          return invoice
        } else {
          throw new Error(response.data.message || i18n.global.t('invoices.fetch_one_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('invoices.fetch_one_failed')
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
      commit('CLEAR_FORM_ERRORS')
      NProgress.start()

      try {
        const cleanedData = {
          ...invoiceData,
          items: invoiceData.items.map(item => ({
            description: item.description,
            quantity: parseFloat(item.quantity) || 0,
            unit_price: parseFloat(item.unit_price) || 0,
            tax_rate: parseFloat(item.tax_rate) || 0
          }))
        }

        const response = await axios.post('/admin/invoices', cleanedData)

        if (response.data.status) {
          const invoice = response.data.data
          commit('ADD_INVOICE', invoice)
          commit('CLEAR_INVOICE_FORM')
          return invoice
        } else {
          throw new Error(response.data.message || i18n.global.t('invoices.create_failed'))
        }
      } catch (error) {
        let message = i18n.global.t('invoices.create_failed')
        if (error.response) {
          if (error.response.status === 422 && error.response.data.errors) {
            commit('SET_FORM_ERRORS', error.response.data.errors)
          }
          message = error.response.data?.message || error.message
        }
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
      commit('CLEAR_FORM_ERRORS')
      NProgress.start()

      try {
        const cleanedData = {
          ...data,
          items: data.items.map(item => ({
            description: item.description,
            quantity: parseFloat(item.quantity) || 0,
            unit_price: parseFloat(item.unit_price) || 0,
            tax_rate: parseFloat(item.tax_rate) || 0
          }))
        }

        const response = await axios.put(`/admin/invoices/${id}`, cleanedData)

        if (response.data.status) {
          const invoice = response.data.data
          commit('UPDATE_INVOICE', invoice)
          return invoice
        } else {
          throw new Error(response.data.message || i18n.global.t('invoices.update_failed'))
        }
      } catch (error) {
        let message = i18n.global.t('invoices.update_failed')
        if (error.response) {
          if (error.response.status === 422 && error.response.data.errors) {
            commit('SET_FORM_ERRORS', error.response.data.errors)
          }
          message = error.response.data?.message || error.message
        }
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
        const response = await axios.delete(`/admin/invoices/${id}`)

        if (response.data.status) {
          commit('DELETE_INVOICE', id)
          return true
        } else {
          throw new Error(response.data.message || i18n.global.t('invoices.delete_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('invoices.delete_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحديث حالة الفاتورة (دفع، إرسال، تغيير حالة)
    async updateInvoiceStatus({ commit }, { id, status }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        let response
        if (status === 'paid') {
          response = await axios.put(`/admin/invoices/${id}/mark-paid`)
        } else if (status === 'sent') {
          response = await axios.post(`/admin/invoices/${id}/send`)
        } else {
          response = await axios.put(`/admin/invoices/${id}`, { status })
        }

        if (response.data.status) {
          const invoice = response.data.data
          commit('UPDATE_INVOICE', invoice)
          return invoice
        } else {
          throw new Error(response.data.message || i18n.global.t('invoices.status_update_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('invoices.status_update_failed')
        commit('SET_ERROR', message)
        throw new Error(message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // تحديث المرشحات (بدون NProgress)
    setFilters({ commit }, filters) {
      commit('SET_FILTERS', filters)
    },

    // مسح المرشحات
    clearFilters({ commit }) {
      commit('SET_FILTERS', { status: '', date: '', search: '' })
    },

    // تعيين بيانات نموذج الفاتورة
    setInvoiceFormData({ commit }, formData) {
      commit('SET_INVOICE_FORM', formData)
    },

    // إضافة بند جديد في النموذج
    addInvoiceItem({ commit }) {
      commit('ADD_INVOICE_ITEM')
    },

    // حذف بند من النموذج
    removeInvoiceItem({ commit }, index) {
      commit('REMOVE_INVOICE_ITEM', index)
    },

    // تحديث بيانات بند في النموذج
    updateInvoiceItem({ commit }, payload) {
      commit('UPDATE_INVOICE_ITEM', payload)
    },

    // مسح النموذج بالكامل
    clearInvoiceForm({ commit }) {
      commit('CLEAR_INVOICE_FORM')
      commit('CLEAR_FORM_ERRORS')
    },

    // توليد رقم فاتورة تلقائي (دون طلب API)
    generateInvoiceNumber({ commit }) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      const invoiceNumber = `INV-${year}${month}${day}-${random}`
      commit('SET_INVOICE_FORM', { invoice_number: invoiceNumber })
    }
  }
}
