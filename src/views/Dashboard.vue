<template>
  <div class="dashboard-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-gray-900">نظام الفواتير</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="refreshDashboard" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'جاري التحديث...' : 'تحديث البيانات' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري التحميل...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">حدث خطأ</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">لوحة التحكم</h1>
        <p class="text-gray-600 text-lg">
          مرحباً بك {{ user?.name }} {{ isAdmin ? '(مدير)' : '' }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Invoices Card -->
        <div
          v-if="showInvoicesCard"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">إجمالي الفواتير</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalInvoices }}</p>
              <div class="flex items-center mt-2">
                <span class="text-green-600 text-sm font-medium">+{{ stats.invoiceGrowth }}%</span>
                <span class="text-gray-500 text-sm mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div class="p-3 bg-blue-50 rounded-lg">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Clients Card -->
        <div
          v-if="showClientsCard"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">إجمالي العملاء</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.totalClients }}</p>
              <div class="flex items-center mt-2">
                <span class="text-green-600 text-sm font-medium">+{{ stats.clientsGrowth }}%</span>
                <span class="text-gray-500 text-sm mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <svg
                class="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Paid Invoices Card -->
        <div
          v-if="showPaidInvoicesCard"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">الفواتير المدفوعة</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.paidInvoices }}</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  class="bg-green-600 h-2 rounded-full"
                  :style="{ width: stats.paymentRate + '%' }"
                ></div>
              </div>
              <p class="text-gray-500 text-sm mt-2">نسبة السداد {{ stats.paymentRate }}%</p>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div
          v-if="showRevenueCard"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
              <p class="text-2xl font-bold text-gray-900 mt-2">
                {{ formatCurrency(stats.revenue) }}
              </p>
              <div class="flex items-center mt-2">
                <span class="text-green-600 text-sm font-medium">+{{ stats.revenueGrowth }}%</span>
                <span class="text-gray-500 text-sm mr-2">من الشهر الماضي</span>
              </div>
            </div>
            <div class="p-3 bg-orange-50 rounded-lg">
              <svg
                class="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - 2/3 width -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Quick Actions -->
          <div
            v-if="showQuickActions"
            class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h2 class="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <router-link
                v-if="showCreateInvoice"
                to="/invoices/create"
                class="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                <div class="p-2 bg-blue-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">إنشاء فاتورة</h3>
                  <p class="text-gray-600 text-sm">أضف فاتورة جديدة</p>
                </div>
              </router-link>

              <router-link
                v-if="showCreateClient"
                to="/clients/create"
                class="flex items-center p-4 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                <div class="p-2 bg-green-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">إضافة عميل</h3>
                  <p class="text-gray-600 text-sm">أضف عميل جديد</p>
                </div>
              </router-link>

              <router-link
                v-if="showViewInvoices"
                to="/invoices"
                class="flex items-center p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors duration-200"
              >
                <div class="p-2 bg-purple-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">عرض الفواتير</h3>
                  <p class="text-gray-600 text-sm">عرض وإدارة الفواتير</p>
                </div>
              </router-link>

              <router-link
                v-if="showViewClients"
                to="/clients"
                class="flex items-center p-4 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors duration-200"
              >
                <div class="p-2 bg-yellow-500 rounded-lg mr-3">
                  <svg
                    class="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">عرض العملاء</h3>
                  <p class="text-gray-600 text-sm">عرض وإدارة العملاء</p>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Recent Clients -->
          <div
            v-if="showRecentClients"
            class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">العملاء الحديثين</h2>
              <router-link
                v-if="showViewClients"
                to="/clients"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                عرض الكل
              </router-link>
            </div>

            <div v-if="recentClients.length === 0" class="text-center py-8">
              <svg
                class="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p class="text-gray-500">لا يوجد عملاء بعد</p>
              <router-link
                v-if="showCreateClient"
                to="/clients/create"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                أضف أول عميل
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="client in recentClients"
                :key="client.id"
                class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                @click="goToClient(client.id)"
              >
                <div
                  class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                >
                  {{ getInitials(client.name) }}
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900">{{ client.name }}</p>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ client.email || 'غير متوفر' }}
                  </p>
                  <p class="text-gray-500 text-xs mt-1">
                    تاريخ الإضافة: {{ formatDate(client.created_at) }}
                  </p>
                </div>
                <div class="text-right">
                  <span
                    class="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    نشط
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - 1/3 width -->
        <div class="space-y-8">
          <!-- Recent Invoices -->
          <div
            v-if="showRecentInvoices"
            class="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-gray-900">الفواتير الحديثة</h2>
              <router-link
                v-if="showViewInvoices"
                to="/invoices"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                عرض الكل
              </router-link>
            </div>

            <div v-if="recentInvoices.length === 0" class="text-center py-8">
              <svg
                class="w-12 h-12 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
              <p class="text-gray-500">لا يوجد فواتير بعد</p>
              <router-link
                v-if="showCreateInvoice"
                to="/invoices/create"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 inline-block"
              >
                إنشاء أول فاتورة
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="invoice in recentInvoices"
                :key="invoice.id"
                class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                @click="goToInvoice(invoice.id)"
              >
                <div>
                  <p class="font-semibold text-gray-900">{{ invoice.invoice_number }}</p>
                  <p class="text-gray-600 text-sm mt-1">
                    {{ invoice.client_name || 'غير معروف' }}
                  </p>
                  <p class="text-gray-500 text-xs mt-1">
                    تاريخ الاستحقاق: {{ formatDate(invoice.due_date) }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">{{ formatCurrency(invoice.total) }}</p>
                  <span
                    :class="getStatusClass(invoice.status)"
                    class="inline-block px-2 py-1 text-xs rounded-full mt-1"
                  >
                    {{ getStatusText(invoice.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div
            v-if="showQuickStats"
            class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white"
          >
            <h3 class="text-lg font-bold mb-4">إحصائيات سريعة</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-blue-100">هذا الشهر</span>
                <span class="font-semibold">{{ stats.thisMonthInvoices }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">عملاء جدد</span>
                <span class="font-semibold">{{ stats.newClientsThisMonth }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">متوسط الفاتورة</span>
                <span class="font-semibold">{{ formatCurrency(stats.averageInvoice) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-blue-100">نسبة التحصيل</span>
                <span class="font-semibold">{{ stats.collectionRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Dashboard',

  data() {
    return {
      debugMode: true, // ضع false لإخفاء معلومات التصحيح
    }
  },

  computed: {
    ...mapState('auth', ['user']),

    ...mapGetters('dashboard', [
      'stats',
      'recentClients',
      'recentInvoices',
      'loading',
      'error',
      'formatCurrency',
      'formatDate',
      'getInitials',
      'getStatusClass',
      'getStatusText',
    ]),

    ...mapGetters('auth', ['permissions', 'isAdmin', 'hasPermission']),

    // دوال مساعدة لعرض البطاقات
    showInvoicesCard() {
      return this.isAdmin || this.hasPermission('view_invoices')
    },

    showClientsCard() {
      return this.isAdmin || this.hasPermission('view_clients')
    },

    showPaidInvoicesCard() {
      return this.isAdmin || this.hasPermission('view_invoices')
    },

    showRevenueCard() {
      return this.isAdmin || this.hasPermission('view_sales_report')
    },

    showCreateInvoice() {
      return this.isAdmin || this.hasPermission('create_invoice')
    },

    showCreateClient() {
      return this.isAdmin || this.hasPermission('create_client')
    },

    showViewInvoices() {
      return this.isAdmin || this.hasPermission('view_invoices')
    },

    showViewClients() {
      return this.isAdmin || this.hasPermission('view_clients')
    },

    showQuickActions() {
      return (
        this.showCreateInvoice ||
        this.showCreateClient ||
        this.showViewInvoices ||
        this.showViewClients
      )
    },

    showRecentClients() {
      return this.isAdmin || this.hasPermission('view_clients')
    },

    showRecentInvoices() {
      return this.isAdmin || this.hasPermission('view_invoices')
    },

    showQuickStats() {
      return this.isAdmin || this.hasPermission('view_sales_report')
    },
  },

  mounted() {
    this.loadDashboardData()
    this.checkUserPermissions()
  },

  methods: {
    ...mapActions('dashboard', [
      'fetchDashboardData',
      'calculateDashboardData',
      'refreshDashboardData',
    ]),

    checkUserPermissions() {
      console.log('🔍 فحص صلاحيات المستخدم:')
      console.log('👤 المستخدم:', this.user)
      console.log('👑 هل هو مدير؟ (isAdmin):', this.isAdmin)
      console.log('📋 الصلاحيات:', this.permissions)
      console.log('💰 صلاحية view_sales_report:', this.hasPermission('view_sales_report'))
      console.log('🧾 صلاحية view_invoices:', this.hasPermission('view_invoices'))
      console.log('👥 صلاحية view_clients:', this.hasPermission('view_clients'))
      console.log('🏢 state.is_admin:', this.$store.state.auth.is_admin)
      console.log('👤 user.is_admin:', this.user?.is_admin)
    },

    goToClient(id) {
      if (this.showViewClients) {
        this.$router.push(`/clients/${id}`)
      }
    },

    goToInvoice(id) {
      if (this.showViewInvoices) {
        this.$router.push(`/invoices/${id}`)
      }
    },

    async loadDashboardData() {
      try {
        console.log('🚀 تحميل بيانات الداشبورد...')
        // محاولة جلب البيانات من API
        await this.fetchDashboardData()
        this.$toast.success('تم تحميل بيانات الداشبورد بنجاح')
      } catch (error) {
        console.log('🔄 استخدام البيانات المحلية لحساب الإحصائيات...')
        // في حالة فشل API، نقوم بحساب البيانات من المتاجر الأخرى
        await this.calculateDashboardData()
        this.$toast.info('تم استخدام البيانات المحلية للإحصائيات')
      }
    },

    async refreshDashboard() {
      try {
        await this.refreshDashboardData()
        this.$toast.success('تم تحديث البيانات بنجاح')
      } catch (error) {
        this.$toast.error('فشل في تحديث البيانات')
      }
    },
  },
}
</script>

<style scoped>
.dashboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.min-h-screen {
  min-height: 100vh;
}

.grid {
  display: grid;
}

.gap-6 {
  gap: 1.5rem;
}

.gap-8 {
  gap: 2rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.btn-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
