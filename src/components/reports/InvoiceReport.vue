<template>
  <div class="invoice-report">
    <!-- إحصائيات الفواتير -->
    <div v-if="reportData?.stats" class="stats-grid grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <StatCard
        icon="fa-file-invoice"
        :title="'إجمالي الفواتير'"
        :value="reportData.stats.total_invoices"
        color="blue"
      />

      <StatCard
        icon="fa-money-bill-wave"
        :title="'إجمالي المبلغ'"
        :value="formatCurrency(reportData.stats.total_amount)"
        color="green"
      />

      <StatCard
        icon="fa-check-circle"
        :title="'المبلغ المدفوع'"
        :value="formatCurrency(reportData.stats.total_paid)"
        color="purple"
      />

      <StatCard
        icon="fa-exclamation-circle"
        :title="'المبلغ المستحق'"
        :value="formatCurrency(reportData.stats.total_due)"
        color="red"
      />
    </div>

    <!-- جدول الفواتير -->
    <div class="table-card bg-white rounded-lg shadow overflow-hidden">
      <div class="card-header px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">قائمة الفواتير</h3>

        <div class="flex items-center space-x-3 space-x-reverse">
          <PaginationInfo v-if="reportData?.pagination" :pagination="reportData.pagination" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                رقم الفاتورة
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                العميل
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                تاريخ الإصدار
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                تاريخ الاستحقاق
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                المبلغ
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الحالة
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الإجراءات
              </th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="invoice in reportData?.data" :key="invoice.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <router-link
                  :to="`/invoices/${invoice.id}`"
                  class="text-blue-500 hover:text-blue-700 font-medium"
                >
                  {{ invoice.invoice_number }}
                </router-link>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                {{ invoice.client?.name || 'غير محدد' }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDate(invoice.issue_date) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDate(invoice.due_date) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatCurrency(invoice.total_amount) }}
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <StatusBadge :status="invoice.status" :label="invoice.status_label" />
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button
                    @click="$emit('view-invoice', invoice.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="عرض"
                  >
                    <i class="fas fa-eye"></i>
                  </button>

                  <button
                    v-if="invoice.status === 'overdue'"
                    @click="$emit('send-reminder', invoice.id)"
                    class="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                    title="إرسال تذكير"
                  >
                    <i class="fas fa-envelope"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- الترقيم -->
      <Pagination
        v-if="reportData?.pagination?.last_page > 1"
        :pagination="reportData.pagination"
        @page-change="$emit('page-change', $event)"
      />
    </div>
  </div>
</template>

<script>
import StatCard from '@/components/shared/StatCard.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import Pagination from '@/components/shared/Pagination.vue'
import PaginationInfo from '@/components/shared/PaginationInfo.vue'

export default {
  name: 'InvoiceReport',

  components: {
    StatCard,
    StatusBadge,
    Pagination,
    PaginationInfo,
  },

  props: {
    reportData: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ر.س'
      return (
        parseFloat(amount).toLocaleString('ar-SA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + ' ر.س'
      )
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    },
  },
}
</script>
