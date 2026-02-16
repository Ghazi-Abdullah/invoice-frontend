<template>
  <div class="report-section">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">
              {{ $t('reports.overdueInvoices') }}
            </p>
            <p class="text-2xl font-bold text-red-600">
              {{ stats.total_overdue || 0 }}
            </p>
          </div>
          <div class="p-3 bg-red-50 rounded-lg">
            <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p class="text-sm font-medium text-gray-500 mb-1">
              {{ $t('reports.totalOverdueAmount') }}
            </p>
            <p class="text-2xl font-bold text-yellow-600">
              {{ formatCurrency(stats.total_amount || 0) }}
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
              {{ $t('reports.averageDaysOverdue') }}
            </p>
            <p class="text-2xl font-bold text-orange-600">
              {{ stats.average_days_overdue || 0 }} {{ $t('common.days') }}
            </p>
          </div>
          <div class="p-3 bg-orange-50 rounded-lg">
            <svg
              class="w-6 h-6 text-orange-500"
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
            <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('reports.totalDue') }}</p>
            <p class="text-2xl font-bold text-purple-600">
              {{ formatCurrency(stats.total_amount || 0) }}
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Overdue Invoices Table -->
    <div
      v-if="invoices.length > 0"
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t('reports.overdueInvoicesList') }}
            </h3>
            <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
              {{
                $t('pagination.showing', {
                  from: pagination.from || 0,
                  to: pagination.to || 0,
                  total: pagination.total || 0,
                })
              }}
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
                {{ $t('reports.invoice_number') }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.client') }}
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.due_date') }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.total_amount') }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.due_amount') }}
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.days_overdue') }}
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
              >
                {{ $t('reports.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="hover:bg-red-50/30 transition-colors duration-150"
            >
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ invoice.client?.name || $t('common.notProvided') }}
                </div>
                <div class="text-xs text-gray-500">{{ invoice.client?.email || '' }}</div>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-sm text-gray-900">{{ formatDate(invoice.due_date) }}</span>
                  <span class="text-xs text-red-600 mt-1">{{
                    getDaysText(invoice.days_overdue)
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col items-end">
                  <span class="text-lg font-bold text-gray-900">{{
                    formatCurrency(invoice.total_amount)
                  }}</span>
                  <span v-if="invoice.paid_amount" class="text-sm text-green-600">
                    {{ $t('reports.paid') }}: {{ formatCurrency(invoice.paid_amount) }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex flex-col items-end">
                  <span class="text-xl font-bold text-red-600">{{
                    formatCurrency(invoice.due_amount)
                  }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="getDaysOverdueClass(invoice.days_overdue)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                >
                  <span
                    :class="getDaysOverdueDotClass(invoice.days_overdue)"
                    class="w-2 h-2 rounded-full"
                  ></span>
                  {{ invoice.days_overdue }} {{ $t('common.days') }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="sendReminder(invoice)"
                    class="px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                    {{ $t('reports.sendReminder') }}
                  </button>
                  <button
                    @click="markAsPaid(invoice)"
                    class="px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ $t('reports.markAsPaid') }}
                  </button>
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('reports.noOverdue') }}</h3>
      <p class="text-gray-600 mb-6 max-w-md mx-auto">
        {{ $t('reports.noOverdueMessage') }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverdueReportSection',

  props: {
    invoices: {
      type: Array,
      default: () => [],
    },
    stats: {
      type: Object,
      default: () => ({}),
    },
    pagination: {
      type: Object,
      default: () => ({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0,
        from: 0,
        to: 0,
      }),
    },
  },

  computed: {
    paginationLinks() {
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
      if (page >= 1 && page <= this.pagination.last_page && page !== this.pagination.current_page) {
        this.$emit('page-change', page)
      }
    },

    sendReminder(invoice) {
      this.$emit('send-reminder', invoice.id)
    },

    markAsPaid(invoice) {
      this.$emit('mark-paid', invoice.id)
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

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    getDaysText(days) {
      if (days === 1) return this.$t('common.one_day')
      if (days === 2) return this.$t('common.two_days')
      if (days > 2 && days <= 10) return this.$t('common.few_days', { days })
      return this.$t('common.many_days', { days })
    },

    getDaysOverdueClass(days) {
      if (days <= 7) return 'bg-yellow-100 text-yellow-800'
      if (days <= 30) return 'bg-orange-100 text-orange-800'
      return 'bg-red-100 text-red-800'
    },

    getDaysOverdueDotClass(days) {
      if (days <= 7) return 'bg-yellow-500'
      if (days <= 30) return 'bg-orange-500'
      return 'bg-red-500'
    },
  },
}
</script>
