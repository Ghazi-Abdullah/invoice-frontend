import axios from '@/api/axios'

export default {
  namespaced: true,

  state: () => ({
    stats: {
      totalClients: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      revenue: 0,
      thisMonthInvoices: 0,
      newClientsThisMonth: 0,
      averageInvoice: 0,
      collectionRate: 0,
      clientsGrowth: 0,
      invoiceGrowth: 0,
      revenueGrowth: 0,
      paymentRate: 0,
    },
    recentClients: [],
    recentInvoices: [],
    monthlyRevenue: [],
    overdueInvoices: [],
    recentActivity: [],
    loading: false,
    error: null
  }),

  getters: {
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
      if (!amount) return '0.00 ر.س'
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
      if (!name) return '?'
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
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusText: () => (status) => {
      const texts = {
        paid: 'مدفوعة',
        sent: 'مرسلة',
        draft: 'مسودة',
        overdue: 'متأخرة',
      }
      return texts[status] || status
    }
  },

  mutations: {
    SET_STATS(state, stats) {
      state.stats = { ...state.stats, ...stats }
    },

    SET_RECENT_CLIENTS(state, clients) {
      state.recentClients = Array.isArray(clients) ? clients : []
    },

    SET_RECENT_INVOICES(state, invoices) {
      state.recentInvoices = Array.isArray(invoices) ? invoices : []
    },

    SET_MONTHLY_REVENUE(state, revenue) {
      state.monthlyRevenue = Array.isArray(revenue) ? revenue : []
    },

    SET_OVERDUE_INVOICES(state, invoices) {
      state.overdueInvoices = Array.isArray(invoices) ? invoices : []
    },

    SET_RECENT_ACTIVITY(state, activity) {
      state.recentActivity = Array.isArray(activity) ? activity : []
    },

    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    async fetchDashboardData({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        console.log('📊 جلب بيانات الداشبورد...')

        // استخدام المسار الرئيسي الذي يجلب كل البيانات في مرة واحدة
        const response = await axios.get('/admin/dashboard')

        if (response.data.status) {
          const data = response.data.data

          // تحديث جميع البيانات
          commit('SET_STATS', data.stats || {})
          commit('SET_RECENT_CLIENTS', data.recentClients || [])
          commit('SET_RECENT_INVOICES', data.recentInvoices || [])
          commit('SET_MONTHLY_REVENUE', data.monthlyRevenue || [])
          commit('SET_OVERDUE_INVOICES', data.overdueInvoices || [])
          commit('SET_RECENT_ACTIVITY', data.recentActivity || [])

          console.log('✅ تم جلب بيانات الداشبورد بنجاح')
          return data
        } else {
          throw new Error(response.data.message || 'فشل في جلب بيانات الداشبورد')
        }
      } catch (error) {
        console.error('❌ خطأ في جلب بيانات الداشبورد:', error)

        let errorMessage = 'حدث خطأ في جلب بيانات الداشبورد'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async calculateDashboardData({ commit, rootGetters }) {
      try {
        console.log('🔄 حساب إحصائيات الداشبورد من البيانات المحلية...')

        // الحصول على البيانات من المتاجر الأخرى
        const clients = rootGetters['clients/clients'] || []
        const invoices = rootGetters['invoices/invoices'] || []

        // تأكد أن البيانات هي مصفوفات
        const clientsArray = Array.isArray(clients) ? clients : []
        const invoicesArray = Array.isArray(invoices) ? invoices : []

        // حساب الإحصائيات الأساسية
        const now = new Date()
        const thisMonth = now.getMonth()
        const thisYear = now.getFullYear()

        // إحصائيات العملاء
        const totalClients = clientsArray.length

        // العملاء الجدد هذا الشهر
        const newClientsThisMonth = clientsArray.filter((client) => {
          try {
            const clientDate = new Date(client.created_at)
            return clientDate.getMonth() === thisMonth && clientDate.getFullYear() === thisYear
          } catch (error) {
            return false
          }
        }).length

        // إحصائيات الفواتير
        const totalInvoices = invoicesArray.length

        // الفواتير المدفوعة
        const paidInvoices = invoicesArray.filter((inv) => inv.status === 'paid').length

        // إجمالي الإيرادات
        const revenue = invoicesArray.reduce((sum, inv) => {
          const amount = parseFloat(inv.total || inv.total_amount || 0)
          return isNaN(amount) ? sum : sum + amount
        }, 0)

        // الفواتير هذا الشهر
        const thisMonthInvoices = invoicesArray.filter((invoice) => {
          try {
            const invoiceDate = new Date(invoice.created_at)
            return invoiceDate.getMonth() === thisMonth && invoiceDate.getFullYear() === thisYear
          } catch (error) {
            return false
          }
        }).length

        // حساب المعدلات والنسب
        const paymentRate = totalInvoices > 0
          ? Math.round((paidInvoices / totalInvoices) * 100)
          : 0

        const averageInvoice = totalInvoices > 0
          ? parseFloat((revenue / totalInvoices).toFixed(2))
          : 0

        // تحديث العملاء الحديثين (آخر 5)
        const recentClients = [...clientsArray]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)

        // تحديث الفواتير الحديثة (آخر 5)
        const recentInvoices = [...invoicesArray]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)

        // تحديث الحالة
        commit('SET_STATS', {
          totalClients,
          totalInvoices,
          paidInvoices,
          revenue,
          thisMonthInvoices,
          newClientsThisMonth,
          averageInvoice,
          collectionRate: paymentRate,
          clientsGrowth: 0,
          invoiceGrowth: 0,
          revenueGrowth: 0,
          paymentRate
        })

        commit('SET_RECENT_CLIENTS', recentClients)
        commit('SET_RECENT_INVOICES', recentInvoices)

        console.log('✅ تم حساب إحصائيات الداشبورد محلياً')

        return {
          stats: this.state.stats,
          recentClients,
          recentInvoices
        }
      } catch (error) {
        console.error('❌ خطأ في حساب بيانات الداشبورد:', error)
        commit('SET_ERROR', error.message)
        throw error
      }
    },

    async refreshDashboardData({ dispatch }) {
      try {
        console.log('🔄 تحديث بيانات الداشبورد...')

        // جلب أحدث البيانات من الخادم
        await Promise.all([
          dispatch('clients/fetchClients', {}, { root: true }),
          dispatch('invoices/fetchInvoices', {}, { root: true })
        ])

        // إعادة حساب إحصائيات الداشبورد
        await dispatch('calculateDashboardData')

        console.log('✅ تم تحديث بيانات الداشبورد')
        return true
      } catch (error) {
        console.error('❌ خطأ في تحديث بيانات الداشبورد:', error)
        throw error
      }
    }
  }
}
