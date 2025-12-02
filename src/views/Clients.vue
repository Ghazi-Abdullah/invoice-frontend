<template>
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
              <h1 class="text-3xl font-bold text-gray-900">{{ $t('clients.title') }}</h1>
              <p class="text-gray-600 mt-1">{{ $t('clients.subtitle') }}</p>
            </div>
          </div>

          <button
            @click="showClientForm = true"
            class="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>{{ $t('clients.addClient') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- المحتوى الرئيسي -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- حالة الخطأ -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="loadClients()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {{ $t('common.retry') }}
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
        />
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
      searchQuery: '',
      sortBy: 'newest',
      loading: false,
      error: null,
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
  },
  methods: {
    async loadClients() {
      this.loading = true
      this.error = null
      try {
        console.log('🚀 Starting to load clients...')
        await this.$store.dispatch('clients/fetchClients', {
          page: 1,
          per_page: 10,
          search: this.searchQuery,
          sort: this.sortBy,
        })
        console.log('✅ Load clients completed')
      } catch (error) {
        console.error('❌ Failed to load clients:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    forceReload() {
      console.log('🔄 Manual reload triggered')
      this.loadClients()
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
        } catch (error) {
          console.error('❌ Failed to delete client:', error)
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
