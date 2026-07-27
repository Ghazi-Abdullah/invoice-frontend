<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto print:relative print:bg-white print:p-0 print:block"
      @click.self="close"
    >
      <div
        class="invoice-print-area bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden print:rounded-none print:shadow-none print:my-0 print:max-w-full"
      >
        <!-- شريط الأدوات (لا يظهر عند الطباعة) -->
        <div
          class="print:hidden flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-800">{{ $t('invoices.print_preview') }}</h3>
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

        <!-- محتوى الفاتورة القابل للطباعة -->
        <div class="p-8 sm:p-10">
          <!-- رأس الفاتورة: الشركة + العنوان -->
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
                <p v-if="company.taxNumber" class="text-xs text-gray-400 mt-1">
                  {{ $t('invoices.tax_number') }}: {{ company.taxNumber }}
                </p>
              </div>
            </div>

            <div class="text-right sm:text-left">
              <p class="text-2xl font-bold text-gray-900 tracking-wide">
                {{ $t('invoices.invoice') }}
              </p>
              <p class="text-sm text-gray-500 mt-1">{{ invoice.invoice_number }}</p>
              <span
                class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold"
                :class="statusBadgeClass(invoice.status)"
              >
                {{ $t('invoices.status.' + invoice.status) }}
              </span>
            </div>
          </div>

          <!-- معلومات العميل + التواريخ -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-gray-100">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {{ $t('invoices.bill_to') }}
              </p>
              <p class="font-semibold text-gray-900">{{ invoice.client?.name }}</p>
              <p v-if="invoice.client?.company_name" class="text-sm text-gray-600">
                {{ invoice.client.company_name }}
              </p>
              <p v-if="invoice.client?.address" class="text-sm text-gray-500">
                {{ invoice.client.address }}
              </p>
              <p v-if="invoice.client?.email" class="text-sm text-gray-500">
                {{ invoice.client.email }}
              </p>
              <p v-if="invoice.client?.phone" class="text-sm text-gray-500">
                {{ invoice.client.phone }}
              </p>
            </div>

            <div class="sm:text-right space-y-1">
              <div class="flex justify-between sm:justify-end sm:gap-4">
                <span class="text-sm text-gray-500">{{ $t('invoices.invoice_date') }}</span>
                <span class="text-sm font-medium text-gray-900">{{
                  formatDate(invoice.invoice_date)
                }}</span>
              </div>
              <div class="flex justify-between sm:justify-end sm:gap-4">
                <span class="text-sm text-gray-500">{{ $t('invoices.due_date') }}</span>
                <span class="text-sm font-medium text-gray-900">{{
                  formatDate(invoice.due_date)
                }}</span>
              </div>
              <div v-if="invoice.payment_date" class="flex justify-between sm:justify-end sm:gap-4">
                <span class="text-sm text-gray-500">{{ $t('invoices.payment_date') }}</span>
                <span class="text-sm font-medium text-gray-900">{{
                  formatDate(invoice.payment_date)
                }}</span>
              </div>
            </div>
          </div>

          <!-- جدول البنود -->
          <div class="py-6">
            <table class="min-w-full">
              <thead>
                <tr class="border-b-2 border-gray-100">
                  <th class="py-2 text-right text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('invoices.description') }}
                  </th>
                  <th class="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('invoices.quantity') }}
                  </th>
                  <th class="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('invoices.unit_price') }}
                  </th>
                  <th class="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('invoices.tax') }}
                  </th>
                  <th class="py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('invoices.total') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in invoice.items" :key="item.id" class="border-b border-gray-50">
                  <td class="py-3 text-sm text-gray-800">
                    {{ item.description }}
                    <span v-if="item.notes" class="block text-xs text-gray-400">{{
                      item.notes
                    }}</span>
                  </td>
                  <td class="py-3 text-sm text-gray-600 text-center">{{ item.quantity }}</td>
                  <td class="py-3 text-sm text-gray-600 text-center">
                    {{ formatCurrency(item.unit_price) }}
                  </td>
                  <td class="py-3 text-sm text-gray-600 text-center">{{ item.tax_rate || 0 }}%</td>
                  <td class="py-3 text-sm font-semibold text-gray-900 text-left">
                    {{ formatCurrency(item.total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- الإجماليات -->
          <div class="flex justify-end">
            <div class="w-full sm:w-72 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">{{ $t('invoices.subtotal') }}</span>
                <span class="text-gray-800">{{ formatCurrency(invoice.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-500">{{ $t('invoices.tax') }}</span>
                <span class="text-gray-800">{{ formatCurrency(invoice.tax_amount) }}</span>
              </div>
              <div v-if="Number(invoice.discount_amount) > 0" class="flex justify-between text-sm">
                <span class="text-gray-500">{{ $t('invoices.discount') }}</span>
                <span class="text-red-500">- {{ formatCurrency(invoice.discount_amount) }}</span>
              </div>
              <div class="flex justify-between text-base font-bold pt-2 border-t-2 border-gray-100">
                <span class="text-gray-900">{{ $t('invoices.total') }}</span>
                <span class="text-blue-700">{{ formatCurrency(invoice.total) }}</span>
              </div>
            </div>
          </div>

          <!-- جدول الأقساط (إن وجد) -->
          <div
            v-if="invoice.installmentPlan?.installments?.length"
            class="mt-8 pt-6 border-t border-gray-100"
          >
            <p class="text-sm font-semibold text-gray-700 mb-3">{{ $t('installments.title') }}</p>
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="py-2 text-right text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th class="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('installments.due_date') }}
                  </th>
                  <th class="py-2 text-center text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('installments.amount') }}
                  </th>
                  <th class="py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                    {{ $t('common.status') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="inst in invoice.installmentPlan.installments"
                  :key="inst.id"
                  class="border-b border-gray-50"
                >
                  <td class="py-2 text-sm text-gray-800">{{ inst.installment_number }}</td>
                  <td class="py-2 text-sm text-gray-600 text-center">
                    {{ formatDate(inst.due_date) }}
                  </td>
                  <td class="py-2 text-sm text-gray-800 text-center">
                    {{ formatCurrency(inst.amount) }}
                  </td>
                  <td class="py-2 text-sm text-left">
                    <span
                      class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="
                        inst.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      "
                    >
                      {{ $t('installments.status.' + inst.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ملاحظات وشروط -->
          <div
            v-if="invoice.notes || invoice.terms"
            class="mt-8 pt-6 border-t border-gray-100 space-y-4"
          >
            <div v-if="invoice.notes">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {{ $t('invoices.notes') }}
              </p>
              <p class="text-sm text-gray-600 whitespace-pre-line">{{ invoice.notes }}</p>
            </div>
            <div v-if="invoice.terms">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {{ $t('invoices.terms') }}
              </p>
              <p class="text-sm text-gray-600 whitespace-pre-line">{{ invoice.terms }}</p>
            </div>
          </div>

          <div
            v-if="invoice.footer"
            class="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400"
          >
            {{ invoice.footer }}
          </div>

          <!-- معلومات الإنشاء/الطباعة -->
          <div
            v-if="invoice.created_by?.name || printedBy"
            class="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-1 text-xs text-gray-400"
          >
            <span v-if="invoice.created_by?.name">
              {{ $t('reports.created_by') }}: {{ invoice.created_by.name }} —
              {{ formatDate(invoice.created_at) }}
            </span>
            <span v-if="printedBy">
              {{ $t('reports.printed_by') }}: {{ printedBy }} — {{ printedOn }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { formatCurrency, formatDate } from '@/utils/formatters'

export default {
  name: 'InvoicePrintTemplate',
  props: {
    show: { type: Boolean, default: false },
    invoice: { type: Object, required: true },
    // بيانات الشركة لرأس الفاتورة — مرّرها من إعدادات المشروع/المتجر عند الاستخدام
    company: {
      type: Object,
      default: () => ({
        name: '',
        address: '',
        phone: '',
        email: '',
        taxNumber: '',
        logoUrl: '',
      }),
    },
    // اختياري — مرّرها من نفس القيم المستخدمة في بطاقة "أنشئ/طبع بواسطة"
    // الموجودة أصلاً في InvoiceDetails.vue (this.printedBy / this.printedOn)
    printedBy: { type: String, default: '' },
    printedOn: { type: String, default: '' },
  },
  emits: ['close'],
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
        paid: 'bg-green-100 text-green-700',
        sent: 'bg-blue-100 text-blue-700',
        overdue: 'bg-red-100 text-red-700',
        draft: 'bg-gray-100 text-gray-600',
        cancelled: 'bg-gray-100 text-gray-500',
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
/* طباعة منطقة الفاتورة فقط — يجب أن يبقى هذا النمط غير مقيّد (unscoped) */
@media print {
  body * {
    visibility: hidden;
  }
  .invoice-print-area,
  .invoice-print-area * {
    visibility: visible;
  }
  .invoice-print-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
