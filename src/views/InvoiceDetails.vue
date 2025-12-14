<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('invoices.details') }}</h1>
          <p class="text-gray-600 mt-2">{{ $t('invoices.detailsDescription') }}</p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-3">
          <router-link
            to="/invoices"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            {{ $t('common.back') }}
          </router-link>
          <router-link
            v-if="$store.getters['auth/hasPermission']('edit_invoice')"
            :to="`/invoices/${invoice.id}/edit`"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-edit mr-2"></i>
            {{ $t('common.edit') }}
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="mr-3 text-gray-600">{{ $t('common.loading') }}</span>
      </div>

      <div v-else-if="invoice" class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Invoice Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-bold">
                {{ $t('invoices.invoice') }} #{{ invoice.invoice_number }}
              </h2>
              <p class="text-blue-100 mt-1">{{ formatDate(invoice.issue_date) }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <span :class="`status-badge status-${invoice.status}`">
                {{ getStatusText(invoice.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Invoice Details -->
        <div class="p-6">
          <!-- Client and Dates Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ $t('invoices.clientInfo') }}
              </h3>
              <div class="space-y-2">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold text-sm">
                      {{ getInitials(invoice.client?.name) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ invoice.client?.name }}</p>
                    <p class="text-gray-600 text-sm">{{ invoice.client?.email }}</p>
                  </div>
                </div>
                <div class="text-sm text-gray-600 mt-3">
                  <p>{{ invoice.client?.phone || $t('common.notAvailable') }}</p>
                  <p>{{ invoice.client?.address || $t('common.notAvailable') }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ $t('invoices.datesInfo') }}
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('invoices.issueDate') }}:</span>
                  <span class="font-medium">{{ formatDate(invoice.issue_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('invoices.dueDate') }}:</span>
                  <span class="font-medium">{{ formatDate(invoice.due_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('invoices.daysRemaining') }}:</span>
                  <span :class="getDaysRemainingClass(invoice.due_date)">
                    {{ getDaysRemaining(invoice.due_date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice Items -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ $t('invoices.items') }}
            </h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('common.description') }}
                    </th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('common.quantity') }}
                    </th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('common.unitPrice') }}
                    </th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('common.total') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in invoice.items" :key="item.id">
                    <td class="px-4 py-3 text-sm text-gray-900">{{ item.description }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-center">{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">
                      {{ formatCurrency(item.unit_price) }}
                    </td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">
                      {{ formatCurrency(item.total) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Invoice Summary -->
          <div class="border-t border-gray-200 pt-6">
            <div class="max-w-xs ml-auto space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.subtotal') }}:</span>
                <span class="font-medium">{{ formatCurrency(invoice.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('common.tax') }} (15%):</span>
                <span class="font-medium">{{ formatCurrency(invoice.tax_amount) }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-3">
                <span class="text-lg font-semibold text-gray-900">{{ $t('common.total') }}:</span>
                <span class="text-lg font-bold text-blue-600">{{
                  formatCurrency(invoice.total_amount)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="invoice.notes" class="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('common.notes') }}</h3>
            <p class="text-gray-700">{{ invoice.notes }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
          >
            <div class="flex space-x-3">
              <button
                v-if="$store.getters['auth/hasPermission']('edit_invoice')"
                @click="updateStatus('sent')"
                :disabled="invoice.status === 'sent'"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ $t('invoices.markAsSent') }}
              </button>
              <button
                v-if="$store.getters['auth/hasPermission']('edit_invoice')"
                @click="updateStatus('paid')"
                :disabled="invoice.status === 'paid'"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {{ $t('invoices.markAsPaid') }}
              </button>
            </div>
            <div class="flex space-x-3">
              <button
                @click="printInvoice"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <i class="fas fa-print mr-2"></i> {{ $t('invoices.print') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-12">
        <i class="fas fa-file-invoice text-gray-300 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('invoices.notFound') }}</h3>
        <p class="text-gray-500">{{ $t('invoices.notFoundMessage') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceDetails',
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    invoice() {
      return this.$store.getters['invoices/currentInvoice']
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
        draft: this.$t('invoices.statuses.draft'),
        sent: this.$t('invoices.statuses.sent'),
        paid: this.$t('invoices.statuses.paid'),
        overdue: this.$t('invoices.statuses.overdue'),
      }
      return statusMap[status] || status
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
    getDaysRemaining(dueDate) {
      if (!dueDate) return this.$t('invoices.notSpecified')
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays < 0) return this.$t('invoices.expired')
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
      if (diffDays < 0) return 'text-red-600 font-semibold'
      if (diffDays <= 3) return 'text-yellow-600 font-semibold'
      return 'text-green-600 font-semibold'
    },
    async updateStatus(status) {
      try {
        await this.$store.dispatch('invoices/updateInvoiceStatus', {
          id: this.invoice.id,
          status,
        })
        this.$toast.success(this.$t('invoices.statusUpdated'))
      } catch (error) {
        this.$toast.error(this.$t('invoices.updateFailed'))
      }
    },
    printInvoice() {
      window.print()
    },
    async loadInvoice() {
      try {
        const invoiceId = this.$route.params.id
        await this.$store.dispatch('invoices/fetchInvoice', invoiceId)
      } catch (error) {
        this.$toast.error(this.$t('invoices.loadFailed'))
        this.$router.push('/invoices')
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.loadInvoice()
  },
}
</script>

<style scoped>
.status-badge {
  @apply inline-flex px-3 py-1 text-sm font-semibold rounded-full;
}
.status-draft {
  @apply bg-yellow-100 text-yellow-800;
}
.status-sent {
  @apply bg-blue-100 text-blue-800;
}
.status-paid {
  @apply bg-green-100 text-green-800;
}
.status-overdue {
  @apply bg-red-100 text-red-800;
}
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
