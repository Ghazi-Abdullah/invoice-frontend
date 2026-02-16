import axios from '@/api/axios'

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
  lastUpdated: null
}

const getters = {
  stats: (state) => state.stats || {},
  recentClients: (state) => state.recentClients,
  recentInvoices: (state) => state.recentInvoices,
  monthlyRevenue: (state) => state.monthlyRevenue,
  overdueInvoices: (state) => state.overdueInvoices,
  recentActivity: (state) => state.recentActivity,
  topClients: (state) => state.topClients,
  invoiceStatuses: (state) => state.invoiceStatuses,
  performanceData: (state) => state.performanceData,
  loading: (state) => state.loading,
  error: (state) => state.error,
  lastUpdated: (state) => state.lastUpdated,

  // Helper functions
  formatCurrency: () => (amount) => {
    if (amount === null || amount === undefined) return '0.00 ر.س'
    const num = parseFloat(amount)
    if (isNaN(num)) return '0.00 ر.س'
    return num.toLocaleString('ar-SA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' ر.س'
  },

  formatDate: () => (dateString) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return 'تاريخ غير صالح'
    }
  },

  formatShortDate: () => (dateString) => {
    if (!dateString) return 'غير محدد'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'تاريخ غير صالح'
    }
  },

  getInitials: () => (name) => {
    if (!name) return '؟'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  },

  getStatusClass: () => (status) => {
    const classes = {
      paid: 'bg-green-100 text-green-800',
      sent: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      overdue: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800'
    }
    return classes[status] || 'bg-gray-100 text-gray-800'
  },

  getStatusText: () => (status) => {
    const texts = {
      paid: 'مدفوعة',
      sent: 'مرسلة',
      draft: 'مسودة',
      overdue: 'متأخرة',
      active: 'نشط',
      inactive: 'غير نشط'
    }
    return texts[status] || status
  },

  // حساب أداء اليوم
  todayPerformance: (state) => {
    const stats = state.stats || {}
    const todayPaid = stats.todayPaidInvoices || 0
    const todayTotal = stats.todayTotalInvoices || 0
    return todayTotal > 0 ? Math.round((todayPaid / todayTotal) * 100) : 0
  },

  // بيانات الرسوم البيانية
  chartData: (state) => {
    return {
      revenueChartData: {
        labels: state.performanceData.months || [],
        datasets: [
          {
            label: 'الإيرادات',
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
            label: 'الفواتير',
            data: state.performanceData.invoices || [],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 8
          },
          {
            label: 'الإيرادات',
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
  }
}

const mutations = {
  SET_STATS(state, stats) {
    state.stats = stats
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
  },
  SET_PERFORMANCE_DATA(state, data) {
    state.performanceData = data
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
  }
}

const actions = {
  async fetchDashboardData({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

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
        throw new Error(response.data.message || 'فشل في جلب البيانات')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'فشل في تحميل بيانات لوحة التحكم'

      commit('SET_ERROR', errorMessage)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async refreshDashboardData({ dispatch }) {
    return await dispatch('fetchDashboardData')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
