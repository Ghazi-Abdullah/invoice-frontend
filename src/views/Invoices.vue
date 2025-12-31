<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- العنوان والإحصائيات -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('invoices.title') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('invoices.subtitle') }}</p>
          </div>
          <button
            v-if="hasPermission('create_invoice')"
            @click="$router.push('/invoices/create')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center transition-colors duration-200"
          >
            <i class="fas fa-plus ml-2"></i>
            {{ $t('invoices.create_new') }}
          </button>
        </div>

        <!-- إحصائيات -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 stat-card"
          >
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg mr-4">
                <i class="fas fa-file-invoice text-blue-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.total') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total || 0 }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 stat-card"
          >
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg mr-4">
                <i class="fas fa-check-circle text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.paid') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.paid || 0 }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 stat-card"
          >
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-lg mr-4">
                <i class="fas fa-paper-plane text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.sent') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.sent || 0 }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 stat-card"
          >
            <div class="flex items-center">
              <div class="p-3 bg-red-100 rounded-lg mr-4">
                <i class="fas fa-exclamation-triangle text-red-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.overdue') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.overdue || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- فلاتر البحث -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('common.filters') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.status')
            }}</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="draft">{{ $t('invoices.statuses.draft') }}</option>
              <option value="sent">{{ $t('invoices.statuses.sent') }}</option>
              <option value="paid">{{ $t('invoices.statuses.paid') }}</option>
              <option value="overdue">{{ $t('invoices.statuses.overdue') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.fromDate')
            }}</label>
            <input
              type="date"
              v-model="filters.date_from"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.toDate')
            }}</label>
            <input
              type="date"
              v-model="filters.date_to"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.search')
            }}</label>
            <div class="relative">
              <input
                type="text"
                v-model="filters.search"
                @input="onSearch"
                :placeholder="$t('invoices.searchPlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex space-x-3 space-x-reverse">
          <button
            @click="applyFilters"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
          >
            <i class="fas fa-search ml-2"></i>
            {{ $t('buttons.search') }}
          </button>
          <button
            @click="clearFilters"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center"
          >
            <i class="fas fa-redo ml-2"></i>
            {{ $t('reports.buttons.reset_filters') }}
          </button>
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">{{ $t('invoices.loading') }}</p>
      </div>

      <!-- حالة الخطأ -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-400"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          <button @click="clearError" class="text-red-700 hover:text-red-900 mr-auto">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- جدول الفواتير -->
      <div v-else>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div
            class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50"
          >
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t('invoices.table.invoice_list') }}
            </h3>
            <div class="text-sm text-gray-500">
              {{ $t('invoices.total_amount') }}:
              <span class="font-bold text-gray-900">{{ formatCurrency(stats.totalAmount) }}</span>
            </div>
          </div>

          <div v-if="invoices.length === 0" class="text-center py-12">
            <i class="fas fa-file-invoice text-gray-300 text-4xl mb-3"></i>
            <p class="text-gray-500">{{ $t('invoices.no_invoices') }}</p>
            <button
              v-if="hasPermission('create_invoice')"
              @click="$router.push('/invoices/create')"
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              <i class="fas fa-plus ml-2"></i>
              {{ $t('invoices.start_creating') }}
            </button>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
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
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('invoices.table.date') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('invoices.table.due_date') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('invoices.table.amount') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('invoices.table.status') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('invoices.table.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <router-link
                      :to="`/invoices/${invoice.id}`"
                      class="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                      {{
                        invoice.invoice_number ||
                        $t('invoices.invoiceHeading', { number: invoice.id })
                      }}
                    </router-link>
                    <div class="text-xs text-gray-500 mt-1">#{{ invoice.id }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3"
                      >
                        <span class="text-blue-600 text-xs font-semibold">
                          {{ getInitials(invoice.client?.name) }}
                        </span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">
                          {{ invoice.client?.name || $t('common.notAvailable') }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ invoice.client?.email || $t('common.notAvailable') }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {{ formatDate(invoice.invoice_date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      :class="getDaysRemainingClass(invoice.due_date)"
                      class="text-sm font-medium"
                    >
                      {{ formatDate(invoice.due_date) }}
                      <div class="text-xs mt-1">{{ getDaysRemaining(invoice.due_date) }}</div>
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <span class="font-semibold text-gray-900">{{
                      formatCurrency(invoice.total)
                    }}</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      :class="getStatusClass(invoice.status)"
                      class="px-3 py-1 text-xs font-medium rounded-full inline-block min-w-[80px]"
                    >
                      {{ getStatusText(invoice.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center space-x-2 action-buttons">
                      <BaseButton
                        @click="$router.push(`/invoices/${invoice.id}`)"
                        type="ghost"
                        size="sm"
                        icon="eye"
                        :title="$t('buttons.view')"
                      />
                      <BaseButton
                        v-if="hasPermission('edit_invoice')"
                        @click="$router.push(`/invoices/${invoice.id}/edit`)"
                        type="ghost"
                        size="sm"
                        icon="edit"
                        :title="$t('buttons.edit')"
                      />
                      <BaseButton
                        v-if="hasPermission('delete_client')"
                        @click="confirmDelete(invoice)"
                        type="ghost"
                        size="sm"
                        icon="trash"
                        :title="$t('buttons.delete')"
                        class="text-red-600 hover:text-red-700"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination && pagination.total > pagination.per_page"
          class="mt-6 bg-white rounded-lg shadow p-4"
        >
          <div
            class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
          >
            <div class="text-sm text-gray-700">
              {{
                $t('pagination.showing', {
                  from: pagination.from || 1,
                  to: pagination.to || pagination.total,
                  total: pagination.total,
                })
              }}
            </div>
            <div class="flex items-center space-x-2 space-x-reverse">
              <button
                @click="previousPage"
                :disabled="pagination.current_page === 1"
                class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-chevron-right ml-1"></i>
                {{ $t('pagination.previous') }}
              </button>

              <div class="flex items-center space-x-2">
                <template v-if="pagination.last_page <= 7">
                  <button
                    v-for="page in pagination.last_page"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'px-3 py-1 rounded text-sm transition-colors duration-200',
                      page === pagination.current_page
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>
                </template>
                <template v-else>
                  <button
                    v-for="page in getPaginationRange()"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'px-3 py-1 rounded text-sm transition-colors duration-200',
                      page === pagination.current_page
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 hover:bg-gray-50',
                      page === '...' ? 'cursor-default hover:bg-transparent' : '',
                    ]"
                    :disabled="page === '...'"
                  >
                    {{ page }}
                  </button>
                </template>
              </div>

              <button
                @click="nextPage"
                :disabled="pagination.current_page === pagination.last_page"
                class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('pagination.next') }}
                <i class="fas fa-chevron-left mr-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Invoices',

  data() {
    return {
      filters: {
        status: '',
        date_from: '',
        date_to: '',
        search: '',
      },
      searchTimeout: null,
    }
  },

  computed: {
    ...mapGetters('invoices', [
      'invoices',
      'loading',
      'error',
      'pagination',
      'invoiceStats',
      'invoiceFilters',
    ]),

    stats() {
      return this.invoiceStats
    },
  },

  mounted() {
    console.log('🚀 ' + this.$t('invoices.title') + ' component mounted')

    // تحميل الفلاتر المخزنة
    this.filters = { ...this.filters, ...this.invoiceFilters }

    // تحميل الفواتير
    this.loadInvoices()
  },

  methods: {
    ...mapActions('invoices', [
      'fetchInvoices',
      'deleteInvoice',
      'updateFilters',
      'clearFilters',
      'clearError',
    ]),

    async loadInvoices() {
      console.log('🔄 ' + this.$t('invoices.loading') + '...')
      try {
        await this.fetchInvoices(this.filters)
        console.log(
          '✅ ' + this.$t('invoices.load_success') + ':',
          this.invoices.length,
          'invoices',
        )
      } catch (error) {
        console.error('❌ ' + this.$t('invoices.loadFailed') + ':', error)
        this.$toast.error(error.message || this.$t('errors.loadFailed'))
      }
    },

    applyFilters() {
      console.log('🔍 ' + this.$t('common.filters') + ':', this.filters)
      this.updateFilters(this.filters)
      this.loadInvoices()
    },

    onSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 500)
    },

    clearFilters() {
      this.filters = {
        status: '',
        date_from: '',
        date_to: '',
        search: '',
      }
      this.clearFilters()
      this.loadInvoices()
      this.$toast.info(this.$t('reports.buttons.reset_filters'))
    },

    confirmDelete(invoice) {
      if (
        confirm(
          this.$t('invoices.delete_confirm', { number: invoice.invoice_number || invoice.id }) +
            ' ' +
            this.$t('invoices.delete_warning'),
        )
      ) {
        this.deleteInvoiceHandler(invoice.id)
      }
    },

    async deleteInvoiceHandler(id) {
      try {
        await this.deleteInvoice(id)
        this.$toast.success(
          this.$t('invoices.messages.deleteSuccess', { item: this.$t('invoices.invoice') }),
        )
        this.loadInvoices()
      } catch (error) {
        this.$toast.error(error.message || this.$t('invoices.delete_error'))
      }
    },

    goToPage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      this.filters.page = page
      this.loadInvoices()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    previousPage() {
      if (this.pagination && this.pagination.current_page > 1) {
        this.filters.page = this.pagination.current_page - 1
        this.loadInvoices()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    nextPage() {
      if (this.pagination && this.pagination.current_page < this.pagination.last_page) {
        this.filters.page = this.pagination.current_page + 1
        this.loadInvoices()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    getPaginationRange() {
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
          range.push(i)
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      }

      return rangeWithDots
    },

    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
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

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    getInitials(name) {
      if (!name) return '؟؟'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    getDaysRemaining(dueDate) {
      if (!dueDate) return this.$t('common.notAvailable')
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return this.$t('invoices.overdue')
      if (diffDays === 0) return this.$t('invoices.today')
      if (diffDays === 1) return this.$t('invoices.tomorrow')
      return this.$t('invoices.days', { days: diffDays })
    },

    getDaysRemainingClass(dueDate) {
      if (!dueDate) return 'text-gray-600'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'text-red-600'
      if (diffDays <= 3) return 'text-yellow-600'
      return 'text-green-600'
    },

    getStatusClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusText(status) {
      const texts = {
        draft: this.$t('invoices.statuses.draft'),
        sent: this.$t('invoices.statuses.sent'),
        paid: this.$t('invoices.statuses.paid'),
        overdue: this.$t('invoices.statuses.overdue'),
      }
      return texts[status] || status
    },
  },

  watch: {
    invoiceFilters: {
      immediate: true,
      handler(newFilters) {
        this.filters = { ...newFilters }
      },
    },
  },
}
</script>

<style scoped>
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

/* تحسينات للجدول على الأجهزة المحمولة */
@media (max-width: 640px) {
  .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-buttons button {
    width: 100%;
    justify-content: center;
  }
}

/* تأثيرات hover للبطاقات */
.stat-card {
  transition: all 0.2s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}
</style>
