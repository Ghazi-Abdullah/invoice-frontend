<template>
  <div class="min-h-screen bg-gray-50 p-6 font-cairo">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            <i class="fas fa-chart-bar text-blue-500 mr-2"></i>
            نظام التقارير
          </h1>
          <p class="text-gray-600">إحصائيات وتحليلات شاملة لنشاطك التجاري</p>
        </div>
        <div class="flex flex-wrap gap-3 mt-4 md:mt-0">
          <button
            @click="exportReport('pdf')"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
          >
            <i class="fas fa-file-pdf"></i>
            تصدير PDF
          </button>
          <button
            @click="exportReport('excel')"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
          >
            <i class="fas fa-file-excel"></i>
            تصدير Excel
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">إجمالي الفواتير</p>
              <h3 class="text-2xl font-bold text-gray-800">{{ stats.total_invoices || 0 }}</h3>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <i class="fas fa-file-invoice text-blue-500 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <span class="text-green-500 text-sm">
              <i class="fas fa-arrow-up mr-1"></i>
              12% عن الشهر الماضي
            </span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">إجمالي الإيرادات</p>
              <h3 class="text-2xl font-bold text-gray-800">{{ formatCurrency(stats.total_amount || 0) }}</h3>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <i class="fas fa-money-bill-wave text-green-500 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <span class="text-green-500 text-sm">
              <i class="fas fa-arrow-up mr-1"></i>
              8% عن الشهر الماضي
            </span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">إجمالي العملاء</p>
              <h3 class="text-2xl font-bold text-gray-800">{{ stats.total_clients || 0 }}</h3>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <i class="fas fa-users text-purple-500 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <span class="text-green-500 text-sm">
              <i class="fas fa-arrow-up mr-1"></i>
              5% عن الشهر الماضي
            </span>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">المستحقات</p>
              <h3 class="text-2xl font-bold text-gray-800">{{ formatCurrency(stats.total_due || 0) }}</h3>
            </div>
            <div class="p-3 bg-yellow-50 rounded-lg">
              <i class="fas fa-clock text-yellow-500 text-xl"></i>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <span class="text-red-500 text-sm">
              <i class="fas fa-exclamation-circle mr-1"></i>
              {{ overdueCount }} فاتورة متأخرة
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Sidebar - Report Types -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">أنواع التقارير</h3>
          <div class="space-y-3">
            <button
              v-for="report in reportTypes"
              :key="report.id"
              @click="selectReport(report.id)"
              :class="[
                'w-full text-right p-4 rounded-lg border transition-all duration-200 flex items-center justify-between',
                activeReport === report.id
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
              ]"
            >
              <div class="flex items-center gap-3">
                <div :class="[
                  'p-2 rounded-lg',
                  activeReport === report.id ? 'bg-blue-100' : 'bg-gray-100'
                ]">
                  <i :class="[report.icon, activeReport === report.id ? 'text-blue-500' : 'text-gray-500']"></i>
                </div>
                <div class="text-right">
                  <h4 class="font-medium">{{ report.title }}</h4>
                  <p class="text-xs text-gray-500 mt-1">{{ report.description }}</p>
                </div>
              </div>
              <i class="fas fa-chevron-left text-gray-400"></i>
            </button>
          </div>

          <!-- Filters -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">الفلاتر</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الفترة الزمنية</label>
                <div class="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    v-model="filters.start_date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="date"
                    v-model="filters.end_date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div v-if="activeReport === 'invoices'">
                <label class="block text-sm font-medium text-gray-700 mb-2">حالة الفاتورة</label>
                <select
                  v-model="filters.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع الحالات</option>
                  <option value="paid">مدفوعة</option>
                  <option value="unpaid">غير مدفوعة</option>
                  <option value="partially_paid">مدفوعة جزئياً</option>
                </select>
              </div>

              <div v-if="activeReport === 'invoices'">
                <label class="block text-sm font-medium text-gray-700 mb-2">العميل</label>
                <select
                  v-model="filters.client_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">جميع العملاء</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.name }}
                  </option>
                </select>
              </div>

              <div v-if="activeReport === 'sales' || activeReport === 'revenue'">
                <label class="block text-sm font-medium text-gray-700 mb-2">نوع الفترة</label>
                <select
                  v-model="filters.period"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="daily">يومي</option>
                  <option value="weekly">أسبوعي</option>
                  <option value="monthly">شهري</option>
                  <option value="yearly">سنوي</option>
                </select>
              </div>

              <div class="flex gap-2 pt-2">
                <button
                  @click="applyFilters"
                  class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <i class="fas fa-filter"></i>
                  تطبيق الفلاتر
                </button>
                <button
                  @click="resetFilters"
                  class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  <i class="fas fa-redo"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="lg:col-span-2">
        <!-- Charts -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">الفواتير حسب الحالة</h3>
            <div class="h-64">
              <canvas ref="statusChart" style="direction: ltr"></canvas>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">الإيرادات الشهرية</h3>
            <div class="h-64">
              <canvas ref="salesChart" style="direction: ltr"></canvas>
            </div>
          </div>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">البيانات التفصيلية</h3>
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="بحث..."
                class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p class="mt-2 text-gray-600">جاري تحميل البيانات...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="p-8 text-center">
            <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-3"></i>
            <p class="text-red-600">{{ error }}</p>
            <button @click="fetchData" class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              حاول مرة أخرى
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="!filteredData.length" class="p-8 text-center">
            <i class="fas fa-database text-gray-400 text-3xl mb-3"></i>
            <p class="text-gray-600">لا توجد بيانات لعرضها</p>
            <p class="text-gray-500 text-sm mt-1">جرب تغيير الفلاتر أو اختيار فترة زمنية مختلفة</p>
          </div>

          <!-- Data Table -->
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="item in paginatedData"
                  :key="item.id"
                  class="hover:bg-gray-50 transition"
                >
                  <td
                    v-for="column in tableColumns"
                    :key="column.key"
                    class="px-6 py-4 text-sm"
                  >
                    <template v-if="column.key === 'status'">
                      <span :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        getStatusClass(item[column.key])
                      ]">
                        {{ getStatusText(item[column.key]) }}
                      </span>
                    </template>
                    <template v-else-if="column.type === 'currency'">
                      {{ formatCurrency(getNestedValue(item, column.key)) }}
                    </template>
                    <template v-else-if="column.type === 'date'">
                      {{ formatDate(getNestedValue(item, column.key)) }}
                    </template>
                    <template v-else>
                      {{ getNestedValue(item, column.key) }}
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && !error && filteredData.length" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                عرض {{ (currentPage - 1) * itemsPerPage + 1 }} إلى {{ Math.min(currentPage * itemsPerPage, filteredData.length) }} من {{ filteredData.length }} عنصر
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  :class="[
                    'px-3 py-1 border border-gray-300 rounded-lg',
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  ]"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
                <span class="px-3 py-1 text-sm text-gray-700">
                  الصفحة {{ currentPage }} من {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  :class="[
                    'px-3 py-1 border border-gray-300 rounded-lg',
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                  ]"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div v-if="!loading && !error" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="fas fa-info-circle text-blue-500"></i>
              </div>
              <div>
                <p class="text-sm text-blue-700">آخر تحديث</p>
                <p class="font-medium text-blue-900">{{ formatDate(new Date()) }}</p>
              </div>
            </div>
          </div>
          <div class="bg-green-50 border border-green-200 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="fas fa-chart-line text-green-500"></i>
              </div>
              <div>
                <p class="text-sm text-green-700">إجمالي البيانات</p>
                <p class="font-medium text-green-900">{{ filteredData.length }} عنصر</p>
              </div>
            </div>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-yellow-100 rounded-lg">
                <i class="fas fa-clock text-yellow-500"></i>
              </div>
              <div>
                <p class="text-sm text-yellow-700">وقت التحميل</p>
                <p class="font-medium text-yellow-900">{{ loadingTime }} ثانية</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';

