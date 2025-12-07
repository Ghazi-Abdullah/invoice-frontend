<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 font-cairo">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <!-- Title Section -->
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div class="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <i class="fas fa-chart-bar text-white text-xl"></i>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">
                {{ $t('reports.title') }}
              </h1>
              <p class="text-gray-600 mt-1">{{ $t('reports.subtitle') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-100 rounded-lg">
              <i class="fas fa-file-invoice text-blue-500"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('reports.quick_stats.total_invoices') }}</p>
              <p class="text-xl font-bold text-gray-800">
                {{ formatNumber(stats.total_invoices) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <i class="fas fa-money-bill-wave text-green-500"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('reports.quick_stats.total_amount') }}</p>
              <p class="text-xl font-bold text-gray-800">
                {{ formatCurrency(stats.total_amount) }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-100 rounded-lg">
              <i class="fas fa-check-circle text-emerald-500"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('reports.quick_stats.total_paid') }}</p>
              <p class="text-xl font-bold text-gray-800">{{ formatCurrency(stats.total_paid) }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-amber-100 rounded-lg">
              <i class="fas fa-clock text-amber-500"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('reports.quick_stats.total_due') }}</p>
              <p class="text-xl font-bold text-gray-800">{{ formatCurrency(stats.total_due) }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-purple-100 rounded-lg">
              <i class="fas fa-users text-purple-500"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('reports.quick_stats.total_clients') }}</p>
              <p class="text-xl font-bold text-gray-800">{{ formatNumber(stats.total_clients) }}</p>
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-red-100 rounded-lg">
              <i class="fas fa-exclamation-triangle text-red-500"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ $t('reports.quick_stats.overdue_invoices') }}</p>
              <p class="text-xl font-bold text-gray-800">{{ formatNumber(overdueCount) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Sidebar -->
      <!-- Left Sidebar -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Report Types Dropdown -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <label class="block mb-3 text-gray-700 font-semibold" for="reportType">
            <i class="fas fa-chart-pie text-blue-500 mr-2"></i>
            {{ $t('reports.report_types') }}
          </label>
          <div class="relative">
            <select
              id="reportType"
              v-model="activeReport"
              @change="selectReport(activeReport)"
              class="block w-full p-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
            >
              <option v-for="type in reportTypes" :key="type.id" :value="type.id">
                {{ $t(`reports.types.${type.id}`) }}
              </option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
          </div>
          <p v-if="activeReport" class="mt-2 text-sm text-gray-500">
            {{ $t(`reports.type_descriptions.${activeReport}`) }}
          </p>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <i class="fas fa-filter text-blue-500"></i>
              {{ $t('reports.filters') }}
            </h3>
          </div>

          <div class="p-6 space-y-6">
            <!-- Date Range -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <i class="fas fa-calendar-alt text-gray-400"></i>
                {{ $t('reports.filter_labels.date_range') }}
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">{{
                    $t('reports.filter_labels.start_date')
                  }}</label>
                  <input
                    type="date"
                    v-model="filters.start_date"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">{{
                    $t('reports.filter_labels.end_date')
                  }}</label>
                  <input
                    type="date"
                    v-model="filters.end_date"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <i class="fas fa-tag text-gray-400"></i>
                {{ $t('reports.filter_labels.status') }}
              </label>
              <select
                v-model="filters.status"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="">{{ $t('reports.statuses.all') }}</option>
                <option value="draft">{{ $t('reports.statuses.draft') }}</option>
                <option value="sent">{{ $t('reports.statuses.sent') }}</option>
                <option value="paid">{{ $t('reports.statuses.paid') }}</option>
                <option value="overdue">{{ $t('reports.statuses.overdue') }}</option>
                <option value="partially_paid">{{ $t('reports.statuses.partially_paid') }}</option>
              </select>
            </div>

            <!-- Client -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <i class="fas fa-user text-gray-400"></i>
                {{ $t('reports.filter_labels.client') }}
              </label>
              <select
                v-model="filters.client_id"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
              >
                <option value="">{{ $t('reports.statuses.all') }}</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
            </div>

            <!-- Period -->
            <!--<div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <i class="fas fa-chart-line text-gray-400"></i>
                {{ $t('reports.filter_labels.period') }}
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="period in periodOptions"
                  :key="period.value"
                  @click="filters.period = period.value"
                  class="px-3 py-2 text-sm rounded-lg border transition"
                  :class="
                    filters.period === period.value
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  "
                >
                  {{ $t(`reports.periods.${period.value}`) }}
                </button>
              </div>
            </div>-->

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
              <button
                @click="applyFilters"
                class="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <i class="fas fa-check"></i>
                {{ $t('reports.buttons.apply_filters') }}
              </button>
              <button
                @click="resetFilters"
                class="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-300 flex items-center justify-center gap-2"
              >
                <i class="fas fa-redo"></i>
                {{ $t('reports.buttons.reset_filters') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Status Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <i class="fas fa-pie-chart text-blue-500"></i>
                {{ $t('reports.charts.by_status') }}
              </h3>
            </div>
            <div class="p-6">
              <div class="h-64">
                <canvas ref="statusChart" style="direction: ltr"></canvas>
              </div>
            </div>
          </div>

          <!-- Revenue Chart -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <i class="fas fa-chart-line text-green-500"></i>
                {{ $t('reports.charts.monthly_revenue') }}
              </h3>
            </div>
            <div class="p-6">
              <div class="h-64">
                <canvas ref="salesChart" style="direction: ltr"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <i class="fas fa-table text-blue-500"></i>
                {{ $t('reports.table.detailed_data') }}
              </h3>

              <div class="flex items-center gap-4">
                <!-- Search -->
                <div class="relative">
                  <input
                    type="text"
                    v-model="searchQuery"
                    :placeholder="$t('reports.buttons.search')"
                    class="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
                  />
                  <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
                </div>

                <!-- Items Per Page -->
                <div class="hidden md:block">
                  <select
                    v-model="itemsPerPage"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                  >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-12 text-center">
            <div class="inline-flex flex-col items-center">
              <div class="relative">
                <div class="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                <div
                  class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"
                ></div>
              </div>
              <p class="mt-4 text-gray-600 font-medium">{{ $t('reports.loading') }}</p>
              <p class="text-sm text-gray-500 mt-1">{{ loadingProgress }}</p>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="reportError" class="p-12 text-center">
            <div class="inline-flex flex-col items-center">
              <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <p class="text-red-600 font-medium">{{ reportError }}</p>
              <button
                @click="fetchReportData"
                class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition inline-flex items-center gap-2"
              >
                <i class="fas fa-redo"></i>
                {{ $t('reports.buttons.try_again') }}
              </button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!filteredData.length" class="p-12 text-center">
            <div class="inline-flex flex-col items-center">
              <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-database text-gray-400 text-2xl"></i>
              </div>
              <p class="text-gray-600 font-medium">{{ $t('reports.table.no_data') }}</p>
              <p class="text-gray-500 text-sm mt-1">{{ $t('reports.table.no_data_hint') }}</p>
            </div>
          </div>

          <!-- Data Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200"
                  >
                    <div class="flex items-center justify-between">
                      <span>{{ column.label }}</span>
                      <i
                        v-if="column.sortable"
                        class="fas fa-sort text-gray-400 text-xs cursor-pointer"
                      ></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="item in paginatedData"
                  :key="item.id"
                  class="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="px-6 py-4 whitespace-nowrap"
                    :class="column.class"
                  >
                    <template v-if="column.key === 'status'">
                      <span
                        :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                          getStatusClass(item[column.key]),
                        ]"
                      >
                        <span
                          class="w-2 h-2 rounded-full mr-2"
                          :class="getStatusDotClass(item[column.key])"
                        ></span>
                        {{ getStatusText(item[column.key]) }}
                      </span>
                    </template>
                    <template v-else-if="column.type === 'currency'">
                      <div class="flex items-center justify-between">
                        <span class="font-medium">{{
                          formatCurrency(getNestedValue(item, column.key))
                        }}</span>
                        <i class="fas fa-money-bill-wave text-gray-400 text-sm"></i>
                      </div>
                    </template>
                    <template v-else-if="column.type === 'date'">
                      <div class="flex items-center gap-2">
                        <i class="fas fa-calendar text-gray-400 text-sm"></i>
                        <span>{{ formatDate(getNestedValue(item, column.key)) }}</span>
                      </div>
                    </template>
                    <template v-else-if="column.type === 'days_overdue'">
                      <div class="flex items-center gap-2">
                        <span
                          class="font-medium"
                          :class="
                            getNestedValue(item, column.key) > 30
                              ? 'text-red-600'
                              : 'text-amber-600'
                          "
                        >
                          {{ getNestedValue(item, column.key) }}
                        </span>
                        <i class="fas fa-clock text-gray-400 text-sm"></i>
                      </div>
                    </template>
                    <template v-else>
                      <span class="text-gray-800">{{ getNestedValue(item, column.key) }}</span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="!loading && !reportError && filteredData.length"
            class="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white"
          >
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="text-sm text-gray-700">
                {{ $t('reports.table.showing') }}
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                {{ $t('reports.table.to') }}
                <span class="font-medium">{{
                  Math.min(currentPage * itemsPerPage, filteredData.length)
                }}</span>
                {{ $t('reports.table.of') }}
                <span class="font-medium">{{ filteredData.length }}</span>
                {{ $t('reports.table.items') }}
              </div>

              <div class="flex items-center gap-2">
                <!-- Page Navigation -->
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="p-2.5 border border-gray-300 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <i class="fas fa-chevron-right text-gray-600"></i>
                </button>

                <!-- Page Numbers -->
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="currentPage = page"
                    class="w-10 h-10 flex items-center justify-center border rounded-lg transition"
                    :class="[
                      currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>

                  <span v-if="hasMorePages" class="px-2 text-gray-500">...</span>
                </div>

                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="p-2.5 border border-gray-300 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info Cards -->
        <div v-if="!loading && !reportError" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-blue-500 rounded-xl">
                <i class="fas fa-history text-white text-lg"></i>
              </div>
              <div>
                <p class="text-sm text-blue-700 font-medium">
                  {{ $t('reports.info_cards.last_update') }}
                </p>
                <p class="text-lg font-bold text-blue-900 mt-1">{{ formatDate(new Date()) }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-emerald-500 rounded-xl">
                <i class="fas fa-chart-bar text-white text-lg"></i>
              </div>
              <div>
                <p class="text-sm text-emerald-700 font-medium">
                  {{ $t('reports.info_cards.total_data') }}
                </p>
                <p class="text-lg font-bold text-emerald-900 mt-1">
                  {{ filteredData.length }} {{ $t('reports.table.items') }}
                </p>
              </div>
            </div>
          </div>

          <div
            class="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-amber-500 rounded-xl">
                <i class="fas fa-bolt text-white text-lg"></i>
              </div>
              <div>
                <p class="text-sm text-amber-700 font-medium">
                  {{ $t('reports.info_cards.loading_time') }}
                </p>
                <p class="text-lg font-bold text-amber-900 mt-1">
                  {{ loadingTime }} {{ currentLanguage === 'ar' ? 'ثانية' : 'seconds' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Chart from 'chart.js/auto'
import vClickOutside from 'click-outside-vue3'

export default {
  name: 'ReportsIndex',

  directives: {
    clickOutside: vClickOutside.directive,
  },

  data() {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 30)

    return {
      activeReport: 'invoices',
      currentLanguage: 'ar',
      showLanguageMenu: false,
      filters: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
        period: 'monthly',
        search: '',
      },
      clients: [],
      stats: {
        total_invoices: 0,
        total_amount: 0,
        total_paid: 0,
        total_due: 0,
        total_clients: 0,
      },
      loading: false,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 15,
      loadingTime: 0,
      overdueCount: 0,
      loadingProgress: '',

      reportTypes: [
        {
          id: 'invoices',
          icon: 'fas fa-file-invoice',
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-500',
        },
        {
          id: 'clients',
          icon: 'fas fa-users',
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-500',
        },
        {
          id: 'revenue',
          icon: 'fas fa-money-bill-trend-up',
          bgColor: 'bg-green-100',
          iconColor: 'text-green-500',
        },
        {
          id: 'overdue',
          icon: 'fas fa-clock',
          bgColor: 'bg-red-100',
          iconColor: 'text-red-500',
        },
      ],

      periodOptions: [
        { value: 'daily', icon: 'fas fa-calendar-day' },
        { value: 'weekly', icon: 'fas fa-calendar-week' },
        { value: 'monthly', icon: 'fas fa-calendar-alt' },
        { value: 'yearly', icon: 'fas fa-calendar' },
      ],

      statusChart: null,
      salesChart: null,
    }
  },

  computed: {
    ...mapGetters('report', ['reportData', 'isLoading', 'reportError']),

    tableColumns() {
      const columns = {
        invoices: [
          {
            key: 'invoice_number',
            label: this.$t('reports.columns.invoice_number'),
            sortable: true,
          },
          { key: 'client.name', label: this.$t('reports.columns.client'), sortable: true },
          {
            key: 'issue_date',
            label: this.$t('reports.columns.issue_date'),
            type: 'date',
            sortable: true,
          },
          {
            key: 'due_date',
            label: this.$t('reports.columns.due_date'),
            type: 'date',
            sortable: true,
          },
          {
            key: 'total_amount',
            label: this.$t('reports.columns.total'),
            type: 'currency',
            sortable: true,
          },
          { key: 'status', label: this.$t('reports.columns.status'), sortable: true },
        ],
        clients: [
          { key: 'client_name', label: this.$t('reports.columns.client_name'), sortable: true },
          { key: 'client_email', label: this.$t('reports.columns.client_email'), sortable: true },
          {
            key: 'total_invoices',
            label: this.$t('reports.columns.invoices_count'),
            sortable: true,
            class: 'text-center',
          },
          {
            key: 'total_amount',
            label: this.$t('reports.columns.total_amount'),
            type: 'currency',
            sortable: true,
          },
          {
            key: 'total_paid',
            label: this.$t('reports.columns.amount_paid'),
            type: 'currency',
            sortable: true,
          },
          {
            key: 'total_due',
            label: this.$t('reports.columns.amount_due'),
            type: 'currency',
            sortable: true,
          },
        ],
        revenue: [
          { key: 'month', label: this.$t('reports.columns.month'), sortable: true },
          {
            key: 'count',
            label: this.$t('reports.columns.invoices_count'),
            sortable: true,
            class: 'text-center',
          },
          {
            key: 'total',
            label: this.$t('reports.columns.total_amount'),
            type: 'currency',
            sortable: true,
          },
          {
            key: 'paid',
            label: this.$t('reports.columns.collected'),
            type: 'currency',
            sortable: true,
          },
          {
            key: 'due',
            label: this.$t('reports.columns.outstanding'),
            type: 'currency',
            sortable: true,
          },
        ],
        overdue: [
          {
            key: 'invoice_number',
            label: this.$t('reports.columns.invoice_number'),
            sortable: true,
          },
          { key: 'client_name', label: this.$t('reports.columns.client_name'), sortable: true },
          {
            key: 'issue_date',
            label: this.$t('reports.columns.issue_date'),
            type: 'date',
            sortable: true,
          },
          {
            key: 'due_date',
            label: this.$t('reports.columns.due_date'),
            type: 'date',
            sortable: true,
          },
          {
            key: 'days_overdue',
            label: this.$t('reports.columns.days_overdue'),
            type: 'days_overdue',
            sortable: true,
            class: 'text-center',
          },
          {
            key: 'total_amount',
            label: this.$t('reports.columns.amount'),
            type: 'currency',
            sortable: true,
          },
          { key: 'status', label: this.$t('reports.columns.status'), sortable: true },
        ],
      }
      return columns[this.activeReport] || []
    },

    filteredData() {
      const data = this.reportData(this.activeReport)
      if (!data) return []

      let items = []
      switch (this.activeReport) {
        case 'invoices':
          items = data.invoices?.data || data.invoices || []
          break
        case 'clients':
          items = data.clients || []
          break
        case 'revenue':
          items = data.revenue_data || []
          break
        case 'overdue':
          items = data.overdue_invoices || []
          break
        default:
          items = []
      }

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        items = items.filter((item) => {
          return Object.values(item).some(
            (value) => value && String(value).toLowerCase().includes(query),
          )
        })
      }

      return items
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredData.slice(start, end)
    },

    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage)
    },

    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      const end = Math.min(this.totalPages, start + maxVisible - 1)

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    },

    hasMorePages() {
      return this.visiblePages[this.visiblePages.length - 1] < this.totalPages
    },
  },

  methods: {
    ...mapActions('report', ['fetchReport', 'exportReport']),

    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu
    },

    closeLanguageMenu() {
      this.showLanguageMenu = false
    },

    changeLanguage(lang) {
      this.currentLanguage = lang
      this.$i18n.locale = lang
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
      this.showLanguageMenu = false
    },

    async exportReport(format) {
      try {
        this.$toast.info(this.$t('reports.exporting'))

        await this.exportReport({
          reportType: this.activeReport,
          format: format,
          filters: this.filters,
        })

        this.$toast.success(this.$t('reports.export_success'))
      } catch (err) {
        this.$toast.error(this.$t('reports.export_error'))
        console.error('Export error:', err)
      }
    },

    getNestedValue(obj, path) {
      return path.split('.').reduce((o, p) => (o || {})[p], obj) || ''
    },

    formatCurrency(amount) {
      if (!amount) return `٠٫٠٠ ${this.$t('reports.currency')}`
      return new Intl.NumberFormat(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        style: 'currency',
        currency: 'SAR',
      }).format(amount)
    },

    formatNumber(number) {
      return new Intl.NumberFormat(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US').format(number)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString(this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    getStatusClass(status) {
      const classes = {
        paid: 'bg-emerald-100 text-emerald-800',
        unpaid: 'bg-red-100 text-red-800',
        partially_paid: 'bg-amber-100 text-amber-800',
        sent: 'bg-blue-100 text-blue-800',
        draft: 'bg-gray-100 text-gray-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusDotClass(status) {
      const classes = {
        paid: 'bg-emerald-500',
        unpaid: 'bg-red-500',
        partially_paid: 'bg-amber-500',
        sent: 'bg-blue-500',
        draft: 'bg-gray-500',
        overdue: 'bg-red-500',
      }
      return classes[status] || 'bg-gray-500'
    },

    getStatusText(status) {
      return this.$t(`reports.statuses.${status}`) || status
    },

    async selectReport(reportType) {
      this.activeReport = reportType
      this.currentPage = 1
      await this.fetchReportData()
    },

    async applyFilters() {
      this.currentPage = 1
      await this.fetchReportData()
    },

    resetFilters() {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      this.filters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
        period: 'monthly',
        search: '',
      }
      this.searchQuery = ''
      this.fetchReportData()
    },

    async fetchReportData() {
      const startTime = performance.now()
      this.loading = true
      this.loadingProgress = 'جاري التحميل...'

      try {
        const data = await this.fetchReport({
          reportType: this.activeReport,
          filters: this.filters,
        })

        this.updateStats(data)
        this.updateCharts(data)
        this.$toast.success(this.$t('reports.load_success'))
      } catch (err) {
        console.error('Error fetching report:', err)
        this.$toast.error(this.$t('reports.load_error'))
      } finally {
        this.loading = false
        const endTime = performance.now()
        this.loadingTime = ((endTime - startTime) / 1000).toFixed(2)
      }
    },

    async fetchClients() {
      try {
        const response = await this.$store.dispatch('clients/fetchClients')
        this.clients = response.data || []
      } catch (err) {
        console.error('Error fetching clients:', err)
      }
    },

    updateStats(data) {
      if (!data) return

      this.stats = {
        total_invoices: data.stats?.total_invoices || data.total_invoices || 0,
        total_amount: data.stats?.total_amount || data.total_amount || 0,
        total_paid: data.stats?.total_paid || data.total_paid || 0,
        total_due: data.stats?.total_due || data.total_due || 0,
        total_clients: data.stats?.total_clients || data.total_clients || 0,
      }

      if (this.activeReport === 'overdue') {
        this.overdueCount = data.summary?.total_overdue || data.overdue_invoices?.length || 0
      } else {
        this.overdueCount = data.stats?.overdue_invoices || 0
      }
    },

    updateCharts(data) {
      if (this.statusChart) this.statusChart.destroy()
      if (this.salesChart) this.salesChart.destroy()

      // Status Chart
      if (data?.invoices_by_status) {
        const ctx = this.$refs.statusChart
        this.statusChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: data.invoices_by_status.map((item) => this.getStatusText(item.status)),
            datasets: [
              {
                data: data.invoices_by_status.map((item) => item.count),
                backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
              legend: {
                position: 'bottom',
                rtl: this.currentLanguage === 'ar',
                labels: {
                  font: {
                    family: 'Cairo, sans-serif',
                    size: 12,
                  },
                  padding: 20,
                  usePointStyle: true,
                },
              },
              tooltip: {
                rtl: this.currentLanguage === 'ar',
                bodyFont: {
                  family: 'Cairo, sans-serif',
                },
              },
            },
          },
        })
      }

      // Sales Chart
      if (data?.invoices_by_month) {
        const ctx = this.$refs.salesChart
        this.salesChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.invoices_by_month.map((item) => item.month),
            datasets: [
              {
                label: this.$t('reports.columns.total_amount'),
                data: data.invoices_by_month.map((item) => item.total),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                rtl: this.currentLanguage === 'ar',
                bodyFont: {
                  family: 'Cairo, sans-serif',
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    family: 'Cairo, sans-serif',
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  borderDash: [5, 5],
                },
                ticks: {
                  font: {
                    family: 'Cairo, sans-serif',
                  },
                  callback: (value) => {
                    return this.formatCurrency(value)
                  },
                },
              },
            },
          },
        })
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
  },

  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    itemsPerPage() {
      this.currentPage = 1
    },
  },

  mounted() {
    // Set initial language
    this.changeLanguage('ar')

    // Fetch data
    this.fetchClients()
    this.fetchReportData()
  },

  beforeUnmount() {
    if (this.statusChart) this.statusChart.destroy()
    if (this.salesChart) this.salesChart.destroy()
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap');

.font-cairo {
  font-family: 'Cairo', sans-serif;
}

/* Smooth transitions */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Table hover effects */
table tbody tr {
  transition: all 0.2s ease;
}

table tbody tr:hover {
  transform: translateX(2px);
  box-shadow: inset 2px 0 0 0 #3b82f6;
}

/* Card hover effects */
.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Gradient backgrounds */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Loading animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive table */
@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .table-container {
    margin-left: -1rem;
    margin-right: -1rem;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white !important;
  }

  .bg-gray-50,
  .bg-white {
    background: white !important;
    box-shadow: none !important;
  }
}
</style>
