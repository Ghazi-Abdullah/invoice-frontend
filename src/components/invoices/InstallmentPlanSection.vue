<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">
        {{ $t('installments.title') }}
      </h3>
      <div>
        <button
          v-if="!plan && canManage"
          @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {{ $t('installments.create_plan') }}
        </button>
        <button
          v-if="plan && plan.status === 'active' && canManage"
          @click="confirmCancel"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          {{ $t('installments.cancel_plan') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-500">
      {{ $t('common.loading') }}
    </div>
    <div v-else-if="!plan" class="text-center py-4 text-gray-500">
      {{ $t('installments.no_plan') }}
    </div>

    <div v-else>
      <!-- بطاقات الملخص -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-sm text-gray-500">{{ $t('installments.original_amount') }}</p>
          <p class="font-bold">{{ formatCurrency(plan.original_amount) }}</p>
        </div>
        <div class="bg-orange-50 rounded-lg p-3">
          <p class="text-sm text-gray-500">{{ $t('installments.interest_amount') }} ({{ plan.interest_rate }}%)</p>
          <p class="font-bold text-orange-600">{{ formatCurrency(plan.interest_amount) }}</p>
        </div>
        <div class="bg-blue-50 rounded-lg p-3">
          <p class="text-sm text-gray-500">{{ $t('installments.total_amount') }}</p>
          <p class="font-bold text-blue-700">{{ formatCurrency(plan.total_amount) }}</p>
        </div>
        <div class="bg-gray-50 rounded-lg p-3">
          <p class="text-sm text-gray-500">{{ $t('common.status') }}</p>
          <p class="font-bold">{{ $t('installments.status.' + plan.status) }}</p>
        </div>
      </div>

      <!-- جدول الأقساط -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">#</th>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                {{ $t('installments.due_date') }}
              </th>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                {{ $t('installments.amount') }}
              </th>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                {{ $t('common.status') }}
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-700">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="inst in plan.installments" :key="inst.id">
              <td class="px-4 py-2 text-sm">{{ inst.installment_number }}</td>
              <td class="px-4 py-2 text-sm">{{ formatDate(inst.due_date) }}</td>
              <td class="px-4 py-2 text-sm font-medium">{{ formatCurrency(inst.amount) }}</td>
              <td class="px-4 py-2">
                <span
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="statusClass(inst.status)"
                >
                  {{ $t('installments.status.' + inst.status) }}
                </span>
              </td>
              <td class="px-4 py-2 text-center">
                <button
                  v-if="['pending', 'overdue'].includes(inst.status) && canManage"
                  @click="pay(inst)"
                  class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                  {{ $t('installments.mark_paid') }}
                </button>
                <span v-else-if="inst.status === 'paid'" class="text-gray-500 text-xs">
                  {{ formatDate(inst.paid_at) }}
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
      @created="onCreated"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { formatCurrency, formatDate } from '@/utils/formatters';
import CreateInstallmentPlanModal from './CreateInstallmentPlanModal.vue';

export default {
  components: { CreateInstallmentPlanModal },
  props: {
    invoiceId: { type: [Number, String], required: true },
    invoiceTotal: { type: [Number, String], required: true },
    canManage: { type: Boolean, default: false },
  },
  data() {
    return {
      showCreateModal: false,
    };
  },
  computed: {
    ...mapGetters('installments', ['currentPlan', 'loading', 'submitting']),
    plan() {
      return this.currentPlan;
    },
  },
  created() {
    this.fetchPlan(this.invoiceId);
  },
  methods: {
    ...mapActions('installments', ['fetchPlan', 'payInstallment', 'cancelPlan']),
    formatCurrency,
    formatDate,
    statusClass(status) {
      return {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-600',
      }[status] || 'bg-gray-100';
    },
    onCreated() {
      this.showCreateModal = false;
      this.fetchPlan(this.invoiceId);
    },
    async pay(inst) {
      if (!confirm(this.$t('installments.confirm_pay_message', { number: inst.installment_number, amount: formatCurrency(inst.amount) }))) return;
      try {
        await this.payInstallment({ installmentId: inst.id, paymentMethod: 'cash' });
        this.$toast?.success(this.$t('installments.pay_success'));
        this.fetchPlan(this.invoiceId);
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.pay_failed'));
      }
    },
    async confirmCancel() {
      if (!confirm(this.$t('installments.confirm_cancel_message'))) return;
      try {
        await this.cancelPlan(this.plan.id);
        this.$toast?.success(this.$t('installments.cancel_success'));
        this.fetchPlan(this.invoiceId);
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.cancel_failed'));
      }
    },
  },
};
</script>
