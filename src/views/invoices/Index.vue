<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">الفواتير</h1>
            <p class="text-gray-600 mt-2">إدارة جميع فواتيرك في مكان واحد</p>
          </div>
          <div class="mt-4 md:mt-0">
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

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg mr-4">
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
            <div>
              <p class="text-sm font-medium text-gray-600">إجمالي الفواتير</p>
              <p class="text-2xl font-bold text-gray-900">{{ invoiceStats.total }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg mr-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">مدفوعة</p>
              <p class="text-2xl font-bold text-gray-900">{{ invoiceStats.paid }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-yellow-100 rounded-lg mr-4">
              <svg
                class="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">مرسلة</p>
              <p class="text-2xl font-bold text-gray-900">{{ invoiceStats.sent }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-red-100 rounded-lg mr-4">
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">متأخرة</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ invoiceStats.overdue }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-4 border-b border-gray-200">
          <div
            class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
          >
            <div
              class="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4"
            >
              <!-- Status Filter -->
              <select
                v-model="filters.status"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @change="applyFilters"
              >
                <option value="">جميع الحالات</option>
                <option value="draft">مسودة</option>
                <option value="sent">مرسلة</option>
                <option value="paid">مدفوعة</option>
                <option value="overdue">متأخرة</option>
              </select>

              <!-- Date Filter -->
              <select
                v-model="filters.date"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @change="applyFilters"
              >
                <option value="">جميع التواريخ</option>
                <option value="this_month">هذا الشهر</option>
                <option value="last_month">الشهر الماضي</option>
                <option value="this_year">هذه السنة</option>
              </select>
            </div>

            <!-- Search -->
            <div class="relative w-full md:w-64">
              <input
                type="text"
                v-model="filters.search"
                @input="onSearchInput"
                placeholder="بحث برقم الفاتورة أو اسم العميل..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoices Table -->
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
                  العميل
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  التاريخ
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
              <tr v-if="loading">
                <td colspan="7" class="px-6 py-8 text-center">
                  <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="mr-3 text-gray-600">جاري التحميل...</span>
                  </div>
                </td>
              </tr>

              <tr v-else-if="!hasInvoices && !loading">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  <svg
                    class="w-12 h-12 text-gray-400 mx-auto mb-4"
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
                  <p class="text-lg text-gray-600 mb-2">لا توجد فواتير</p>
                  <p class="text-gray-500 text-sm mb-4">ابدأ بإنشاء فاتورتك الأولى</p>
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
                </td>
              </tr>

              <tr v-else v-for="invoice in invoices" :key="invoice.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</div>
                  <div class="text-sm text-gray-500">#{{ invoice.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                    >
                      <span class="text-blue-600 text-xs font-semibold">
                        {{ getInitials(invoice.client?.name) }}
                      </span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ invoice.client?.name || 'غير محدد' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ invoice.client?.email || 'غير محدد' }}
                      </div>
                    </div>
                  </div>
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
                  <div class="flex items-center space-x-2 space-x-reverse">
                    <router-link
                      :to="`/invoices/${invoice.id}`"
                      class="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="عرض"
                    >
                      عرض
                    </router-link>
                    <router-link
                      :to="`/invoices/${invoice.id}/edit`"
                      class="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 transition-colors"
                      title="تعديل"
                    >
                      تعديل
                    </router-link>
                    <button
                      @click="deleteInvoice(invoice)"
                      class="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      title="حذف"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="hasInvoices" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between items-center">
              <button
                :disabled="paginationInfo.currentPage <= 1"
                @click="changePage(paginationInfo.currentPage - 1)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                  paginationInfo.currentPage > 1
                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed',
                ]"
              >
                السابق
              </button>

              <span class="text-sm text-gray-700">
                صفحة
                <span class="font-medium">{{ paginationInfo.currentPage }}</span>
                من
                <span class="font-medium">{{ paginationInfo.lastPage }}</span>
              </span>

              <button
                :disabled="paginationInfo.currentPage >= paginationInfo.lastPage"
                @click="changePage(paginationInfo.currentPage + 1)"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                  paginationInfo.currentPage < paginationInfo.lastPage
                    ? 'text-gray-700 bg-white hover:bg-gray-50'
                    : 'text-gray-400 bg-gray-100 cursor-not-allowed',
                ]"
              >
                التالي
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
  name: 'InvoicesIndex',

  data() {
    return {
      filters: {
        status: '',
        date: '',
        search: '',
      },
      searchTimeout: null,
      loading: false,
    }
  },

  computed: {
    invoiceStats() {
      return (
        this.$store.getters['invoices/stats'] || {
          total: 0,
          paid: 0,
          sent: 0,
          overdue: 0,
        }
      )
    },

    hasInvoices() {
      const invoices = this.$store.getters['invoices/invoices']
      return invoices && invoices.length > 0
    },

    paginationInfo() {
      return (
        this.$store.state.invoices.pagination || {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 0,
        }
      )
    },

    invoices() {
      const invoices = this.$store.getters['invoices/invoices']
      return Array.isArray(invoices) ? invoices : []
    },

    storeLoading() {
      return this.$store.state.invoices.loading || false
    },
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('ar-SA')
    },

    formatCurrency(amount) {
      if (!amount) return '0.00 ر.س'
      return (
        new Intl.NumberFormat('ar-SA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + ' ر.س'
      )
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
      const baseClasses = 'inline-flex px-3 py-1 text-xs font-semibold rounded-full'
      const statusClasses = {
        draft: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
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

    async fetchInvoices(page = 1) {
      this.loading = true
      try {
        const params = {
          page,
          ...this.filters,
        }

        // إزالة الفلاتر الفارغة
        Object.keys(params).forEach((key) => {
          if (params[key] === '' || params[key] === null) {
            delete params[key]
          }
        })

        console.log('🔄 جلب الفواتير:', params)
        await this.$store.dispatch('invoices/fetchInvoices', params)
      } catch (error) {
        console.error('❌ فشل في جلب الفواتير:', error)
        this.$toast.error('فشل في جلب الفواتير')
      } finally {
        this.loading = false
      }
    },

    applyFilters() {
      this.fetchInvoices(1)
    },

    onSearchInput() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.fetchInvoices(1)
      }, 500)
    },

    changePage(page) {
      if (page >= 1 && page <= this.paginationInfo.lastPage) {
        this.fetchInvoices(page)
      }
    },

    async deleteInvoice(invoice) {
      if (confirm(`هل أنت متأكد من حذف الفاتورة "${invoice.invoice_number}"؟`)) {
        try {
          await this.$store.dispatch('invoices/deleteInvoice', invoice.id)
          this.$toast.success('تم حذف الفاتورة بنجاح')
          this.fetchInvoices(this.paginationInfo.currentPage)
        } catch (error) {
          console.error('فشل في حذف الفاتورة:', error)
          this.$toast.error('فشل في حذف الفاتورة')
        }
      }
    },
  },

  mounted() {
    this.fetchInvoices()
  },

  watch: {
    storeLoading(newLoading) {
      this.loading = newLoading
    },
  },
}
</script>
