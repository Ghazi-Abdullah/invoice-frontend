<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">تفاصيل الفاتورة</h1>
          <p class="text-gray-600 mt-2">عرض تفاصيل الفاتورة</p>
        </div>
        <div class="mt-4 md:mt-0 flex space-x-3 space-x-reverse">
          <router-link
            to="/invoices"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            رجوع
          </router-link>
          <router-link
            v-if="invoice && invoice.id"
            :to="`/invoices/${invoice.id}/edit`"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تعديل
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span class="mr-3 text-gray-600">جاري التحميل...</span>
      </div>

      <!-- Error State -->
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
        <h3 class="text-lg font-medium text-red-800 mb-2">خطأ</h3>
        <p class="text-red-700 mb-4">{{ error }}</p>
        <button
          @click="loadInvoice"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>

      <!-- No Data State -->
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
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد فاتورة</h3>
        <p class="text-gray-500">لم يتم العثور على الفاتورة</p>
      </div>

      <!-- Invoice Data -->
      <div v-else class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Invoice Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-2xl font-bold">فاتورة #{{ invoice.invoice_number }}</h2>
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
              <h3 class="text-lg font-semibold text-gray-900 mb-4">معلومات العميل</h3>
              <div class="space-y-2">
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-blue-600 font-semibold text-sm">
                      {{ getInitials(invoice.client?.name) }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">
                      {{ invoice.client?.name || 'غير محدد' }}
                    </p>
                    <p class="text-gray-600 text-sm">
                      {{ invoice.client?.email || 'لا يوجد بريد' }}
                    </p>
                  </div>
                </div>
                <div class="text-sm text-gray-600 mt-3">
                  <p>{{ invoice.client?.phone || 'غير محدد' }}</p>
                  <p>{{ invoice.client?.address || 'غير محدد' }}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">التواريخ</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">تاريخ الإصدار:</span>
                  <span class="font-medium">{{ formatDate(invoice.issue_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">تاريخ الاستحقاق:</span>
                  <span class="font-medium">{{ formatDate(invoice.due_date) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">الأيام المتبقية:</span>
                  <span :class="getDaysRemainingClass(invoice.due_date)">
                    {{ getDaysRemaining(invoice.due_date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Invoice Items -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">عناصر الفاتورة</h3>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">الوصف</th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">الكمية</th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">
                      سعر الوحدة
                    </th>
                    <th class="px-4 py-3 text-right text-sm font-medium text-gray-700">الإجمالي</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="item in invoice.items" :key="item.id">
                    <td class="px-4 py-3 text-sm text-gray-900">{{ item.description }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900 text-center">{{ item.quantity }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ item.unit_price }} ر.س</td>
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">
                      {{ item.total }} ر.س
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
                <span class="text-gray-600">المجموع الفرعي:</span>
                <span class="font-medium">{{ invoice.subtotal }} ر.س</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الضريبة (15%):</span>
                <span class="font-medium">{{ invoice.tax_amount }} ر.س</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-3">
                <span class="text-lg font-semibold text-gray-900">الإجمالي الكلي:</span>
                <span class="text-lg font-bold text-blue-600">{{ invoice.total_amount }} ر.س</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="invoice.notes" class="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">ملاحظات</h3>
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
                :disabled="invoice.status === 'sent'"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                وضع كمرسلة
              </button>
              <button
                @click="updateStatus('paid')"
                :disabled="invoice.status === 'paid'"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                وضع كمدفوعة
              </button>
            </div>
            <div class="flex space-x-3 space-x-reverse">
              <button
                @click="printInvoice"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                طباعة
              </button>
              <button
                @click="downloadPDF"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                تحميل PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceShow',

  data() {
    return {
      loading: true,
      error: null,
      invoice: null,
    }
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    },

    getStatusText(status) {
      const statusMap = {
        draft: 'مسودة',
        sent: 'مرسلة',
        paid: 'مدفوعة',
        overdue: 'متأخرة',
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
      if (!dueDate) return 'غير محدد'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'منتهية'
      if (diffDays === 0) return 'اليوم'
      if (diffDays === 1) return 'غداً'
      return `${diffDays} يوم`
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

        this.$toast.success('تم تحديث حالة الفاتورة بنجاح')

        // إعادة تحميل الفاتورة
        this.loadInvoice()
      } catch (error) {
        console.error('Failed to update status:', error)
        this.$toast.error('فشل في تحديث حالة الفاتورة')
      }
    },

    printInvoice() {
      window.print()
    },

    downloadPDF() {
      this.$toast.info('ميزة تحميل PDF قريباً')
    },

    async loadInvoice() {
      this.loading = true
      this.error = null
      this.invoice = null

      try {
        const invoiceId = this.$route.params.id

        if (!invoiceId) {
          throw new Error('معرف الفاتورة غير صالح')
        }

        await this.$store.dispatch('invoices/fetchInvoice', invoiceId)

        // استخدام البيانات من المتجر
        this.invoice = this.$store.state.invoices.currentInvoice

        if (!this.invoice) {
          this.error = 'لم يتم العثور على الفاتورة'
        }
      } catch (error) {
        console.error('❌ فشل في تحميل الفاتورة:', error)
        this.error = error.message || 'فشل في تحميل الفاتورة'
      } finally {
        this.loading = false
      }
    },
  },

  mounted() {
    this.loadInvoice()
  },

  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadInvoice()
        }
      },
      immediate: true,
    },
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
