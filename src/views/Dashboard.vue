<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <!-- Enhanced Header -->
    <div
      class="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/60 sticky top-0 z-10"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <h1
                class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              >
                {{ $t('nav.dashboard') }}
              </h1>
            </div>
            <div class="hidden md:flex items-center space-x-3">
              <div class="relative group">
                <span
                  class="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-800 text-sm rounded-full flex items-center space-x-2"
                >
                  <span class="relative flex h-2 w-2">
                    <span
                      class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
                    ></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span class="font-medium">{{ $t('common.live') }}</span>
                </span>
                <div
                  class="hidden group-hover:block absolute z-20 w-48 p-3 mt-2 bg-white rounded-xl shadow-lg border border-gray-200"
                >
                  <p class="text-xs text-gray-600">{{ $t('dashboard.real_time_update') }}</p>
                </div>
              </div>
              <div class="text-gray-500 text-sm flex items-center">
                <i class="far fa-clock mr-2"></i>
                {{ $t('dashboard.last_updated') }}:
                <span class="font-medium text-gray-700 ml-1">{{ lastUpdated }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="refreshDashboard"
              class="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              :disabled="loading"
            >
              <div class="relative">
                <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
                <i
                  v-else
                  class="fas fa-sync-alt mr-2 group-hover:rotate-180 transition-transform duration-500"
                ></i>
              </div>
              {{ loading ? $t('common.updating') : $t('common.refresh') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Loading State -->
    <div v-if="initialLoading" class="flex justify-center items-center min-h-[70vh]">
      <div class="text-center space-y-6">
        <div class="relative">
          <div class="relative mx-auto w-24 h-24">
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 animate-pulse"
            ></div>
            <div
              class="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500"
            ></div>
            <i
              class="fas fa-chart-line text-2xl text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ></i>
          </div>
          <div class="mt-6">
            <div class="h-1.5 w-48 bg-gray-200 rounded-full overflow-hidden mx-auto">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-[loading_1.5s_ease-in-out_infinite] rounded-full"
              ></div>
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <p class="text-gray-700 font-medium text-lg">{{ $t('dashboard.loading_data') }}</p>
          <p class="text-gray-500 text-sm">{{ $t('dashboard.preparing_insights') }}</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Error State -->
    <div v-else-if="error" class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div
        class="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 rounded-2xl p-8 shadow-sm"
      >
        <div class="flex flex-col items-center text-center space-y-6">
          <div class="relative">
            <div
              class="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
            </div>
            <div
              class="absolute -top-1 -right-1 w-8 h-8 bg-white rounded-full border border-red-200 flex items-center justify-center"
            >
              <i class="fas fa-times text-xs text-red-500"></i>
            </div>
          </div>
          <div class="space-y-3">
            <h3 class="text-2xl font-bold text-gray-900">{{ $t('common.error') }}</h3>
            <p class="text-gray-600">{{ error }}</p>
          </div>
          <div class="flex space-x-4">
            <button
              @click="loadDashboardData"
              class="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-sm hover:shadow-md flex items-center space-x-2"
            >
              <i class="fas fa-redo"></i>
              <span>{{ $t('common.retry') }}</span>
            </button>
            <button
              @click="goToHome"
              class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              {{ $t('common.go_home') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Enhanced Welcome Banner -->
      <div class="mb-8 relative overflow-hidden rounded-2xl">
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-90"
        ></div>
        <div
          class="absolute inset-0 opacity-10"
          :style="{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z%22 fill=%239C92AC fill-opacity=%220.1%22/%3E%3C/svg%3E')`,
          }"
        ></div>

        <div class="relative p-8 text-white">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between">
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <i class="fas fa-chart-line text-xl"></i>
                </div>
                <h1 class="text-3xl font-bold">
                  {{ $t('dashboard.welcome_back') }},
                  <span
                    class="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
                    >{{ user?.name || $t('common.user') }}</span
                  >!
                </h1>
              </div>
              <p class="text-blue-100/80 max-w-2xl">
                {{ $t('dashboard.overview_subtitle') }}
                <span
                  v-if="isAdmin"
                  class="inline-flex items-center px-2 py-1 ml-2 bg-white/20 rounded-lg text-sm font-semibold"
                  >{{ $t('auth.admin_indicator') }}</span
                >
              </p>
            </div>
            <div class="mt-6 lg:mt-0">
              <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div
                      class="w-14 h-14 bg-gradient-to-br from-white/30 to-transparent rounded-full flex items-center justify-center"
                    >
                      <i class="fas fa-chart-pie text-2xl"></i>
                    </div>
                    <div
                      class="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <i class="fas fa-arrow-up text-xs text-white"></i>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm opacity-90">{{ $t('dashboard.today_performance') }}</p>
                    <div class="flex items-baseline space-x-2">
                      <p class="text-3xl font-bold">{{ todayPerformance }}%</p>
                      <span class="text-green-300 text-sm">+{{ todayPerformance - 85 }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Revenue -->
        <div
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-blue-200/50 overflow-hidden"
          @mouseenter="hoveredCard = 'revenue'"
          @mouseleave="hoveredCard = null"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <i
                    class="fas fa-circle text-xs mr-2"
                    :class="
                      hoveredCard === 'revenue' ? 'text-green-500 animate-pulse' : 'text-gray-400'
                    "
                  ></i>
                  {{ $t('dashboard.total_revenue') }}
                </p>
                <p
                  class="text-2xl font-bold text-gray-900 mt-1 transition-transform duration-300 group-hover:scale-105"
                >
                  {{ formatCurrency(totalRevenue) }}
                </p>
              </div>
              <div
                class="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-money-bill-wave text-white text-2xl"></i>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm">
                <span
                  :class="revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
                  class="font-semibold flex items-center"
                >
                  <i
                    :class="revenueGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                    class="mr-1.5"
                  ></i>
                  {{ Math.abs(revenueGrowth) }}%
                </span>
                <span class="text-gray-500 mr-2">{{ $t('common.from_last_month') }}</span>
              </div>
              <button
                v-if="hasPermission('view_sales_report')"
                @click="viewRevenueDetails"
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                <span>View Details</span>
                <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
          <div
            class="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 transform origin-left transition-transform duration-700"
            :class="hoveredCard === 'revenue' ? 'scale-x-100' : 'scale-x-0'"
          ></div>
        </div>

        <!-- Total Invoices -->
        <div
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-blue-200/50 overflow-hidden"
          @mouseenter="hoveredCard = 'invoices'"
          @mouseleave="hoveredCard = null"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <i
                    class="fas fa-circle text-xs mr-2"
                    :class="
                      hoveredCard === 'invoices' ? 'text-blue-500 animate-pulse' : 'text-gray-400'
                    "
                  ></i>
                  {{ $t('dashboard.total_invoices') }}
                </p>
                <p
                  class="text-2xl font-bold text-gray-900 mt-1 transition-transform duration-300 group-hover:scale-105"
                >
                  {{ totalInvoices }}
                </p>
              </div>
              <div
                class="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-file-invoice text-white text-2xl"></i>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm">
                <span
                  :class="invoiceGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
                  class="font-semibold flex items-center"
                >
                  <i
                    :class="invoiceGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                    class="mr-1.5"
                  ></i>
                  {{ Math.abs(invoiceGrowth) }}%
                </span>
                <span class="text-gray-500 mr-2">{{ $t('common.from_last_month') }}</span>
              </div>
              <button
                v-if="hasPermission('view_invoices')"
                @click="viewInvoices"
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                <span>View All</span>
                <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
          <div
            class="h-1.5 bg-gradient-to-r from-blue-400 to-cyan-500 transform origin-left transition-transform duration-700"
            :class="hoveredCard === 'invoices' ? 'scale-x-100' : 'scale-x-0'"
          ></div>
        </div>

        <!-- Active Clients -->
        <div
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-purple-200/50 overflow-hidden"
          @mouseenter="hoveredCard = 'clients'"
          @mouseleave="hoveredCard = null"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-purple-50 to-violet-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <i
                    class="fas fa-circle text-xs mr-2"
                    :class="
                      hoveredCard === 'clients' ? 'text-purple-500 animate-pulse' : 'text-gray-400'
                    "
                  ></i>
                  {{ $t('dashboard.total_clients') }}
                </p>
                <p
                  class="text-2xl font-bold text-gray-900 mt-1 transition-transform duration-300 group-hover:scale-105"
                >
                  {{ totalClients }}
                </p>
              </div>
              <div
                class="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-users text-white text-2xl"></i>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center text-sm">
                <span
                  :class="clientsGrowth >= 0 ? 'text-green-600' : 'text-red-600'"
                  class="font-semibold flex items-center"
                >
                  <i
                    :class="clientsGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                    class="mr-1.5"
                  ></i>
                  {{ Math.abs(clientsGrowth) }}%
                </span>
                <span class="text-gray-500 mr-2">{{ $t('common.from_last_month') }}</span>
              </div>
              <button
                v-if="hasPermission('view_clients')"
                @click="viewClients"
                class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center"
              >
                <span>View All</span>
                <i class="fas fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
          <div
            class="h-1.5 bg-gradient-to-r from-purple-400 to-violet-500 transform origin-left transition-transform duration-700"
            :class="hoveredCard === 'clients' ? 'scale-x-100' : 'scale-x-0'"
          ></div>
        </div>

        <!-- Payment Rate -->
        <div
          class="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-amber-200/50 overflow-hidden"
          @mouseenter="hoveredCard = 'payment'"
          @mouseleave="hoveredCard = null"
        >
          <div
            class="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          ></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm font-medium text-gray-600 mb-2 flex items-center">
                  <i
                    class="fas fa-circle text-xs mr-2"
                    :class="
                      hoveredCard === 'payment' ? 'text-amber-500 animate-pulse' : 'text-gray-400'
                    "
                  ></i>
                  {{ $t('invoices.payment_rate') }}
                </p>
                <p
                  class="text-2xl font-bold text-gray-900 mt-1 transition-transform duration-300 group-hover:scale-105"
                >
                  {{ paymentRate }}%
                </p>
              </div>
              <div
                class="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              >
                <i class="fas fa-percentage text-white text-2xl"></i>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-600">Collection Progress</span>
                <span class="font-semibold text-amber-600">{{ collectionRate }}%</span>
              </div>
              <div class="space-y-2">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    class="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 h-full rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: paymentRate + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 transform origin-left transition-transform duration-700"
            :class="hoveredCard === 'payment' ? 'scale-x-100' : 'scale-x-0'"
          ></div>
        </div>
      </div>

      <!-- Charts Section with Tab Navigation -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Revenue Chart with Tabs -->
        <div
          v-if="hasPermission('view_sales_report')"
          class="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div class="border-b border-gray-200/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ $t('dashboard.revenue_trend') }}
                </h3>
                <p class="text-gray-500 text-sm">{{ $t('dashboard.revenue_insights') }}</p>
              </div>
              <div class="mt-4 sm:mt-0">
                <div class="inline-flex rounded-xl bg-gray-100 p-1">
                  <button
                    v-for="period in chartPeriods"
                    :key="period.value"
                    @click="changeChartPeriod('revenue', period.value)"
                    :class="[
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300',
                      revenuePeriod === period.value
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50',
                    ]"
                  >
                    {{ period.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="h-80">
              <LineChart
                :chartData="revenueChartData"
                :options="enhancedLineChartOptions"
                :key="'revenue-' + revenuePeriod"
              />
            </div>
            <div class="mt-6 pt-6 border-t border-gray-200/50">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-blue-50 rounded-xl">
                  <p class="text-sm text-gray-600 mb-1">Average Monthly</p>
                  <p class="text-xl font-bold text-blue-600">
                    {{ formatCurrency(avgMonthlyRevenue) }}
                  </p>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-xl">
                  <p class="text-sm text-gray-600 mb-1">Growth Rate</p>
                  <p class="text-xl font-bold text-green-600">{{ revenueGrowth }}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoice Status Distribution -->
        <div
          v-if="hasPermission('view_invoices')"
          class="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
        >
          <div class="border-b border-gray-200/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ $t('invoices.status_distribution') }}
                </h3>
                <p class="text-gray-500 text-sm">{{ $t('dashboard.status_overview') }}</p>
              </div>
              <div class="mt-4 sm:mt-0">
                <button
                  @click="viewAllInvoices"
                  class="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 text-sm font-medium flex items-center"
                >
                  <i class="fas fa-external-link-alt mr-2 text-xs"></i>
                  View Details
                </button>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Chart Section -->
              <div class="lg:col-span-2">
                <div class="h-64">
                  <DoughnutChart
                    :chartData="invoiceStatusChartData"
                    :options="enhancedDoughnutChartOptions"
                  />
                </div>
              </div>

              <!-- Status Stats -->
              <div class="space-y-4">
                <div
                  v-for="status in invoiceStatuses"
                  :key="status.status"
                  class="group p-4 bg-gray-50 hover:bg-white rounded-xl border border-gray-200/50 hover:border-gray-300/50 cursor-pointer transition-all duration-300"
                  @click="filterByStatus(status.status)"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300"
                        :style="{
                          backgroundColor: status.color + '20',
                          border: `2px solid ${status.color}`,
                        }"
                      >
                        <i
                          :class="status.icon"
                          class="text-lg"
                          :style="{ color: status.color }"
                        ></i>
                      </div>
                      <div>
                        <p class="font-medium text-gray-900">{{ status.label }}</p>
                        <p class="text-gray-500 text-sm">
                          {{ $t('invoices.statuses.' + status.status) }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900">{{ status.value }}</p>
                      <p class="text-sm" :style="{ color: status.color }">
                        {{ status.percentage }}%
                      </p>
                    </div>
                  </div>
                  <div class="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Amount: {{ formatCurrency(status.amount) }}</span>
                    <span class="group-hover:text-blue-600 transition-colors duration-300">
                      <i class="fas fa-chevron-right ml-1 text-xs"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Charts & Recent Activity -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Monthly Performance Chart -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div class="border-b border-gray-200/50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ $t('dashboard.monthly_performance') }}
                  </h3>
                  <p class="text-gray-500 text-sm">{{ $t('dashboard.invoices_vs_revenue') }}</p>
                </div>
                <div class="mt-4 sm:mt-0 flex items-center space-x-4">
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
            </div>
            <div class="p-6">
              <div class="h-80">
                <BarChart :chartData="performanceChartData" :options="enhancedBarChartOptions" />
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div class="border-b border-gray-200/50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between p-6">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ $t('dashboard.recent_activity') }}
                </h3>
                <div class="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    @click="loadDashboardData"
                    class="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 text-sm font-medium flex items-center"
                  >
                    <i class="fas fa-sync-alt mr-2"></i>
                    {{ $t('common.refresh') }}
                  </button>
                  <button
                    @click="viewAllActivity"
                    class="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="activity in recentActivity"
                  :key="activity.id"
                  class="group flex items-center p-4 hover:bg-gray-50/50 rounded-xl transition-all duration-300 cursor-pointer border border-transparent hover:border-gray-200/50"
                  @click="handleActivityClick(activity)"
                >
                  <div class="flex-shrink-0 relative">
                    <div
                      :class="getActivityIconClass(activity.type)"
                      class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    >
                      <i :class="getActivityIcon(activity.type)" class="text-white text-lg"></i>
                    </div>
                    <div
                      class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center"
                    >
                      <i
                        :class="getActivityActionIcon(activity.type)"
                        class="text-xs text-gray-600"
                      ></i>
                    </div>
                  </div>
                  <div class="mr-4 flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ activity.title }}</p>
                    <p class="text-gray-500 text-sm mt-1 line-clamp-2">
                      {{ activity.description }}
                    </p>
                    <div class="flex items-center mt-2">
                      <i class="far fa-clock text-gray-400 text-xs mr-1.5"></i>
                      <span class="text-gray-400 text-xs">{{
                        formatTimeAgo(activity.timestamp)
                      }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <span v-if="activity.amount" class="font-semibold text-gray-900 block">
                      {{ formatCurrency(activity.amount) }}
                    </span>
                    <span
                      class="text-gray-400 text-xs group-hover:text-blue-600 transition-colors duration-300"
                    >
                      <i class="fas fa-chevron-right"></i>
                    </span>
                  </div>
                </div>
                <div v-if="recentActivity.length === 0" class="text-center py-12">
                  <div
                    class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <i class="fas fa-history text-gray-300 text-2xl"></i>
                  </div>
                  <p class="text-gray-500">{{ $t('dashboard.no_recent_activity') }}</p>
                  <p class="text-gray-400 text-sm mt-1">
                    Start creating invoices to see activity here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Quick Actions & Recent -->
        <div class="space-y-8">
          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div class="border-b border-gray-200/50">
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-bolt text-amber-500 mr-2"></i>
                  {{ $t('buttons.quick_actions') }}
                </h3>
                <p class="text-gray-500 text-sm mt-1">{{ $t('dashboard.quick_access_tools') }}</p>
              </div>
            </div>
            <div class="p-6 space-y-3">
              <router-link
                v-if="hasPermission('create_invoice')"
                to="/invoices/create"
                class="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200/50 rounded-xl hover:from-blue-100 hover:to-blue-200 hover:border-blue-300/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                ></div>
                <div class="relative flex items-center w-full">
                  <div
                    class="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                  >
                    <i class="fas fa-plus text-white"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ $t('invoices.create_invoice') }}</h4>
                    <p class="text-gray-600 text-sm mt-1">{{ $t('invoices.quick_create') }}</p>
                  </div>
                  <i
                    class="fas fa-chevron-left text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300"
                  ></i>
                </div>
              </router-link>

              <router-link
                v-if="hasPermission('create_client')"
                to="/clients/create"
                class="group flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-100/50 border border-green-200/50 rounded-xl hover:from-green-100 hover:to-emerald-200 hover:border-green-300/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                ></div>
                <div class="relative flex items-center w-full">
                  <div
                    class="flex-shrink-0 p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                  >
                    <i class="fas fa-user-plus text-white"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ $t('clients.addClient') }}</h4>
                    <p class="text-gray-600 text-sm mt-1">{{ $t('clients.quick_add') }}</p>
                  </div>
                  <i
                    class="fas fa-chevron-left text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300"
                  ></i>
                </div>
              </router-link>

              <router-link
                v-if="hasPermission('view_reports')"
                to="/reports"
                class="group flex items-center p-4 bg-gradient-to-r from-purple-50 to-violet-100/50 border border-purple-200/50 rounded-xl hover:from-purple-100 hover:to-violet-200 hover:border-purple-300/50 hover:shadow-md transition-all duration-300 relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                ></div>
                <div class="relative flex items-center w-full">
                  <div
                    class="flex-shrink-0 p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg mr-3 group-hover:scale-110 transition-transform duration-300 shadow-sm"
                  >
                    <i class="fas fa-chart-bar text-white"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ $t('reports.title') }}</h4>
                    <p class="text-gray-600 text-sm mt-1">{{ $t('reports.view_insights') }}</p>
                  </div>
                  <i
                    class="fas fa-chevron-left text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300"
                  ></i>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Top Clients -->
          <div
            v-if="hasPermission('view_clients')"
            class="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
          >
            <div class="border-b border-gray-200/50">
              <div class="flex items-center justify-between p-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <i class="fas fa-crown text-amber-500 mr-2"></i>
                  {{ $t('dashboard.top_clients') }}
                </h3>
                <router-link
                  to="/clients"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center group"
                >
                  <span>{{ $t('common.view_all') }}</span>
                  <i
                    class="fas fa-chevron-left mr-2 group-hover:translate-x-1 transition-transform duration-300"
                  ></i>
                </router-link>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div
                  v-for="(client, index) in topClients"
                  :key="client.id"
                  class="group flex items-center p-4 bg-gray-50/50 hover:bg-white border border-gray-200/50 hover:border-gray-300/50 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-sm"
                  @click="goToClient(client.id)"
                >
                  <div class="flex-shrink-0 relative">
                    <div class="relative">
                      <div
                        class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg group-hover:scale-110 transition-transform duration-300 shadow-sm"
                      >
                        {{ getInitials(client.name) }}
                      </div>
                      <div
                        v-if="index < 3"
                        class="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs"
                      >
                        {{ index + 1 }}
                      </div>
                    </div>
                  </div>
                  <div class="mr-4 flex-1 min-w-0">
                    <p class="font-semibold text-gray-900 truncate">{{ client.name }}</p>
                    <p class="text-gray-500 text-sm truncate mt-1">
                      {{ client.company_name || $t('clients.noCompany') }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900 text-sm">
                      {{ formatCurrency(client.total_spent || 0) }}
                    </p>
                    <span
                      :class="(client.growth || 0) >= 0 ? 'text-green-600' : 'text-red-600'"
                      class="text-xs font-medium"
                    >
                      <i
                        :class="(client.growth || 0) >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"
                        class="mr-1"
                      ></i>
                      {{ Math.abs(client.growth || 0) }}%
                    </span>
                  </div>
                </div>
                <div v-if="topClients.length === 0" class="text-center py-8">
                  <div
                    class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <i class="fas fa-users text-gray-300 text-xl"></i>
                  </div>
                  <p class="text-gray-500">{{ $t('clients.no_clients') }}</p>
                </div>
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
      hoveredCard: null,
      chartPeriods: [
        { label: '1M', value: '1m' },
        { label: '3M', value: '3m' },
        { label: '6M', value: '6m' },
        { label: '1Y', value: '1y' },
      ],
      enhancedLineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#374151',
              font: {
                family: "'Inter', sans-serif",
                size: 12,
              },
              padding: 20,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            boxPadding: 6,
            displayColors: false,
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${this.formatCurrency(context.raw)}`
              },
              title: (context) => {
                return `Revenue for ${context[0].label}`
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
              drawBorder: false,
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 11,
              },
            },
          },
          y: {
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
              drawBorder: false,
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 11,
              },
              callback: (value) => {
                if (value >= 1000) {
                  return (value / 1000).toFixed(0) + 'K'
                }
                return value
              },
            },
          },
        },
        elements: {
          point: {
            radius: 4,
            hoverRadius: 6,
            backgroundColor: '#ffffff',
            borderWidth: 2,
            borderColor: '#3b82f6',
          },
          line: {
            tension: 0.4,
            borderWidth: 3,
          },
        },
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
          },
        },
      },
      enhancedBarChartOptions: {
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
              padding: 20,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            boxPadding: 6,
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
              drawBorder: false,
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 11,
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(229, 231, 235, 0.5)',
              drawBorder: false,
            },
            ticks: {
              color: '#6b7280',
              font: {
                size: 11,
              },
              callback: (value) => {
                if (value >= 1000) {
                  return (value / 1000).toFixed(0) + 'K'
                }
                return value
              },
            },
          },
        },
        elements: {
          bar: {
            borderRadius: 8,
            borderSkipped: false,
          },
        },
        datasets: {
          bar: {
            categoryPercentage: 0.8,
            barPercentage: 0.9,
          },
        },
      },
      enhancedDoughnutChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        radius: '90%',
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
              boxWidth: 8,
              boxHeight: 8,
            },
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            titleColor: '#1f2937',
            bodyColor: '#4b5563',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            boxPadding: 6,
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
        elements: {
          arc: {
            borderWidth: 0,
            borderAlign: 'center',
          },
        },
        animation: {
          animateScale: true,
          animateRotate: true,
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

    avgMonthlyRevenue() {
      return this.stats?.avgMonthlyRevenue || 0
    },

    todayPerformance() {
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
            borderWidth: 0,
            hoverOffset: 15,
            hoverBorderWidth: 2,
            hoverBorderColor: '#ffffff',
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
          icon: 'fas fa-check-circle',
          amount: this.paidAmount,
        },
        {
          status: 'sent',
          label: this.$t('invoices.statuses.sent'),
          value: this.pendingInvoices,
          color: '#f59e0b',
          icon: 'fas fa-clock',
          amount: this.pendingAmount,
        },
        {
          status: 'overdue',
          label: this.$t('invoices.statuses.overdue'),
          value: this.overdueInvoices,
          color: '#ef4444',
          icon: 'fas fa-exclamation-triangle',
          amount: this.overdueAmount,
        },
        {
          status: 'draft',
          label: this.$t('invoices.statuses.draft'),
          value: this.draftInvoices,
          color: '#6b7280',
          icon: 'fas fa-file-alt',
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
      const revenueData = this.generateRevenueData(periods)

      return {
        labels,
        datasets: [
          {
            label: this.$t('dashboard.revenue'),
            data: revenueData,
            borderColor: '#3b82f6',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx
              const gradient = ctx.createLinearGradient(0, 0, 0, 400)
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)')
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)')
              return gradient
            },
            fill: true,
            tension: 0.4,
            borderWidth: 3,
          },
        ],
      }
    },

    performanceChartData() {
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']

      return {
        labels: months,
        datasets: [
          {
            label: this.$t('dashboard.invoices'),
            data: [120, 150, 180, 200, 220, 240],
            backgroundColor: (context) => {
              const ctx = context.chart.ctx
              const gradient = ctx.createLinearGradient(0, 0, 0, 400)
              gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0.4)')
              return gradient
            },
            borderRadius: 8,
          },
          {
            label: this.$t('dashboard.revenue'),
            data: [25000, 32000, 40000, 45000, 52000, 60000],
            backgroundColor: (context) => {
              const ctx = context.chart.ctx
              const gradient = ctx.createLinearGradient(0, 0, 0, 400)
              gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)')
              gradient.addColorStop(1, 'rgba(16, 185, 129, 0.4)')
              return gradient
            },
            borderRadius: 8,
          },
        ],
      }
    },

    recentActivity() {
      return [
        {
          id: 1,
          type: 'invoice_paid',
          title: 'فاتورة مدفوعة',
          description: 'فاتورة #INV-2024-001 تم دفعها بنجاح',
          amount: 1250,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          invoiceId: 'INV-2024-001',
        },
        {
          id: 2,
          type: 'client_added',
          title: 'عميل جديد',
          description: 'شركة التقنية المتطورة تمت إضافتها إلى النظام',
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          clientId: 123,
        },
        {
          id: 3,
          type: 'invoice_created',
          title: 'فاتورة جديدة',
          description: 'فاتورة #INV-2024-002 تم إنشاؤها',
          amount: 850,
          timestamp: new Date(Date.now() - 1000 * 60 * 240),
          invoiceId: 'INV-2024-002',
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
          icon: '✓',
          style: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
          },
        })
      } catch (error) {
        this.$toast.error(this.$t('dashboard.data_load_error'), {
          position: 'top-right',
          timeout: 5000,
          icon: '✗',
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
          },
        })
      }
    },

    async refreshDashboard() {
      try {
        await this.refreshDashboardData()
        this.$toast.success(this.$t('dashboard.data_refreshed'), {
          position: 'top-right',
          timeout: 3000,
          icon: '🔄',
          style: {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
          },
        })
      } catch (error) {
        this.$toast.error(this.$t('dashboard.refresh_error'), {
          position: 'top-right',
          timeout: 5000,
          icon: '✗',
          style: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            borderRadius: '12px',
            padding: '16px',
          },
        })
      }
    },

    goToClient(id) {
      if (this.hasPermission('view_clients')) {
        this.$router.push(`/clients/${id}`)
      }
    },

    goToHome() {
      this.$router.push('/')
    },

    changeChartPeriod(type, period) {
      if (type === 'revenue') {
        this.revenuePeriod = period
        this.$toast.info(`Showing data for ${period}`, {
          position: 'top-right',
          timeout: 2000,
          icon: '📊',
        })
      }
    },

    viewRevenueDetails() {
      this.$router.push('/reports?type=revenue')
    },

    viewInvoices() {
      this.$router.push('/invoices')
    },

    viewClients() {
      this.$router.push('/clients')
    },

    viewAllInvoices() {
      this.$router.push('/invoices')
    },

    viewAllActivity() {
      this.$router.push('/activity')
    },

    handleActivityClick(activity) {
      if (activity.invoiceId) {
        this.$router.push(`/invoices/${activity.invoiceId}`)
      } else if (activity.clientId) {
        this.$router.push(`/clients/${activity.clientId}`)
      }
    },

    generateMonthLabels(months) {
      const labels = []
      const now = new Date()
      const monthNames = [
        'يناير',
        'فبراير',
        'مارس',
        'أبريل',
        'مايو',
        'يونيو',
        'يوليو',
        'أغسطس',
        'سبتمبر',
        'أكتوبر',
        'نوفمبر',
        'ديسمبر',
      ]

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        labels.push(monthNames[date.getMonth()])
      }

      return labels
    },

    generateRevenueData(months) {
      const data = []
      let base = 10000

      for (let i = 0; i < months; i++) {
        const growth = Math.random() * 0.2 + 0.1
        base *= 1 + growth
        data.push(Math.round(base))
      }

      return data
    },

    filterByStatus(status) {
      this.$router.push({
        path: '/invoices',
        query: { status },
      })
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
        invoice_paid: 'bg-gradient-to-br from-green-500 to-emerald-600',
        invoice_created: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        client_added: 'bg-gradient-to-br from-purple-500 to-violet-600',
        payment_received: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        invoice_updated: 'bg-gradient-to-br from-amber-500 to-orange-600',
      }
      return colorMap[type] || 'bg-gradient-to-br from-gray-500 to-gray-600'
    },

    getActivityActionIcon(type) {
      const iconMap = {
        invoice_paid: 'fa-file-invoice-dollar',
        invoice_created: 'fa-plus',
        client_added: 'fa-user',
        payment_received: 'fa-money-bill',
        invoice_updated: 'fa-edit',
      }
      return iconMap[type] || 'fa-circle'
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

/* Enhanced Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #c1c1c1, #a1a1a1);
  border-radius: 10px;
  border: 2px solid #f8fafc;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #a1a1a1, #818181);
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Card hover effects with transform */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-1 {
  transform: translateX(4px);
}

/* Gradient animations */
.bg-gradient-shimmer {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Loading animation */
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
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

/* Fade in animation with stagger */
@keyframes fadeInUp {
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
  animation: fadeInUp 0.6s ease-out;
}

/* Stagger animation for cards */
.stagger-item:nth-child(1) {
  animation-delay: 0.1s;
}
.stagger-item:nth-child(2) {
  animation-delay: 0.2s;
}
.stagger-item:nth-child(3) {
  animation-delay: 0.3s;
}
.stagger-item:nth-child(4) {
  animation-delay: 0.4s;
}

/* Line clamp utility */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Pulse ring animation */
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.pulse-ring {
  position: relative;
}

.pulse-ring::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  border: 2px solid currentColor;
  opacity: 0;
  animation: pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hover lift effect */
.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Shine effect */
.shine {
  position: relative;
  overflow: hidden;
}

.shine::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: rotate(30deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(30deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(30deg);
  }
}

/* Status indicator animation */
.status-indicator {
  position: relative;
}

.status-indicator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: inherit;
  background: currentColor;
  opacity: 0.1;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%,
  100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.05);
  }
}

/* Smooth border transition */
.border-transition {
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

/* Enhanced focus styles */
:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Custom selection color */
::selection {
  background-color: rgba(59, 130, 246, 0.3);
  color: #1f2937;
}

/* Enhanced tooltip */
[data-tooltip] {
  position: relative;
}

[data-tooltip]::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s,
    visibility 0.3s;
  z-index: 1000;
}

[data-tooltip]:hover::before {
  opacity: 1;
  visibility: visible;
}

/* Smooth opacity transitions */
.opacity-transition {
  transition: opacity 0.5s ease;
}
</style>
