<template>
<<<<<<< HEAD
<<<<<<< Updated upstream
  <div class="min-h-screen bg-gray-50/30">
    <!-- قسم التصحيح الموسع -->
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
              <span :class="clientsData.length > 0 ? 'text-green-600' : 'text-red-600'">
                {{ clientsData.length }}
              </span>
            </div>
            <div>
              <span class="font-medium">Has Clients:</span>
              <span :class="hasClients ? 'text-green-600' : 'text-red-600'">
                {{ hasClients }}
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

      <details class="mt-3">
        <summary class="cursor-pointer font-medium text-blue-700">
          عرض البيانات الكاملة من الـ Store
        </summary>
        <div class="mt-2 bg-white p-3 rounded border">
          <pre class="text-xs overflow-auto">{{ JSON.stringify(clientsStore, null, 2) }}</pre>
        </div>
      </details>
    </div>

    <!-- باقي محتوى الصفحة -->
=======
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
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
=======
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{ $t('clients.title') }}</h1>
        <p class="text-gray-600 mt-1">{{ $t('clients.subtitle') }}</p>
      </div>
      <div class="flex space-x-3">
        <button
          v-if="$store.getters['auth/hasPermission']('create_client')"
          @click="$router.push('/clients/create')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> {{ $t('clients.create') }}
        </button>
      </div>
    </div>
>>>>>>> Stashed changes

    <!-- Search and Filter -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
        <div class="flex-1">
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('common.search')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mt-4 md:mt-0">
          <button
            @click="refreshClients"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
          >
<<<<<<< Updated upstream
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
<<<<<<< HEAD
            <span>{{ $t('clients.addClient') }}</span>
=======
            <i class="fas fa-redo-alt mr-2"></i> {{ $t('common.refresh') }}
>>>>>>> Stashed changes
=======
            <span>إضافة عميل جديد</span>
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
          </button>
        </div>
      </div>
    </div>

<<<<<<< Updated upstream
    <!-- المحتوى الرئيسي -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">جاري التحميل...</p>
      </div>

      <!-- حالة الخطأ -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="loadClients()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>

      <!-- حالة عدم وجود عملاء -->
      <div v-else-if="!loading && clientsData.length === 0" class="text-center py-12">
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
          @click="showClientForm = true"
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

      <!-- قائمة العملاء -->
      <div v-else>
        <ClientList
          :clients="clientsData"
          :loading="loading"
          @edit="handleEditClient"
          @delete="handleDeleteClient"
          @view="handleViewClient"
          @add="showClientForm = true"
        />
      </div>
