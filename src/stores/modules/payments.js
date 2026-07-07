// src/stores/modules/payments.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

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
    per_page: 15
  },
  paymentStats: {
    total: 0,
    completed: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0
  }
}

const getters = {
  payments: state => state.payments,
  currentPayment: state => state.currentPayment,
  loading: state => state.loading,
  error: state => state.error,
  pagination: state => state.pagination,
  paymentFilters: state => state.filters,
  paymentStats: state => state.paymentStats
}

const mutations = {
  SET_PAYMENTS(state, payments) {
    state.payments = payments
  },
  SET_CURRENT_PAYMENT(state, payment) {
    state.currentPayment = payment
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = pagination
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  SET_PAYMENT_STATS(state, stats) {
    state.paymentStats = stats
  },
  CLEAR_ERROR(state) {
    state.error = null
  },
  CLEAR_FILTERS(state) {
    state.filters = {
      status: '',
      date_from: '',
      date_to: '',
      search: '',
      page: 1,
      per_page: 15
    }
  }
}

const actions = {
  // إنشاء جلسة دفع عبر Stripe
  async createPaymentSession({ commit }, invoiceId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    NProgress.start()

    try {
      const response = await axios.post(`/admin/payments/create-session/${invoiceId}`)

      if (response.data.status) {
        if (response.data.data?.url) {
          return response.data.data
        } else {
          throw new Error(i18n.t('payments.invalid_session_url'))
        }
      } else {
        throw new Error(response.data.message || i18n.t('payments.create_session_failed'))
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || i18n.t('payments.create_session_failed')
      commit('SET_ERROR', message)
      throw new Error(message)
    } finally {
      NProgress.done()
      commit('SET_LOADING', false)
    }
  },

  // جلب قائمة المدفوعات
  async fetchPayments({ commit, state }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    NProgress.start()

    try {
      const response = await axios.get('/admin/payments', { params: state.filters })

      if (response.data.status) {
        const data = response.data.data
        const payments = data.data || []
        commit('SET_PAYMENTS', payments)
        commit('SET_PAGINATION', {
          current_page: data.current_page || 1,
          last_page: data.last_page || 1,
          per_page: data.per_page || 15,
          total: data.total || 0,
          from: data.from || 0,
          to: data.to || 0
        })

        // حساب الإحصائيات من المدفوعات
        const stats = {
          total: data.total || 0,
          completed: payments.filter(p => p.status === 'completed').length,
          pending: payments.filter(p => p.status === 'pending').length,
          failed: payments.filter(p => p.status === 'failed').length,
          totalAmount: payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
        }
        commit('SET_PAYMENT_STATS', stats)

        return response.data
      } else {
        throw new Error(response.data.message || i18n.t('payments.fetch_failed'))
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || i18n.t('payments.fetch_failed')
      commit('SET_ERROR', message)
      throw new Error(message)
    } finally {
      NProgress.done()
      commit('SET_LOADING', false)
    }
  },

  // جلب تفاصيل دفعة واحدة
  async fetchPayment({ commit }, paymentId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    NProgress.start()

    try {
      const response = await axios.get(`/admin/payments/${paymentId}`)

      if (response.data.status) {
        commit('SET_CURRENT_PAYMENT', response.data.data)
        return response.data.data
      } else {
        throw new Error(response.data.message || i18n.t('payments.fetch_one_failed'))
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || i18n.t('payments.fetch_one_failed')
      commit('SET_ERROR', message)
      throw new Error(message)
    } finally {
      NProgress.done()
      commit('SET_LOADING', false)
    }
  },

  // تحديث المرشحات
  updateFilters({ commit }, filters) {
    commit('SET_FILTERS', filters)
  },

  // مسح المرشحات
  clearFilters({ commit }) {
    commit('CLEAR_FILTERS')
  },

  // مسح الخطأ
  clearError({ commit }) {
    commit('CLEAR_ERROR')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
