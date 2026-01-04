<template>
  <div>
    <p class="text-3xl">التقارير والإحصائيات</p>
    <hr class="mb-5" />

    <!-- فلاتر البحث -->
    <div class="filters-card bg-white rounded-lg shadow-md p-6 mb-6">
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
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">العميل</label>
          <select
            v-model="filters.client_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">الكل</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex space-x-3 space-x-reverse">
        <button
          @click="loadReport"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <i class="fas fa-search ml-2"></i>
          بحث
        </button>
        <button
          @click="exportReport"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <i class="fas fa-file-export ml-2"></i>
          تصدير
        </button>
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          <i class="fas fa-redo ml-2"></i>
          إعادة تعيين
        </button>
      </div>
    </div>

    <!-- علامات التبويب -->
    <div class="tabs-container border-b border-gray-200 mb-6">
      <nav class="-mb-px flex space-x-8 space-x-reverse">
        <button
          @click="switchTab('invoices')"
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
          @click="switchTab('clients')"
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
          @click="switchTab('revenue')"
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
          @click="switchTab('overdue')"
          :class="{
            'border-blue-500 text-blue-600': activeTab === 'overdue',
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
              activeTab !== 'overdue',
          }"
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
        >
          <i class="fas fa-exclamation-triangle ml-2"></i>
          الفواتير المتأخرة
          <span
            v-if="overdueCount > 0"
            class="bg-red-500 text-white text-xs rounded-full px-2 py-1 mr-2"
          >
            {{ overdueCount }}
          </span>
        </button>
      </nav>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">جاري تحميل البيانات...</p>
    </div>

    <!-- حالة الخطأ -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-400"></i>
        </div>
        <div class="mr-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
        <button @click="clearError" class="text-red-700 hover:text-red-900">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- محتوى التقارير -->
    <div v-else>
      <!-- تقرير الفواتير -->
      <div v-if="activeTab === 'invoices' && reports.invoices.length > 0">
        <!-- إحصائيات -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الفواتير</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ stats.invoices.total_invoices || 0 }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي المبلغ</p>
              <p class="text-3xl font-bold text-green-600">
                {{ formatCurrency(stats.invoices.total_amount) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المبلغ المدفوع</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(stats.invoices.total_paid) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المبلغ المستحق</p>
              <p class="text-3xl font-bold text-red-600">
                {{ formatCurrency(stats.invoices.total_due) }}
              </p>
            </div>
          </div>
        </div>

        <!-- جدول الفواتير -->
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
                <tr v-for="invoice in reports.invoices" :key="invoice.id">
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

      <!-- تقرير العملاء -->
      <div v-if="activeTab === 'clients' && reports.clients.length > 0">
        <!-- إحصائيات -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي العملاء</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats.clients.total_clients || 0 }}</p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الفواتير</p>
              <p class="text-3xl font-bold text-green-600">
                {{ stats.clients.total_invoices || 0 }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الإيرادات</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(stats.clients.total_revenue) }}
              </p>
            </div>
          </div>
        </div>

        <!-- جدول العملاء -->
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
                <tr v-for="client in reports.clients" :key="client.id">
                  <td class="px-6 py-4 whitespace-nowrap">{{ client.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ client.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ client.invoices_count || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(client.total_spent) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(client.total_spent / (client.invoices_count || 1)) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- تقرير الإيرادات -->
      <div v-if="activeTab === 'revenue' && reports.revenue.length > 0">
        <!-- إحصائيات -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي الإيرادات</p>
              <p class="text-3xl font-bold text-green-600">
                {{ formatCurrency(stats.revenue.total_revenue) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المحصل فعلياً</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(stats.revenue.collected_revenue) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">المستحق تحصيله</p>
              <p class="text-3xl font-bold text-yellow-600">
                {{ formatCurrency(stats.revenue.outstanding_revenue) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">نسبة التحصيل</p>
              <p class="text-3xl font-bold text-purple-600">
                {{ Math.round(stats.revenue.collection_rate || 0) }}%
              </p>
            </div>
          </div>
        </div>

        <!-- جدول الإيرادات الشهرية -->
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
                <tr v-for="month in reports.revenue" :key="month.month">
                  <td class="px-6 py-4 whitespace-nowrap">{{ month.month }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ month.invoice_count || 0 }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(month.total_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(month.paid_amount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatCurrency(month.total_amount - month.paid_amount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- تقرير الفواتير المتأخرة -->
      <div v-if="activeTab === 'overdue' && reports.overdue.length > 0">
        <!-- إحصائيات -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">الفواتير المتأخرة</p>
              <p class="text-3xl font-bold text-red-600">{{ stats.overdue.total_overdue || 0 }}</p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">إجمالي المبلغ</p>
              <p class="text-3xl font-bold text-red-600">
                {{ formatCurrency(stats.overdue.total_amount) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">متوسط أيام التأخير</p>
              <p class="text-3xl font-bold text-red-600">
                {{ Math.round(stats.overdue.average_days_overdue || 0) }} يوم
              </p>
            </div>
          </div>
        </div>

        <!-- جدول الفواتير المتأخرة -->
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
                <tr v-for="invoice in reports.overdue" :key="invoice.id">
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
                      @click="sendReminder(invoice.id)"
                      class="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 ml-2"
                    >
                      <i class="fas fa-envelope ml-1"></i>
                      تذكير
                    </button>
                    <button
                      @click="markAsPaid(invoice.id)"
                      class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      <i class="fas fa-check ml-1"></i>
                      تسديد
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- لا توجد بيانات -->
      <div
        v-if="activeTab === 'invoices' && reports.invoices.length === 0"
        class="text-center py-12"
      >
        <i class="fas fa-file-invoice text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">لا توجد فواتير في الفترة المحددة</p>
      </div>
      <div v-if="activeTab === 'clients' && reports.clients.length === 0" class="text-center py-12">
        <i class="fas fa-users text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">لا توجد بيانات للعملاء</p>
      </div>
      <div v-if="activeTab === 'revenue' && reports.revenue.length === 0" class="text-center py-12">
        <i class="fas fa-chart-line text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">لا توجد بيانات للإيرادات</p>
      </div>
      <div v-if="activeTab === 'overdue' && reports.overdue.length === 0" class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">لا توجد فواتير متأخرة</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from '@/api/axios' // إضافة استيراد axios

export default {
  name: 'ReportsIndex',

  data() {
    return {
      activeTab: 'invoices',
      filters: {
        start_date: '',
        end_date: '',
        status: '',
        client_id: '',
      },
      clients: [],
    }
  },

  computed: {
    ...mapGetters('report', [
      'invoicesReport',
      'clientsReport',
      'revenueReport',
      'overdueReport',
      'invoiceStats',
      'clientStats',
      'revenueStats',
      'overdueStats',
      'isLoading',
      'reportError',
      'reportFilters',
    ]),

    loading() {
      return this.isLoading
    },

    error() {
      return this.reportError
    },

    reports() {
      return {
        invoices: this.invoicesReport,
        clients: this.clientsReport,
        revenue: this.revenueReport,
        overdue: this.overdueReport,
      }
    },

    stats() {
      return {
        invoices: this.invoiceStats,
        clients: this.clientStats,
        revenue: this.revenueStats,
        overdue: this.overdueStats,
      }
    },

    overdueCount() {
      return this.stats.overdue.total_overdue || 0
    },
  },

  watch: {
    reportFilters: {
      immediate: true,
      handler(newFilters) {
        this.filters = { ...newFilters }
      },
    },
  },

  mounted() {
    this.initFilters()
    this.loadReport()
    this.loadClients()
  },

  methods: {
    ...mapActions('report', [
      'getInvoicesReport',
      'getClientsReport',
      'getRevenueReport',
      'getOverdueReport',
      'updateFilters',
      'exportReport',
      'sendReminder',
      'markAsPaid',
      'resetFilters',
      'clearError',
    ]),

    // تهيئة الفلاتر
    initFilters() {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      this.filters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
      }

      this.updateFilters(this.filters)
    },

    // تحميل التقرير
    async loadReport() {
      this.updateFilters(this.filters)

      const actions = {
        invoices: 'getInvoicesReport',
        clients: 'getClientsReport',
        revenue: 'getRevenueReport',
        overdue: 'getOverdueReport',
      }

      try {
        await this[actions[this.activeTab]]()
        this.$toast.success('تم تحميل التقرير بنجاح')
      } catch (error) {
        this.$toast.error(error.message || 'فشل في تحميل التقرير')
      }
    },

    // تبديل التبويب
    switchTab(tab) {
      this.activeTab = tab
      this.loadReport()
    },

    // تصدير التقرير
    async exportReport() {
      try {
        await this.exportReport(this.activeTab)
        this.$toast.success('تم تصدير التقرير بنجاح')
      } catch (error) {
        this.$toast.error(error.message || 'فشل في تصدير التقرير')
      }
    },

    // إعادة تعيين الفلاتر
    resetFilters() {
      this.resetFilters()
      this.loadReport()
      this.$toast.info('تم إعادة تعيين الفلاتر')
    },

    // تحميل العملاء للفلتر - تصحيح الخطأ هنا
    async loadClients() {
      try {
        const response = await axios.get('/api/admin/clients', {
          params: { per_page: 100, is_active: true },
        })

        if (response.data && response.data.data) {
          this.clients = response.data.data
        } else {
          this.clients = []
        }
      } catch (error) {
        console.error('فشل في تحميل العملاء:', error)
        this.clients = []
      }
    },

    // إرسال تذكير
    async sendReminder(invoiceId) {
      if (confirm('هل تريد إرسال تذكير للعميل؟')) {
        try {
          await this.sendReminder(invoiceId)
          this.$toast.success('تم إرسال التذكير بنجاح')
        } catch (error) {
          this.$toast.error(error.message || 'فشل في إرسال التذكير')
        }
      }
    },

    // تسديد فاتورة
    async markAsPaid(invoiceId) {
      if (confirm('هل تريد تسديد هذه الفاتورة؟')) {
        try {
          await this.markAsPaid(invoiceId)
          this.$toast.success('تم تسديد الفاتورة بنجاح')
          // تحديث تقرير المتأخرات
          setTimeout(() => {
            this.getOverdueReport()
          }, 1000)
        } catch (error) {
          this.$toast.error(error.message || 'فشل في تسديد الفاتورة')
        }
      }
    },

    // تنسيق العملات
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ر.س'
      return parseFloat(amount).toFixed(2) + ' ر.س'
    },

    // تنسيق التاريخ
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ar-SA')
    },

    // كلاس الحالة
    getStatusClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    // نص الحالة
    getStatusText(status) {
      const texts = {
        draft: 'مسودة',
        sent: 'مرسلة',
        paid: 'مدفوعة',
        overdue: 'متأخرة',
      }
      return texts[status] || status
    },
  },
}
</script>
