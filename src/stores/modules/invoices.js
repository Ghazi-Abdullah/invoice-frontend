

import api from '@/api/axios'

const state = {
  invoices: {
    data: [],
    meta: {}
  },
  currentInvoice: null,
  loading: false,
  error: null
}

const getters = {
  allInvoices: (state) => state.invoices.data || [],
  totalInvoices: (state) => state.invoices.data?.length || 0,
  hasInvoices: (state) => (state.invoices.data?.length || 0) > 0,
  paginationInfo: (state) => ({
    currentPage: state.invoices.meta?.current_page || 1,
    lastPage: state.invoices.meta?.last_page || 1,
    perPage: state.invoices.meta?.per_page || 10,
    total: state.invoices.meta?.total || 0
  }),
  invoiceStats: (state) => {
    const invoices = state.invoices.data || []
    return {
      total: invoices.length,
      draft: invoices.filter(inv => inv.status === 'draft').length,
      sent: invoices.filter(inv => inv.status === 'sent').length,
      paid: invoices.filter(inv => inv.status === 'paid').length,
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      totalAmount: invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0)
    }
  },
  getInvoiceById: (state) => (id) => {
    return state.invoices.data.find(invoice => invoice.id === parseInt(id))
  }
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_INVOICES(state, invoices) {
    state.invoices = invoices
  },
  SET_CURRENT_INVOICE(state, invoice) {
    state.currentInvoice = invoice
  },
  ADD_INVOICE(state, invoice) {
    state.invoices.data.unshift(invoice)
  },
  UPDATE_INVOICE(state, updatedInvoice) {
    const index = state.invoices.data.findIndex(inv => inv.id === updatedInvoice.id)
    if (index !== -1) {
      state.invoices.data.splice(index, 1, updatedInvoice)
    }

    if (state.currentInvoice && state.currentInvoice.id === updatedInvoice.id) {
      state.currentInvoice = updatedInvoice
    }
  },
  REMOVE_INVOICE(state, id) {
    state.invoices.data = state.invoices.data.filter(inv => inv.id !== parseInt(id))
  },
  UPDATE_INVOICE_STATUS(state, { id, status }) {
    const invoice = state.invoices.data.find(inv => inv.id === parseInt(id))
    if (invoice) {
      invoice.status = status
    }

    if (state.currentInvoice && state.currentInvoice.id === parseInt(id)) {
      state.currentInvoice.status = status
    }
  }
}

const actions = {

  async fetchInvoices({ commit }, params = {}) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log('🔄 جلب الفواتير من API...', params)
      const response = await api.get('/invoices', { params })
      console.log('📦 استجابة API للفواتير:', response.data)

      let invoicesData = []
      let metaData = {}

      if (response.data && response.data.success) {
        const responseData = response.data.data

        // التعامل مع هيكل البيانات المختلف
        if (responseData && Array.isArray(responseData.data)) {
          // الحالة: استجابة Laravel Pagination
          invoicesData = responseData.data
          metaData = {
            current_page: responseData.current_page || 1,
            last_page: responseData.last_page || 1,
            per_page: responseData.per_page || 10,
            total: responseData.total || 0,
            from: responseData.from || 0,
            to: responseData.to || 0
          }
        } else if (Array.isArray(responseData)) {
          // الحالة: مصفوفة مباشرة
          invoicesData = responseData
          metaData = {
            current_page: 1,
            last_page: 1,
            per_page: responseData.length,
            total: responseData.length
          }
        } else {
          // هيكل غير متوقع
          console.warn('⚠️ هيكل بيانات غير متوقع للفواتير:', response.data)
          invoicesData = []
          metaData = {}
        }
      } else {
        console.warn('⚠️ استجابة API للفواتير غير ناجحة:', response.data)
        invoicesData = []
        metaData = {}
      }

      commit('SET_INVOICES', {
        data: invoicesData,
        meta: metaData
      })

      console.log('✅ الفواتير المخزنة في store:', state.invoices)
      return state.invoices
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ خطأ في جلب الفواتير:', error)

      // إرجاع حالة فارغة في حالة الخطأ
      commit('SET_INVOICES', { data: [], meta: {} })
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchInvoice({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🔄 جلب فاتورة ${id} من API...`)
      const response = await api.get(`/invoices/${id}`)
      console.log('📦 تفاصيل الفاتورة:', response.data)

      if (response.data && response.data.success) {
        const invoiceData = response.data.data
        commit('SET_CURRENT_INVOICE', invoiceData)
        return invoiceData
      } else {
        throw new Error('فشل في جلب تفاصيل الفاتورة')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ خطأ في جلب الفاتورة:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createInvoice({ commit }, invoiceData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log('🔄 إنشاء فاتورة جديدة:', invoiceData)
      const response = await api.post('/invoices', invoiceData)
      console.log('✅ فاتورة تم إنشاؤها:', response.data)

      if (response.data && response.data.success) {
        const newInvoice = response.data.data
        commit('ADD_INVOICE', newInvoice)
        return {
          success: true,
          data: newInvoice
        }
      } else {
        throw new Error('فشل في إنشاء الفاتورة')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ خطأ في إنشاء الفاتورة:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateInvoice({ commit }, { id, invoiceData }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🔄 تحديث فاتورة ${id}:`, invoiceData)
      const response = await api.put(`/invoices/${id}`, invoiceData)
      console.log('✏️ فاتورة تم تحديثها:', response.data)

      if (response.data && response.data.success) {
        const updatedInvoice = response.data.data
        commit('UPDATE_INVOICE', updatedInvoice)
        return {
          success: true,
          data: updatedInvoice
        }
      } else {
        throw new Error('فشل في تحديث الفاتورة')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ خطأ في تحديث الفاتورة:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteInvoice({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🗑️ حذف فاتورة ${id}...`)
      const response = await api.delete(`/invoices/${id}`)
      console.log('✅ فاتورة تم حذفها:', response.data)

      commit('REMOVE_INVOICE', id)
      return {
        success: true,
        message: 'تم حذف الفاتورة بنجاح'
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ خطأ في حذف الفاتورة:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateInvoiceStatus({ commit }, { id, status }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🔄 تحديث حالة فاتورة ${id} إلى:`, status)
      const response = await api.patch(`/invoices/${id}/status`, { status })
      console.log('✅ حالة الفاتورة تم تحديثها:', response.data)

      if (response.data && response.data.success) {
        commit('UPDATE_INVOICE_STATUS', { id, status })
        return {
          success: true,
          data: response.data.data
        }
      } else {
        throw new Error('فشل في تحديث حالة الفاتورة')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ خطأ في تحديث حالة الفاتورة:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
