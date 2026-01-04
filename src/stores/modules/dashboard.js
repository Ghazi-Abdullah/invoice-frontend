import axios from '@/api/axios'
import NProgress from 'nprogress'

const state = {
  stats: {
    totalRevenue: 0,
    totalInvoices: 0,
    totalClients: 0,
    paidInvoices: 0,
    revenueGrowth: 0,
    invoiceGrowth: 0,
    clientsGrowth: 0,
    paymentRate: 0,
    averageInvoice: 0,
    collectionRate: 0,
    draftInvoices: 0,
    sentInvoices: 0,
    overdueInvoices: 0,
    draftPercentage: 0,
    sentPercentage: 0,
    paidPercentage: 0,
    overduePercentage: 0,
    thisMonthInvoices: 0,
    newClientsThisMonth: 0
  },
  recentClients: [],
  recentInvoices: [],
  monthlyRevenue: [],
  overdueInvoices: [],
  recentActivity: [],
  loading: false,
  error: null
}

const getters = {
  stats: (state) => state.stats,
  recentClients: (state) => state.recentClients,
  recentInvoices: (state) => state.recentInvoices,
  monthlyRevenue: (state) => state.monthlyRevenue,
  overdueInvoices: (state) => state.overdueInvoices,
  recentActivity: (state) => state.recentActivity,
  loading: (state) => state.loading,
  error: (state) => state.error,

  // Helper functions
  formatCurrency: () => (amount) => {
    if (!amount && amount !== 0) return '0.00 ر.س'
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
  }
}

const mutations = {
  SET_STATS(state, stats) {
    state.stats = { ...state.stats, ...stats }
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
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchDashboardData({ commit }) {
    NProgress.start()
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await axios.get('/admin/dashboard')
      const data = response.data.data || response.data

      if (response.data.code === 401) {
        throw new Error('غير مصرح بالوصول')
      }

      commit('SET_STATS', data.stats || {})
      commit('SET_RECENT_CLIENTS', data.recentClients || [])
      commit('SET_RECENT_INVOICES', data.recentInvoices || [])
      commit('SET_MONTHLY_REVENUE', data.monthlyRevenue || [])
      commit('SET_OVERDUE_INVOICES', data.overdueInvoices || [])
      commit('SET_RECENT_ACTIVITY', data.recentActivity || [])
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || error.message || 'فشل في تحميل بيانات لوحة التحكم')

      // استخدام بيانات وهمية للعرض فقط في حالة التطوير
      if (process.env.NODE_ENV === 'development') {
        commit('SET_STATS', {
          totalRevenue: 1250000,
          totalInvoices: 150,
          totalClients: 85,
          paidInvoices: 120,
          revenueGrowth: 12.5,
          invoiceGrowth: 8.3,
          clientsGrowth: 5.2,
          paymentRate: 80,
          averageInvoice: 8333.33,
          collectionRate: 85,
          draftInvoices: 15,
          sentInvoices: 25,
          overdueInvoices: 10,
          draftPercentage: 8.8,
          sentPercentage: 14.7,
          paidPercentage: 70.6,
          overduePercentage: 5.9,
          thisMonthInvoices: 25,
          newClientsThisMonth: 12
        })

        commit('SET_RECENT_CLIENTS', [
          { id: 1, name: 'شركة النور للتجارة', email: 'info@alnoor.com', status: 'active', created_at: '2024-01-15' },
          { id: 2, name: 'مؤسسة التقنية المتقدمة', email: 'contact@tech.com', status: 'active', created_at: '2024-01-10' },
          { id: 3, name: 'محمد أحمد', email: 'mohamed@email.com', status: 'active', created_at: '2024-01-05' }
        ])

        commit('SET_RECENT_INVOICES', [
          { id: 1, invoice_number: 'INV-2024-001', client_name: 'شركة النور للتجارة', total: 15000, status: 'paid', issue_date: '2024-01-15', due_date: '2024-02-15' },
          { id: 2, invoice_number: 'INV-2024-002', client_name: 'مؤسسة التقنية المتقدمة', total: 25000, status: 'sent', issue_date: '2024-01-10', due_date: '2024-02-10' },
          { id: 3, invoice_number: 'INV-2024-003', client_name: 'محمد أحمد', total: 8000, status: 'draft', issue_date: '2024-01-05', due_date: '2024-02-05' }
        ])

        commit('SET_MONTHLY_REVENUE', [
          { month: 'يناير', revenue: 1200000 },
          { month: 'فبراير', revenue: 1500000 },
          { month: 'مارس', revenue: 1300000 }
        ])
      }
    } finally {
      NProgress.done()
      commit('SET_LOADING', false)
    }
  },

  async refreshDashboardData({ dispatch }) {
    await dispatch('fetchDashboardData')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