export default {
  name: 'ReportsIndex',

  data() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
      activeReport: 'invoices',
      filters: {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
        period: 'monthly'
      },
      reportData: null,
      clients: [],
      stats: {},
      loading: false,
      error: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 15,
      loadingTime: 0,
      overdueCount: 0,

      reportTypes: [
        {
          id: 'invoices',
          title: 'تقرير الفواتير',
          icon: 'fas fa-file-invoice',
          description: 'عرض جميع الفواتير مع تفاصيلها'
        },
        {
          id: 'clients',
          title: 'تقرير العملاء',
          icon: 'fas fa-users',
          description: 'تحليل بيانات العملاء'
        },
        {
          id: 'sales',
          title: 'تقرير المبيعات',
          icon: 'fas fa-chart-line',
          description: 'تحليل المبيعات عبر الوقت'
        },
        {
          id: 'revenue',
          title: 'تقرير الإيرادات',
          icon: 'fas fa-money-bill-trend-up',
          description: 'تتبع الإيرادات والمتحصلات'
        },
        {
          id: 'overdue',
          title: 'الفواتير المتأخرة',
          icon: 'fas fa-clock',
          description: 'الفواتير التي تجاوزت تاريخ الاستحقاق'
        }
      ],

      statusChart: null,
      salesChart: null
    };
  },

  computed: {
    tableColumns() {
      switch (this.activeReport) {
        case 'invoices':
          return [
            { key: 'invoice_number', label: 'رقم الفاتورة' },
            { key: 'client.name', label: 'العميل' },
            { key: 'issue_date', label: 'تاريخ الإصدار', type: 'date' },
            { key: 'due_date', label: 'تاريخ الاستحقاق', type: 'date' },
            { key: 'total', label: 'المجموع', type: 'currency' },
            { key: 'paid_amount', label: 'المبلغ المدفوع', type: 'currency' },
            { key: 'due_amount', label: 'المبلغ المتبقي', type: 'currency' },
            { key: 'status', label: 'الحالة' }
          ];
        case 'clients':
          return [
            { key: 'name', label: 'اسم العميل' },
            { key: 'email', label: 'البريد الإلكتروني' },
            { key: 'phone', label: 'الهاتف' },
            { key: 'total_invoices', label: 'عدد الفواتير' },
            { key: 'total_amount', label: 'إجمالي المبلغ', type: 'currency' },
            { key: 'total_paid', label: 'المبلغ المدفوع', type: 'currency' },
            { key: 'total_due', label: 'المبلغ المتبقي', type: 'currency' }
          ];
        case 'sales':
          return [
            { key: 'date', label: 'التاريخ', type: 'date' },
            { key: 'invoices_count', label: 'عدد الفواتير' },
            { key: 'total_sales', label: 'إجمالي المبيعات', type: 'currency' },
            { key: 'total_paid', label: 'إجمالي المدفوع', type: 'currency' },
            { key: 'total_due', label: 'إجمالي المتبقي', type: 'currency' }
          ];
        case 'revenue':
          return [
            { key: 'month', label: 'الشهر' },
            { key: 'revenue', label: 'الإيرادات', type: 'currency' },
            { key: 'collected', label: 'المتحصلات', type: 'currency' },
            { key: 'outstanding', label: 'المستحقات', type: 'currency' },
            { key: 'invoice_count', label: 'عدد الفواتير' }
          ];
        case 'overdue':
          return [
            { key: 'invoice_number', label: 'رقم الفاتورة' },
            { key: 'client.name', label: 'العميل' },
            { key: 'issue_date', label: 'تاريخ الإصدار', type: 'date' },
            { key: 'due_date', label: 'تاريخ الاستحقاق', type: 'date' },
            { key: 'due_amount', label: 'المبلغ المتبقي', type: 'currency' },
            { key: 'status', label: 'الحالة' }
          ];
        default:
          return [];
      }
    },

    filteredData() {
      if (!this.reportData || !this.reportData.invoices) return [];

      let data = this.reportData.invoices.data || [];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        data = data.filter(item => {
          return Object.values(item).some(value =>
            value && String(value).toLowerCase().includes(query)
          );
        });
      }

      return data;
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }
  },

  methods: {
    getNestedValue(obj, path) {
      return path.split('.').reduce((o, p) => (o || {})[p], obj) || '';
    },

    formatCurrency(amount) {
      if (!amount) return '٠٫٠٠ ر.س';
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR'
      }).format(amount);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    getStatusClass(status) {
      switch (status) {
        case 'paid': return 'bg-green-100 text-green-800';
        case 'unpaid': return 'bg-red-100 text-red-800';
        case 'partially_paid': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    },

    getStatusText(status) {
      switch (status) {
        case 'paid': return 'مدفوعة';
        case 'unpaid': return 'غير مدفوعة';
        case 'partially_paid': return 'مدفوعة جزئياً';
        default: return status;
      }
    },

    async selectReport(reportType) {
      this.activeReport = reportType;
      this.currentPage = 1;
      await this.fetchReportData();
    },

    async applyFilters() {
      this.currentPage = 1;
      await this.fetchReportData();
    },

    resetFilters() {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      this.filters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
        period: 'monthly'
      };
      this.searchQuery = '';
      this.fetchReportData();
    },

    async fetchReportData() {
      const startTime = performance.now();
      this.loading = true;
      this.error = null;

      try {
        const endpoint = this.getEndpoint();
        const response = await axios.get(`/api/reports/${endpoint}`, {
          params: this.filters,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          this.reportData = response.data.data;
          this.updateStats();
          this.updateCharts();

          // Show success toast
          this.$toast.success('تم تحميل البيانات بنجاح');
        } else {
          throw new Error(response.data.message || 'فشل في جلب البيانات');
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        this.$toast.error(this.error || 'حدث خطأ في جلب البيانات');
      } finally {
        this.loading = false;
        const endTime = performance.now();
        this.loadingTime = ((endTime - startTime) / 1000).toFixed(2);
      }
    },

    async fetchClients() {
      try {
        const response = await axios.get('/api/clients', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        this.clients = response.data.data || [];
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    },

    async fetchOverdueCount() {
      try {
        const response = await axios.get('/api/reports/overdue-invoices', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          this.overdueCount = response.data.data.total_overdue_invoices || 0;
        }
      } catch (err) {
        console.error('Error fetching overdue count:', err);
      }
    },

    updateStats() {
      if (!this.reportData) return;

      this.stats = {
        total_invoices: this.reportData.total_invoices || 0,
        total_amount: this.reportData.total_amount || 0,
        total_paid: this.reportData.total_paid || 0,
        total_due: this.reportData.total_due || 0,
        total_clients: this.reportData.total_clients || 0
      };
    },

    updateCharts() {
      if (this.statusChart) this.statusChart.destroy();
      if (this.salesChart) this.salesChart.destroy();

      // Status Chart
      if (this.reportData?.invoices_by_status) {
        const ctx = this.$refs.statusChart;
        this.statusChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: this.reportData.invoices_by_status.map(item =>
              this.getStatusText(item.status)
            ),
            datasets: [{
              data: this.reportData.invoices_by_status.map(item => item.count),
              backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
                rtl: true
              }
            }
          }
        });
      }

      // Sales Chart
      if (this.reportData?.invoices_by_month) {
        const ctx = this.$refs.salesChart;
        this.salesChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: this.reportData.invoices_by_month.map(item => item.month),
            datasets: [{
              label: 'المبيعات',
              data: this.reportData.invoices_by_month.map(item => item.total),
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    },

    getEndpoint() {
      switch (this.activeReport) {
        case 'invoices': return 'invoices';
        case 'clients': return 'clients';
        case 'sales': return 'sales';
        case 'revenue': return 'revenue';
        case 'overdue': return 'overdue-invoices';
        default: return 'invoices';
      }
    },

    async exportReport(format) {
      if (!this.reportData) {
        this.$toast.warning('لا توجد بيانات للتصدير');
        return;
      }

      try {
        this.$toast.info('جاري تصدير التقرير...');

        const response = await axios.post(`/api/reports/export/${format}`, {
          report_type: this.activeReport,
          data: this.reportData
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${this.activeReport}_report_${new Date().toISOString().split('T')[0]}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        this.$toast.success('تم تصدير التقرير بنجاح');
      } catch (err) {
        this.$toast.error('فشل في تصدير التقرير');
        console.error('Export error:', err);
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },

  mounted() {
    this.fetchClients();
    this.fetchOverdueCount();
    this.fetchReportData();
  },

  beforeUnmount() {
    if (this.statusChart) this.statusChart.destroy();
    if (this.salesChart) this.salesChart.destroy();
  }
};
</script>

<style scoped>
/* Custom styles for RTL */
.font-cairo {
  font-family: 'Cairo', sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Table styles */
table {
  border-collapse: separate;
  border-spacing: 0;
}

table thead th {
  position: sticky;
  top: 0;
  background: #f9fafb;
  z-index: 10;
}

table tbody tr:last-child td {
  border-bottom: none;
}
</style>
