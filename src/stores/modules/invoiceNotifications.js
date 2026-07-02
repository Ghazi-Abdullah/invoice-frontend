// src/stores/modules/invoiceNotifications.js
import echo from '@/echo'

export default {
  namespaced: true,

  state: {
    unpaidCount: 0,
    overdueCount: 0,
    hasNew: false,
    channel: null
  },

  getters: {
    unpaidCount: state => state.unpaidCount,
    overdueCount: state => state.overdueCount,
    totalCount: state => state.unpaidCount + state.overdueCount,
    hasNew: state => state.hasNew
  },

  mutations: {
    SET_COUNTS(state, { unpaidCount = 0, overdueCount = 0 }) {
      const previousTotal = state.unpaidCount + state.overdueCount
      state.unpaidCount = unpaidCount
      state.overdueCount = overdueCount
      state.hasNew = (unpaidCount + overdueCount) > previousTotal
    },

    CLEAR_NEW(state) {
      state.hasNew = false
    },

    SET_CHANNEL(state, channel) {
      state.channel = channel
    },

    CLEAR_CHANNEL(state) {
      state.channel = null
    }
  },

  actions: {
    startListening({ commit }) {
      if (!echo) {
        return
      }

      const channel = echo
        .channel('invoice-admin-channel')
        .listen('.notify-invoice-admin', (data) => {
          commit('SET_COUNTS', {
            unpaidCount: data.unpaidCount || 0,
            overdueCount: data.overdueCount || 0
          })
        })

      commit('SET_CHANNEL', channel)
    },

    stopListening({ commit, state }) {
      if (state.channel) {
        state.channel.stopListening('.notify-invoice-admin')
      }
      if (echo) {
        echo.leaveChannel('invoice-admin-channel')
      }
      commit('CLEAR_CHANNEL')
    }
  }
}
