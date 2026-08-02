import echo from '@/echo'
import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    unpaidCount: 0,
    overdueCount: 0,
    dueSoonCount: 0,
    openTicketsCount: 0,
    hasNew: false,
    lastTrigger: null,
    channel: null,
  },

  getters: {
    unpaidCount: state => state.unpaidCount,
    overdueCount: state => state.overdueCount,
    dueSoonCount: state => state.dueSoonCount,
    openTicketsCount: state => state.openTicketsCount,
    totalCount: state => state.unpaidCount + state.overdueCount + state.dueSoonCount + state.openTicketsCount,
    hasNew: state => state.hasNew,
    lastTrigger: state => state.lastTrigger,
  },

  mutations: {
    SET_COUNTS(state, { unpaid, overdue, due_soon, open_tickets, trigger }) {
      const oldTotal = state.unpaidCount + state.overdueCount + state.dueSoonCount + state.openTicketsCount
      const newTotal = unpaid + overdue + due_soon + (open_tickets || 0)

      state.unpaidCount = unpaid
      state.overdueCount = overdue
      state.dueSoonCount = due_soon
      state.openTicketsCount = open_tickets || 0
      state.lastTrigger = trigger || null

      if (newTotal !== oldTotal || trigger !== 'initial') {
        state.hasNew = true
      }
    },
    SET_HAS_NEW(state, value) {
      state.hasNew = value
    },
    CLEAR_NEW(state) {
      state.hasNew = false
    },
    SET_CHANNEL(state, channel) {
      state.channel = channel
    },
    CLEAR_CHANNEL(state) {
      state.channel = null
    },
  },

  actions: {
    async fetchInitialCounts({ commit }) {
      try {
        const { data } = await axios.get('/admin/invoices/notification-counts')
        if (data.status) {
          commit('SET_COUNTS', {
            unpaid: data.data.unpaid || 0,
            overdue: data.data.overdue || 0,
            due_soon: data.data.due_soon || 0,
            open_tickets: data.data.open_tickets || 0,
            trigger: 'initial',
          })
        }
      } catch (e) {
        console.error('❌ Failed to fetch notification counts:', e)
      }
    },

    startListening({ commit, dispatch }) {
      if (!echo) {
        console.warn('Echo not initialized')
        return
      }

      dispatch('fetchInitialCounts')

      const channel = echo
        .channel('invoice-admin-channel')
        .listen('.invoice-notification-updated', (data) => {
          commit('SET_COUNTS', {
            unpaid: data.unpaidCount || 0,
            overdue: data.overdueCount || 0,
            due_soon: data.dueSoonCount || 0,
            open_tickets: data.openTicketsCount || 0,
            trigger: data.trigger || 'broadcast',
          })
        })
        .listen('.invoice-due-date-alert', (data) => {
          console.log('📢 Due date alert:', data.alertType, data.invoices)
        })

      commit('SET_CHANNEL', channel)
    },

    stopListening({ commit, state }) {
      if (state.channel) {
        state.channel.stopListening('.invoice-notification-updated')
        state.channel.stopListening('.invoice-due-date-alert')
      }
      if (echo) {
        echo.leaveChannel('invoice-admin-channel')
      }
      commit('CLEAR_CHANNEL')
    },

    async refreshCounts({ dispatch }) {
      await dispatch('fetchInitialCounts')
    },
  },
}
