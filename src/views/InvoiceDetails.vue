<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        :title="$t('invoices.details.title')"
        :subtitle="$t('invoices.details.subtitle')"
        :breadcrumbs="breadcrumbs"
        :actions="headerActions"
      />

      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="text-gray-600 text-lg mt-4">{{ $t('common.loading') }}</p>
      </div>

      <BaseAlert
        v-else-if="storeError"
        type="error"
        title="حدث خطأ"
        :message="storeError"
        :actions="errorActions"
        class="mb-6"
      />

      <div v-else-if="invoice" class="space-y-6">
        <BaseCard class="invoice-header-card">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-gray-900">
                {{ $t('invoices.invoice') }} #{{ invoice.invoice_number || 'غير محدد' }}
              </h2>
              <StatusBadge :status="invoice.status" />
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="info-section">
              <h3 class="section-title">{{ $t('invoices.clientInfo') }}</h3>
              <div class="space-y-4">
                <div v-if="invoice.client" class="flex items-center space-x-3 space-x-reverse">
                  <div class="client-avatar">
                    {{ getInitials(invoice.client.name) }}
                  </div>
                  <div>
                    <p class="client-name">{{ invoice.client.name }}</p>
                    <p class="client-email">{{ invoice.client.email || 'لا يوجد بريد' }}</p>
                  </div>
                </div>
                <div v-else class="text-gray-500 italic">
                  {{ invoice.client_id ? 'جاري تحميل بيانات العميل...' : 'لا توجد معلومات العميل' }}
                </div>
                <div class="client-details">
                  <div v-if="invoice.client?.phone" class="detail-item">
                    <font-awesome-icon :icon="['fas', 'phone']" />
                    <span>{{ invoice.client.phone }}</span>
                  </div>
                  <div v-if="invoice.client?.address" class="detail-item">
                    <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
                    <span>{{ invoice.client.address }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3 class="section-title">{{ $t('invoices.datesInfo') }}</h3>
              <div class="space-y-3">
                <div class="date-item">
                  <span class="date-label">{{ $t('invoices.issueDate') }}:</span>
                  <span class="date-value">{{ formatDate(invoice.invoice_date) }}</span>
                </div>
                <div class="date-item">
                  <span class="date-label">{{ $t('invoices.dueDate') }}:</span>
                  <span class="date-value">{{ formatDate(invoice.due_date) }}</span>
                </div>
                <div class="date-item">
                  <span class="date-label">{{ $t('invoices.daysRemaining') }}:</span>
                  <span :class="getDaysRemainingClass(invoice.due_date)">
                    {{ getDaysRemaining(invoice.due_date) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h3 class="section-title">{{ $t('common.summary') }}</h3>
              <div class="space-y-2">
                <div class="summary-item">
                  <span>{{ $t('common.subtotal') }}:</span>
                  <span class="font-semibold">{{ formatCurrency(invoice.subtotal || 0) }}</span>
                </div>
                <div class="summary-item">
                  <span>{{ $t('common.tax') }} (15%):</span>
                  <span class="font-semibold">{{ formatCurrency(invoice.tax_amount || 0) }}</span>
                </div>
                <div class="summary-item total">
                  <span class="text-lg font-semibold">{{ $t('common.total') }}:</span>
                  <span class="text-xl font-bold text-primary-600">
                    {{ formatCurrency(invoice.total || 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard :title="$t('invoices.items')" class="invoice-items-card">
          <div v-if="!invoiceItems || invoiceItems.length === 0" class="text-center py-8">
            <font-awesome-icon :icon="['fas', 'inbox']" class="text-gray-300 text-4xl mb-3" />
            <p class="text-gray-500">لا توجد عناصر في هذه الفاتورة</p>
          </div>

          <BaseTable
            v-else
            :columns="itemColumns"
            :data="invoiceItems"
            bordered
            striped
            class="mt-4"
          >
            <template #cell-description="{ row }">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-primary-100 rounded flex items-center justify-center ml-3">
                  <font-awesome-icon
                    :icon="['fas', 'file-invoice']"
                    class="text-primary-600 text-sm"
                  />
                </div>
                <span>{{ row.description || 'بدون وصف' }}</span>
              </div>
            </template>

            <template #cell-quantity="{ row }">
              <span class="badge bg-gray-100 text-gray-800 px-3 py-1 rounded">
                {{ row.quantity || 0 }}
              </span>
            </template>

            <template #cell-unit_price="{ row }">
              {{ formatCurrency(row.unit_price || 0) }}
            </template>

            <template #cell-total="{ row }">
              <span class="font-semibold">{{ formatCurrency(row.total || 0) }}</span>
            </template>
          </BaseTable>
        </BaseCard>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BaseCard v-if="invoice.notes" :title="$t('common.notes')" class="lg:col-span-2">
            <p class="text-gray-700 whitespace-pre-line">{{ invoice.notes }}</p>
          </BaseCard>

          <BaseCard :title="$t('common.actions')">
            <div class="space-y-3">
              <BaseButton
                v-if="
                  hasPermission('edit_invoice') &&
                  invoice.status !== 'sent' &&
                  invoice.status !== 'paid'
                "
                @click="updateStatus('sent')"
                :disabled="updatingStatus"
                type="primary"
                :icon="['fas', 'paper-plane']"
                :loading="updatingStatus && statusToUpdate === 'sent'"
                block
              >
                {{ $t('invoices.actions.markSent') }}
              </BaseButton>

              <BaseButton
                v-if="hasPermission('edit_invoice') && invoice.status !== 'paid'"
                @click="updateStatus('paid')"
                :disabled="updatingStatus"
                type="success"
                :icon="['fas', 'check-circle']"
                :loading="updatingStatus && statusToUpdate === 'paid'"
                block
              >
                {{ $t('invoices.actions.markPaid') }}
              </BaseButton>

              <BaseButton @click="printInvoice" type="outline" :icon="['fas', 'print']" block>
                {{ $t('invoices.actions.print') }}
              </BaseButton>

              <BaseButton @click="downloadPDF" type="outline" :icon="['fas', 'download']" block>
                {{ $t('invoices.actions.downloadPDF') }}
              </BaseButton>

              <BaseButton
                v-if="hasPermission('delete_invoice')"
                @click="confirmDelete"
                type="danger"
                :icon="['fas', 'trash']"
                :disabled="updatingStatus"
                block
              >
                {{ $t('common.delete') }}
              </BaseButton>
            </div>
          </BaseCard>
        </div>
      </div>

      <BaseAlert
        v-else
        type="warning"
        :title="$t('invoices.details.notFound')"
        :message="`لم يتم العثور على فاتورة بالرقم: ${$route.params.id}`"
        :actions="noInvoiceActions"
        class="mt-8"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'InvoiceDetails',

  data() {
    return {
      updatingStatus: false,
      statusToUpdate: '',
      itemColumns: [
        { key: 'description', label: this.$t('common.description'), align: 'right' },
        { key: 'quantity', label: this.$t('common.quantity'), align: 'center' },
        { key: 'unit_price', label: this.$t('common.unitPrice'), align: 'right' },
        { key: 'total', label: this.$t('common.total'), align: 'right' },
      ],
    }
  },

  computed: {
    ...mapGetters('invoices', ['currentInvoice', 'loading', 'error']),

    invoice() {
      return this.currentInvoice
    },

    storeError() {
      return this.error
    },

    invoiceItems() {
      if (!this.invoice) return []
      return this.invoice.items || []
    },

    breadcrumbs() {
      return [
        { text: this.$t('invoices.title'), to: '/invoices' },
        { text: `فاتورة #${this.$route.params.id}` },
      ]
    },

    headerActions() {
      const actions = [
        {
          text: this.$t('common.back'),
          type: 'outline',
          icon: ['fas', 'arrow-left'],
          onClick: () => this.$router.push('/invoices'),
        },
      ]

      if (this.invoice && this.hasPermission('edit_invoice') && this.invoice.status !== 'paid') {
        actions.push({
          text: this.$t('common.edit'),
          type: 'primary',
          icon: ['fas', 'edit'],
          onClick: () => this.$router.push(`/invoices/${this.invoice.id}/edit`),
        })
      }

      return actions
    },

    errorActions() {
      return [
        {
          text: 'إعادة المحاولة',
          onClick: this.loadInvoice,
          type: 'danger',
        },
      ]
    },

    noInvoiceActions() {
      return [
        {
          text: this.$t('common.back'),
          onClick: () => this.$router.push('/invoices'),
          type: 'primary',
        },
      ]
    },
  },

  mounted() {
    this.loadInvoice()
  },

  methods: {
    ...mapActions('invoices', ['fetchInvoice', 'updateInvoiceStatus', 'deleteInvoice']),

    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },

    formatDate(dateString) {
      if (!dateString) return this.$t('common.notAvailable')
      try {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }
        return new Date(dateString).toLocaleDateString(
          this.$i18n.locale === 'ar' ? 'ar-SA' : 'en-US',
          options,
        )
      } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
      }
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return this.$t('common.notAvailable')
      try {
        const formatter = new Intl.NumberFormat(this.$i18n.locale === 'ar' ? 'ar-SA' : 'en-US', {
          style: 'currency',
          currency: this.$i18n.locale === 'ar' ? 'SAR' : 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        return formatter.format(amount)
      } catch (error) {
        console.error('Error formatting currency:', error)
        return amount
      }
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
      try {
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return this.$t('invoices.expired')
        if (diffDays === 0) return this.$t('invoices.today')
        if (diffDays === 1) return this.$t('invoices.tomorrow')
        return this.$t('invoices.days', { days: diffDays })
      } catch (error) {
        console.error('Error calculating days remaining:', error)
        return this.$t('common.notAvailable')
      }
    },

    getDaysRemainingClass(dueDate) {
      if (!dueDate) return 'text-gray-600'
      try {
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays < 0) return 'text-red-600 font-semibold'
        if (diffDays <= 3) return 'text-yellow-600 font-semibold'
        return 'text-green-600 font-semibold'
      } catch (error) {
        console.error('Error getting days remaining class:', error)
        return 'text-gray-600'
      }
    },

    async loadInvoice() {
      const invoiceId = this.$route.params.id

      if (!invoiceId) {
        this.error = 'معرف الفاتورة غير صالح'
        return
      }

      try {
        await this.fetchInvoice(invoiceId)
      } catch (error) {
        console.error('❌ خطأ في تحميل الفاتورة:', error)
      }
    },

    async updateStatus(status) {
      if (!this.invoice?.id) {
        this.$toast.error('لا يمكن تحديث حالة فاتورة غير موجودة')
        return
      }

      if (!this.hasPermission('edit_invoice')) {
        this.$toast.error('ليس لديك صلاحية لتحديث حالة الفاتورة')
        return
      }

      this.updatingStatus = true
      this.statusToUpdate = status

      try {
        await this.updateInvoiceStatus({
          id: this.invoice.id,
          status,
        })

        this.$toast.success(`تم تحديث حالة الفاتورة إلى "${status}"`)
        await this.loadInvoice()
      } catch (error) {
        console.error('Error updating invoice status:', error)
        this.$toast.error(error.response?.data?.message || 'فشل في تحديث حالة الفاتورة')
      } finally {
        this.updatingStatus = false
        this.statusToUpdate = ''
      }
    },

    confirmDelete() {
      if (!this.invoice) return

      this.$toast.confirm(
        `هل أنت متأكد من حذف الفاتورة "#${this.invoice.invoice_number}"؟`,
        'هذا الإجراء لا يمكن التراجع عنه',
        async () => {
          await this.deleteInvoiceHandler()
        },
      )
    },

    async deleteInvoiceHandler() {
      try {
        await this.deleteInvoice(this.invoice.id)
        this.$toast.success('تم حذف الفاتورة بنجاح')
        this.$router.push('/invoices')
      } catch (error) {
        console.error('Error deleting invoice:', error)
        this.$toast.error(error.response?.data?.message || 'فشل حذف الفاتورة')
      }
    },

    printInvoice() {
      window.print()
    },

    downloadPDF() {
      this.$toast.info('سيتم إضافة خاصية تحميل PDF قريباً')
    },
  },

  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadInvoice()
        }
      },
    },
  },
}
</script>

<style scoped>
.invoice-header-card {
  @apply border-primary-100;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200;
}

.client-avatar {
  @apply w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm;
}

.client-name {
  @apply font-semibold text-gray-900;
}

.client-email {
  @apply text-sm text-gray-600;
}

.client-details {
  @apply space-y-2 mt-3;
}

.detail-item {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.date-item {
  @apply flex justify-between items-center py-2 border-b border-gray-100 last:border-0;
}

.date-label {
  @apply text-gray-600;
}

.date-value {
  @apply font-medium text-gray-900;
}

.summary-item {
  @apply flex justify-between items-center py-2 border-b border-gray-100 last:border-0;
}

.summary-item.total {
  @apply border-t border-gray-200 mt-2 pt-3;
}

@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white !important;
  }

  .print\:hidden {
    display: none !important;
  }
}
</style>
