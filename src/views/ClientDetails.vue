<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              {{ $t('clients.clientDetails') }}
            </h1>
            <p class="text-gray-600 mt-2">
              {{ $t('clients.clientDetailsDescription') }}
            </p>
          </div>
          <router-link
            to="/clients"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            {{ $t('common.backToClients') }}
          </router-link>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Client Details -->
      <div v-else-if="client" class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-xl font-semibold">
              {{ getInitials(client.name) }}
            </span>
          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ client.name }}</h2>
            <p class="text-gray-600">{{ client.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Contact -->
          <div>
            <h3 class="font-semibold mb-4">{{ $t('clients.contactInfo') }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Email:</span>
                <span>{{ client.email || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Phone:</span>
                <span>{{ client.phone || '-' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Address:</span>
                <span>{{ client.address || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div>
            <h3 class="font-semibold mb-4">{{ $t('clients.stats') }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>{{ $t('clients.totalInvoices') }}:</span>
                <span>{{ stats.totalInvoices }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('clients.paidInvoices') }}:</span>
                <span>{{ stats.paidInvoices }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('clients.overdueInvoices') }}:</span>
                <span>{{ stats.overdueInvoices }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <button class="px-4 py-2 text-gray-700" @click="$router.push('/clients')">
            {{ $t('common.back') }}
          </button>

          <button
            v-if="$store.getters['auth/hasPermission']('edit_client')"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg"
            @click="editClient"
          >
            <i class="fas fa-edit mr-2"></i>
            {{ $t('common.edit') }}
          </button>
        </div>
      </div>

      <!-- Invoices -->
      <div v-if="clientInvoices.length" class="bg-white shadow rounded-lg">
        <table class="w-full">
          <tbody>
            <tr v-for="invoice in clientInvoices" :key="invoice.id" class="border-b">
              <td class="p-4">{{ invoice.invoice_number }}</td>
              <td class="p-4">{{ formatDate(invoice.issue_date) }}</td>
              <td class="p-4">{{ formatCurrency(invoice.total_amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="client && !loading" class="bg-white p-8 text-center rounded-lg">
        <p class="text-gray-500">لا توجد فواتير لهذا العميل</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientDetails',
  data() {
    return {
      client: null,
      clientInvoices: [],
      loading: true,
      stats: {
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
      },
    }
  },
  methods: {
    getInitials(name) {
      return name ? name.substring(0, 2).toUpperCase() : '?'
    },
    formatDate(date) {
      return date ? new Date(date).toLocaleDateString('ar-SA') : '-'
    },
    formatCurrency(amount) {
      return `${parseFloat(amount || 0).toFixed(2)} ر.س`
    },
    editClient() {
      this.$router.push(`/clients/${this.client.id}/edit`)
    },
    async loadClientDetails() {
      try {
        const id = this.$route.params.id
        this.client = await this.$store.dispatch('clients/fetchClient', id)
        await this.$store.dispatch('invoices/fetchInvoices')

        const invoices =
          this.$store.state.invoices.invoices?.data || this.$store.state.invoices.invoices || []

        this.clientInvoices = invoices.filter((i) => i.client_id === this.client.id)

        this.stats.totalInvoices = this.clientInvoices.length
        this.stats.paidInvoices = this.clientInvoices.filter((i) => i.status === 'paid').length
        this.stats.overdueInvoices = this.clientInvoices.filter(
          (i) => i.status === 'overdue',
        ).length
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.loadClientDetails()
  },
}
</script>
