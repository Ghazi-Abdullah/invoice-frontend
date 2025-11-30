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
            <div class="relative">
              <input
                type="text"
                :placeholder="$t('buttons.search')"
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ $t('dashboard.title') }}</h1>
        <p class="text-gray-600 text-lg">{{ $t('dashboard.welcome') }}</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Invoices Card -->
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
        >
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
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
        >
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
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
        >
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
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
        >
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

          <!-- Recent Activity (Real Data) -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">{{ $t('clients.recent_activity') }}</h2>
              <span class="text-blue-600 text-sm font-medium">{{
                $t('messages.live_updates')
              }}</span>
            </div>
            <div class="space-y-4">
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

              <div
                v-for="client in recentClients"
                :key="client.id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
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
                    {{ $t('clients.jopped') }}: {{ formatDate(client.created_at) }}
                  </p>
                </div>
                <div class="text-right">
                  <span
                    class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    {{ $t('common.active') }}
                  </span>
                  <p class="text-gray-500 text-xs mt-1">
                    {{ client.phone || $t('clients.notProvided') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - 1/3 width -->
        <div class="space-y-8">
          <!-- Recent Clients Summary -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{{ $t('clients.summary') }}</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                  <p class="text-2xl font-bold text-blue-600">{{ stats.totalClients }}</p>
                  <p class="text-blue-800 text-sm">{{ $t('clients.stats.total') }}</p>
                </div>
                <div class="bg-green-50 p-4 rounded-lg text-center">
                  <p class="text-2xl font-bold text-green-600">{{ stats.newClientsThisMonth }}</p>
                  <p class="text-green-800 text-sm">{{ $t('clients.stats.newThisMonth') }}</p>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <h3 class="font-semibold text-gray-900 mb-3">
                  {{ $t('clients.stats.distribution') }}
                </h3>
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 text-sm">{{
                      $t('clients.stats.active_clients')
                    }}</span>
                    <span class="font-semibold">{{ stats.totalClients }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600 text-sm">{{ $t('clients.stats.growth') }}</span>
                    <span class="text-green-600 font-semibold">+{{ stats.clientsGrowth }}%</span>
                  </div>
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

          <!-- System Status -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('common.system_status') }}</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">{{ $t('common.database') }}</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {{ $t('common.connected') }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">{{ $t('common.server') }}</span>
                <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {{ $t('common.running') }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">{{ $t('common.last_update') }}</span>
                <span class="text-gray-500 text-xs">{{ currentTime }}</span>
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
      currentTime: new Date().toLocaleTimeString('ar-SA'),
    }
  },
  computed: {
    stats() {
      const clientStats = {
        totalClients: this.$store.getters['clients/totalClients'],
        newClientsThisMonth: 0,
        clientsGrowth: 10,
      }

      const invoiceStats = this.$store.getters['invoices/invoiceStats']

      return {
        totalInvoices: invoiceStats.total,
        ...clientStats,
        paidInvoices: invoiceStats.paid,
        revenue: invoiceStats.totalAmount,
        paymentRate:
          invoiceStats.total > 0 ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0,
        thisMonthInvoices: 0,
        averageInvoice:
          invoiceStats.total > 0 ? (invoiceStats.totalAmount / invoiceStats.total).toFixed(2) : 0,
        collectionRate:
          invoiceStats.total > 0 ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0,
      }
    },
    recentClients() {
      const clientsData = this.$store.state.clients.clients.data
      if (!clientsData || !Array.isArray(clientsData)) {
        return []
      }

      return clientsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
      }).format(amount)
    },

    formatDate(dateString) {
      if (!dateString) return this.$t('clients.notProvided')
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

    async loadStats() {
      try {
        await this.$store.dispatch('clients/fetchClients')
        await this.$store.dispatch('invoices/fetchInvoices')
      } catch (error) {
        console.error('Error loading dashboard stats:', error)
      }
    },
  },
  mounted() {
    this.loadStats()

    // تحديث الوقت كل دقيقة
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString('ar-SA')
    }, 60000)
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
