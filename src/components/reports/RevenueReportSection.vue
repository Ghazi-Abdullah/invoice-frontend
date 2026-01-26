<template>
  <div class="report-section">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('reports.totalRevenue') }}</p>
            <p class="text-2xl font-bold text-green-600">
              {{ formatCurrency(stats.total_revenue || 0) }}
            </p>
          </div>
          <div class="p-3 bg-green-50 rounded-lg">
            <svg
              class="w-6 h-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">
              {{ $t('reports.collectedRevenue') }}
            </p>
            <p class="text-2xl font-bold text-blue-600">
              {{ formatCurrency(stats.collected_revenue || 0) }}
            </p>
          </div>
          <div class="p-3 bg-blue-50 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-500"
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

      <div
        class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">
              {{ $t('reports.outstandingRevenue') }}
            </p>
            <p class="text-2xl font-bold text-yellow-600">
              {{ formatCurrency(stats.outstanding_revenue || 0) }}
            </p>
          </div>
          <div class="p-3 bg-yellow-50 rounded-lg">
            <svg
              class="w-6 h-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('reports.collectionRate') }}</p>
            <p class="text-2xl font-bold text-purple-600">
              {{ Math.round(stats.collection_rate || 0) }}%
            </p>
          </div>
          <div class="p-3 bg-purple-50 rounded-lg">
            <svg
              class="w-6 h-6 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue Table -->
    <div
      v-if="revenueData.length > 0"
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('reports.monthlyRevenue') }}</h3>
            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {{ revenueData.length }} {{ $t('reports.month') }}
            </span>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.month') }}
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.invoicesCount') }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.totalAmount') }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.collectedAmount') }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.outstandingAmount') }}
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.collectionRate') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="month in revenueData"
              :key="month.month"
              class="hover:bg-blue-50/30 transition-colors duration-150"
            >
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatMonth(month.month) }}
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {{ month.invoice_count || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col items-end">
                  <span class="text-lg font-bold text-gray-900">{{
                    formatCurrency(month.total_amount)
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col items-end">
                  <span class="text-base font-semibold text-green-600">{{
                    formatCurrency(month.paid_amount)
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col items-end">
                  <span class="text-base font-semibold text-yellow-600">{{
                    formatCurrency(month.due_amount)
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex flex-col items-center">
                  <span
                    :class="getCollectionRateClass(calculateCollectionRate(month))"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span
                      :class="getCollectionRateDotClass(calculateCollectionRate(month))"
                      class="w-2 h-2 rounded-full"
                    ></span>
                    {{ calculateCollectionRate(month) }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.last_page > 1"
        class="px-6 py-4 border-t border-gray-200 bg-gray-50/50"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            {{
              $t('pagination.pageOf', {
                current: pagination.current_page,
                total: pagination.last_page,
              })
            }}
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('pagination.previous') }}
            </button>

            <button
              v-for="page in paginationLinks"
              :key="page"
              @click="changePage(page)"
              :class="{
                'px-3 py-2 text-sm font-medium rounded-lg': true,
                'bg-blue-600 text-white': page === pagination.current_page,
                'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50':
                  page !== pagination.current_page,
                'opacity-50 cursor-not-allowed': page === '...',
              }"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>

            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t('pagination.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('reports.noRevenue') }}</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        {{ $t('reports.noRevenueMessage') }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RevenueReportSection',

  props: {
    revenue: {
      type: Array,
      default: () => [],
    },
    stats: {
      type: Object,
      default: () => ({}),
    },
    pagination: {
      type: Object,
      default: () => null,
    },
  },

  computed: {
    revenueData() {
      return this.revenue || []
    },

    paginationLinks() {
      if (!this.pagination) return []

      const links = []
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const delta = 2

      for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
          links.push(i)
        } else if (links[links.length - 1] !== '...') {
          links.push('...')
        }
      }

      return links
    },
  },

  methods: {
    changePage(page) {
      if (
        this.pagination &&
        page >= 1 &&
        page <= this.pagination.last_page &&
        page !== this.pagination.current_page
      ) {
        this.$emit('page-change', page)
      }
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    formatMonth(monthString) {
      if (!monthString) return '-'
      const [year, month] = monthString.split('-')
      const monthNames = [
        this.$t('common.months.january'),
        this.$t('common.months.february'),
        this.$t('common.months.march'),
        this.$t('common.months.april'),
        this.$t('common.months.may'),
        this.$t('common.months.june'),
        this.$t('common.months.july'),
        this.$t('common.months.august'),
        this.$t('common.months.september'),
        this.$t('common.months.october'),
        this.$t('common.months.november'),
        this.$t('common.months.december'),
      ]
      return `${monthNames[parseInt(month) - 1]} ${year}`
    },

    calculateCollectionRate(month) {
      if (!month.total_amount || month.total_amount === 0) return 0
      const rate = (month.paid_amount / month.total_amount) * 100
      return Math.round(rate)
    },

    getCollectionRateClass(rate) {
      if (rate >= 90) return 'bg-green-100 text-green-800'
      if (rate >= 70) return 'bg-yellow-100 text-yellow-800'
      return 'bg-red-100 text-red-800'
    },

    getCollectionRateDotClass(rate) {
      if (rate >= 90) return 'bg-green-500'
      if (rate >= 70) return 'bg-yellow-500'
      return 'bg-red-500'
    },
  },
}
</script>
