import axios from '@/api/axios';

const state = {
  currentPlan: null,
  interestTiers: [],
  loading: false,
  submitting: false,
  error: null,
};

const getters = {
  currentPlan: state => state.currentPlan,
  interestTiers: state => state.interestTiers,
  loading: state => state.loading,
  submitting: state => state.submitting,
  hasActivePlan: state => state.currentPlan && state.currentPlan.status === 'active',
};

const mutations = {
  SET_CURRENT_PLAN(state, plan) { state.currentPlan = plan; },
  SET_INTEREST_TIERS(state, tiers) { state.interestTiers = tiers; },
  SET_LOADING(state, val) { state.loading = val; },
  SET_SUBMITTING(state, val) { state.submitting = val; },
  SET_ERROR(state, err) { state.error = err; },
  CLEAR_ERROR(state) { state.error = null; },
  UPDATE_INSTALLMENT(state, updated) {
    if (!state.currentPlan || !state.currentPlan.installments) return;
    const idx = state.currentPlan.installments.findIndex(i => i.id === updated.id);
    if (idx !== -1) {
      state.currentPlan.installments.splice(idx, 1, updated);
    }
  }
};

const actions = {
  // ──────────────────────────────────────────────
  // خطط الأقساط (Installment Plans)
  // ──────────────────────────────────────────────
  async fetchPlan({ commit }, invoiceId) {
    commit('SET_LOADING', true);
    try {
      const res = await axios.get(`/admin/invoices/${invoiceId}/installment-plan`);
      commit('SET_CURRENT_PLAN', res.data.data);
      return res.data.data;
    } catch (e) {
      if (e.response?.status === 404) {
        commit('SET_CURRENT_PLAN', null);
        return null;
      }
      const msg = e.response?.data?.message || 'فشل في جلب خطة الأقساط';
      commit('SET_ERROR', msg);
      throw new Error(msg);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createPlan({ commit }, { invoiceId, data }) {
    commit('SET_SUBMITTING', true);
    try {
      const res = await axios.post(`/admin/invoices/${invoiceId}/installment-plan`, data);
      commit('SET_CURRENT_PLAN', res.data.data);
      return res.data.data;
    } catch (e) {
      const msg = e.response?.data?.message || 'فشل في إنشاء خطة الأقساط';
      commit('SET_ERROR', msg);
      throw new Error(msg);
    } finally {
      commit('SET_SUBMITTING', false);
    }
  },

  async payInstallment({ commit }, { installmentId, paymentMethod = 'cash' }) {
    commit('SET_SUBMITTING', true);
    try {
      const res = await axios.put(`/admin/installments/${installmentId}/pay`, {
        payment_method: paymentMethod,
      });
      commit('UPDATE_INSTALLMENT', res.data.data);
      return res.data.data;
    } catch (e) {
      const msg = e.response?.data?.message || 'فشل في سداد القسط';
      commit('SET_ERROR', msg);
      throw new Error(msg);
    } finally {
      commit('SET_SUBMITTING', false);
    }
  },

  async cancelPlan({ commit }, planId) {
    commit('SET_SUBMITTING', true);
    try {
      const res = await axios.delete(`/admin/installment-plans/${planId}`);
      commit('SET_CURRENT_PLAN', res.data.data);
      return res.data.data;
    } catch (e) {
      const msg = e.response?.data?.message || 'فشل في إلغاء خطة الأقساط';
      commit('SET_ERROR', msg);
      throw new Error(msg);
    } finally {
      commit('SET_SUBMITTING', false);
    }
  },

  // ──────────────────────────────────────────────
  // نسب الفائدة (Interest Tiers)
  // ──────────────────────────────────────────────
  async suggestRate({ commit }, numberOfInstallments) {
    try {
      const res = await axios.get(`/admin/installment-interest-tiers/suggest/${numberOfInstallments}`);
      return res.data.data.interest_rate;
    } catch (e) {
      const msg = e.response?.data?.message || 'فشل في جلب النسبة المقترحة';
      commit('SET_ERROR', msg);
      return 0;
    }
  },

  async fetchTiers({ commit }) {
    commit('SET_LOADING', true);
    try {
      const res = await axios.get('/admin/installment-interest-tiers');
      commit('SET_INTEREST_TIERS', res.data.data);
      return res.data.data;
    } catch (e) {
      const msg = e.response?.data?.message || 'فشل في جلب جدول نسب الفائدة';
      commit('SET_ERROR', msg);
      throw new Error(msg);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async saveTier({ commit, dispatch }, { numberOfInstallments, interestRate }) {
    commit('SET_SUBMITTING', true);
    try {
      await axios.post('/admin/installment-interest-tiers', {
        number_of_installments: numberOfInstallments,
        interest_rate: interestRate,
      });
      await dispatch('fetchTiers');
    } catch (e) {
      const msg = e.response?.data?.message || 'فشل في حفظ النسبة';
      commit('SET_ERROR', msg);
      throw new Error(msg);
    } finally {
      commit('SET_SUBMITTING', false);
    }
  },

  async deleteTier({ commit, dispatch }, tierId) {
    commit('SET_SUBMITTING', true);
    try {
      await axios.delete(`/admin/installment-interest-tiers/${tierId}`);
      await dispatch('fetchTiers');
    } catch (e) {
      const msg = e.response?.data?.message || 'فشل في حذف النسبة';
      commit('SET_ERROR', msg);
      throw new Error(msg);
    } finally {
      commit('SET_SUBMITTING', false);
    }
  },

  // ──────────────────────────────────────────────
  // مساعد
  // ──────────────────────────────────────────────
  clearError({ commit }) {
    commit('CLEAR_ERROR');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
