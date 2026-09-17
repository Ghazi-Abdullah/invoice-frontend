<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto print:relative print:bg-white print:p-0 print:block"
      @click.self="close"
    >
      <div
        class="receipt-print-area bg-white rounded-2xl shadow-2xl max-w-xl w-full my-8 overflow-hidden print:rounded-none print:shadow-none print:my-0 print:max-w-full"
      >
        <!-- شريط الأدوات (لا يظهر عند الطباعة) -->
        <div
          class="print:hidden flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-800">{{ $t('payments.receipt_preview') }}</h3>
          <div class="flex gap-2">
            <button
              @click="printNow"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              {{ $t('common.print') }}
            </button>
            <button
              @click="close"
              class="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              {{ $t('common.close') }}
            </button>
          </div>
        </div>

        <!-- محتوى السند القابل للطباعة -->
        <div class="p-8 sm:p-10">
          <!-- رأس السند: الشركة + العنوان -->
          <div
            class="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-gray-100"
          >
            <div class="flex items-center gap-3">
              <img
                v-if="company.logoUrl"
                :src="company.logoUrl"
                alt=""
                class="w-14 h-14 object-contain"
              />
              <div>
                <p class="text-xl font-bold text-gray-900">{{ company.name }}</p>
                <p v-if="company.address" class="text-sm text-gray-500">{{ company.address }}</p>
                <p v-if="company.phone || company.email" class="text-sm text-gray-500">
                  {{ [company.phone, company.email].filter(Boolean).join(' · ') }}
                </p>
              </div>
            </div>

            <div class="text-right sm:text-left">
              <p class="text-2xl font-bold text-gray-900 tracking-wide">
                {{ $t('payments.receipt_voucher') }}
              </p>
              <p class="text-sm text-gray-500 mt-1">{{ payment.receipt_number }}</p>
              <span
                class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                :class="statusBadgeClass(payment.status)"
              >
                {{ $t('payments.status.' + payment.status) }}
              </span>
            </div>
          </div>

          <!-- معلومات الدافع + التاريخ -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-100">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {{ $t('payments.received_from') }}
              </p>
              <p class="font-semibold text-gray-900">{{ payerName }}</p>
              <p v-if="payer?.company_name" class="text-sm text-gray-600">
                {{ payer.company_name }}
              </p>
              <p v-if="payer?.phone" class="text-sm text-gray-500">{{ payer.phone }}</p>
              <p v-if="payer?.email" class="text-sm text-gray-500">{{ payer.email }}</p>
            </div>

            <div class="sm:text-right space-y-1">
              <div class="flex justify-between sm:justify-end sm:gap-4">
                <span class="text-sm text-gray-500">{{ $t('payments.payment_date') }}</span>
                <span class="text-sm font-medium text-gray-900">{{
                  formatDate(payment.paid_at)
                }}</span>
              </div>
              <div class="flex justify-between sm:justify-end sm:gap-4">
                <span class="text-sm text-gray-500">{{ $t('payments.payment_method') }}</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ $t('payments.method.' + payment.payment_method) }}
                </span>
              </div>
              <div
                v-if="payment.reference_number"
                class="flex justify-between sm:justify-end sm:gap-4"
              >
                <span class="text-sm text-gray-500">{{ $t('payments.reference_number') }}</span>
                <span class="text-sm font-medium text-gray-900">{{
                  payment.reference_number
                }}</span>
              </div>
              <div
                v-if="payment.invoice?.invoice_number"
                class="flex justify-between sm:justify-end sm:gap-4"
              >
                <span class="text-sm text-gray-500">{{ $t('payments.related_invoice') }}</span>
                <span class="text-sm font-medium text-gray-900">{{
                  payment.invoice.invoice_number
                }}</span>
              </div>
            </div>
          </div>

          <!-- المبلغ -->
          <div class="py-8 flex flex-col items-center text-center border-b border-gray-100">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              {{ $t('payments.amount_received') }}
            </p>
            <p class="text-4xl font-extrabold text-blue-700">
              {{ formatCurrency(payment.amount) }}
            </p>
          </div>

          <!-- ملاحظات -->
          <div v-if="payment.notes" class="pt-6 border-b border-gray-100 pb-6">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
              {{ $t('payments.notes') }}
            </p>
            <p class="text-sm text-gray-600 whitespace-pre-line">{{ payment.notes }}</p>
          </div>

          <!-- توقيعات -->
          <div class="grid grid-cols-2 gap-8 pt-10">
            <div class="text-center">
              <p class="text-sm text-gray-500 mb-10">{{ $t('payments.received_by') }}</p>
              <div class="border-t border-gray-300 pt-1 text-xs text-gray-400">
                {{ payment.user?.name || '—' }}
              </div>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500 mb-10">{{ $t('payments.payer_signature') }}</p>
              <div class="border-t border-gray-300 pt-1 text-xs text-gray-400">
                {{ payerName }}
              </div>
            </div>
          </div>

          <div class="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
            {{ $t('payments.receipt_footer_note') }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { formatCurrency, formatDate } from '@/utils/formatters'

export default {
  name: 'PaymentReceiptTemplate',
  props: {
    show: { type: Boolean, default: false },
    payment: { type: Object, required: true },
    // بيانات الشركة لرأس السند — مرّرها من إعدادات المشروع/المتجر عند الاستخدام
    company: {
      type: Object,
      default: () => ({
        name: '',
        address: '',
        phone: '',
        email: '',
        logoUrl: '',
      }),
    },
  },
  emits: ['close'],
  computed: {
    // الدافع قد يكون مستأجر (tenant) أو عميل (client) حسب نوع الفاتورة المرتبطة
    payer() {
      return this.payment.tenant || this.payment.client || null
    },
    payerName() {
      return this.payer?.name || '—'
    },
  },
  methods: {
    formatCurrency,
    formatDate,
    close() {
      this.$emit('close')
    },
    printNow() {
      window.print()
    },
    statusBadgeClass(status) {
      const classes = {
        completed: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-gray-100 text-gray-600',
      }
      return classes[status] || 'bg-gray-100 text-gray-600'
    },
  },
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* طباعة منطقة السند فقط — يجب أن يبقى هذا النمط غير مقيّد (unscoped) */
@media print {
  body * {
    visibility: hidden;
  }
  .receipt-print-area,
  .receipt-print-area * {
    visibility: visible;
  }
  .receipt-print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
