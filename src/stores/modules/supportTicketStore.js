import { defineStore } from 'pinia'
import axios from 'axios'

export const useSupportTicketStore = defineStore('supportTickets', {
  state: () => ({
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
  }),

  getters: {
    openTickets: (state) => state.tickets.filter((t) => t.status === 'open'),
    closedTickets: (state) => state.tickets.filter((t) => t.status === 'closed'),
    inProgressTickets: (state) => state.tickets.filter((t) => t.status === 'in_progress'),
    hasTickets: (state) => state.tickets.length > 0,
  },

  actions: {
    async fetchTickets(page = 1) {
      this.loading = true
      this.error = null
      try {
        const params = {
          page,
          per_page: this.pagination.per_page,
          ...this.filters,
        }
        // ✅ مسار الأدمن
        const { data } = await axios.get('/api/admin/support/tickets', { params })
        this.tickets = data.data || data
        if (data.meta) {
          this.pagination = data.meta
        }
      } catch (error) {
        console.error('Error fetching tickets:', error)
        this.error = error.response?.data?.message || 'فشل في تحميل التذاكر'
      } finally {
        this.loading = false
      }
    },

    async fetchTicket(id) {
      this.loading = true
      this.error = null
      try {
        // ✅ مسار الأدمن
        const { data } = await axios.get(`/api/admin/support/tickets/${id}`)
        this.ticket = data
      } catch (error) {
        console.error('Error fetching ticket:', error)
        this.error = error.response?.data?.message || 'فشل في تحميل التذكرة'
      } finally {
        this.loading = false
      }
    },

    async createTicket(ticketData) {
      this.submitting = true
      this.error = null
      try {
        // ✅ مسار عام (Public)
        const { data } = await axios.post('/api/support/tickets', ticketData)
        this.tickets.unshift(data.ticket || data)
        return data
      } catch (error) {
        console.error('Error creating ticket:', error)
        this.error = error.response?.data?.message || 'فشل في إنشاء التذكرة'
        throw error
      } finally {
        this.submitting = false
      }
    },

    async replyToTicket(id, replyData) {
      this.submitting = true
      try {
        // ✅ مسار الأدمن
        const { data } = await axios.post(`/api/admin/support/tickets/${id}/replies`, replyData)
        if (this.ticket && this.ticket.id === id) {
          this.ticket.replies = data.replies || []
          this.ticket.status = data.status || this.ticket.status
        }
        return data
      } catch (error) {
        console.error('Error replying:', error)
        throw error
      } finally {
        this.submitting = false
      }
    },

    async closeTicket(id) {
      try {
        // ✅ مسار الأدمن
        const { data } = await axios.patch(`/api/admin/support/tickets/${id}/close`)
        const index = this.tickets.findIndex((t) => t.id === id)
        if (index !== -1) {
          this.tickets[index].status = 'closed'
        }
        if (this.ticket && this.ticket.id === id) {
          this.ticket.status = 'closed'
        }
        return data
      } catch (error) {
        console.error('Error closing ticket:', error)
        throw error
      }
    },

    setFilter(key, value) {
      this.filters[key] = value
      this.pagination.current_page = 1
    },

    clearFilters() {
      this.filters = { status: '', priority: '', search: '' }
      this.fetchTickets(1)
    },
  },
})