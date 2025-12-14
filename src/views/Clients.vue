<template>
  <div class="min-h-screen bg-gray-50">
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
            <span>إضافة عميل جديد</span>
          </button>
        </div>
      </div>
    </div>

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
    },
  },
  methods: {
    async loadClients() {
      this.loading = true
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
        if (error.response) {
          console.error('❌ Error response:', error.response.data)
          console.error('❌ Error status:', error.response.status)
        }
        this.error = error.message || 'فشل في تحميل العملاء'
      } finally {
        this.loading = false
      }
    },

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
      }
    },

    handleCloseForm() {
      this.showClientForm = false
      this.editingClient = null
    },

    handleClientSaved() {
      this.handleCloseForm()
      this.loadClients()
      this.$toast.success('تم حفظ العميل بنجاح')
    },
  },
  mounted() {
    console.log('🏁 Clients component mounted')
    this.loadClients()
  },
}
</script>
