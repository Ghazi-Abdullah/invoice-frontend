<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">تفاصيل العميل</h1>
            <p class="text-gray-600 mt-2">معلومات العميل والفواتير المرتبطة</p>
          </div>
          <div class="mt-4 md:mt-0">
            <router-link
              to="/clients"
              class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              رجوع إلى العملاء
            </router-link>
          </div>
        </div>
      </div>

      <!-- Client Details -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="client" class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-xl font-semibold">{{ getInitials(client.name) }}</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ client.name }}</h2>
            <p class="text-gray-600">{{ client.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">معلومات الاتصال</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">البريد الإلكتروني:</span>
                <span class="font-medium">{{ client.email || 'غير متوفر' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الهاتف:</span>
                <span class="font-medium">{{ client.phone || 'غير متوفر' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">العنوان:</span>
                <span class="font-medium">{{ client.address || 'غير متوفر' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">اسم الشركة:</span>
                <span class="font-medium">{{ client.company_name || 'غير متوفر' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الرقم الضريبي:</span>
                <span class="font-medium">{{ client.tax_number || 'غير متوفر' }}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">الإحصائيات</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">إجمالي الفواتير:</span>
                <span class="font-medium">{{ stats.totalInvoices }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الفواتير المدفوعة:</span>
                <span class="font-medium">{{ stats.paidInvoices }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الفواتير المتأخرة:</span>
                <span class="font-medium">{{ stats.overdueInvoices }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">تاريخ التسجيل:</span>
                <span class="font-medium">{{ formatDate(client.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">آخر تحديث:</span>
                <span class="font-medium">{{ formatDate(client.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- أزرار التحكم -->
        <div class="flex justify-end space-x-3 space-x-reverse mt-6">
          <button
            @click="$router.push('/clients')"
            class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            رجوع
          </button>
          <button
            @click="editClient"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تعديل العميل
          </button>
        </div>
      </div>

      <!-- Invoices Table -->
      <div v-if="client && clientInvoices.length > 0" class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">فواتير العميل</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
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
                  التاريخ
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الاستحقاق
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
              <tr v-for="invoice in clientInvoices" :key="invoice.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(invoice.issue_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(invoice.due_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(invoice.total_amount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(invoice.status)">
                    {{ getStatusText(invoice.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link
                    :to="`/invoices/${invoice.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    عرض
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- حالة عدم وجود فواتير -->
      <div v-else-if="client && !loading" class="bg-white shadow rounded-lg p-8 text-center">
        <svg
          class="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد فواتير</h3>
        <p class="text-gray-500 mb-4">لا توجد فواتير مسجلة لهذا العميل بعد</p>
        <router-link
          to="/invoices/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          إنشاء فاتورة جديدة
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientDetails',
  data() {
    return {
      client: null,
      clientInvoices: [],
      loading: true,
      stats: {
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
      },
    }
  },
  methods: {
    getInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    },

    formatCurrency(amount) {
      if (!amount) return '0.00 ر.س'
      return parseFloat(amount).toFixed(2) + ' ر.س'
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

    getStatusClasses(status) {
      const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
      const statusClasses = {
        draft: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
    },

    editClient() {
      this.$router.push(`/clients/${this.client.id}/edit`)
    },

    async loadClientDetails() {
      this.loading = true
      try {
        const clientId = this.$route.params.id
        console.log(`🚀 Loading client details for ID: ${clientId}`)

        // Fetch client details
        this.client = await this.$store.dispatch('clients/fetchClient', clientId)
        console.log('✅ Client loaded:', this.client)

        // Fetch all invoices to filter by client
        await this.$store.dispatch('invoices/fetchInvoices')

        const allInvoices =
          this.$store.state.invoices.invoices.data || this.$store.state.invoices.invoices || []
        console.log('📋 All invoices:', allInvoices)

        this.clientInvoices = allInvoices.filter((inv) => inv.client_id === this.client.id)
        console.log('✅ Client invoices:', this.clientInvoices)

        // Calculate stats
        this.stats.totalInvoices = this.clientInvoices.length
        this.stats.paidInvoices = this.clientInvoices.filter((inv) => inv.status === 'paid').length
        this.stats.overdueInvoices = this.clientInvoices.filter(
          (inv) => inv.status === 'overdue',
        ).length
      } catch (error) {
        console.error('❌ Failed to load client details:', error)
        if (error.response) {
          console.error('❌ Error response:', error.response.data)
        }
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    console.log('🏁 ClientDetails component mounted')
    this.loadClientDetails()
  },
}
</script>
