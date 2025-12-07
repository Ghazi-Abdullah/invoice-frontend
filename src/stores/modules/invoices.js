

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
  totalInvoices: (state) => state.invoices.meta?.total || 0,
  hasInvoices: (state) => state.invoices.data?.length > 0,
  paginationInfo: (state) => ({
    currentPage: state.invoices.meta?.current_page || 1,
    lastPage: state.invoices.meta?.last_page || 1,
    perPage: state.invoices.meta?.per_page || 10,
    total: state.invoices.meta?.total || 0
  }),
  invoiceStats: (state) => {
    const invoices = state.invoices.data
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
    state.invoices.meta = {
      ...state.invoices.meta,
      total: (state.invoices.meta.total || 0) + 1,
      from: (state.invoices.meta.from || 0) + 1
    }
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
    state.invoices.meta = {
      ...state.invoices.meta,
      total: (state.invoices.meta.total || 1) - 1
    }
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
      console.log('🔄 Fetching invoices from API...', params)
      const response = await api.get('/invoices', { params })
      console.log('📦 Full Invoices API Response:', response.data)

      if (response.data && response.data.success) {
        const apiData = response.data.data

        if (apiData && Array.isArray(apiData.data)) {
          commit('SET_INVOICES', {
            data: apiData.data,
            meta: {
              current_page: apiData.current_page,
              last_page: apiData.last_page,
              per_page: apiData.per_page,
              total: apiData.total,
              from: apiData.from,
              to: apiData.to
            }
          })
        } else if (Array.isArray(apiData)) {
          commit('SET_INVOICES', {
            data: apiData,
            meta: {
              current_page: 1,
              last_page: 1,
              per_page: apiData.length,
              total: apiData.length
            }
          })
        } else {
          console.warn('⚠️ Unexpected invoices API structure:', response.data)
          commit('SET_INVOICES', { data: [], meta: {} })
        }
      } else {
        console.warn('⚠️ Invoices API response not successful:', response.data)
        commit('SET_INVOICES', { data: [], meta: {} })
      }

      console.log('✅ Final invoices in store:', state.invoices)
      return state.invoices
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error fetching invoices:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchInvoice({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🔄 Fetching invoice ${id} from API...`)
      const response = await api.get(`/invoices/${id}`)
      console.log('📦 Invoice API Response:', response.data)

      if (response.data && response.data.success) {
        const invoiceData = response.data.data
        console.log('✅ Invoice data to commit:', invoiceData)
        commit('SET_CURRENT_INVOICE', invoiceData)
        return invoiceData
      } else {
        throw new Error('Failed to fetch invoice details')
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error fetching invoice:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createInvoice({ commit }, invoiceData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log('🔄 Creating invoice:', invoiceData)
      const response = await api.post('/invoices', invoiceData)
      console.log('✅ Invoice created:', response.data)

      if (response.data && response.data.success) {
        commit('ADD_INVOICE', response.data.data)
        return response.data.data
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error creating invoice:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateInvoice({ commit }, { id, invoiceData }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🔄 Updating invoice ${id}:`, invoiceData)
      const response = await api.put(`/invoices/${id}`, invoiceData)
      console.log('✏️ Invoice updated:', response.data)

      if (response.data && response.data.success) {
        commit('UPDATE_INVOICE', response.data.data)
        return response.data.data
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error updating invoice:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteInvoice({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🗑️ Deleting invoice ${id}...`)
      await api.delete(`/invoices/${id}`)
      console.log('✅ Invoice deleted:', id)

      commit('REMOVE_INVOICE', id)
      return true
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error deleting invoice:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateInvoiceStatus({ commit }, { id, status }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      console.log(`🔄 Updating invoice ${id} status to:`, status)
      const response = await api.patch(`/invoices/${id}/status`, { status })
      console.log('✅ Invoice status updated:', response.data)

      if (response.data && response.data.success) {
        commit('UPDATE_INVOICE_STATUS', { id, status })
        return response.data.data
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message
      commit('SET_ERROR', errorMsg)
      console.error('❌ Error updating invoice status:', error)
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
