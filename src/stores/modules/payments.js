import axios from '../../api/axios';

const state = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    status: '',
    date_from: '',
    date_to: '',
    search: '',
    page: 1,
    per_page: 15,
  },
  paymentStats: {
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
  },
};

const mutations = {
  SET_PAYMENTS(state, payments) { state.payments = payments; },
  SET_CURRENT_PAYMENT(state, payment) { state.currentPayment = payment; },
  SET_LOADING(state, loading) { state.loading = loading; },
  SET_ERROR(state, error) { state.error = error; },
  SET_PAGINATION(state, pagination) { state.pagination = pagination; },
  SET_FILTERS(state, filters) { state.filters = { ...state.filters, ...filters }; },
  SET_PAYMENT_STATS(state, stats) { state.paymentStats = stats; },
  CLEAR_ERROR(state) { state.error = null; },
  CLEAR_FILTERS(state) {
    state.filters = { status: '', date_from: '', date_to: '', search: '', page: 1, per_page: 15 };
  },
};

const actions = {
  async createPaymentSession({ commit }, invoiceId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');

    try {
      const response = await axios.post(`/admin/payments/create-session/${invoiceId}`);
      console.log('✅ Stripe API response:', response.data);

      // ✅ التعديل: قبول status === true أو status === 'success'
      if (response.data.status === true || response.data.status === 'success') {
        if (response.data.data && response.data.data.url) {
          return response.data.data; // { session_id, url, invoice_id, amount, currency }
        } else {
          throw new Error('Stripe session created but no URL returned');
        }
      } else {
        throw new Error(response.data.message || 'فشل في إنشاء جلسة الدفع');
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchPayments({ commit, state }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    try {
      const params = { ...state.filters };
      const response = await axios.get('/admin/payments', { params });
      if (response.data.status === true || response.data.status === 'success') {
        const data = response.data.data;
        commit('SET_PAYMENTS', data.data);
        commit('SET_PAGINATION', {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
          from: data.from,
          to: data.to,
        });
        const stats = { total: data.total, completed: 0, pending: 0, failed: 0, totalAmount: 0 };
        data.data.forEach(payment => {
          if (payment.status === 'completed') stats.completed++;
          if (payment.status === 'pending') stats.pending++;
          if (payment.status === 'failed') stats.failed++;
          stats.totalAmount += parseFloat(payment.amount);
        });
        commit('SET_PAYMENT_STATS', stats);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'فشل في تحميل المدفوعات';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchPayment({ commit }, paymentId) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    try {
      const response = await axios.get(`/admin/payments/${paymentId}`);
      if (response.data.status === true || response.data.status === 'success') {
        commit('SET_CURRENT_PAYMENT', response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'فشل في تحميل بيانات الدفع');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'فشل في تحميل بيانات الدفع';
      commit('SET_ERROR', errorMessage);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  updateFilters({ commit }, filters) { commit('SET_FILTERS', filters); },
  clearFilters({ commit }) { commit('CLEAR_FILTERS'); },
  clearError({ commit }) { commit('CLEAR_ERROR'); },
};

const getters = {
  payments: (state) => state.payments,
  currentPayment: (state) => state.currentPayment,
  loading: (state) => state.loading,
  error: (state) => state.error,
  pagination: (state) => state.pagination,
  paymentFilters: (state) => state.filters,
  paymentStats: (state) => state.paymentStats,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
