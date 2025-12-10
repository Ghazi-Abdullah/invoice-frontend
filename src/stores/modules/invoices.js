import axios from '@/api/axios'

const state = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  pagination: {}
}

const mutations = {
  SET_INVOICES(state, data) {
    if (data.data) {
      state.invoices = data.data
      state.pagination = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
        from: data.from,
        to: data.to
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
}

const actions = {
  async fetchInvoices({ commit }, filters = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await axios.get('/api/invoices', { params: filters })
      commit('SET_INVOICES', response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching invoices:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchInvoice({ commit }, id) {
    try {
      const response = await axios.get(`/api/invoices/${id}`)
      commit('SET_CURRENT_INVOICE', response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Error fetching invoice:', error)
      throw error
    }
  },

  async createInvoice({ commit }, invoiceData) {
    try {
      const response = await axios.post('/api/invoices', invoiceData)
      const invoice = response.data.data
      commit('ADD_INVOICE', invoice)
      return invoice
    } catch (error) {
      console.error('Error creating invoice:', error)
      throw error
    }
  },

  async updateInvoice({ commit }, { id, data }) {
    try {
      const response = await axios.put(`/api/invoices/${id}`, data)
      const updatedInvoice = response.data.data
      commit('UPDATE_INVOICE', updatedInvoice)
      return updatedInvoice
    } catch (error) {
      console.error('Error updating invoice:', error)
      throw error
    }
  },

  async deleteInvoice({ commit }, id) {
    try {
      await axios.delete(`/api/invoices/${id}`)
      commit('DELETE_INVOICE', id)
    } catch (error) {
      console.error('Error deleting invoice:', error)
      throw error
    }
  },

  async updateInvoiceStatus({ commit }, { id, status }) {
    try {
      const response = await axios.post(`/api/invoices/${id}/status`, { status })
      const updatedInvoice = response.data.data
      commit('UPDATE_INVOICE', updatedInvoice)
      return updatedInvoice
    } catch (error) {
      console.error('Error updating invoice status:', error)
      throw error
    }
  },

  async getDashboardStats({ commit }) {
    try {
      const response = await axios.get('/api/invoices/dashboard/stats')
      return response.data.data
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }
}

const getters = {
  invoices: state => Array.isArray(state.invoices) ? state.invoices : [],
  currentInvoice: state => state.currentInvoice,
  loading: state => state.loading,
  pagination: state => state.pagination
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
