<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-100 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">{{ $t('installments.create_plan') }}</h3>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <form @submit.prevent="submit" class="p-6">
          <div v-if="formError" class="mb-5 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {{ formError }}
          </div>

          <div class="space-y-5">
            <!-- عدد الأقساط -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('installments.number_of_installments') }} <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                v-model.number="form.number_of_installments"
                @change="onInstallmentCountChange"
                min="2"
                max="60"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- نسبة الفائدة -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('installments.interest_rate') }} (%)
                <span class="text-xs text-gray-500 font-normal">
                  {{ $t('installments.interest_rate_hint') }}
                </span>
              </label>
              <input
                type="number"
                v-model.number="form.interest_rate"
                min="0"
                max="100"
                step="0.5"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- تاريخ أول قسط -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('installments.start_date') }} <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                v-model="form.start_date"
                :min="today"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <!-- التكرار -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ $t('installments.frequency') }}</label>
              <select
                v-model="form.frequency"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="monthly">{{ $t('installments.monthly') }}</option>
                <option value="weekly">{{ $t('installments.weekly') }}</option>
              </select>
            </div>

            <!-- ملاحظات -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">{{ $t('common.notes') }}</label>
              <textarea
                v-model="form.notes"
                rows="2"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- معاينة الحساب -->
            <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">{{ $t('installments.original_amount') }}</span>
                <span class="font-medium">{{ formatCurrency(invoiceTotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">{{ $t('installments.interest_amount') }}</span>
                <span class="font-medium text-orange-600">{{ formatCurrency(previewInterestAmount) }}</span>
              </div>
              <div class="flex justify-between text-sm pt-2 border-t border-blue-200">
                <span class="text-gray-700 font-semibold">{{ $t('installments.total_amount') }}</span>
                <span class="font-bold text-blue-700">{{ formatCurrency(previewTotalAmount) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">{{ $t('installments.per_installment') }}</span>
                <span class="font-medium">{{ formatCurrency(previewPerInstallment) }}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-300"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                v-if="submitting"
                class="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>{{ $t('installments.create_plan') }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { formatCurrency } from '@/utils/formatters'

export default {
  name: 'CreateInstallmentPlanModal',

  props: {
    show: {
      type: Boolean,
      default: false,
    },
    invoiceId: {
      type: [Number, String],
      required: true,
    },
    invoiceTotal: {
      type: [Number, String],
      required: true,
    },
    submitting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close', 'created'],

  data() {
    return {
      form: {
        number_of_installments: 3,
        interest_rate: 0,
        start_date: '',
        frequency: 'monthly',
        notes: '',
      },
      formError: null,
      interestManuallyEdited: false,
    }
  },

  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
    },

    previewInterestAmount() {
      const rate = Number(this.form.interest_rate) || 0
      return (Number(this.invoiceTotal) * rate) / 100
    },

    previewTotalAmount() {
      return Number(this.invoiceTotal) + this.previewInterestAmount
    },

    previewPerInstallment() {
      const count = Number(this.form.number_of_installments) || 1
      return this.previewTotalAmount / count
    },
  },

  watch: {
    show(isOpen) {
      if (isOpen) {
        this.resetForm()
        this.onInstallmentCountChange()
      }
    },
  },

  methods: {
    ...mapActions('installments', ['createInstallmentPlan', 'suggestInterestRate']),
    formatCurrency,

    resetForm() {
      this.formError = null
      this.interestManuallyEdited = false
      this.form = {
        number_of_installments: 3,
        interest_rate: 0,
        start_date: '',
        frequency: 'monthly',
        notes: '',
      }
    },

    async onInstallmentCountChange() {
      // نجيب النسبة المقترحة من الجدول الافتراضي، والمستخدم يقدر يعدّلها يدوياً بعدين
      const count = Number(this.form.number_of_installments)
      if (!count || count < 2) return

      const suggested = await this.suggestInterestRate(count)
      this.form.interest_rate = suggested
    },

    async submit() {
      this.formError = null

      try {
        const plan = await this.createInstallmentPlan({
          invoiceId: this.invoiceId,
          data: { ...this.form },
        })
        this.$emit('created', plan)
      } catch (error) {
        this.formError =
          error.response?.data?.message ||
          Object.values(error.response?.data?.errors || {})[0]?.[0] ||
          this.$t('installments.create_failed')
      }
    },
  },
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
