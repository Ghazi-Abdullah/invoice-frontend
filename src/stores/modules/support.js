import axios from '@/api/axios'

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
}

const getters = {
  openTickets: (state) => state.tickets.filter((t) => t.status === 'open'),
  closedTickets: (state) => state.tickets.filter((t) => t.status === 'closed'),
  inProgressTickets: (state) => state.tickets.filter((t) => t.status === 'in_progress'),
  hasTickets: (state) => state.tickets.length > 0,
}

const actions = {
  async fetchTickets({ commit }, params = {}) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const { data } = await axios.get('/admin/support/tickets', { params })
      commit('SET_TICKETS', data.data || data)
      if (data.meta) commit('SET_PAGINATION', data.meta)
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحميل التذاكر'))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTicket({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const { data } = await axios.get(`/admin/support/tickets/${id}`)
      commit('SET_TICKET', data.data || data)
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحميل التذكرة'))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createTicket({ commit }, ticketData) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.post('/support/tickets', ticketData)
      commit('ADD_TICKET', data.ticket || data)
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في انشاء التذكرة'))
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async replyToTicket({ commit }, { id, message }) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.post(`/admin/support/tickets/${id}/replies`, { message })
      commit('SET_TICKET_REPLIES', { id, replies: data.replies || [] })
      if (data.status) commit('SET_TICKET_STATUS', { id, status: data.status })
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في رد التذكرة'))
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async closeTicket({ commit }, id) {
    try {
      const { data } = await axios.patch(`/admin/support/tickets/${id}/close`)
      const status = data.ticket?.status || 'closed'
      commit('UPDATE_TICKET_IN_LIST', { id, status })
      commit('SET_TICKET_STATUS', { id, status })
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحديث حالة التذكرة'))
      throw error
    }
  },

  async updateTicketStatus({ commit }, { id, status }) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.patch(`/admin/support/tickets/${id}/status`, { status })
      const newStatus = data.data?.status || data.ticket?.status || status
      commit('UPDATE_TICKET_IN_LIST', { id, status: newStatus })
      commit('SET_TICKET_STATUS', { id, status: newStatus })
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحديث حالة التذكرة'))
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },
}

const mutations = {
  SET_TICKETS(state, tickets) { state.tickets = tickets },
  SET_TICKET(state, ticket) { state.ticket = ticket },
  ADD_TICKET(state, ticket) { state.tickets.unshift(ticket) },
  SET_TICKET_REPLIES(state, { id, replies }) {
    if (state.ticket && state.ticket.id === id) state.ticket.replies = replies
  },
  SET_TICKET_STATUS(state, { id, status }) {
    if (state.ticket && state.ticket.id === id) state.ticket.status = status
  },
  UPDATE_TICKET_IN_LIST(state, { id, status }) {
    const ticket = state.tickets.find((t) => t.id === id)
    if (ticket) ticket.status = status
  },
  SET_LOADING(state, status) { state.loading = status },
  SET_SUBMITTING(state, status) { state.submitting = status },
  SET_ERROR(state, error) { state.error = error },
  SET_PAGINATION(state, meta) { state.pagination = meta },
}

function resolveErrorMessage(error, fallback) {
  if (error.response?.status === 401) return 'Unauthenticated.'
  return error.response?.data?.message || fallback
}

export default { namespaced: true, state, getters, actions, mutations }
