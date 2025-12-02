<template>
  <div class="dashboard-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-gray-900">{{ $t('app.name') }}</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="loadDashboardData" class="btn btn-primary">
              {{ $t('buttons.refresh') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">{{ $t('messages.loading') }}...</p>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('dashboard.title') }}</h1>
        <p class="text-gray-600 text-lg">{{ $t('dashboard.welcome') }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Invoices Card -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.total_invoices') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalInvoices }}</p>
              <div class="flex items-center mt-2">
                <span class="text-green-600 text-sm font-medium">+12%</span>
                <span class="text-gray-500 text-sm mr-2">{{ $t('common.from_last_month') }}</span>
              </div>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Clients Card -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.total_clients') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalClients }}</p>
              <div class="flex items-center mt-2">
                <span class="text-green-600 text-sm font-medium">+{{ stats.clientsGrowth }}%</span>
                <span class="text-gray-500 text-sm mr-2">{{ $t('common.from_last_month') }}</span>
              </div>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Paid Invoices Card -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.paid') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.paidInvoices }}</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  :style="{ width: stats.paymentRate + '%' }"
                ></div>
              </div>
              <p class="text-gray-500 text-sm mt-2">
                {{ $t('invoices.payment_rate') }} {{ stats.paymentRate }}%
              </p>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.total_revenue') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ formatCurrency(stats.revenue) }}
              </p>
              <div class="flex items-center mt-2">
                <span class="text-green-600 text-sm font-medium">+15%</span>
                <span class="text-gray-500 text-sm mr-2">{{ $t('common.from_last_month') }}</span>
              </div>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg">
              <svg
                class="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - 2/3 width -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{{ $t('buttons.quick_actions') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <router-link
                to="/invoices/create"
                class="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <div class="p-2 bg-blue-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ $t('invoices.create') }}</h3>
                  <p class="text-gray-600 text-sm">{{ $t('invoices.add_new') }}</p>
                </div>
              </router-link>

              <router-link
                to="/clients/create"
                class="flex items-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <div class="p-2 bg-green-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ $t('clients.addClient') }}</h3>
                  <p class="text-gray-600 text-sm">{{ $t('clients.add_new') }}</p>
                </div>
              </router-link>

              <router-link
                to="/invoices"
                class="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200"
              >
                <div class="p-2 bg-purple-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ $t('invoices.view_all') }}</h3>
                  <p class="text-gray-600 text-sm">{{ $t('invoices.view_manage') }}</p>
                </div>
              </router-link>

              <router-link
                to="/clients"
                class="flex items-center p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors duration-200"
              >
                <div class="p-2 bg-yellow-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">{{ $t('clients.view_all') }}</h3>
                  <p class="text-gray-600 text-sm">{{ $t('clients.view_manage') }}</p>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Recent Clients -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">{{ $t('clients.recent_activity') }}</h2>
              <router-link
                to="/clients"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {{ $t('buttons.view_all') }}
              </router-link>
            </div>

            <div v-if="recentClients.length === 0" class="text-center py-8">
              <svg
                class="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p class="text-gray-500">{{ $t('clients.no_clients_yet') }}</p>
              <router-link
                to="/clients/create"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                {{ $t('clients.add_first_client') }}
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="client in recentClients"
                :key="client.id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                @click="$router.push(`/clients/${client.id}`)"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                >
                  {{ getInitials(client.name) }}
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ client.name }}</p>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ client.email || $t('clients.notProvided') }}
                  </p>
                  <p class="text-gray-500 text-xs mt-1">
                    {{ $t('clients.joined') }}: {{ formatDate(client.created_at) }}
                  </p>
                </div>
                <div class="text-right">
                  <span
                    class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {{ $t('common.active') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - 1/3 width -->
        <div class="space-y-8">
          <!-- Recent Invoices -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">{{ $t('invoices.recent_invoices') }}</h2>
              <router-link
                to="/invoices"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {{ $t('buttons.view_all') }}
              </router-link>
            </div>

            <div v-if="recentInvoices.length === 0" class="text-center py-8">
              <svg
                class="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
              <p class="text-gray-500">{{ $t('invoices.no_invoices_yet') }}</p>
              <router-link
                to="/invoices/create"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                {{ $t('invoices.create_first') }}
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="invoice in recentInvoices"
                :key="invoice.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                @click="$router.push(`/invoices/${invoice.id}`)"
              >
                <div>
                  <p class="font-semibold text-gray-900">{{ invoice.invoice_number }}</p>
                  <p class="text-gray-600 text-sm mt-1">{{ invoice.client?.name || 'N/A' }}</p>
                  <p class="text-gray-500 text-xs mt-1">
                    {{ $t('invoices.due_date') }}: {{ formatDate(invoice.due_date) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">{{ formatCurrency(invoice.total_amount) }}</p>
                  <span
                    :class="getStatusClass(invoice.status)"
                    class="inline-block px-2 py-1 text-xs rounded-full mt-1"
                  >
                    {{ $t(`invoices.status.${invoice.status}`) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div
            class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white"
          >
            <h3 class="text-lg font-bold mb-4">{{ $t('common.quick_stats') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-blue-100">{{ $t('invoices.this_month') }}</span>
                <span class="font-semibold">{{ stats.thisMonthInvoices }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">{{ $t('common.new_clients') }}</span>
                <span class="font-semibold">{{ stats.newClientsThisMonth }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">{{ $t('invoices.average') }}</span>
                <span class="font-semibold">{{ formatCurrency(stats.averageInvoice) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">{{ $t('common.collection_rate') }}</span>
                <span class="font-semibold">{{ stats.collectionRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      loading: true,
      recentClients: [],
      recentInvoices: [],
      stats: {
        totalClients: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        revenue: 0,
        thisMonthInvoices: 0,
        newClientsThisMonth: 0,
        averageInvoice: 0,
        collectionRate: 0,
        clientsGrowth: 10,
        paymentRate: 0,
      },
    }
  },
  mounted() {
    this.loadDashboardData()
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
      }).format(amount || 0)
    },
    formatDate(dateString) {
      if (!dateString) return this.$t('common.not_provided')
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
    getInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
    getStatusClass(status) {
      const classes = {
        paid: 'bg-green-100 text-green-800',
        sent: 'bg-blue-100 text-blue-800',
        draft: 'bg-gray-100 text-gray-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },
    async loadDashboardData() {
      this.loading = true
      try {
        console.log('🔄 جلب بيانات Dashboard...')

        // جلب العملاء
        console.log('📋 جلب العملاء...')
        const clientsResponse = await this.$store.dispatch('clients/fetchClients')
        console.log('📦 استجابة العملاء:', clientsResponse)

        // جلب الفواتير
        console.log('🧾 جلب الفواتير...')
        const invoicesResponse = await this.$store.dispatch('invoices/fetchInvoices')
        console.log('📦 استجابة الفواتير:', invoicesResponse)

        // تحديث البيانات
        this.updateDashboardData()
      } catch (error) {
        console.error('❌ خطأ في تحميل بيانات Dashboard:', error)
        this.$toast.error(this.$t('messages.load_error'))
      } finally {
        this.loading = false
      }
    },
    updateDashboardData() {
      // الحصول على البيانات من الـ store
      const clients = this.$store.state.clients.clients.data || []
      const invoices = this.$store.state.invoices.invoices.data || []

      console.log('📊 العملاء من الـ store:', clients)
      console.log('📊 الفواتير من الـ store:', invoices)

      // تحديث العملاء الأخيرة
      this.recentClients = [...clients]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)

      // تحديث الفواتير الأخيرة
      this.recentInvoices = [...invoices]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)

      // حساب الإحصائيات
      this.calculateStats(clients, invoices)
    },
    calculateStats(clients, invoices) {
      const now = new Date()
      const thisMonth = now.getMonth()
      const thisYear = now.getFullYear()

      // إحصائيات العملاء
      this.stats.totalClients = clients.length
      this.stats.newClientsThisMonth = clients.filter((client) => {
        const clientDate = new Date(client.created_at)
        return clientDate.getMonth() === thisMonth && clientDate.getFullYear() === thisYear
      }).length

      // إحصائيات الفواتير
      this.stats.totalInvoices = invoices.length
      this.stats.paidInvoices = invoices.filter((inv) => inv.status === 'paid').length
      this.stats.revenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0)
      this.stats.thisMonthInvoices = invoices.filter((invoice) => {
        const invoiceDate = new Date(invoice.created_at)
        return invoiceDate.getMonth() === thisMonth && invoiceDate.getFullYear() === thisYear
      }).length

      // معدلات
      this.stats.paymentRate =
        this.stats.totalInvoices > 0
          ? Math.round((this.stats.paidInvoices / this.stats.totalInvoices) * 100)
          : 0

      this.stats.averageInvoice =
        this.stats.totalInvoices > 0
          ? (this.stats.revenue / this.stats.totalInvoices).toFixed(2)
          : 0

      this.stats.collectionRate = this.stats.paymentRate

      console.log('📈 الإحصائيات المحسوبة:', this.stats)
    },
  },
}
</script>

<style scoped>
.dashboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.min-h-screen {
  min-height: 100vh;
}

.grid {
  display: grid;
}

.gap-6 {
  gap: 1.5rem;
}

.gap-8 {
  gap: 2rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: 1fr;
  }

  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .lg\:col-span-2 {
    grid-column: span 2 / span 2;
  }
}
</style>
