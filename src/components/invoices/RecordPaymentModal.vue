<template>
  <BaseModal :show="show" :title="$t('payments.record_payment')" @close="close">
    <form @submit.prevent="submit" class="space-y-4">
      <div class="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
        <div class="flex justify-between">
          <span>{{ $t('invoices.invoice') }}</span>
          <span class="font-semibold text-gray-900">{{ invoice?.invoice_number }}</span>
        </div>
        <div class="flex justify-between mt-1">
          <span>{{ $t('payments.remaining_amount') }}</span>
          <span class="font-semibold text-gray-900">{{ formatCurrency(remaining) }}</span>
        </div>
      </div>

      <BaseInput
        v-model="form.amount"
        type="number"
        step="0.01"
        :label="$t('payments.amount')"
        :placeholder="String(remaining)"
        :error="errors.amount?.[0]"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ $t('payments.payment_method') }}
        </label>
        <select
          v-model="form.payment_method"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="cash">{{ $t('payments.method.cash') }}</option>
          <option value="bank_transfer">{{ $t('payments.method.bank_transfer') }}</option>
          <option value="cheque">{{ $t('payments.method.cheque') }}</option>
        </select>
        <p v-if="errors.payment_method?.[0]" class="text-xs text-red-500 mt-1">
          {{ errors.payment_method[0] }}
        </p>
      </div>

      <BaseInput v-model="form.payment_date" type="date" :label="$t('payments.payment_date')" />

      <BaseInput
        v-model="form.reference_number"
        :label="$t('payments.reference_number')"
        :placeholder="$t('payments.reference_number_hint')"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">{{
          $t('payments.notes')
        }}</label>
        <textarea
          v-model="form.notes"
          rows="2"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="secondary" @click="close">{{ $t('common.cancel') }}</BaseButton>
      <BaseButton variant="primary" :loading="submitting" @click="submit">
        {{ $t('payments.issue_receipt') }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script>
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'RecordPaymentModal',
  props: {
    show: { type: Boolean, default: false },
    invoice: { type: Object, default: null },
  },
  // 'recorded' يحمل سند القبض المُنشأ — الصفحة الأم مسؤولة عن عرض التوست
  // وعن فتح PaymentReceiptTemplate.vue بعد الإصدار مباشرة
  emits: ['close', 'recorded', 'error'],
  data() {
    return {
      submitting: false,
      errors: {},
      form: {
        amount: null,
        payment_method: 'cash',
        payment_date: new Date().toISOString().slice(0, 10),
        reference_number: '',
        notes: '',
      },
    }
  },
  computed: {
    remaining() {
      // إجمالي الفاتورة ناقص أي دفعات مكتملة سابقة يرسلها الباك اند مع الفاتورة (paid_amount)
      const total = Number(this.invoice?.total ?? 0)
      const paid = Number(this.invoice?.total_paid ?? this.invoice?.paid_amount ?? 0)
      return Math.max(0, total - paid)
    },
  },
  watch: {
    show(val) {
      if (val) this.resetForm()
    },
  },
  methods: {
    formatCurrency,
    resetForm() {
      this.errors = {}
      this.form = {
        amount: null,
        payment_method: 'cash',
        payment_date: new Date().toISOString().slice(0, 10),
        reference_number: '',
        notes: '',
      }
    },
    close() {
      this.errors = {}
      this.$emit('close')
    },
    async submit() {
      this.errors = {}
      this.submitting = true

      try {
        const payload = { ...this.form }
        if (!payload.amount) delete payload.amount // يترك الباك اند يحسب المتبقي تلقائيًا

        const payment = await this.$store.dispatch('payments/recordManualPayment', {
          invoiceId: this.invoice.id,
          payload,
        })

        this.$emit('recorded', payment)
        this.close()
      } catch (error) {
        if (error?.response?.status === 422) {
          this.errors = error.response.data.errors || {}
        } else {
          // نمرر الخطأ للصفحة الأم بدل افتراض شكل توست معيّن
          this.$emit('error', error?.response?.data?.message || this.$t('common.operation_failed'))
        }
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>
