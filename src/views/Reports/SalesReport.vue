<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('reports.salesReport') }}</h1>
      <p class="mt-2 text-gray-600">{{ $t('reports.salesReportDescription') }}</p>
    </div>

    <!-- Filters -->
    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t('common.fromDate')
          }}</label>
          <input
            type="date"
            v-model="filters.start_date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t('common.toDate')
          }}</label>
          <input
            type="date"
            v-model="filters.end_date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="loadReport"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {{ $t('common.generate') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
    </div>

    <!-- Report Content -->
    <div v-else class="space-y-8">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('reports.totalInvoices') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ summary.invoice_count || 0 }}</p>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <i class="fas fa-file-invoice text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('reports.totalAmount') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ formatCurrency(summary.total_amount || 0) }}
              </p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <i class="fas fa-money-bill-wave text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('reports.totalPaid') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ formatCurrency(summary.total_paid || 0) }}
              </p>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <i class="fas fa-check-circle text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('reports.totalDue') }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ formatCurrency(summary.total_due || 0) }}
              </p>
            </div>
            <div class="p-3 bg-red-50 rounded-lg">
              <i class="fas fa-exclamation-circle text-red-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Invoices Table -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">{{ $t('reports.invoicesList') }}</h2>
        </div>

        <div v-if="invoices.length === 0" class="text-center py-12">
          <i class="fas fa-file-invoice text-gray-300 text-4xl mb-4"></i>
          <p class="text-gray-500">{{ $t('reports.noData') }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.invoiceNumber') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.client') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.issueDate') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('common.amount') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('reports.paidAmount') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('reports.dueAmount') }}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('common.status') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="invoice in invoices" :key="invoice.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ invoice.client?.name || $t('common.unknown') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(invoice.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formatCurrency(invoice.total_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(invoice.paid_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatCurrency(invoice.total_amount - invoice.paid_amount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(invoice.status)">
                    {{ getStatusText(invoice.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination.total > pagination.per_page"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="pagination.current_page === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ $t('common.previous') }}
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.current_page === pagination.last_page"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {{ $t('common.next') }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                {{ $t('common.showing') }}
                <span class="font-medium">{{ pagination.from }}</span>
                {{ $t('common.to') }}
                <span class="font-medium">{{ pagination.to }}</span>
                {{ $t('common.of') }}
                <span class="font-medium">{{ pagination.total }}</span>
                {{ $t('common.results') }}
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="previousPage"
                  :disabled="pagination.current_page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">{{ $t('common.previous') }}</span>
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button
                  v-for="page in pages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === pagination.current_page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="pagination.current_page === pagination.last_page"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">{{ $t('common.next') }}</span>
                  <i class="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Button -->
      <div class="flex justify-end">
        <button
          v-if="$store.getters['auth/hasPermission']('export_reports')"
          @click="exportReport"
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <i class="fas fa-file-export mr-2"></i> {{ $t('reports.export') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalesReport',
  data() {
    return {
      loading: false,
      filters: {
        start_date: '',
        end_date: '',
      },
      invoices: [],
      summary: {},
      pagination: {},
      currentPage: 1,
    }
  },
  computed: {
    pages() {
      const pages = []
      const totalPages = this.pagination.last_page || 1
      const currentPage = this.pagination.current_page || 1

      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, startPage + 4)

      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      return pages
    },
  },
  mounted() {
    // Set default date range to last month
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)

    this.filters.start_date = lastMonth.toISOString().split('T')[0]
    this.filters.end_date = today.toISOString().split('T')[0]

    this.loadReport()
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    },
    formatCurrency(amount) {
      if (!amount) return '0.00 ر.س'
      return parseFloat(amount).toFixed(2) + ' ر.س'
    },
    getStatusText(status) {
      const statusMap = {
        draft: this.$t('invoices.statuses.draft'),
        sent: this.$t('invoices.statuses.sent'),
        paid: this.$t('invoices.statuses.paid'),
        overdue: this.$t('invoices.statuses.overdue'),
      }
      return statusMap[status] || status
    },
    getStatusClasses(status) {
      const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
      const statusClasses = {
        draft: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
    },
    async loadReport() {
      this.loading = true
      try {
        const params = {
          ...this.filters,
          page: this.currentPage,
        }

        // Remove empty filters
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key]
        })

        // In a real application, you would call an API endpoint
        // For now, we'll use the invoices store
        await this.$store.dispatch('invoices/fetchInvoices', params)

        const allInvoices = this.$store.getters['invoices/invoices'] || []
        const pagination = this.$store.getters['invoices/pagination'] || {}

        // Filter by date range if provided
        if (this.filters.start_date || this.filters.end_date) {
          this.invoices = allInvoices.filter((invoice) => {
            const invoiceDate = new Date(invoice.created_at).toISOString().split('T')[0]

            if (this.filters.start_date && invoiceDate < this.filters.start_date) return false
            if (this.filters.end_date && invoiceDate > this.filters.end_date) return false

            return true
          })
        } else {
          this.invoices = allInvoices
        }

        this.pagination = pagination

        // Calculate summary
        this.calculateSummary()
      } catch (error) {
        this.$toast.error(this.$t('common.loadError'))
      } finally {
        this.loading = false
      }
    },
    calculateSummary() {
      this.summary = {
        invoice_count: this.invoices.length,
        total_amount: this.invoices.reduce(
          (sum, inv) => sum + parseFloat(inv.total_amount || 0),
          0,
        ),
        total_paid: this.invoices.reduce((sum, inv) => sum + parseFloat(inv.paid_amount || 0), 0),
      }

      this.summary.total_due = this.summary.total_amount - this.summary.total_paid
    },
    exportReport() {
      // In a real application, this would trigger a file download
      this.$toast.info(this.$t('reports.exportMessage'))
    },
    previousPage() {
      if (this.pagination.current_page > 1) {
        this.currentPage = this.pagination.current_page - 1
        this.loadReport()
      }
    },
    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.currentPage = this.pagination.current_page + 1
        this.loadReport()
      }
    },
    goToPage(page) {
      this.currentPage = page
      this.loadReport()
    },
  },
}
</script>
