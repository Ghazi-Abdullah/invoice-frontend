<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-blue-50 rounded-lg">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-800">{{ $t('installments.title') }}</h3>
      </div>

      <button
        v-if="!plan && canManage"
        @click="showCreateModal = true"
        class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('installments.create_plan') }}
      </button>

      <button
        v-if="plan && plan.status === 'active' && canManage"
        @click="confirmCancelPlan"
        class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors duration-200"
      >
        {{ $t('installments.cancel_plan') }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8 text-gray-500">
      {{ $t('common.loading') }}
    </div>

    <!-- No Plan -->
    <div v-else-if="!plan" class="text-center py-8 text-gray-500">
      <p>{{ $t('installments.no_plan') }}</p>
    </div>

    <!-- Plan Summary + Schedule -->
    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-gray-50 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ $t('installments.original_amount') }}</p>
          <p class="text-lg font-bold text-gray-900">{{ formatCurrency(plan.original_amount) }}</p>
        </div>
        <div class="bg-orange-50 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">
            {{ $t('installments.interest_amount') }} ({{ plan.interest_rate }}%)
          </p>
          <p class="text-lg font-bold text-orange-600">{{ formatCurrency(plan.interest_amount) }}</p>
        </div>
        <div class="bg-blue-50 rounded-xl p-4">
          <p class="text-xs text-gray-500 mb-1">{{ $t('installments.total_amount') }}</p>
          <p class="text-lg font-bold text-blue-700">{{ formatCurrency(plan.total_amount) }}</p>
        </div>
        <div class="rounded-xl p-4" :class="planStatusBg">
          <p class="text-xs text-gray-500 mb-1">{{ $t('common.status') }}</p>
          <p class="text-lg font-bold" :class="planStatusText">{{ planStatusLabel }}</p>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">#</th>
              <th class="table-header">{{ $t('installments.due_date') }}</th>
              <th class="table-header">{{ $t('installments.amount') }}</th>
              <th class="table-header">{{ $t('common.status') }}</th>
              <th class="table-header">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="installment in plan.installments" :key="installment.id">
              <td class="table-cell font-medium">{{ installment.installment_number }}</td>
              <td class="table-cell">{{ formatDate(installment.due_date) }}</td>
              <td class="table-cell font-medium">{{ formatCurrency(installment.amount) }}</td>
              <td class="table-cell">
                <span class="status-badge" :class="statusClasses(installment.status)">
                  {{ installmentStatusLabel(installment.status) }}
                </span>
              </td>
              <td class="table-cell">
                <button
                  v-if="installment.status !== 'paid' && installment.status !== 'cancelled' && canManage"
                  @click="payInstallmentRow(installment)"
                  :disabled="submitting"
                  class="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  {{ $t('installments.mark_paid') }}
                </button>
                <span v-else-if="installment.status === 'paid'" class="text-gray-400 text-xs">
                  {{ formatDate(installment.paid_at) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CreateInstallmentPlanModal
      :show="showCreateModal"
      :invoice-id="invoiceId"
      :invoice-total="invoiceTotal"
      :submitting="submitting"
      @close="showCreateModal = false"
      @created="onPlanCreated"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { THEME_COLORS } from '@/utils/theme-colors'
import CreateInstallmentPlanModal from './CreateInstallmentPlanModal.vue'

export default {
  name: 'InstallmentPlanSection',

  components: {
    CreateInstallmentPlanModal,
  },

  props: {
    invoiceId: {
      type: [Number, String],
      required: true,
    },
    invoiceTotal: {
      type: [Number, String],
      required: true,
    },
    canManage: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      showCreateModal: false,
    }
  },

  computed: {
    ...mapGetters('installments', ['currentPlan', 'loading', 'submitting']),

    plan() {
      return this.currentPlan
    },

    planStatusLabel() {
      const labels = {
        active: this.$t('installments.status.active'),
        completed: this.$t('installments.status.completed'),
        cancelled: this.$t('installments.status.cancelled'),
      }
      return labels[this.plan?.status] || this.plan?.status
    },

    planStatusBg() {
      return {
        active: 'bg-blue-50',
        completed: 'bg-green-50',
        cancelled: 'bg-gray-50',
      }[this.plan?.status] || 'bg-gray-50'
    },

    planStatusText() {
      return {
        active: 'text-blue-700',
        completed: 'text-green-700',
        cancelled: 'text-gray-500',
      }[this.plan?.status] || 'text-gray-700'
    },
  },

  created() {
    this.loadPlan()
  },

  methods: {
    ...mapActions('installments', ['fetchInstallmentPlan', 'payInstallment', 'cancelInstallmentPlan']),
    formatCurrency,
    formatDate,

    async loadPlan() {
      try {
        await this.fetchInstallmentPlan(this.invoiceId)
      } catch (error) {
        this.$toast?.error(error.message || this.$t('installments.load_failed'))
      }
    },

    onPlanCreated() {
      this.showCreateModal = false
      this.$toast?.success(this.$t('installments.create_success'))
    },

    installmentStatusLabel(status) {
      const labels = {
        pending: this.$t('installments.status.pending'),
        paid: this.$t('installments.status.paid'),
        overdue: this.$t('installments.status.overdue'),
        cancelled: this.$t('installments.status.cancelled'),
      }
      return labels[status] || status
    },

    statusClasses(status) {
      return {
        'bg-yellow-100 text-yellow-800': status === 'pending',
        'bg-green-100 text-green-800': status === 'paid',
        'bg-red-100 text-red-800': status === 'overdue',
        'bg-gray-100 text-gray-600': status === 'cancelled',
      }
    },

    async payInstallmentRow(installment) {
      const result = await this.$swal?.fire({
        title: this.$t('installments.confirm_pay_title'),
        text: this.$t('installments.confirm_pay_message', {
          number: installment.installment_number,
          amount: formatCurrency(installment.amount),
        }),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: this.$t('installments.mark_paid'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
      })

      if (!result?.isConfirmed) return

      try {
        await this.payInstallment({ installmentId: installment.id, paymentMethod: 'cash' })
        this.$toast?.success(this.$t('installments.pay_success'))
        await this.loadPlan()
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('installments.pay_failed'))
      }
    },

    async confirmCancelPlan() {
      const result = await this.$swal?.fire({
        title: this.$t('installments.confirm_cancel_title'),
        text: this.$t('installments.confirm_cancel_message'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: THEME_COLORS.danger,
        confirmButtonText: this.$t('installments.cancel_plan'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
      })

      if (!result?.isConfirmed) return

      try {
        await this.cancelInstallmentPlan(this.plan.id)
        this.$toast?.success(this.$t('installments.cancel_success'))
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('installments.cancel_failed'))
      }
    },
  },
}
</script>

<style scoped>
.table-header {
  @apply px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider;
}
.table-cell {
  @apply px-4 py-3 text-sm text-gray-700;
}
.status-badge {
  @apply px-2.5 py-1 rounded-full text-xs font-semibold;
}
</style>
