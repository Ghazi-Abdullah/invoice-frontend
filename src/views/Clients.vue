<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- العنوان والإحصائيات -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('clients.title') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('clients.subtitle') }}</p>
          </div>
          <button
            v-if="hasPermission('create_client')"
            @click="$router.push('/clients/create')"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center transition-colors duration-200"
          >
            <i class="fas fa-plus ml-2"></i>
            {{ $t('clients.add_new') }}
          </button>
        </div>

        <!-- إحصائيات -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 stat-card"
          >
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg mr-4">
                <i class="fas fa-users text-blue-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('clients.stats.total_clients') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total_clients || 0 }}</p>
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
                <p class="text-sm font-medium text-gray-600">{{ $t('common.active') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.active_clients || 0 }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 stat-card"
          >
            <div class="flex items-center">
              <div class="p-3 bg-yellow-100 rounded-lg mr-4">
                <i class="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">
                  {{ $t('clients.stats.totalInvoices') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total_invoices || 0 }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 stat-card"
          >
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg mr-4">
                <i class="fas fa-chart-line text-purple-600 text-xl"></i>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">{{ $t('dashboard.total_revenue') }}</p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatCurrency(stats.total_revenue) }}
                </p>
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
              <option value="active">{{ $t('common.active') }}</option>
              <option value="inactive">{{ $t('common.inactive') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('reports.filter_labels.start_date')
            }}</label>
            <input
              type="date"
              v-model="filters.date_from"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('reports.filter_labels.end_date')
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
                :placeholder="$t('clients.searchPlaceholder')"
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
            {{ $t('common.search') }}
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
        <p class="mt-4 text-gray-600">{{ $t('clients.loading') }}</p>
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

      <!-- جدول العملاء -->
      <div v-else>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div
            class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50"
          >
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('clients.table.title') }}</h3>
            <div class="text-sm text-gray-500">
              {{ $t('clients.clientCount') }}:
              <span class="font-bold text-gray-900">{{ pagination.total || 0 }}</span>
            </div>
          </div>

          <div v-if="clients.length === 0" class="text-center py-12">
            <i class="fas fa-users text-gray-300 text-4xl mb-3"></i>
            <p class="text-gray-500">{{ $t('clients.emptyState') }}</p>
            <button
              v-if="hasPermission('create_client')"
              @click="$router.push('/clients/create')"
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              <i class="fas fa-plus ml-2"></i>
              {{ $t('clients.addClient') }}
            </button>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('clients.table.client') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('clients.contactInfo') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('invoices.title') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('common.lastUpdated') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('clients.stats.totalInvoices') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('common.status') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('common.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="client in clients" :key="client.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center ml-3"
                      >
                        <span class="text-blue-600 text-sm font-semibold">
                          {{ getInitials(client.name) }}
                        </span>
                      </div>
                      <div>
                        <router-link
                          :to="`/clients/${client.id}`"
                          class="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200 block"
                        >
                          {{ client.name || $t('common.notAvailable') }}
                        </router-link>
                        <div class="text-xs text-gray-500 mt-1">
                          {{
                            client.company_name
                              ? `${$t('clients.company')}: ${client.company_name}`
                              : $t('clients.noCompany')
                          }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="space-y-1">
                      <div class="text-sm">
                        <i class="fas fa-envelope text-gray-400 ml-1"></i>
                        {{ client.email || $t('common.notAvailable') }}
                      </div>
                      <div class="text-sm">
                        <i class="fas fa-phone text-gray-400 ml-1"></i>
                        {{ client.phone || $t('common.notAvailable') }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {{ client.invoices_count || 0 }}
                      <span class="mr-2">{{ $t('invoices.invoice') }}</span>
                    </span>
                    <div class="text-xs text-gray-500 mt-1">
                      {{
                        client.last_invoice_date
                          ? formatDate(client.last_invoice_date)
                          : $t('clients.noInvoicesForClient')
                      }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {{ formatDate(client.created_at) }}
                    <div class="text-xs text-gray-500 mt-1">
                      {{ $t('common.lastUpdated') }} {{ getTimeAgo(client.created_at) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <span class="font-semibold text-gray-900">{{
                      formatCurrency(client.total_spent || 0)
                    }}</span>
                    <div class="text-xs text-gray-500 mt-1">
                      {{ $t('clients.stats.avgInvoices') }}:
                      {{ formatCurrency(client.average_invoice || 0) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      :class="getStatusClass(client.status)"
                      class="px-3 py-1 text-xs font-medium rounded-full inline-block min-w-[80px]"
                    >
                      {{ getStatusText(client.status) }}
                    </span>
                    <div v-if="client.is_active" class="text-xs text-green-600 mt-1">
                      <i class="fas fa-circle ml-1"></i> {{ $t('common.active') }}
                    </div>
                    <div v-else class="text-xs text-red-600 mt-1">
                      <i class="fas fa-circle ml-1"></i> {{ $t('common.inactive') }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center space-x-2">
                      <BaseButton
                        @click="$router.push(`/clients/${client.id}`)"
                        type="ghost"
                        size="sm"
                        icon="eye"
                        :title="$t('buttons.view')"
                      />
                      <BaseButton
                        v-if="hasPermission('edit_client')"
                        @click="$router.push(`/clients/${client.id}/edit`)"
                        type="ghost"
                        size="sm"
                        icon="edit"
                        :title="$t('buttons.edit')"
                      />
                      <BaseButton
                        v-if="hasPermission('delete_client')"
                        @click="confirmDelete(client)"
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
  name: 'Clients',

  data() {
    return {
      filters: {
        status: '',
        search: '',
        date_from: '',
        date_to: '',
      },
      searchTimeout: null,
    }
  },

  computed: {
    ...mapGetters('clients', [
      'clients',
      'loading',
      'error',
      'pagination',
      'clientStats',
      'clientFilters',
    ]),

    stats() {
      return (
        this.clientStats || {
          total_clients: 0,
          active_clients: 0,
          total_invoices: 0,
          total_revenue: 0,
        }
      )
    },
  },

  mounted() {
    console.log('🚀 ' + this.$t('clients.loading'))

    // تحميل الفلاتر المخزنة
    this.filters = { ...this.filters, ...this.clientFilters }

    // تحميل العملاء
    this.loadClients()
  },

  methods: {
    ...mapActions('clients', [
      'fetchClients',
      'deleteClient',
      'updateFilters',
      'clearFilters',
      'clearError',
    ]),

    async loadClients() {
      console.log('🔄 ' + this.$t('clients.loading'))
      try {
        await this.fetchClients(this.filters)
        console.log('✅ ' + this.$t('clients.loading') + ':', this.clients.length, 'clients')
      } catch (error) {
        console.error('❌ ' + this.$t('errors.loadFailed') + ':', error)
        this.$toast.error(error.message || this.$t('errors.loadClientsError'))
      }
    },

    applyFilters() {
      console.log('🔍 ' + this.$t('common.filters') + ':', this.filters)
      this.updateFilters(this.filters)
      this.loadClients()
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
        search: '',
        date_from: '',
        date_to: '',
      }
      this.clearFilters()
      this.loadClients()
      this.$toast.info(this.$t('messages.refreshSuccess'))
    },

    confirmDelete(client) {
      if (confirm(this.$t('clients.deleteConfirm', { name: client.name }))) {
        this.deleteClientHandler(client.id)
      }
    },

    async deleteClientHandler(id) {
      try {
        await this.deleteClient(id)
        this.$toast.success(this.$t('messages.deleteSuccess'))
        this.loadClients()
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.deleteFailed'))
      }
    },

    goToPage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      this.filters.page = page
      this.loadClients()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    previousPage() {
      if (this.pagination && this.pagination.current_page > 1) {
        this.filters.page = this.pagination.current_page - 1
        this.loadClients()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    nextPage() {
      if (this.pagination && this.pagination.current_page < this.pagination.last_page) {
        this.filters.page = this.pagination.current_page + 1
        this.loadClients()
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
      if (!amount && amount !== 0) return `0.00 ${this.$t('common.currency')}`
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    getTimeAgo(dateString) {
      if (!dateString) return this.$t('common.notAvailable')
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays < 1) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        if (diffHours < 1) {
          const diffMinutes = Math.floor(diffMs / (1000 * 60))
          return this.$t('common.timeAgo.minutes', { minutes: diffMinutes })
        }
        return this.$t('common.timeAgo.hours', { hours: diffHours })
      } else if (diffDays === 1) {
        return this.$t('common.timeAgo.day')
      } else if (diffDays < 30) {
        return this.$t('common.timeAgo.days', { days: diffDays })
      } else if (diffDays < 365) {
        const diffMonths = Math.floor(diffDays / 30)
        return this.$t('common.timeAgo.months', { months: diffMonths })
      } else {
        const diffYears = Math.floor(diffDays / 365)
        return this.$t('common.timeAgo.years', { years: diffYears })
      }
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

    getStatusClass(status) {
      const classes = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusText(status) {
      const texts = {
        active: this.$t('common.active'),
        inactive: this.$t('common.inactive'),
        pending: this.$t('common.pending'),
      }
      return texts[status] || status
    },
  },

  watch: {
    clientFilters: {
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

/* تخصيص شريط التمرير للجدول */
.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
