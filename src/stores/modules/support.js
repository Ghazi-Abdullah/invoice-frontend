import axios from 'axios'

const state = {
  tickets: [],
  ticket: null,
  loading: false,
  submitting: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  },
  filters: {
    status: '',
    priority: '',
    search: '',
  },
}

const getters = {
  openTickets: (state) => state.tickets.filter((t) => t.status === 'open'),
  closedTickets: (state) => state.tickets.filter((t) => t.status === 'closed'),
  inProgressTickets: (state) => state.tickets.filter((t) => t.status === 'in_progress'),
  hasTickets: (state) => state.tickets.length > 0,
}

const actions = {
  async fetchTickets({ commit, state }, page = 1) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const params = { page, per_page: state.pagination.per_page, ...state.filters }
      const { data } = await axios.get('/api/admin/support/tickets', { params })
      commit('SET_TICKETS', data.data || data)
      if (data.meta) commit('SET_PAGINATION', data.meta)
    } catch (error) {
      console.error('Error fetching tickets:', error)
      commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل التذاكر')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTicket({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const { data } = await axios.get(`/api/admin/support/tickets/${id}`)
      commit('SET_TICKET', data)
    } catch (error) {
      console.error('Error fetching ticket:', error)
      commit('SET_ERROR', error.response?.data?.message || 'فشل في تحميل التذكرة')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createTicket({ commit }, ticketData) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.post('/api/support/tickets', ticketData)
      commit('ADD_TICKET', data.ticket || data)
      return data
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async replyToTicket({ commit, dispatch }, { id, replyData }) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.post(`/api/admin/support/tickets/${id}/replies`, replyData)
      dispatch('fetchTicket', id)
      return data
    } catch (error) {
      console.error('Error replying:', error)
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async closeTicket({ commit, dispatch }, id) {
    try {
      await axios.patch(`/api/admin/support/tickets/${id}/close`)
      dispatch('fetchTicket', id)
    } catch (error) {
      console.error('Error closing ticket:', error)
      throw error
    }
  },

  setFilter({ commit, dispatch }, { key, value }) {
    commit('SET_FILTER', { key, value })
    dispatch('fetchTickets', 1)
  },

  clearFilters({ commit, dispatch }) {
    commit('CLEAR_FILTERS')
    dispatch('fetchTickets', 1)
  },
}

const mutations = {
  SET_TICKETS(state, tickets) { state.tickets = tickets },
  SET_TICKET(state, ticket) { state.ticket = ticket },
  ADD_TICKET(state, ticket) { state.tickets.unshift(ticket) },
  SET_LOADING(state, status) { state.loading = status },
  SET_SUBMITTING(state, status) { state.submitting = status },
  SET_ERROR(state, error) { state.error = error },
  SET_PAGINATION(state, meta) { state.pagination = meta },
  SET_FILTER(state, { key, value }) {
    state.filters[key] = value
    state.pagination.current_page = 1
  },
  CLEAR_FILTERS(state) {
    state.filters = { status: '', priority: '', search: '' }
  },
}

export default { namespaced: true, state, getters, actions, mutations }