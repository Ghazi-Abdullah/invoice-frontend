<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('invoices.title') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('invoices.subtitle') }}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <router-link
              to="/invoices/create"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              {{ $t('invoices.create_new') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg mr-4">
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
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.total') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ invoiceStats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg mr-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.paid') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ invoiceStats.paid }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-lg mr-4">
              <svg
                class="w-6 h-6 text-yellow-600"
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
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.sent') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ invoiceStats.sent }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-lg mr-4">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.overdue') }}</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ invoiceStats.overdue }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-4 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
          >
            <div
              class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <!-- Status Filter -->
              <select
                v-model="filters.status"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @change="applyFilters"
              >
                <option value="">{{ $t('filters.all_statuses') }}</option>
                <option value="draft">{{ $t('invoices.status.draft') }}</option>
                <option value="sent">{{ $t('invoices.status.sent') }}</option>
                <option value="paid">{{ $t('invoices.status.paid') }}</option>
                <option value="overdue">{{ $t('invoices.status.overdue') }}</option>
              </select>

              <!-- Date Filter -->
              <select
                v-model="filters.date"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @change="applyFilters"
              >
                <option value="">{{ $t('filters.all_dates') }}</option>
                <option value="this_month">{{ $t('filters.this_month') }}</option>
                <option value="last_month">{{ $t('filters.last_month') }}</option>
                <option value="this_year">{{ $t('filters.this_year') }}</option>
              </select>
            </div>

            <!-- Search -->
            <div class="relative w-full md:w-64">
              <input
                type="text"
                v-model="filters.search"
                @input="onSearchInput"
                :placeholder="$t('filters.search_placeholder')"
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        <!-- Invoices Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.table.invoice_number') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.table.client') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.table.date') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.table.due_date') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.table.amount') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.table.status') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.table.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-8 text-center">
                  <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="mr-3 text-gray-600">{{ $t('common.loading') }}</span>
                  </div>
                </td>
              </tr>

              <tr v-else-if="!hasInvoices && !loading">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <svg
                    class="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                  <p class="text-lg text-gray-600 mb-2">{{ $t('invoices.no_invoices') }}</p>
                  <p class="text-gray-500 text-sm mb-4">{{ $t('invoices.start_creating') }}</p>
                  <router-link
                    to="/invoices/create"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    {{ $t('invoices.create_new') }}
                  </router-link>
                </td>
              </tr>

              <tr v-else v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</div>
                  <div class="text-sm text-gray-500">#{{ invoice.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                    >
                      <span class="text-blue-600 text-xs font-semibold">
                        {{ getInitials(invoice.client?.name) }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ invoice.client?.name || $t('common.not_provided') }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ invoice.client?.email || $t('common.not_provided') }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(invoice.issue_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(invoice.due_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(invoice.total_amount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(invoice.status)">
                    {{ getStatusText(invoice.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <router-link
                      :to="`/invoices/${invoice.id}`"
                      class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      :title="$t('actions.view')"
                    >
                      {{ $t('actions.view') }}
                    </router-link>
                    <router-link
                      :to="`/invoices/${invoice.id}/edit`"
                      class="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                      :title="$t('actions.edit')"
                    >
                      {{ $t('actions.edit') }}
                    </router-link>
                    <button
                      @click="deleteInvoice(invoice)"
                      class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      :title="$t('actions.delete')"
                    >
                      {{ $t('actions.delete') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="hasInvoices" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between items-center">
              <button
                :disabled="paginationInfo.currentPage <= 1"
                @click="changePage(paginationInfo.currentPage - 1)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                  paginationInfo.currentPage > 1
                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed',
                ]"
              >
                {{ $t('pagination.previous') }}
              </button>

              <span class="text-sm text-gray-700">
                {{ $t('pagination.page') }}
                <span class="font-medium">{{ paginationInfo.currentPage }}</span>
                {{ $t('pagination.of') }}
                <span class="font-medium">{{ paginationInfo.lastPage }}</span>
              </span>

              <button
                :disabled="paginationInfo.currentPage >= paginationInfo.lastPage"
                @click="changePage(paginationInfo.currentPage + 1)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                  paginationInfo.currentPage < paginationInfo.lastPage
                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed',
                ]"
              >
                {{ $t('pagination.next') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoicesIndex',
  data() {
    return {
      filters: {
        status: '',
        date: '',
        search: '',
      },
      searchTimeout: null,
      loading: false,
    }
  },
  computed: {
    // Vuex Getters
    invoiceStats() {
      return (
        this.$store.getters['invoices/invoiceStats'] || { total: 0, paid: 0, sent: 0, overdue: 0 }
      )
    },
    hasInvoices() {
      return this.$store.getters['invoices/hasInvoices'] || false
    },
    paginationInfo() {
      return (
        this.$store.getters['invoices/paginationInfo'] || {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 0,
        }
      )
    },
    invoices() {
      return this.$store.state.invoices.invoices.data || []
    },
    storeLoading() {
      return this.$store.state.invoices.loading || false
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    },

    formatCurrency(amount) {
      if (!amount) return '0.00 ر.س'
      return (
        new Intl.NumberFormat('ar-SA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + ' ر.س'
      )
    },

    getStatusText(status) {
      const statusMap = {
        draft: this.$t('invoices.status.draft'),
        sent: this.$t('invoices.status.sent'),
        paid: this.$t('invoices.status.paid'),
        overdue: this.$t('invoices.status.overdue'),
      }
      return statusMap[status] || status
    },

    getStatusClasses(status) {
      const baseClasses = 'inline-flex px-3 py-1 text-xs font-semibold rounded-full'
      const statusClasses = {
        draft: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
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

    async fetchInvoices(page = 1) {
      this.loading = true
      try {
        const params = {
          page,
          ...this.filters,
        }

        // إزالة الفلاتر الفارغة
        Object.keys(params).forEach((key) => {
          if (params[key] === '' || params[key] === null) {
            delete params[key]
          }
        })

        console.log('🔄 Fetching invoices with params:', params)
        await this.$store.dispatch('invoices/fetchInvoices', params)
      } catch (error) {
        console.error('❌ Failed to fetch invoices:', error)
      } finally {
        this.loading = false
      }
    },

    applyFilters() {
      this.fetchInvoices(1)
    },

    onSearchInput() {
      // إلغاء المؤقت السابق
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // إنشاء مؤقت جديد للبحث
      this.searchTimeout = setTimeout(() => {
        this.fetchInvoices(1)
      }, 500)
    },

    changePage(page) {
      if (page >= 1 && page <= this.paginationInfo.lastPage) {
        this.fetchInvoices(page)
      }
    },

    async deleteInvoice(invoice) {
      if (confirm(this.$t('invoices.delete_confirm', { number: invoice.invoice_number }))) {
        try {
          await this.$store.dispatch('invoices/deleteInvoice', invoice.id)
          // إعادة تحميل الفواتير بعد الحذف
          this.fetchInvoices(this.paginationInfo.currentPage)
        } catch (error) {
          console.error('Failed to delete invoice:', error)
          alert(this.$t('invoices.delete_error'))
        }
      }
    },
  },
  mounted() {
    this.fetchInvoices()
  },
  watch: {
    storeLoading(newLoading) {
      this.loading = newLoading
    },
  },
}
</script>
