<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('invoices.details.title') }}</h1>
          <p class="text-gray-600 mt-2">{{ $t('invoices.details.subtitle') }}</p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-3 space-x-reverse">
          <router-link
            to="/invoices"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            {{ $t('common.back') }}
          </router-link>
          <router-link
            :to="`/invoices/${invoice.id}/edit`"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ $t('common.edit') }}
          </router-link>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="mr-3 text-gray-600">{{ $t('common.loading') }}</span>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div class="text-red-600 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-red-800 mb-2">{{ $t('common.error') }}</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button
          @click="loadInvoice"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {{ $t('common.retry') }}
        </button>
      </div>

      <div v-else-if="!invoice" class="text-center py-12">
        <svg
          class="w-24 h-24 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ $t('invoices.details.notFound') }}
        </h3>
        <p class="text-gray-500">{{ $t('invoices.details.notFoundDesc') }}</p>
      </div>

      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Invoice Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-bold">
                {{ $t('invoices.details.invoice') }} #{{ invoice.invoice_number }}
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
                {{ $t('invoices.details.clientInfo') }}
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
                  <p>{{ invoice.client?.phone || $t('clients.notProvided') }}</p>
                  <p>{{ invoice.client?.address || $t('clients.notProvided') }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                {{ $t('invoices.details.datesInfo') }}
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('invoices.details.issueDate') }}:</span>
                  <span class="font-medium">{{ formatDate(invoice.issue_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('invoices.details.dueDate') }}:</span>
                  <span class="font-medium">{{ formatDate(invoice.due_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ $t('invoices.details.daysRemaining') }}:</span>
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
              {{ $t('invoices.details.items') }}
            </h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('invoices.details.description') }}
                    </th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('invoices.details.quantity') }}
                    </th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('invoices.details.unitPrice') }}
                    </th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      {{ $t('invoices.details.total') }}
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
                <span class="text-gray-600">{{ $t('invoices.details.subtotal') }}:</span>
                <span class="font-medium">{{ formatCurrency(invoice.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('invoices.details.tax') }} (15%):</span>
                <span class="font-medium">{{ formatCurrency(invoice.tax_amount) }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-3">
                <span class="text-lg font-semibold text-gray-900"
                  >{{ $t('invoices.details.totalAmount') }}:</span
                >
                <span class="text-lg font-bold text-blue-600">{{
                  formatCurrency(invoice.total_amount)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="invoice.notes" class="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('invoices.details.notes') }}
            </h3>
            <p class="text-gray-700">{{ invoice.notes }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0"
          >
            <div class="flex space-x-3 space-x-reverse">
              <button
                @click="updateStatus('sent')"
                :disabled="invoice.status === 'sent' || statusLoading"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('invoices.actions.markSent') }}
              </button>
              <button
                @click="updateStatus('paid')"
                :disabled="invoice.status === 'paid' || statusLoading"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ $t('invoices.actions.markPaid') }}
              </button>
            </div>
            <div class="flex space-x-3 space-x-reverse">
              <button
                @click="printInvoice"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {{ $t('invoices.actions.print') }}
              </button>
              <button
                @click="downloadPDF"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {{ $t('invoices.actions.downloadPDF') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
  name: 'InvoiceDetails',
  setup() {
    const { t, locale } = useI18n()
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    // Reactive data
    const loading = ref(true)
    const error = ref(null)
    const statusLoading = ref(false)

    // Computed properties
    const invoice = computed(() => store.state.invoices.currentInvoice)
    const storeError = computed(() => store.state.invoices.error)

    // Methods
    const formatDate = (dateString) => {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString(locale.value, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    }

    const formatCurrency = (amount) => {
      if (!amount) return '0.00 ر.س'
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    }

    const getStatusText = (status) => {
      const statusMap = {
        draft: t('invoices.status.draft'),
        sent: t('invoices.status.sent'),
        paid: t('invoices.status.paid'),
        overdue: t('invoices.status.overdue'),
      }
      return statusMap[status] || status
    }

    const getInitials = (name) => {
      if (!name) return '?'
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }

    const getDaysRemaining = (dueDate) => {
      if (!dueDate) return t('invoices.details.notSpecified')
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return t('invoices.details.expired')
      if (diffDays === 0) return t('invoices.details.today')
      if (diffDays === 1) return t('invoices.details.tomorrow')
      return t('invoices.details.daysRemaining', { days: diffDays })
    }

    const getDaysRemainingClass = (dueDate) => {
      if (!dueDate) return 'text-gray-600'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'text-red-600 font-semibold'
      if (diffDays <= 3) return 'text-yellow-600 font-semibold'
      return 'text-green-600 font-semibold'
    }

    const updateStatus = async (status) => {
      statusLoading.value = true
      try {
        await store.dispatch('invoices/updateInvoiceStatus', {
          id: invoice.value.id,
          status,
        })
        // إظهار رسالة نجاح
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              type: 'success',
              message: t('invoices.messages.statusUpdated'),
            },
          }),
        )
      } catch (error) {
        console.error('Failed to update status:', error)
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              type: 'error',
              message: t('invoices.messages.statusUpdateFailed'),
            },
          }),
        )
      } finally {
        statusLoading.value = false
      }
    }

    const printInvoice = () => {
      window.print()
    }

    const downloadPDF = () => {
      // TODO: Implement PDF download
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: {
            type: 'info',
            message: t('invoices.messages.pdfComingSoon'),
          },
        }),
      )
    }

    const loadInvoice = async () => {
      loading.value = true
      error.value = null

      try {
        const invoiceId = route.params.id
        console.log('🔄 Loading invoice ID:', invoiceId)

        if (!invoiceId) {
          throw new Error(t('invoices.messages.invalidId'))
        }

        await store.dispatch('invoices/fetchInvoice', invoiceId)

        // تحقق إذا كانت البيانات موجودة بعد التحميل
        if (!invoice.value) {
          error.value = t('invoices.messages.notFound')
        }
      } catch (err) {
        console.error('❌ Failed to fetch invoice:', err)
        error.value = err.message || t('invoices.messages.loadFailed')
      } finally {
        loading.value = false
      }
    }

    // Watchers
    watch(storeError, (newError) => {
      if (newError) {
        error.value = newError
      }
    })

    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          loadInvoice()
        }
      },
    )

    // Lifecycle
    onMounted(() => {
      loadInvoice()
    })

    return {
      // Reactive data
      loading,
      error,
      statusLoading,

      // Computed
      invoice,

      // Methods
      formatDate,
      formatCurrency,
      getStatusText,
      getInitials,
      getDaysRemaining,
      getDaysRemainingClass,
      updateStatus,
      printInvoice,
      downloadPDF,
      loadInvoice,
    }
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

  body {
    background: white !important;
  }

  .bg-gray-50 {
    background: white !important;
  }
}
</style>
