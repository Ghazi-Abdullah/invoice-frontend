<template>
  <div class="min-h-screen bg-gray-50/30">
    <!-- قسم التصحيح الموسع (يمكن إزالته لاحقاً) -->
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-blue-800">🔍 معلومات التصحيح التفصيلية</h3>
          <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span class="font-medium">Loading:</span>
              <span :class="loading ? 'text-red-600' : 'text-green-600'">
                {{ loading }}
              </span>
            </div>
            <div>
              <span class="font-medium">Error:</span>
              <span class="text-red-600">{{ error || 'None' }}</span>
            </div>
            <div>
              <span class="font-medium">عدد العملاء:</span>
              <span :class="filteredClients.length > 0 ? 'text-green-600' : 'text-red-600'">
                {{ filteredClients.length }}
              </span>
            </div>
            <div>
              <span class="font-medium">Has Permission:</span>
              <span :class="hasPermission('view_clients') ? 'text-green-600' : 'text-red-600'">
                {{ hasPermission('view_clients') }}
              </span>
            </div>
          </div>
        </div>
        <button
          @click="forceReload"
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          إعادة تحميل
        </button>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center space-x-4">
            <div
              class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/25"
            >
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">العملاء</h1>
              <p class="text-gray-600 mt-1">إدارة قاعدة عملائك بسهولة</p>
            </div>
          </div>
          <div class="mt-4 sm:mt-0">
            <button
              v-if="hasPermission('create_client')"
              @click="$router.push('/clients/create')"
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
              إضافة عميل جديد
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div class="flex-1">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="ابحث باسم العميل أو البريد أو الهاتف..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="mt-4 md:mt-0 flex space-x-2">
            <button
              @click="loadClients"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              تحديث
            </button>
            <button
              @click="exportClients"
              class="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              تصدير
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">جاري تحميل العملاء...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="loadClients"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>

      <!-- No Clients State -->
      <div
        v-else-if="!loading && filteredClients.length === 0 && searchQuery === ''"
        class="text-center py-12"
      >
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا يوجد عملاء</h3>
        <p class="text-gray-500 mb-4">لم يتم إضافة أي عملاء بعد</p>
        <button
          v-if="hasPermission('create_client')"
          @click="$router.push('/clients/create')"
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
          إضافة عميل جديد
        </button>
      </div>

      <!-- No Search Results -->
      <div
        v-else-if="!loading && filteredClients.length === 0 && searchQuery !== ''"
        class="text-center py-12"
      >
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
        <p class="text-gray-500 mb-4">لم يتم العثور على عملاء تطابق البحث "{{ searchQuery }}"</p>
        <button
          @click="searchQuery = ''"
          class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          عرض جميع العملاء
        </button>
      </div>

      <!-- Clients Table -->
      <div v-else class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  العميل
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  البريد الإلكتروني
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الهاتف
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الشركة
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
              <tr v-for="client in filteredClients" :key="client.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                      >
                        <span class="text-blue-600 font-semibold">{{
                          getInitials(client.name)
                        }}</span>
                      </div>
                    </div>
                    <div class="mr-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ client.name }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ client.tax_number ? `الرقم الضريبي: ${client.tax_number}` : '' }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ client.email || 'غير متوفر' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ client.phone || 'غير متوفر' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ client.company_name || 'غير متوفر' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="
                      client.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ client.status === 'active' ? 'نشط' : 'غير نشط' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="viewClient(client)"
                    class="text-blue-600 hover:text-blue-900"
                    title="عرض التفاصيل"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('edit_client')"
                    @click="editClient(client)"
                    class="text-green-600 hover:text-green-900"
                    title="تعديل"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('delete_client')"
                    @click="confirmDelete(client)"
                    class="text-red-600 hover:text-red-900"
                    title="حذف"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination.total > pagination.per_page"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="pagination.current_page === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              السابق
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.current_page === pagination.last_page"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                عرض
                <span class="font-medium">{{ pagination.from }}</span>
                إلى
                <span class="font-medium">{{ pagination.to }}</span>
                من
                <span class="font-medium">{{ pagination.total }}</span>
                نتيجة
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="pagination.current_page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">السابق</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  v-for="page in pages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === pagination.current_page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="pagination.current_page === pagination.last_page"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">التالي</span>
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Clients',
  data() {
    return {
      loading: false,
      error: null,
      searchQuery: '',
      currentPage: 1,
      perPage: 10,
    }
  },
  computed: {
    clients() {
      const clients = this.$store.getters['clients/clients']
      console.log('📊 Clients from store:', clients)
      return clients || []
    },
    pagination() {
      return (
        this.$store.getters['clients/pagination'] || {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
          from: 0,
          to: 0,
        }
      )
    },
    filteredClients() {
      if (!this.searchQuery.trim()) {
        return this.clients
      }
      const query = this.searchQuery.toLowerCase()
      return this.clients.filter((client) => {
        return (
          (client.name && client.name.toLowerCase().includes(query)) ||
          (client.email && client.email.toLowerCase().includes(query)) ||
          (client.phone && client.phone.includes(query)) ||
          (client.company_name && client.company_name.toLowerCase().includes(query)) ||
          (client.address && client.address.toLowerCase().includes(query))
        )
      })
    },
    pages() {
      const pages = []
      const totalPages = this.pagination.last_page || 1
      const currentPage = this.pagination.current_page || 1

      // إظهار 5 أرقام صفحات كحد أقصى
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, startPage + 4)

      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      return pages
    },
  },
  mounted() {
    this.loadClients()
  },
  methods: {
    hasPermission(permission) {
      // إذا كان المستخدم مديراً، لديه جميع الصلاحيات
      if (this.$store.state.auth.is_admin) {
        return true
      }

      // التحقق من الصلاحيات المخزنة في state
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
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

    async loadClients() {
      this.loading = true
      this.error = null
      console.log('🚀 جلب العملاء...')

      try {
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          search: this.searchQuery,
        }

        console.log('📋 معلمات الجلب:', params)

        await this.$store.dispatch('clients/fetchClients', params)

        console.log('✅ تم جلب العملاء بنجاح')
        console.log('📊 عدد العملاء المحملة:', this.clients.length)
        console.log('📊 معلومات التصفح:', this.pagination)
      } catch (error) {
        console.error('❌ خطأ في جلب العملاء:', error)
        this.error = error.message || 'حدث خطأ في جلب بيانات العملاء'

        // إظهار رسالة للمستخدم
        if (typeof this.$toast !== 'undefined') {
          this.$toast.error(this.error)
        }
      } finally {
        this.loading = false
      }
    },

    forceReload() {
      console.log('🔄 إعادة تحميل قسرية...')
      this.currentPage = 1
      this.searchQuery = ''
      this.loadClients()
    },

    async refreshClients() {
      await this.loadClients()
      if (typeof this.$toast !== 'undefined') {
        this.$toast.success('تم تحديث البيانات بنجاح')
      }
    },

    exportClients() {
      // TODO: تنفيذ تصدير العملاء
      console.log('📤 تصدير العملاء...')
      if (typeof this.$toast !== 'undefined') {
        this.$toast.info('سيتم تنفيذ التصدير قريباً')
      }
    },

    viewClient(client) {
      this.$router.push(`/clients/${client.id}`)
    },

    editClient(client) {
      this.$router.push(`/clients/${client.id}/edit`)
    },

    confirmDelete(client) {
      if (confirm(`هل أنت متأكد من حذف العميل "${client.name}"؟`)) {
        this.deleteClient(client.id)
      }
    },

    async deleteClient(id) {
      this.loading = true
      try {
        await this.$store.dispatch('clients/deleteClient', id)

        if (typeof this.$toast !== 'undefined') {
          this.$toast.success('تم حذف العميل بنجاح')
        }

        // إعادة تحميل القائمة
        await this.loadClients()
      } catch (error) {
        console.error('❌ خطأ في حذف العميل:', error)

        if (typeof this.$toast !== 'undefined') {
          this.$toast.error(error.message || 'حدث خطأ في حذف العميل')
        }
      } finally {
        this.loading = false
      }
    },

    previousPage() {
      if (this.pagination.current_page > 1) {
        this.currentPage = this.pagination.current_page - 1
        this.loadClients()
      }
    },

    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.currentPage = this.pagination.current_page + 1
        this.loadClients()
      }
    },

    goToPage(page) {
      this.currentPage = page
      this.loadClients()
    },
  },
  watch: {
    searchQuery() {
      // البحث بعد توقف الكتابة
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.loadClients()
      }, 500)
    },
  },
  beforeUnmount() {
    clearTimeout(this.searchTimeout)
  },
}
</script>

<style scoped>
/* تنسيقات إضافية */
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
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
</style>
