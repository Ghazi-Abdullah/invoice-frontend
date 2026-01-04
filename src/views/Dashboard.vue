<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-gray-900">{{ $t('nav.dashboard') }}</h1>
            </div>
            <div class="hidden md:flex items-center space-x-2">
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                <i class="fas fa-circle text-green-500 mr-1 animate-pulse"></i>
                {{ $t('common.live') }}
              </span>
              <span class="text-gray-500 text-sm">
                {{ $t('dashboard.last_updated') }}: {{ lastUpdated }}
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshDashboard"
              class="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow"
              :disabled="loading"
            >
              <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
              <i v-else class="fas fa-sync-alt mr-2"></i>
              {{ loading ? $t('common.updating') : $t('common.refresh') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="initialLoading" class="flex justify-center items-center h-96">
      <div class="text-center">
        <div class="relative">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"
          ></div>
          <i
            class="fas fa-chart-line text-blue-600 text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          ></i>
        </div>
        <p class="mt-4 text-gray-600 font-medium">{{ $t('dashboard.loading_data') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6 shadow-sm"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <div class="p-3 bg-red-100 rounded-full">
              <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
          </div>
          <div class="ml-4">
            <h3 class="text-lg font-semibold text-red-800">{{ $t('common.error') }}</h3>
            <div class="mt-2">
              <p class="text-red-700">{{ error }}</p>
            </div>
            <button
              @click="loadDashboardData"
              class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {{ $t('common.retry') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Banner -->
      <div class="mb-8">
        <div
          class="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold mb-2">
                {{ $t('dashboard.welcome_back') }}, {{ user?.name || $t('common.user') }}!
              </h1>
              <p class="text-blue-100 opacity-90">
                {{ $t('dashboard.overview_subtitle') }}
                <span v-if="isAdmin" class="font-semibold">{{ $t('auth.admin_indicator') }}</span>
              </p>
            </div>
            <div class="mt-4 md:mt-0">
              <div class="flex items-center space-x-2">
                <div class="p-3 bg-white/20 rounded-full">
                  <i class="fas fa-chart-pie text-xl"></i>
                </div>
                <div>
                  <p class="text-sm opacity-90">{{ $t('dashboard.today_performance') }}</p>
                  <p class="text-2xl font-bold">{{ todayPerformance }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Revenue -->
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.total_revenue') }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">
                  {{ formatCurrency(totalRevenue) }}
                </p>
              </div>
              <div class="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <i class="fas fa-money-bill-wave text-white text-xl"></i>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <span
                :class="revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
                class="font-semibold"
              >
                <i
                  :class="revenueGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                  class="mr-1"
                ></i>
                {{ Math.abs(revenueGrowth) }}%
              </span>
              <span class="text-gray-500 mr-2">{{ $t('common.from_last_month') }}</span>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
        </div>

        <!-- Total Invoices -->
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('dashboard.total_invoices') }}
                </p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalInvoices }}</p>
              </div>
              <div class="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <i class="fas fa-file-invoice text-white text-xl"></i>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <span
                :class="invoiceGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
                class="font-semibold"
              >
                <i
                  :class="invoiceGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                  class="mr-1"
                ></i>
                {{ Math.abs(invoiceGrowth) }}%
              </span>
              <span class="text-gray-500 mr-2">{{ $t('common.from_last_month') }}</span>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
        </div>

        <!-- Active Clients -->
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.total_clients') }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalClients }}</p>
              </div>
              <div class="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                <i class="fas fa-users text-white text-xl"></i>
              </div>
            </div>
            <div class="flex items-center text-sm">
              <span
                :class="clientsGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
                class="font-semibold"
              >
                <i
                  :class="clientsGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                  class="mr-1"
                ></i>
                {{ Math.abs(clientsGrowth) }}%
              </span>
              <span class="text-gray-500 mr-2">{{ $t('common.from_last_month') }}</span>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-purple-400 to-violet-500"></div>
        </div>

        <!-- Payment Rate -->
        <div
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('invoices.payment_rate') }}</p>
                <p class="text-2xl font-bold text-gray-900 mt-1">{{ paymentRate }}%</p>
              </div>
              <div class="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                <i class="fas fa-percentage text-white text-xl"></i>
              </div>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                class="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: paymentRate + '%' }"
              ></div>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart -->
        <div
          v-if="hasPermission('view_sales_report')"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('dashboard.revenue_trend') }}
              </h3>
              <p class="text-gray-500 text-sm">{{ $t('dashboard.last_6_months') }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                v-for="period in chartPeriods"
                :key="period.value"
                @click="changeChartPeriod('revenue', period.value)"
                :class="[
                  'px-3 py-1 text-sm rounded-lg transition-colors',
                  revenuePeriod === period.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                ]"
              >
                {{ period.label }}
              </button>
            </div>
          </div>
          <div class="h-80">
            <LineChart
              :chartData="revenueChartData"
              :options="lineChartOptions"
              :key="'revenue-' + revenuePeriod"
            />
          </div>
        </div>

        <!-- Invoice Status Distribution -->
        <div
          v-if="hasPermission('view_invoices')"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('invoices.status_distribution') }}
              </h3>
              <p class="text-gray-500 text-sm">{{ $t('dashboard.current_status') }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-right">
                <div class="flex items-center space-x-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-gray-900">
                      {{ stats?.totalInvoices || 0 }}
                    </div>
                    <div class="text-gray-500 text-xs">{{ $t('invoices.total') }}</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">
                      {{ stats?.paidInvoices || 0 }}
                    </div>
                    <div class="text-gray-500 text-xs">{{ $t('invoices.paid') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Chart Section -->
            <div class="lg:col-span-2">
              <div class="h-64">
                <DoughnutChart
                  :chartData="invoiceStatusChartData"
                  :options="doughnutChartOptions"
                />
              </div>
            </div>

            <!-- Status Stats -->
            <div class="space-y-4">
              <div
                v-for="status in invoiceStatuses"
                :key="status.status"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <div
                    class="w-3 h-3 rounded-full mr-3"
                    :style="{ backgroundColor: status.color }"
                  ></div>
                  <div>
                    <p class="font-medium text-gray-900">{{ status.label }}</p>
                    <p class="text-gray-500 text-sm">
                      {{ $t('invoices.statuses.' + status.status) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{{ status.value }}</p>
                  <p class="text-gray-500 text-sm">{{ status.percentage }}%</p>
                </div>
              </div>

              <!-- Summary Card -->
              <!--<div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-blue-800">
                      {{ $t('invoices.payment_rate') }}
                    </p>
                    <p class="text-2xl font-bold text-blue-900">{{ stats?.paymentRate || 0 }}%</p>
                  </div>
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <i class="fas fa-chart-line text-blue-600 text-xl"></i>
                  </div>
                </div>
                <div class="w-full bg-blue-200 rounded-full h-2 mt-3">
                  <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    :style="{ width: (stats?.paymentRate || 0) + '%' }"
                  ></div>
                </div>
              </div>-->
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Charts & Recent Activity -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Monthly Performance Chart -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ $t('dashboard.monthly_performance') }}
                </h3>
                <p class="text-gray-500 text-sm">{{ $t('dashboard.invoices_vs_revenue') }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">{{ $t('dashboard.invoices') }}</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span class="text-sm text-gray-600">{{ $t('dashboard.revenue') }}</span>
                </div>
              </div>
            </div>
            <div class="h-80">
              <BarChart :chartData="performanceChartData" :options="barChartOptions" />
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t('dashboard.recent_activity') }}
              </h3>
              <button
                @click="loadDashboardData"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                <i class="fas fa-sync-alt mr-1"></i>
                {{ $t('common.refresh') }}
              </button>
            </div>
            <div class="space-y-4">
              <div
                v-for="activity in recentActivity"
                :key="activity.id"
                class="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div class="flex-shrink-0">
                  <div
                    :class="getActivityIconClass(activity.type)"
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                  >
                    <i :class="getActivityIcon(activity.type)" class="text-white"></i>
                  </div>
                </div>
                <div class="mr-3 flex-1">
                  <p class="font-medium text-gray-900">{{ activity.title }}</p>
                  <p class="text-gray-500 text-sm mt-1">{{ activity.description }}</p>
                  <p class="text-gray-400 text-xs mt-2">
                    <i class="far fa-clock mr-1"></i>
                    {{ formatTimeAgo(activity.timestamp) }}
                  </p>
                </div>
                <div class="text-right">
                  <span v-if="activity.amount" class="font-semibold text-gray-900">
                    {{ formatCurrency(activity.amount) }}
                  </span>
                </div>
              </div>
              <div v-if="recentActivity.length === 0" class="text-center py-8">
                <i class="fas fa-history text-gray-300 text-4xl mb-4"></i>
                <p class="text-gray-500">{{ $t('dashboard.no_recent_activity') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions & Recent -->
        <div class="space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">
              {{ $t('buttons.quick_actions') }}
            </h3>
            <div class="space-y-3">
              <router-link
                v-if="hasPermission('create_invoice')"
                to="/invoices/create"
                class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group"
              >
                <div
                  class="flex-shrink-0 p-3 bg-blue-600 rounded-lg mr-3 group-hover:scale-110 transition-transform"
                >
                  <i class="fas fa-plus text-white"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ $t('invoices.create_invoice') }}</h4>
                  <p class="text-gray-600 text-sm mt-1">{{ $t('invoices.quick_create') }}</p>
                </div>
                <i
                  class="fas fa-chevron-left text-gray-400 group-hover:text-blue-600 transition-colors"
                ></i>
              </router-link>

              <router-link
                v-if="hasPermission('create_client')"
                to="/clients/create"
                class="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-200 transition-all duration-200 group"
              >
                <div
                  class="flex-shrink-0 p-3 bg-green-600 rounded-lg mr-3 group-hover:scale-110 transition-transform"
                >
                  <i class="fas fa-user-plus text-white"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ $t('clients.addClient') }}</h4>
                  <p class="text-gray-600 text-sm mt-1">{{ $t('clients.quick_add') }}</p>
                </div>
                <i
                  class="fas fa-chevron-left text-gray-400 group-hover:text-green-600 transition-colors"
                ></i>
              </router-link>

              <router-link
                v-if="hasPermission('view_reports')"
                to="/reports"
                class="flex items-center p-4 bg-gradient-to-r from-purple-50 to-violet-100 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-violet-200 transition-all duration-200 group"
              >
                <div
                  class="flex-shrink-0 p-3 bg-purple-600 rounded-lg mr-3 group-hover:scale-110 transition-transform"
                >
                  <i class="fas fa-chart-bar text-white"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-gray-900">{{ $t('reports.title') }}</h4>
                  <p class="text-gray-600 text-sm mt-1">{{ $t('reports.view_insights') }}</p>
                </div>
                <i
                  class="fas fa-chevron-left text-gray-400 group-hover:text-purple-600 transition-colors"
                ></i>
              </router-link>
            </div>
          </div>

          <!-- Top Clients -->
          <div
            v-if="hasPermission('view_clients')"
            class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('dashboard.top_clients') }}</h3>
              <router-link
                to="/clients"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {{ $t('common.view_all') }}
              </router-link>
            </div>
            <div class="space-y-4">
              <div
                v-for="client in topClients"
                :key="client.id"
                class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                @click="goToClient(client.id)"
              >
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold"
                  >
                    {{ getInitials(client.name) }}
                  </div>
                </div>
                <div class="mr-3 flex-1">
                  <p class="font-medium text-gray-900">{{ client.name }}</p>
                  <p class="text-gray-500 text-sm truncate">
                    {{ client.company_name || $t('clients.noCompany') }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">
                    {{ formatCurrency(client.total_spent || 0) }}
                  </p>
                  <span class="text-green-600 text-xs font-medium">
                    <i class="fas fa-arrow-up mr-1"></i>
                    {{ client.growth || 0 }}%
                  </span>
                </div>
              </div>
              <div v-if="topClients.length === 0" class="text-center py-4">
                <p class="text-gray-500">{{ $t('clients.no_clients') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

export default {
  name: 'Dashboard',

  components: {
    LineChart,
    BarChart,
    DoughnutChart,
  },

  data() {
    return {
      initialLoading: true,
      revenuePeriod: '6m',
      chartPeriods: [
        { label: '1M', value: '1m' },
        { label: '3M', value: '3m' },
        { label: '6M', value: '6m' },
        { label: '1Y', value: '1y' },
      ],
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#374151',
              font: {
                family: "'Inter', sans-serif",
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${this.formatCurrency(context.raw)}`
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
            },
            ticks: {
              color: '#6b7280',
            },
          },
          y: {
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
            },
            ticks: {
              color: '#6b7280',
              callback: (value) => {
                return this.formatCurrency(value)
              },
            },
          },
        },
      },
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#374151',
              font: {
                family: "'Inter', sans-serif",
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
            },
            ticks: {
              color: '#6b7280',
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
            },
            ticks: {
              color: '#6b7280',
              callback: (value) => {
                if (value >= 1000) {
                  return (value / 1000).toFixed(0) + 'K'
                }
                return value
              },
            },
          },
        },
      },
      doughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#374151',
              font: {
                family: "'Inter', sans-serif",
                size: 11,
              },
              padding: 20,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            callbacks: {
              label: (context) => {
                const label = context.label || ''
                const value = context.raw || 0
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = total > 0 ? Math.round((value / total) * 100) : 0
                return `${label}: ${value} ${this.$t('common.invoices')} (${percentage}%)`
              },
            },
          },
        },
      },
    }
  },

  computed: {
    ...mapState('auth', ['user', 'permissions', 'is_admin']),
    ...mapState('dashboard', ['stats', 'loading', 'error']),
    ...mapGetters('dashboard', [
      'recentClients',
      'recentInvoices',
      'formatCurrency',
      'formatDate',
      'getInitials',
    ]),
    ...mapGetters('auth', ['hasPermission']),

    // البيانات الحقيقية من قاعدة البيانات
    totalInvoices() {
      return this.stats?.totalInvoices || 0
    },

    paidInvoices() {
      return this.stats?.paidInvoices || 0
    },

    pendingInvoices() {
      return this.stats?.pendingInvoices || 0
    },

    overdueInvoices() {
      return this.stats?.overdueInvoices || 0
    },

    draftInvoices() {
      return this.stats?.draftInvoices || 0
    },

    totalClients() {
      return this.stats?.totalClients || 0
    },

    totalRevenue() {
      return this.stats?.revenue || 0
    },

    paidAmount() {
      return this.stats?.paidAmount || 0
    },

    pendingAmount() {
      return this.stats?.pendingAmount || 0
    },

    overdueAmount() {
      return this.stats?.overdueAmount || 0
    },

    draftAmount() {
      return this.stats?.draftAmount || 0
    },

    paymentRate() {
      return this.stats?.paymentRate || 0
    },

    collectionRate() {
      const total = this.totalRevenue || 0
      const paid = this.paidAmount || 0
      return total > 0 ? Math.round((paid / total) * 100) : 0
    },

    revenueGrowth() {
      return this.stats?.revenueGrowth || 0
    },

    invoiceGrowth() {
      return this.stats?.invoiceGrowth || 0
    },

    clientsGrowth() {
      return this.stats?.clientsGrowth || 0
    },

    averagePendingDays() {
      return this.stats?.averagePendingDays || 7
    },

    averageOverdueDays() {
      return this.stats?.averageOverdueDays || 15
    },

    activeUsers() {
      return this.stats?.activeUsers || 0
    },

    todayPerformance() {
      // حساب الأداء اليومي بناءً على نسبة الفواتير المدفوعة اليوم
      const todayPaid = this.stats?.todayPaidInvoices || 0
      const todayTotal = this.stats?.todayTotalInvoices || 1
      return Math.round((todayPaid / todayTotal) * 100)
    },

    isAdmin() {
      return this.is_admin || false
    },

    lastUpdated() {
      return new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    invoiceStatusChartData() {
      const statuses = this.invoiceStatuses

      return {
        labels: statuses.map((s) => s.label),
        datasets: [
          {
            data: statuses.map((s) => s.value),
            backgroundColor: statuses.map((s) => s.color),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 20,
          },
        ],
      }
    },

    invoiceStatuses() {
      const statuses = [
        {
          status: 'paid',
          label: this.$t('invoices.statuses.paid'),
          value: this.paidInvoices,
          color: '#10b981',
          icon: 'fa-check-circle',
          amount: this.paidAmount,
        },
        {
          status: 'sent',
          label: this.$t('invoices.statuses.sent'),
          value: this.pendingInvoices,
          color: '#f59e0b',
          icon: 'fa-clock',
          amount: this.pendingAmount,
        },
        {
          status: 'overdue',
          label: this.$t('invoices.statuses.overdue'),
          value: this.overdueInvoices,
          color: '#ef4444',
          icon: 'fa-exclamation-triangle',
          amount: this.overdueAmount,
        },
        {
          status: 'draft',
          label: this.$t('invoices.statuses.draft'),
          value: this.draftInvoices,
          color: '#6b7280',
          icon: 'fa-file-alt',
          amount: this.draftAmount,
        },
      ]

      const total = statuses.reduce((sum, s) => sum + s.value, 0)

      return statuses.map((status) => ({
        ...status,
        percentage: total > 0 ? Math.round((status.value / total) * 100) : 0,
      }))
    },

    revenueChartData() {
      const periods =
        this.revenuePeriod === '1m'
          ? 1
          : this.revenuePeriod === '3m'
            ? 3
            : this.revenuePeriod === '6m'
              ? 6
              : 12

      const labels = this.generateMonthLabels(periods)

      // هنا يمكن استبدال البيانات الافتراضية ببيانات حقيقية من API
      const revenueData = this.generateRevenueData(periods)

      return {
        labels,
        datasets: [
          {
            label: this.$t('dashboard.revenue'),
            data: revenueData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          },
        ],
      }
    },

    performanceChartData() {
      // يمكن استبدال هذا ببيانات حقيقية من API
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']

      return {
        labels: months,
        datasets: [
          {
            label: this.$t('dashboard.invoices'),
            data: [120, 150, 180, 200, 220, 240],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 6,
          },
          {
            label: this.$t('dashboard.revenue'),
            data: [25000, 32000, 40000, 45000, 52000, 60000],
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderRadius: 6,
          },
        ],
      }
    },

    recentActivity() {
      // يمكن استبدال هذا ببيانات حقيقية من API
      return [
        {
          id: 1,
          type: 'invoice_paid',
          title: 'فاتورة مدفوعة',
          description: 'فاتورة #INV-2024-001 تم دفعها',
          amount: 1250,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        },
        {
          id: 2,
          type: 'client_added',
          title: 'عميل جديد',
          description: 'شركة التقنية المتطورة تمت إضافتها',
          timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
        },
        {
          id: 3,
          type: 'invoice_created',
          title: 'فاتورة جديدة',
          description: 'فاتورة #INV-2024-002 تم إنشاؤها',
          amount: 850,
          timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
        },
      ]
    },

    topClients() {
      return (this.recentClients || []).slice(0, 5).map((client) => ({
        ...client,
        total_spent: client.total_spent || 0,
        growth: client.growth || 0,
      }))
    },
  },

  async mounted() {
    await this.loadDashboardData()
    this.initialLoading = false
  },

  methods: {
    ...mapActions('dashboard', ['fetchDashboardData', 'refreshDashboardData']),

    async loadDashboardData() {
      try {
        await this.fetchDashboardData()
        this.$toast.success(this.$t('dashboard.data_loaded'), {
          position: 'top-right',
          timeout: 3000,
        })
      } catch (error) {
        this.$toast.error(this.$t('dashboard.data_load_error'), {
          position: 'top-right',
          timeout: 5000,
        })
      }
    },

    async refreshDashboard() {
      try {
        await this.refreshDashboardData()
        this.$toast.success(this.$t('dashboard.data_refreshed'), {
          position: 'top-right',
          timeout: 3000,
        })
      } catch (error) {
        this.$toast.error(this.$t('dashboard.refresh_error'), {
          position: 'top-right',
          timeout: 5000,
        })
      }
    },

    goToClient(id) {
      if (this.hasPermission('view_clients')) {
        this.$router.push(`/clients/${id}`)
      }
    },

    changeChartPeriod(type, period) {
      if (type === 'revenue') {
        this.revenuePeriod = period
      }
    },

    generateMonthLabels(months) {
      const labels = []
      const now = new Date()

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labels.push(date.toLocaleDateString('ar-SA', { month: 'short' }))
      }

      return labels
    },

    generateRevenueData(months) {
      // هذا مثال، يمكن استبداله ببيانات حقيقية من API
      const data = []
      let base = 10000

      for (let i = 0; i < months; i++) {
        const growth = Math.random() * 0.2 + 0.1 // 10-30% growth
        base *= 1 + growth
        data.push(Math.round(base))
      }

      return data
    },

    getStatusIcon(status) {
      const icons = {
        paid: 'fas fa-check-circle',
        sent: 'fas fa-clock',
        overdue: 'fas fa-exclamation-triangle',
        draft: 'fas fa-file-alt',
      }
      return icons[status] || 'fas fa-question-circle'
    },

    filterByStatus(status) {
      this.$router.push({
        path: '/invoices',
        query: { status },
      })
    },

    createInvoice() {
      if (this.hasPermission('create_invoice')) {
        this.$router.push('/invoices/create')
      }
    },

    viewOverdueInvoices() {
      if (this.hasPermission('view_invoices') && this.overdueInvoices > 0) {
        this.$router.push({
          path: '/invoices',
          query: { status: 'overdue' },
        })
      }
    },

    generateReport() {
      if (this.hasPermission('view_reports')) {
        this.$router.push('/reports')
      }
    },

    async refreshInvoiceStats() {
      try {
        await this.$store.dispatch('dashboard/fetchDashboardData')
        this.$toast.success('تم تحديث إحصائيات الفواتير')
      } catch (error) {
        this.$toast.error('فشل في تحديث الإحصائيات')
      }
    },

    getActivityIcon(type) {
      const iconMap = {
        invoice_paid: 'fa-check-circle',
        invoice_created: 'fa-file-invoice',
        client_added: 'fa-user-plus',
        payment_received: 'fa-money-bill-wave',
        invoice_updated: 'fa-edit',
      }
      return iconMap[type] || 'fa-bell'
    },

    getActivityIconClass(type) {
      const colorMap = {
        invoice_paid: 'bg-green-500',
        invoice_created: 'bg-blue-500',
        client_added: 'bg-purple-500',
        payment_received: 'bg-emerald-500',
        invoice_updated: 'bg-amber-500',
      }
      return colorMap[type] || 'bg-gray-500'
    },

    formatTimeAgo(date) {
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (days > 0) return `قبل ${days} يوم`
      if (hours > 0) return `قبل ${hours} ساعة`
      if (minutes > 0) return `قبل ${minutes} دقيقة`
      return 'الآن'
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.dashboard-container {
  font-family: 'Inter', sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Card hover effects */
.hover\:shadow-xl {
  transition: box-shadow 0.3s ease-in-out;
}

/* Gradient animations */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Pulse animation for live indicator */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Bounce animation */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.hover\:scale-110 {
  transition: transform 0.3s ease;
}

/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dashboard-container > * {
  animation: fadeIn 0.5s ease-out;
}

/* Status colors */
.status-paid {
  @apply text-green-600 bg-green-50 border-green-200;
}

.status-pending {
  @apply text-amber-600 bg-amber-50 border-amber-200;
}

.status-overdue {
  @apply text-red-600 bg-red-50 border-red-200;
}

.status-draft {
  @apply text-gray-600 bg-gray-50 border-gray-200;
}
</style>
