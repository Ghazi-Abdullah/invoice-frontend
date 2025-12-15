<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{ $t('invoices.title') }}</h1>
        <p class="text-gray-600 mt-1">{{ $t('invoices.subtitle') }}</p>
      </div>
      <div class="flex space-x-3">
        <button
          v-if="$store.getters['auth/hasPermission']('create_invoice')"
          @click="$router.push('/invoices/create')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> {{ $t('invoices.create') }}
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            $t('invoices.status')
          }}</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="draft">{{ $t('invoices.statuses.draft') }}</option>
            <option value="sent">{{ $t('invoices.statuses.sent') }}</option>
            <option value="paid">{{ $t('invoices.statuses.paid') }}</option>
            <option value="overdue">{{ $t('invoices.statuses.overdue') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
            $t('common.fromDate')
          }}</label>
          <input
            type="date"
            v-model="filters.start_date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{
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
            @click="applyFilters"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            {{ $t('common.filter') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
    </div>

    <!-- Invoices Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="invoices.length === 0" class="text-center py-12">
        <i class="fas fa-file-invoice text-gray-300 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('invoices.noInvoices') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('invoices.noInvoicesMessage') }}</p>
        <button
          v-if="$store.getters['auth/hasPermission']('create_invoice')"
          @click="$router.push('/invoices/create')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <i class="fas fa-plus mr-2"></i> {{ $t('invoices.create') }}
        </button>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
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
              {{ $t('invoices.dueDate') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('common.amount') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('common.status') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('common.actions') }}
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
              {{ formatDate(invoice.issue_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(invoice.due_date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ formatCurrency(invoice.total_amount) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClasses(invoice.status)">
                {{ getStatusText(invoice.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="$router.push(`/invoices/${invoice.id}`)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                <i class="fas fa-eye mr-1"></i> {{ $t('common.view') }}
              </button>
              <button
                v-if="$store.getters['auth/hasPermission']('edit_invoice')"
                @click="$router.push(`/invoices/${invoice.id}/edit`)"
                class="text-green-600 hover:text-green-900 mr-3"
              >
                <i class="fas fa-edit mr-1"></i> {{ $t('common.edit') }}
              </button>
              <button
                v-if="$store.getters['auth/hasPermission']('delete_invoice')"
                @click="confirmDeleteInvoice(invoice)"
                class="text-red-600 hover:text-red-900"
              >
                <i class="fas fa-trash mr-1"></i> {{ $t('common.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

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
  </div>
</template>

<script>
export default {
  name: 'Invoices',
  data() {
    return {
      loading: false,
      filters: {
        status: '',
        start_date: '',
        end_date: '',
      },
      currentPage: 1,
    }
  },
  computed: {
    invoices() {
      return this.$store.getters['invoices/invoices']
    },
    pagination() {
      return this.$store.getters['invoices/pagination'] || {}
    },
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
    this.loadInvoices()
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
    async loadInvoices() {
      this.loading = true
      try {
        await this.$store.dispatch('invoices/fetchInvoices', {
          ...this.filters,
          page: this.currentPage,
        })
      } catch (error) {
        this.$toast.error(this.$t('common.loadError'))
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.currentPage = 1
      this.loadInvoices()
    },
    confirmDeleteInvoice(invoice) {
      if (confirm(this.$t('common.confirmDelete'))) {
        this.deleteInvoice(invoice.id)
      }
    },
    async deleteInvoice(id) {
      this.loading = true
      try {
        await this.$store.dispatch('invoices/deleteInvoice', id)
        this.$toast.success(this.$t('invoices.deleteSuccess'))
      } catch (error) {
        this.$toast.error(error.message || this.$t('common.deleteError'))
      } finally {
        this.loading = false
      }
    },
    previousPage() {
      if (this.pagination.current_page > 1) {
        this.currentPage = this.pagination.current_page - 1
        this.loadInvoices()
      }
    },
    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.currentPage = this.pagination.current_page + 1
        this.loadInvoices()
      }
    },
    goToPage(page) {
      this.currentPage = page
      this.loadInvoices()
    },
  },
}
</script>
