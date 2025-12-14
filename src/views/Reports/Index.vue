<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">التقارير والإحصائيات</h1>
      <p class="text-gray-600 mt-2">عرض وتحليل البيانات المالية</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">فلاتر البحث</h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
          <input
            type="date"
            v-model="filters.start_date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
          <input
            type="date"
            v-model="filters.end_date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">حالة الفاتورة</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">الكل</option>
            <option value="draft">مسودة</option>
            <option value="sent">مرسلة</option>
            <option value="paid">مدفوعة</option>
            <option value="overdue">متأخرة</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="fetchReports('invoices')"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          >
            <i class="fas fa-search ml-2"></i>
            بحث
          </button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8 space-x-reverse">
        <button
          @click="activeTab = 'invoices'"
          :class="{
            'border-blue-500 text-blue-600': activeTab === 'invoices',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
              activeTab !== 'invoices',
          }"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          <i class="fas fa-file-invoice ml-2"></i>
          تقرير الفواتير
        </button>

        <button
          @click="activeTab = 'clients'"
          :class="{
            'border-blue-500 text-blue-600': activeTab === 'clients',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
              activeTab !== 'clients',
          }"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          <i class="fas fa-users ml-2"></i>
          تقرير العملاء
        </button>

        <button
          @click="activeTab = 'revenue'"
          :class="{
            'border-blue-500 text-blue-600': activeTab === 'revenue',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
              activeTab !== 'revenue',
          }"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          <i class="fas fa-chart-line ml-2"></i>
          تقرير الإيرادات
        </button>

        <button
          @click="activeTab = 'overdue'"
          :class="{
            'border-blue-500 text-blue-600': activeTab === 'overdue',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
              activeTab !== 'overdue',
          }"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          <i class="fas fa-exclamation-triangle ml-2"></i>
          الفواتير المتأخرة
        </button>
      </nav>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">جاري تحميل البيانات...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-400"></i>
        </div>
        <div class="mr-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Invoices Report -->
      <div v-if="activeTab === 'invoices' && reports.invoices">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الفواتير</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ reports.invoices.total_invoices || 0 }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي المبلغ</p>
              <p class="text-3xl font-bold text-green-600">
                {{ formatCurrency(reports.invoices.total_amount) }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المبلغ المدفوع</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(reports.invoices.total_paid) }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المبلغ المستحق</p>
              <p class="text-3xl font-bold text-red-600">
                {{ formatCurrency(reports.invoices.total_due) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">قائمة الفواتير</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الفاتورة
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    العميل
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    تاريخ الإصدار
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    تاريخ الاستحقاق
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبلغ
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الحالة
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="invoice in reports.invoices.data" :key="invoice.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <router-link
                      :to="`/invoices/${invoice.id}`"
                      class="text-blue-500 hover:text-blue-700"
                    >
                      {{ invoice.invoice_number }}
                    </router-link>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ invoice.client?.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(invoice.issue_date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(invoice.due_date) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(invoice.total_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getStatusClass(invoice.status)"
                      class="px-2 py-1 text-xs rounded-full"
                    >
                      {{ getStatusText(invoice.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Clients Report -->
      <div v-if="activeTab === 'clients' && reports.clients">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي العملاء</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ reports.clients.stats?.total_clients || 0 }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الفواتير</p>
              <p class="text-3xl font-bold text-green-600">
                {{ reports.clients.stats?.total_invoices || 0 }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الإيرادات</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(reports.clients.stats?.total_revenue) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">تقرير العملاء</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    اسم العميل
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    البريد الإلكتروني
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    عدد الفواتير
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    إجمالي المشتريات
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    متوسط الفاتورة
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="client in reports.clients.data" :key="client.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ client.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ client.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ client.invoices_count || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(client.invoices_sum_total_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{
                      formatCurrency(
                        client.invoices_sum_total_amount / (client.invoices_count || 1),
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Revenue Report -->
      <div v-if="activeTab === 'revenue' && reports.revenue">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الإيرادات</p>
              <p class="text-3xl font-bold text-green-600">
                {{ formatCurrency(reports.revenue.stats?.total_revenue) }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المحصل فعلياً</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(reports.revenue.stats?.collected_revenue) }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المستحق تحصيله</p>
              <p class="text-3xl font-bold text-yellow-600">
                {{ formatCurrency(reports.revenue.stats?.outstanding_revenue) }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">نسبة التحصيل</p>
              <p class="text-3xl font-bold text-purple-600">
                {{ Math.round(reports.revenue.stats?.collection_rate || 0) }}%
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">الإيرادات الشهرية</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الشهر
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    عدد الفواتير
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجمالي
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المحصل
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المستحق
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="month in reports.revenue.data" :key="month.month">
                  <td class="px-6 py-4 whitespace-nowrap">{{ month.month }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ month.count || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(month.total) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(month.paid) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ formatCurrency(month.due) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Overdue Report -->
      <div v-if="activeTab === 'overdue' && reports.overdue">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">الفواتير المتأخرة</p>
              <p class="text-3xl font-bold text-red-600">
                {{ reports.overdue.stats?.total_overdue || 0 }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي المبلغ</p>
              <p class="text-3xl font-bold text-red-600">
                {{ formatCurrency(reports.overdue.stats?.total_amount) }}
              </p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">متوسط أيام التأخير</p>
              <p class="text-3xl font-bold text-red-600">
                {{ Math.round(reports.overdue.stats?.average_days_overdue || 0) }} يوم
              </p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">قائمة الفواتير المتأخرة</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    رقم الفاتورة
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    العميل
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    تاريخ الاستحقاق
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    أيام التأخير
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبلغ
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="invoice in reports.overdue.data" :key="invoice.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <router-link
                      :to="`/invoices/${invoice.id}`"
                      class="text-blue-500 hover:text-blue-700"
                    >
                      {{ invoice.invoice_number }}
                    </router-link>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ invoice.client?.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-red-600">
                    {{ formatDate(invoice.due_date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-red-600">
                    {{ invoice.days_overdue || 0 }} يوم
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(invoice.total_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      @click="sendReminder(invoice)"
                      class="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 ml-2"
                    >
                      <i class="fas fa-envelope ml-1"></i>
                      تذكير
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { toast } from 'vue3-toastify'

export default {
  name: 'ReportsIndex',

  setup() {
    const store = useStore()

    const loading = ref(false)
    const error = ref(null)
    const activeTab = ref('invoices')
    const reports = reactive({
      invoices: null,
      clients: null,
      revenue: null,
      overdue: null,
    })

    const filters = reactive({
      start_date: '',
      end_date: '',
      status: '',
      client_id: '',
    })

    const fetchReports = async (reportType = null) => {
      const type = reportType || activeTab.value
      loading.value = true
      error.value = null

      try {
        const result = await store.dispatch('report/fetchReport', {
          reportType: type,
          filters: { ...filters },
        })

        reports[type] = result

        // تحويل التواريخ إذا لزم الأمر
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach((item) => {
            if (item.issue_date)
              item.issue_date = new Date(item.issue_date).toISOString().split('T')[0]
            if (item.due_date) item.due_date = new Date(item.due_date).toISOString().split('T')[0]
          })
        }

        toast.success(`تم تحميل تقرير ${getReportTitle(type)} بنجاح`)
      } catch (err) {
        error.value = err.message || 'فشل في تحميل التقرير'
        toast.error(error.value)
      } finally {
        loading.value = false
      }
    }

    const getReportTitle = (type) => {
      const titles = {
        invoices: 'الفواتير',
        clients: 'العملاء',
        revenue: 'الإيرادات',
        overdue: 'المتأخرات',
      }
      return titles[type] || type
    }

    const formatCurrency = (amount) => {
      if (!amount) return '0.00 ر.س'
      return parseFloat(amount).toFixed(2) + ' ر.س'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ar-SA')
    }

    const getStatusClass = (status) => {
      const classes = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status) => {
      const texts = {
        draft: 'مسودة',
        sent: 'مرسلة',
        paid: 'مدفوعة',
        overdue: 'متأخرة',
      }
      return texts[status] || status
    }

    const sendReminder = (invoice) => {
      toast.info(`تم إرسال تذكير للعميل ${invoice.client?.name}`)
      // هنا يمكنك إضافة منطق إرسال التذكير عبر البريد الإلكتروني
    }

    onMounted(() => {
      // تعيين تواريخ افتراضية (آخر 30 يوم)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      filters.start_date = startDate.toISOString().split('T')[0]
      filters.end_date = endDate.toISOString().split('T')[0]

      fetchReports('invoices')
    })

    return {
      loading,
      error,
      activeTab,
      reports,
      filters,
      fetchReports,
      formatCurrency,
      formatDate,
      getStatusClass,
      getStatusText,
      sendReminder,
    }
  },
}
</script>

<style scoped>
/* أي تنسيقات إضافية */
</style>
