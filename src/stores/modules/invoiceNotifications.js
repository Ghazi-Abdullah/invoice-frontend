// src/store/modules/invoiceNotifications.js
import axios from '@/api/axios';
import echo from '@/echo';

const state = {
  unpaidCount: 0,
  overdueCount: 0,
  hasNew: false,
  channel: null,
};

const getters = {
  unpaidCount: (state) => state.unpaidCount,
  overdueCount: (state) => state.overdueCount,
  totalCount: (state) => state.unpaidCount + state.overdueCount,
  hasNew: (state) => state.hasNew,
};

const mutations = {
  SET_COUNTS(state, { unpaidCount, overdueCount }) {
    const previousTotal = state.unpaidCount + state.overdueCount;
    state.unpaidCount = unpaidCount || 0;
    state.overdueCount = overdueCount || 0;
    state.hasNew = (unpaidCount + overdueCount) > previousTotal;
  },
  CLEAR_NEW(state) {
    state.hasNew = false;
  },
  SET_CHANNEL(state, channel) {
    state.channel = channel;
  },
  CLEAR_CHANNEL(state) {
    state.channel = null;
  },
};

const actions = {
  startListening({ commit, dispatch }) {
    if (!echo) {
      console.warn('⚠️ Echo not available — notifications disabled');
      return;
    }

    console.log('🔔 Starting invoice notifications listener');

    // ✅ النقطة قبل اسم الحدث مهمة
    const channel = echo
      .channel('invoice-admin-channel')
      .listen('.notify-invoice-admin', (data) => {
        console.log('📨 Invoice notification received:', data);
        commit('SET_COUNTS', {
          unpaidCount: data.unpaidCount || 0,
          overdueCount: data.overdueCount || 0,
        });
      });

    commit('SET_CHANNEL', channel);
  },

  stopListening({ commit, state }) {
    if (state.channel) {
      state.channel.stopListening('.notify-invoice-admin');
    }
    if (echo) {
      echo.leaveChannel('invoice-admin-channel');
    }
    commit('CLEAR_CHANNEL');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
