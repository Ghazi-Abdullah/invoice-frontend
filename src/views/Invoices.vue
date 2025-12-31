<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('invoices.title')"
        :subtitle="$t('invoices.subtitle')"
        :actions="headerActions"
      />

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <BaseCard hoverable class="stat-card">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg mr-4">
              <font-awesome-icon :icon="['fas', 'file-invoice']" class="text-blue-600 text-xl" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.total') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard hoverable class="stat-card">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg mr-4">
              <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-600 text-xl" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.paid') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.paid }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard hoverable class="stat-card">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-lg mr-4">
              <font-awesome-icon :icon="['fas', 'paper-plane']" class="text-yellow-600 text-xl" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.sent') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.sent }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard hoverable class="stat-card">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-lg mr-4">
              <font-awesome-icon
                :icon="['fas', 'exclamation-triangle']"
                class="text-red-600 text-xl"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('invoices.stats.overdue') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.overdue }}</p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Filters Card -->
      <BaseCard class="mb-6" title="فلاتر البحث">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('invoices.status')
            }}</label>
            <select v-model="filters.status" @change="applyFilters" class="form-input">
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
              v-model="filters.start_date"
              @change="applyFilters"
              class="form-input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.toDate')
            }}</label>
            <input
              type="date"
              v-model="filters.end_date"
              @change="applyFilters"
              class="form-input"
            />
          </div>

          <div class="flex items-end">
            <BaseButton @click="applyFilters" type="primary" icon="filter" block>
              {{ $t('common.filter') }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Invoices Table -->
      <BaseCard>
        <template #actions>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                @input="onSearch"
                placeholder="بحث برقم الفاتورة أو اسم العميل..."
                class="form-input pl-10"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="['fas', 'search']" class="text-gray-400" />
              </div>
            </div>

            <BaseButton
              v-if="hasPermission('create_invoice')"
              @click="$router.push('/invoices/create')"
              type="primary"
              icon="plus"
            >
              {{ $t('invoices.create') }}
            </BaseButton>
          </div>
        </template>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <LoadingSpinner />
        </div>

        <!-- Empty State -->
        <div v-else-if="invoices.length === 0" class="text-center py-12">
          <font-awesome-icon :icon="['fas', 'file-invoice']" class="text-gray-300 text-4xl mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('invoices.noInvoices') }}</h3>
          <p class="text-gray-500 mb-6">{{ $t('invoices.noInvoicesMessage') }}</p>
          <BaseButton
            v-if="hasPermission('create_invoice')"
            @click="$router.push('/invoices/create')"
            type="primary"
            icon="plus"
          >
            {{ $t('invoices.create') }}
          </BaseButton>
        </div>

        <!-- Table -->
        <BaseTable
          v-else
          :columns="tableColumns"
          :data="filteredInvoices"
          :show-actions="true"
          bordered
          striped
          hoverable
        >
          <template #cell-invoice_number="{ row }">
            <div class="font-medium text-gray-900">{{ row.invoice_number }}</div>
            <div class="text-sm text-gray-500">#{{ row.id }}</div>
          </template>

          <template #cell-client="{ row }">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                <span class="text-blue-600 text-xs font-semibold">
                  {{ getInitials(row.client?.name) }}
                </span>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-900">
                  {{ row.client?.name || 'غير محدد' }}
                </div>
                <div class="text-sm text-gray-500">{{ row.client?.email || 'غير محدد' }}</div>
              </div>
            </div>
          </template>

          <template #cell-issue_date="{ row }">
            {{ formatDate(row.issue_date) }}
          </template>

          <template #cell-due_date="{ row }">
            <span :class="getDaysRemainingClass(row.due_date)">
              {{ getDaysRemaining(row.due_date) }}
            </span>
          </template>

          <template #cell-total_amount="{ row }">
            <span class="font-semibold">{{ formatCurrency(row.total_amount) }}</span>
          </template>

          <template #cell-status="{ row }">
            <StatusBadge :status="row.status" />
          </template>

          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <BaseButton
                @click="$router.push(`/invoices/${row.id}`)"
                type="ghost"
                size="sm"
                icon="eye"
                title="عرض"
              />

              <BaseButton
                v-if="hasPermission('edit_invoice')"
                @click="$router.push(`/invoices/${row.id}/edit`)"
                type="ghost"
                size="sm"
                icon="edit"
                title="تعديل"
              />

              <BaseButton
                v-if="hasPermission('delete_invoice')"
                @click="confirmDelete(row)"
                type="ghost"
                size="sm"
                icon="trash"
                title="حذف"
                class="text-red-600 hover:text-red-700"
              />
            </div>
          </template>
        </BaseTable>

        <!-- Pagination -->
        <div v-if="pagination && pagination.total > pagination.per_page" class="mt-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              عرض {{ pagination.from }} إلى {{ pagination.to }} من {{ pagination.total }}
              {{ $t('common.results') }}
            </div>
            <div class="flex space-x-2">
              <BaseButton
                @click="previousPage"
                :disabled="pagination.current_page === 1"
                type="outline"
                size="sm"
                :icon="['fas', 'chevron-right']"
              />

              <span class="flex items-center px-3">
                صفحة {{ pagination.current_page }} من {{ pagination.last_page }}
              </span>

              <BaseButton
                @click="nextPage"
                :disabled="pagination.current_page === pagination.last_page"
                type="outline"
                size="sm"
                :icon="['fas', 'chevron-left']"
              />
            </div>
          </div>
        </div>
      </BaseCard>
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
        start_date: '',
        end_date: '',
      },
      searchQuery: '',
      searchTimeout: null,

      tableColumns: [
        { key: 'invoice_number', label: 'رقم الفاتورة', align: 'right' },
        { key: 'client', label: 'العميل', align: 'right' },
        { key: 'issue_date', label: 'تاريخ الإصدار', align: 'center' },
        { key: 'due_date', label: 'تاريخ الاستحقاق', align: 'center' },
        { key: 'total_amount', label: 'المبلغ', align: 'right' },
        { key: 'status', label: 'الحالة', align: 'center' },
      ],
    }
  },

  computed: {
    ...mapGetters('invoices', ['loading', 'invoices', 'pagination']),

    filteredInvoices() {
      if (!this.searchQuery && !this.filters.status) {
        return this.invoices
      }

      return this.invoices.filter((invoice) => {
        const matchesSearch =
          !this.searchQuery ||
          invoice.invoice_number?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          invoice.client?.name?.toLowerCase().includes(this.searchQuery.toLowerCase())

        const matchesStatus = !this.filters.status || invoice.status === this.filters.status

        return matchesSearch && matchesStatus
      })
    },

    stats() {
      const invoices = this.invoices
      return {
        total: invoices.length,
        paid: invoices.filter((inv) => inv.status === 'paid').length,
        sent: invoices.filter((inv) => inv.status === 'sent').length,
        overdue: invoices.filter((inv) => inv.status === 'overdue').length,
      }
    },

    headerActions() {
      return [
        {
          text: this.$t('invoices.create'),
          type: 'primary',
          icon: 'plus',
          onClick: () => this.$router.push('/invoices/create'),
          disabled: !this.hasPermission('create_invoice'),
        },
      ]
    },
  },

  mounted() {
    console.log('🚀 Invoices component mounted')
    this.loadInvoices()
  },

  methods: {
    ...mapActions('invoices', ['fetchInvoices', 'deleteInvoice']),

    async loadInvoices() {
      console.log('🔄 Loading invoices...')
      try {
        await this.fetchInvoices(this.filters)
        console.log('✅ Invoices loaded successfully:', this.invoices)
      } catch (error) {
        console.error('❌ Error loading invoices:', error)
        this.$toast.error(error.message || 'فشل في تحميل الفواتير')
      }
    },

    applyFilters() {
      console.log('🔍 Applying filters:', this.filters)
      this.loadInvoices()
    },

    onSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        console.log('🔍 Searching for:', this.searchQuery)
        this.applyFilters()
      }, 500)
    },

    confirmDelete(invoice) {
      if (confirm(`هل أنت متأكد من حذف الفاتورة "${invoice.invoice_number}"؟`)) {
        this.deleteInvoiceHandler(invoice.id)
      }
    },

    async deleteInvoiceHandler(id) {
      try {
        await this.deleteInvoice(id)
        this.$toast.success('تم حذف الفاتورة بنجاح')
        this.loadInvoices()
      } catch (error) {
        this.$toast.error(error.message || 'فشل في حذف الفاتورة')
      }
    },

    previousPage() {
      if (this.pagination && this.pagination.current_page > 1) {
        this.filters.page = this.pagination.current_page - 1
        this.loadInvoices()
      }
    },

    nextPage() {
      if (this.pagination && this.pagination.current_page < this.pagination.last_page) {
        this.filters.page = this.pagination.current_page + 1
        this.loadInvoices()
      }
    },

    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    },

    formatCurrency(amount) {
      if (!amount) return '0.00 ر.س'
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      }).format(amount)
    },

    getInitials(name) {
      if (!name) return '؟'
      return name.substring(0, 2).toUpperCase()
    },

    getDaysRemaining(dueDate) {
      if (!dueDate) return 'غير محدد'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'منتهية'
      if (diffDays === 0) return 'اليوم'
      if (diffDays === 1) return 'غداً'
      return `${diffDays} يوم`
    },

    getDaysRemainingClass(dueDate) {
      if (!dueDate) return 'text-gray-600'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'text-red-600 font-semibold'
      if (diffDays <= 3) return 'text-yellow-600 font-semibold'
      return 'text-green-600 font-semibold'
    },
  },

  watch: {
    filters: {
      handler() {
        this.applyFilters()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.stat-card {
  @apply transition-all duration-200 hover:shadow-lg;
}

.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}
</style>
