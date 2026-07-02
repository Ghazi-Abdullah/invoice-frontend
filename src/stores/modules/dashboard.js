// src/stores/modules/dashboard.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'
import {
  formatCurrency,
  formatDate,
  formatShortDate,
  formatDateTime,
  formatTimeAgo,
  formatNumber,
  truncateText,
  getInitials,
  getStatusClass,
  getStatusText,
  formatPhone,
  slugify
} from '@/utils/formatters'

const state = {
  stats: null,
  recentClients: [],
  recentInvoices: [],
  monthlyRevenue: [],
  overdueInvoices: [],
  recentActivity: [],
  topClients: [],
  invoiceStatuses: [],
  performanceData: {},
  loading: false,
  error: null,
  lastUpdated: null,
  // ✅ تخزين chartData مؤقتاً
  _chartDataCache: null
}

const getters = {
  // البيانات الأساسية
  stats: state => state.stats || {},
  recentClients: state => state.recentClients,
  recentInvoices: state => state.recentInvoices,
  monthlyRevenue: state => state.monthlyRevenue,
  overdueInvoices: state => state.overdueInvoices,
  recentActivity: state => state.recentActivity,
  topClients: state => state.topClients,
  invoiceStatuses: state => state.invoiceStatuses,
  performanceData: state => state.performanceData,
  loading: state => state.loading,
  error: state => state.error,
  lastUpdated: state => state.lastUpdated,

  // دوال مساعدة
  formatCurrency: () => formatCurrency,
  formatDate: () => formatDate,
  formatShortDate: () => formatShortDate,
  formatDateTime: () => formatDateTime,
  formatTimeAgo: () => formatTimeAgo,
  formatNumber: () => formatNumber,
  truncateText: () => truncateText,
  getInitials: () => getInitials,
  getStatusClass: () => getStatusClass,
  getStatusText: () => getStatusText,
  formatPhone: () => formatPhone,
  slugify: () => slugify,

  // حساب أداء اليوم
  todayPerformance: state => {
    const stats = state.stats || {}
    const todayPaid = stats.todayPaidInvoices || 0
    const todayTotal = stats.todayTotalInvoices || 0
    return todayTotal > 0 ? Math.round((todayPaid / todayTotal) * 100) : 0
  },

  // ✅ chartData مع تخزين مؤقت
  chartData: state => {
    // إذا لم تتغير البيانات، أعد الكائن المخزن مؤقتاً
    if (state._chartDataCache) {
      return state._chartDataCache
    }

    const data = {
      revenueChartData: {
        labels: state.performanceData.months || [],
        datasets: [
          {
            label: i18n.t('dashboard.revenue'),
            data: state.performanceData.revenues || [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      performanceChartData: {
        labels: state.performanceData.months || [],
        datasets: [
          {
            label: i18n.t('dashboard.invoices'),
            data: state.performanceData.invoices || [],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 8
          },
          {
            label: i18n.t('dashboard.revenue'),
            data: state.performanceData.revenues || [],
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 8
          }
        ]
      },
      invoiceStatusChartData: {
        labels: state.invoiceStatuses.map(s => s.label) || [],
        datasets: [
          {
            data: state.invoiceStatuses.map(s => s.value) || [],
            backgroundColor: state.invoiceStatuses.map(s => s.color) || [],
            borderWidth: 0
          }
        ]
      }
    }

    // ✅ تخزين النتيجة في cache
    state._chartDataCache = data
    return data
  }
}

const mutations = {
  SET_STATS(state, stats) {
    state.stats = stats
    // مسح الكاش لأن البيانات تغيرت
    state._chartDataCache = null
  },
  SET_RECENT_CLIENTS(state, clients) {
    state.recentClients = clients
  },
  SET_RECENT_INVOICES(state, invoices) {
    state.recentInvoices = invoices
  },
  SET_MONTHLY_REVENUE(state, revenue) {
    state.monthlyRevenue = revenue
  },
  SET_OVERDUE_INVOICES(state, invoices) {
    state.overdueInvoices = invoices
  },
  SET_RECENT_ACTIVITY(state, activity) {
    state.recentActivity = activity
  },
  SET_TOP_CLIENTS(state, clients) {
    state.topClients = clients
  },
  SET_INVOICE_STATUSES(state, statuses) {
    state.invoiceStatuses = statuses
    // مسح الكاش لأن البيانات تغيرت
    state._chartDataCache = null
  },
  SET_PERFORMANCE_DATA(state, data) {
    state.performanceData = data
    // مسح الكاش لأن البيانات تغيرت
    state._chartDataCache = null
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_LAST_UPDATED(state) {
    state.lastUpdated = new Date().toISOString()
  },
  CLEAR_DATA(state) {
    state.stats = null
    state.recentClients = []
    state.recentInvoices = []
    state.monthlyRevenue = []
    state.overdueInvoices = []
    state.recentActivity = []
    state.topClients = []
    state.invoiceStatuses = []
    state.performanceData = {}
    state._chartDataCache = null
  },
  CLEAR_ERROR(state) {
    state.error = null
  }
}

const actions = {
  async fetchDashboardData({ commit }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    NProgress.start()

    try {
      const response = await axios.get('/admin/dashboard')

      if (response.data.status) {
        const data = response.data.data

        commit('SET_STATS', data.stats || {})
        commit('SET_RECENT_CLIENTS', data.recentClients || [])
        commit('SET_RECENT_INVOICES', data.recentInvoices || [])
        commit('SET_MONTHLY_REVENUE', data.monthlyRevenue || [])
        commit('SET_OVERDUE_INVOICES', data.overdueInvoices || [])
        commit('SET_RECENT_ACTIVITY', data.recentActivity || [])
        commit('SET_TOP_CLIENTS', data.topClients || [])
        commit('SET_INVOICE_STATUSES', data.invoiceStatuses || [])
        commit('SET_PERFORMANCE_DATA', data.performanceData || {})
        commit('SET_LAST_UPDATED')

        return data
      } else {
        throw new Error(response.data.message || i18n.t('dashboard.fetch_failed'))
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || i18n.t('dashboard.fetch_error')
      commit('SET_ERROR', message)
      throw new Error(message)
    } finally {
      NProgress.done()
      commit('SET_LOADING', false)
    }
  },

  async refreshDashboardData({ dispatch }) {
    return await dispatch('fetchDashboardData')
  },

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