=======
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
>>>>>>> Stashed changes
    </div>

    <!-- Clients Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="filteredClients.length === 0" class="text-center py-12">
        <i class="fas fa-users text-gray-300 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('clients.noClients') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('clients.noClientsMessage') }}</p>
        <button
          v-if="$store.getters['auth/hasPermission']('create_client')"
          @click="$router.push('/clients/create')"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          <i class="fas fa-plus mr-2"></i> {{ $t('clients.create') }}
        </button>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('clients.name') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('auth.email') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('clients.phone') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('clients.company') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('common.status') }}
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ $t('common.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="client in filteredClients" :key="client.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="text-blue-600 font-semibold">{{ getInitials(client.name) }}</span>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ client.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ client.email || $t('common.notAvailable') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ client.phone || $t('common.notAvailable') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ client.company_name || $t('common.notAvailable') }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {{ $t('common.active') }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="$router.push(`/clients/${client.id}`)"
                class="text-blue-600 hover:text-blue-900 mr-3"
              >
                <i class="fas fa-eye mr-1"></i> {{ $t('common.view') }}
              </button>
              <button
                v-if="$store.getters['auth/hasPermission']('edit_client')"
                @click="$router.push(`/clients/${client.id}/edit`)"
                class="text-green-600 hover:text-green-900 mr-3"
              >
                <i class="fas fa-edit mr-1"></i> {{ $t('common.edit') }}
              </button>
              <button
                v-if="$store.getters['auth/hasPermission']('delete_client')"
                @click="confirmDeleteClient(client)"
                class="text-red-600 hover:text-red-900"
              >
                <i class="fas fa-trash mr-1"></i> {{ $t('common.delete') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div
        v-if="pagination.total > pagination.per_page"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      >
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="previousPage"
            :disabled="pagination.current_page === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {{ $t('common.previous') }}
          </button>
          <button
            @click="nextPage"
            :disabled="pagination.current_page === pagination.last_page"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {{ $t('common.next') }}
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              {{ $t('common.showing') }}
              <span class="font-medium">{{ pagination.from }}</span>
              {{ $t('common.to') }}
              <span class="font-medium">{{ pagination.to }}</span>
              {{ $t('common.of') }}
              <span class="font-medium">{{ pagination.total }}</span>
              {{ $t('common.results') }}
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="previousPage"
                :disabled="pagination.current_page === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span class="sr-only">{{ $t('common.previous') }}</span>
                <i class="fas fa-chevron-left"></i>
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
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span class="sr-only">{{ $t('common.next') }}</span>
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
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
      searchQuery: '',
      currentPage: 1,
      perPage: 10,
    }
  },
  computed: {
<<<<<<< HEAD
<<<<<<< Updated upstream
    clientsStore() {
      return this.$store.state.clients
    },

=======
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
    clientsData() {
      console.log('📊 Accessing clients data from store...')
      const clients = this.$store.state.clients.clients
      console.log('📊 Raw clients data:', clients)

      if (Array.isArray(clients)) {
        console.log('✅ Found clients as array:', clients)
        return clients
      }

      console.log('❌ No clients found or not an array')
      return []
=======
    clients() {
      return this.$store.getters['clients/clients']
    },
    pagination() {
      return this.$store.getters['clients/pagination'] || {}
    },
    filteredClients() {
      if (!this.searchQuery) {
        return this.clients
      }
      const query = this.searchQuery.toLowerCase()
      return this.clients.filter((client) => {
        return (
          (client.name && client.name.toLowerCase().includes(query)) ||
          (client.email && client.email.toLowerCase().includes(query)) ||
          (client.phone && client.phone.includes(query)) ||
          (client.company_name && client.company_name.toLowerCase().includes(query))
        )
      })
    },
    pages() {
      const pages = []
      const totalPages = this.pagination.last_page || 1
      const currentPage = this.pagination.current_page || 1

      // Show maximum 5 page buttons
      let startPage = Math.max(1, currentPage - 2)
      let endPage = Math.min(totalPages, startPage + 4)

      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4)
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      return pages
>>>>>>> Stashed changes
    },
  },
  mounted() {
    this.loadClients()
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
    async loadClients() {
      this.loading = true
<<<<<<< Updated upstream
      this.error = null
      console.log('🚀 Starting to load clients...')

      try {
        await this.$store.dispatch('clients/fetchClients')
        console.log('✅ Load clients completed')

        // التحقق من البيانات بعد التحميل
        console.log('📋 After loading - clients:', this.$store.state.clients.clients)
        console.log('📋 After loading - loading state:', this.$store.state.clients.loading)
      } catch (error) {
        console.error('❌ Failed to load clients:', error)
<<<<<<< HEAD
        this.error = error.message
=======
      try {
        await this.$store.dispatch('clients/fetchClients')
      } catch (error) {
        this.$toast.error(this.$t('common.loadError'))
>>>>>>> Stashed changes
=======
        if (error.response) {
          console.error('❌ Error response:', error.response.data)
          console.error('❌ Error status:', error.response.status)
        }
        this.error = error.message || 'فشل في تحميل العملاء'
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
      } finally {
        this.loading = false
      }
    },
<<<<<<< Updated upstream

    handleEditClient(client) {
      this.editingClient = client
      this.showClientForm = true
    },

    handleViewClient(client) {
      this.$router.push(`/clients/${client.id}`)
    },

    async handleDeleteClient(client) {
      if (confirm(`هل أنت متأكد من حذف العميل "${client.name}"؟`)) {
        try {
          await this.$store.dispatch('clients/deleteClient', client.id)
          this.$toast.success('تم حذف العميل بنجاح')
          this.loadClients() // إعادة تحميل القائمة
        } catch (error) {
          console.error('❌ Failed to delete client:', error)
          this.$toast.error('فشل في حذف العميل')
        }
=======
    async refreshClients() {
      await this.loadClients()
      this.$toast.success(this.$t('common.refreshed'))
    },
    confirmDeleteClient(client) {
      if (confirm(this.$t('common.confirmDelete'))) {
        this.deleteClient(client.id)
>>>>>>> Stashed changes
      }
    },
    async deleteClient(id) {
      this.loading = true
      try {
        await this.$store.dispatch('clients/deleteClient', id)
        this.$toast.success(this.$t('clients.deleteSuccess'))
      } catch (error) {
        this.$toast.error(error.message || this.$t('common.deleteError'))
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
      this.$toast.success('تم حفظ العميل بنجاح')
    },
  },
}
</script>
