<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('clients.title') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('clients.subtitle') }}</p>
          </div>
          <div class="mt-4 md:mt-0">
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
              {{ $t('clients.addClient') }}
            </button>
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('clients.stats.total') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ totalClients }}</p>
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">
                {{ $t('clients.stats.newThisMonth') }}
              </p>
              <p class="text-2xl font-bold text-gray-900">{{ newClientsThisMonth }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg mr-4">
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
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('clients.stats.active') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ activeClients }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg mr-4">
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
                  d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">{{ $t('clients.stats.avgInvoices') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ avgInvoicesPerClient }}</p>
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
              <!-- Search -->
              <div class="relative w-full md:w-64">
                <input
                  type="text"
                  v-model="filters.search"
                  @input="onSearchInput"
                  :placeholder="$t('common.search')"
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

              <!-- Sort Filter -->
              <select
                v-model="filters.sort"
                class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                @change="applyFilters"
              >
                <option value="newest">{{ $t('common.sort.newest') }}</option>
                <option value="oldest">{{ $t('common.sort.oldest') }}</option>
                <option value="name_asc">{{ $t('common.sort.nameAsc') }}</option>
                <option value="name_desc">{{ $t('common.sort.nameDesc') }}</option>
              </select>
            </div>

            <div class="text-sm text-gray-500">
              {{ $t('common.showing') }}
              <span class="font-medium">{{ clientsData.length }}</span>
              {{ $t('common.of') }}
              <span class="font-medium">{{ totalClients }}</span>
              {{ $t('clients.title') }}
            </div>
          </div>
        </div>

        <!-- حالة التحميل -->
        <div v-if="loading" class="p-8 text-center">
          <div class="flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="mr-3 text-gray-600">{{ $t('common.loading') }}</span>
          </div>
        </div>

        <!-- حالة الخطأ -->
        <div v-else-if="error" class="p-8 text-center">
          <div class="bg-red-50 border border-red-200 rounded-lg p-6">
            <p class="text-red-600">{{ error }}</p>
            <button
              @click="loadClients()"
              class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {{ $t('common.retry') }}
            </button>
          </div>
        </div>

        <!-- قائمة العملاء -->
        <ClientList
          v-else
          :clients="clientsData"
          :loading="loading"
          @edit="handleEditClient"
          @delete="handleDeleteClient"
          @view="handleViewClient"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="hasClients && !loading"
        class="bg-white px-4 py-3 border-t border-gray-200 rounded-lg shadow"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between items-center">
            <button
              :disabled="!hasPreviousPage"
              @click="changePage(currentPage - 1)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                hasPreviousPage
                  ? 'text-gray-700 bg-white hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed',
              ]"
            >
              {{ $t('common.previous') }}
            </button>

            <span class="text-sm text-gray-700">
              {{ $t('common.page') }}
              <span class="font-medium">{{ currentPage }}</span>
              {{ $t('common.of') }}
              <span class="font-medium">{{ totalPages }}</span>
            </span>

            <button
              :disabled="!hasNextPage"
              @click="changePage(currentPage + 1)"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                hasNextPage
                  ? 'text-gray-700 bg-white hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed',
              ]"
            >
              {{ $t('common.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- نموذج إضافة/تعديل عميل -->
    <ClientForm
      :show="showClientForm"
      :client="editingClient"
      @close="handleCloseForm"
      @saved="handleClientSaved"
    />
  </div>
</template>

<script>
import ClientList from '@/components/clients/ClientList.vue'
import ClientForm from '@/components/clients/ClientForm.vue'

export default {
  name: 'Clients',
  components: {
    ClientList,
    ClientForm,
  },
  data() {
    return {
      showClientForm: false,
      editingClient: null,
      viewingClient: null,
      filters: {
        search: '',
        sort: 'newest',
      },
      searchTimeout: null,
      loading: false,
      error: null,
      currentPage: 1,
      perPage: 10,
    }
  },
  computed: {
    clientsStore() {
      return this.$store.state.clients
    },

    clientsData() {
      console.log('📊 Accessing clients data:', this.$store.state.clients.clients)

      if (
        this.$store.state.clients.clients &&
        this.$store.state.clients.clients.data &&
        Array.isArray(this.$store.state.clients.clients.data)
      ) {
        console.log('✅ Found clients data:', this.$store.state.clients.clients.data)
        return this.$store.state.clients.clients.data
      }

      console.log('❌ No clients data found in expected structure')
      return []
    },

    hasClients() {
      return this.clientsData.length > 0
    },

    totalClients() {
      return this.$store.getters['clients/totalClients'] || 0
    },

    paginationInfo() {
      return (
        this.$store.getters['clients/paginationInfo'] || {
          currentPage: 1,
          lastPage: 1,
          perPage: 10,
          total: 0,
        }
      )
    },

    // إحصائيات تجريبية - يمكن استبدالها ببيانات حقيقية من الـ API
    newClientsThisMonth() {
      return 5
    },

    activeClients() {
      return this.totalClients
    },

    avgInvoicesPerClient() {
      return '2.3'
    },

    totalPages() {
      return this.paginationInfo.lastPage
    },

    hasPreviousPage() {
      return this.currentPage > 1
    },

    hasNextPage() {
      return this.currentPage < this.totalPages
    },
  },
  methods: {
    async loadClients() {
      this.loading = true
      this.error = null
      try {
        console.log('🚀 Starting to load clients...')
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          search: this.filters.search,
          sort: this.filters.sort,
        }

        await this.$store.dispatch('clients/fetchClients', params)
        console.log('✅ Load clients completed')
      } catch (error) {
        console.error('❌ Failed to load clients:', error)
        this.error = error.message || this.$t('common.errors.loadFailed')
      } finally {
        this.loading = false
      }
    },

    async changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        await this.loadClients()
      }
    },

    applyFilters() {
      this.currentPage = 1
      this.loadClients()
    },

    onSearchInput() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 500)
    },

    handleEditClient(client) {
      this.editingClient = client
      this.showClientForm = true
    },

    handleViewClient(client) {
      this.viewingClient = client
    },

    async handleDeleteClient(client) {
      if (confirm(this.$t('clients.deleteConfirm', { name: client.name }))) {
        try {
          await this.$store.dispatch('clients/deleteClient', client.id)
          this.loadClients()
        } catch (error) {
          console.error('❌ Failed to delete client:', error)
          alert(this.$t('common.errors.deleteFailed'))
        }
      }
    },

    handleCloseForm() {
      this.showClientForm = false
      this.editingClient = null
    },

    handleClientSaved() {
      this.handleCloseForm()
      this.loadClients()
    },
  },
  mounted() {
    console.log('🏁 Clients component mounted')
    this.loadClients()
  },
}
</script>
