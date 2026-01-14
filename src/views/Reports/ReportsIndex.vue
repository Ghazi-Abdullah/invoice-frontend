<template>
  <div>
    <p class="text-3xl">{{ $t('reports.title') }}</p>
    <hr class="mb-5" />

    <!-- فلاتر البحث -->
    <div class="filters-card bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">{{ $t('reports.filters') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t('common.dateFrom')
          }}</label>
          <input
            type="date"
            v-model="filters.start_date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t('common.dateTo')
          }}</label>
          <input
            type="date"
            v-model="filters.end_date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t('reports.invoiceStatus')
          }}</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option value="draft">{{ $t('invoices.status.draft') }}</option>
            <option value="sent">{{ $t('invoices.status.sent') }}</option>
            <option value="paid">{{ $t('invoices.status.paid') }}</option>
            <option value="overdue">{{ $t('invoices.status.overdue') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">{{
            $t('clients.title')
          }}</label>
          <select
            v-model="filters.client_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">{{ $t('common.all') }}</option>
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
          {{ $t('common.search') }}
        </button>
        <button
          @click="exportReport"
          class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <i class="fas fa-file-export ml-2"></i>
          {{ $t('common.export') }}
        </button>
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          <i class="fas fa-redo ml-2"></i>
          {{ $t('common.reset') }}
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
          {{ $t('reports.invoicesReport') }}
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
          {{ $t('reports.clientsReport') }}
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
          {{ $t('reports.revenueReport') }}
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
          {{ $t('reports.overdueInvoices') }}
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
      <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
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
              <p class="text-sm text-gray-500">{{ $t('reports.totalInvoices') }}</p>
              <p class="text-3xl font-bold text-gray-800">
                {{ stats.invoices.total_invoices || 0 }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.totalAmount') }}</p>
              <p class="text-3xl font-bold text-green-600">
                {{ formatCurrency(stats.invoices.total_amount) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.totalPaid') }}</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(stats.invoices.total_paid) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.totalDue') }}</p>
              <p class="text-3xl font-bold text-red-600">
                {{ formatCurrency(stats.invoices.total_due) }}
              </p>
            </div>
          </div>
        </div>

        <!-- جدول الفواتير -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('reports.invoicesList') }}</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('invoices.invoiceNumber') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('clients.title') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('invoices.issueDate') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('invoices.dueDate') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('common.amount') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('common.status') }}
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
              <p class="text-sm text-gray-500">{{ $t('reports.totalClients') }}</p>
              <p class="text-3xl font-bold text-gray-800">{{ stats.clients.total_clients || 0 }}</p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.totalInvoices') }}</p>
              <p class="text-3xl font-bold text-green-600">
                {{ stats.clients.total_invoices || 0 }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.totalRevenue') }}</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(stats.clients.total_revenue) }}
              </p>
            </div>
          </div>
        </div>

        <!-- جدول العملاء -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('reports.clientsReport') }}</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('clients.name') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('clients.email') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.invoicesCount') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.totalSpent') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.averageInvoice') }}
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
              <p class="text-sm text-gray-500">{{ $t('reports.totalRevenue') }}</p>
              <p class="text-3xl font-bold text-green-600">
                {{ formatCurrency(stats.revenue.total_revenue) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.collectedRevenue') }}</p>
              <p class="text-3xl font-bold text-blue-600">
                {{ formatCurrency(stats.revenue.collected_revenue) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.outstandingRevenue') }}</p>
              <p class="text-3xl font-bold text-yellow-600">
                {{ formatCurrency(stats.revenue.outstanding_revenue) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.collectionRate') }}</p>
              <p class="text-3xl font-bold text-purple-600">
                {{ Math.round(stats.revenue.collection_rate || 0) }}%
              </p>
            </div>
          </div>
        </div>

        <!-- جدول الإيرادات الشهرية -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            {{ $t('reports.monthlyRevenue') }}
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('common.month') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.invoicesCount') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.totalAmount') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.collectedAmount') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.outstandingAmount') }}
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
              <p class="text-sm text-gray-500">{{ $t('reports.overdueInvoices') }}</p>
              <p class="text-3xl font-bold text-red-600">{{ stats.overdue.total_overdue || 0 }}</p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.totalOverdueAmount') }}</p>
              <p class="text-3xl font-bold text-red-600">
                {{ formatCurrency(stats.overdue.total_amount) }}
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-6">
            <div class="text-center">
              <p class="text-sm text-gray-500">{{ $t('reports.averageDaysOverdue') }}</p>
              <p class="text-3xl font-bold text-red-600">
                {{ Math.round(stats.overdue.average_days_overdue || 0) }} {{ $t('common.days') }}
              </p>
            </div>
          </div>
        </div>

        <!-- جدول الفواتير المتأخرة -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ $t('reports.overdueInvoicesList') }}
            </h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('invoices.invoiceNumber') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('clients.title') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('invoices.dueDate') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('reports.daysOverdue') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('common.amount') }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    {{ $t('common.actions') }}
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
                    {{ invoice.days_overdue || 0 }} {{ $t('common.days') }}
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
                      {{ $t('reports.sendReminder') }}
                    </button>
                    <button
                      @click="markAsPaid(invoice.id)"
                      class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      <i class="fas fa-check ml-1"></i>
                      {{ $t('reports.markAsPaid') }}
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
        <p class="text-gray-500">{{ $t('reports.noInvoices') }}</p>
      </div>
      <div v-if="activeTab === 'clients' && reports.clients.length === 0" class="text-center py-12">
        <i class="fas fa-users text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">{{ $t('reports.noClients') }}</p>
      </div>
      <div v-if="activeTab === 'revenue' && reports.revenue.length === 0" class="text-center py-12">
        <i class="fas fa-chart-line text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">{{ $t('reports.noRevenue') }}</p>
      </div>
      <div v-if="activeTab === 'overdue' && reports.overdue.length === 0" class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">{{ $t('reports.noOverdue') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from '@/api/axios'

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
        this.$toast.success(this.$t('messages.reportLoaded'))
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failedToLoadReport'))
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
        this.$toast.success(this.$t('messages.reportExported'))
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failedToExportReport'))
      }
    },

    // إعادة تعيين الفلاتر
    resetFilters() {
      this.resetFilters()
      this.loadReport()
      this.$toast.info(this.$t('messages.filtersReset'))
    },

    // تحميل العملاء للفلتر
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
        console.error(this.$t('errors.failedToLoadClients'), error)
        this.clients = []
      }
    },

    // إرسال تذكير
    async sendReminder(invoiceId) {
      if (confirm(this.$t('reports.confirmSendReminder'))) {
        try {
          await this.sendReminder(invoiceId)
          this.$toast.success(this.$t('messages.reminderSent'))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failedToSendReminder'))
        }
      }
    },

    // تسديد فاتورة
    async markAsPaid(invoiceId) {
      if (confirm(this.$t('reports.confirmMarkAsPaid'))) {
        try {
          await this.markAsPaid(invoiceId)
          this.$toast.success(this.$t('messages.invoicePaid'))
          // تحديث تقرير المتأخرات
          setTimeout(() => {
            this.getOverdueReport()
          }, 1000)
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failedToMarkAsPaid'))
        }
      }
    },

    // تنسيق العملات
    formatCurrency(amount) {
      if (!amount && amount !== 0) return `0.00 ${this.$t('common.currency')}`
      return parseFloat(amount).toFixed(2) + ` ${this.$t('common.currency')}`
    },

    // تنسيق التاريخ
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString(this.$i18n.locale)
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
      return this.$t(`invoices.status.${status}`) || status
    },
  },
}
</script>
