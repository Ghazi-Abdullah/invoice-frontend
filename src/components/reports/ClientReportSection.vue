<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- total_clients -->
      <div class="stats-card bg-gradient-to-br from-blue-50 to-blue-100">
        <div class="stats-icon bg-blue-100">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.totalClients') }}</p>
          <p class="stats-value">{{ stats.total_clients || 0 }}</p>
        </div>
      </div>

      <!-- active_clients -->
      <div class="stats-card bg-gradient-to-br from-green-50 to-green-100">
        <div class="stats-icon bg-green-100">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.activeClients') }}</p>
          <p class="stats-value">{{ stats.active_clients || 0 }}</p>
        </div>
      </div>

      <!-- total_invoices (from client perspective) -->
      <div class="stats-card bg-gradient-to-br from-blue-50 to-blue-100">
        <div class="stats-icon bg-blue-100">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.totalInvoices') }}</p>
          <p class="stats-value">{{ stats.total_invoices || 0 }}</p>
        </div>
      </div>

      <!-- total_revenue -->
      <div class="stats-card bg-gradient-to-br from-purple-50 to-purple-100">
        <div class="stats-icon bg-purple-100">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.totalRevenue') }}</p>
          <p class="stats-value">{{ formatCurrency(stats.total_revenue || 0) }}</p>
        </div>
      </div>
    </div>

    <!-- Clients Table -->
    <div
      v-if="clients.length > 0"
      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('reports.clientsList') }}</h3>
            <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              {{ pagination.total }} {{ $t('reports.client') }}
            </span>
          </div>
          <div class="text-sm text-gray-600">
            {{
              $t('pagination.showing', {
                from: pagination.from,
                to: pagination.to,
                total: pagination.total,
              })
            }}
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="table-header">{{ $t('reports.client_name') }}</th>
              <th class="table-header">{{ $t('reports.company') }}</th>
              <th class="table-header text-center">{{ $t('reports.email') }}</th>
              <th class="table-header text-center">{{ $t('reports.phone') }}</th>
              <th class="table-header text-center">{{ $t('reports.invoices_count') }}</th>
              <th class="table-header text-right">{{ $t('reports.total_spent') }}</th>
              <th class="table-header text-right">{{ $t('reports.average_invoice') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="client in clients"
              :key="client.id"
              class="hover:bg-blue-50/30 transition-colors"
            >
              <td class="table-cell">
                <div class="client-cell">
                  <div class="client-avatar mr-8">
                    {{ getInitials(client.name) }}
                  </div>
                  <div>
                    <div class="client-name">
                      {{ client.name }}
                    </div>
                    <div class="client-email">
                      {{ client.email || $t('common.notProvided') }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-cell">
                <div class="text-sm text-gray-900">
                  {{ client.company_name || $t('common.notProvided') }}
                </div>
              </td>
              <td class="table-cell text-center">
                <div class="text-sm text-gray-900">{{ client.email || '-' }}</div>
              </td>
              <td class="table-cell text-center">
                <div class="text-sm text-gray-900">{{ client.phone || '-' }}</div>
              </td>
              <td class="table-cell text-center">
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {{ client.invoices_count || 0 }}
                </span>
              </td>
              <td class="table-cell text-right">
                <div class="amount-cell">{{ formatCurrency(client.total_spent) }}</div>
              </td>
              <td class="table-cell text-right">
                <div class="text-base font-semibold text-green-600">
                  {{ formatCurrency(client.average_invoice) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination (simple previous/next) -->
      <div v-if="pagination.last_page > 1" class="px-6 py-4 border-t border-gray-200">
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
              @click="$emit('page-change', pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="pagination-button"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === 1 }"
            >
              {{ $t('pagination.previous') }}
            </button>
            <button
              @click="$emit('page-change', pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="pagination-button"
              :class="{
                'opacity-50 cursor-not-allowed': pagination.current_page === pagination.last_page,
              }"
            >
              {{ $t('pagination.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <h3>{{ $t('reports.noClients') }}</h3>
      <p>{{ $t('reports.noClientsMessage') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientReportSection',
  props: {
    clients: { type: Array, default: () => [] },
    stats: { type: Object, default: () => ({}) },
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
  methods: {
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
      if (!name) return '--'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
  },
}
</script>

<style scoped>
/* استخدم نفس الأنماط الموجودة في InvoiceReportSection */
.stats-card {
  @apply rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300;
}
.stats-icon {
  @apply p-3 rounded-lg w-fit mb-3;
}
.stats-label {
  @apply text-sm font-medium text-gray-500 mb-1;
}
.stats-value {
  @apply text-2xl font-bold text-gray-900;
}
.table-header {
  @apply px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4;
}
.client-cell {
  @apply flex items-center;
}
.client-avatar {
  @apply w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center ml-3;
}
.client-name {
  @apply text-sm font-medium text-gray-900;
}
.client-email {
  @apply text-xs text-gray-500 mt-1;
}
.amount-cell {
  @apply text-lg font-bold text-gray-900;
}
.pagination-button {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200;
}
.empty-state {
  @apply bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center;
}
.empty-icon {
  @apply w-16 h-16 text-gray-400 mx-auto mb-4;
}
.empty-state h3 {
  @apply text-lg font-semibold text-gray-900 mb-2;
}
.empty-state p {
  @apply text-gray-600 mb-6 max-w-md mx-auto;
}
</style>
