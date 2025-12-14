<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('clients.clientDetails') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('clients.clientDetailsDescription') }}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <router-link
              to="/clients"
              class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              {{ $t('common.backToClients') }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- Client Details -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="client" class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="flex items-center space-x-4 mb-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-xl font-semibold">{{ getInitials(client.name) }}</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ client.name }}</h2>
            <p class="text-gray-600">{{ client.email }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              {{ $t('clients.contactInfo') }}
            </h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('auth.email') }}:</span>
                <span class="font-medium">{{ client.email || $t('common.notAvailable') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.phone') }}:</span>
                <span class="font-medium">{{ client.phone || $t('common.notAvailable') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.address') }}:</span>
                <span class="font-medium">{{ client.address || $t('common.notAvailable') }}</span>
              </div>
<<<<<<< Updated upstream
=======
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.company') }}:</span>
                <span class="font-medium">{{
                  client.company_name || $t('common.notAvailable')
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.taxNumber') }}:</span>
                <span class="font-medium">{{
                  client.tax_number || $t('common.notAvailable')
                }}</span>
              </div>
>>>>>>> Stashed changes
            </div>
          </div>

          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('clients.stats') }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.totalInvoices') }}:</span>
                <span class="font-medium">{{ stats.totalInvoices }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.paidInvoices') }}:</span>
                <span class="font-medium">{{ stats.paidInvoices }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.overdueInvoices') }}:</span>
                <span class="font-medium">{{ stats.overdueInvoices }}</span>
              </div>
<<<<<<< Updated upstream
            </div>
          </div>
        </div>
=======
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.registeredAt') }}:</span>
                <span class="font-medium">{{ formatDate(client.created_at) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('clients.updatedAt') }}:</span>
                <span class="font-medium">{{ formatDate(client.updated_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button
            @click="$router.push('/clients')"
            class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            {{ $t('common.back') }}
          </button>
          <button
            v-if="$store.getters['auth/hasPermission']('edit_client')"
            @click="editClient"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i class="fas fa-edit mr-2"></i> {{ $t('common.edit') }}
          </button>
        </div>
>>>>>>> Stashed changes
      </div>

      <!-- Invoices Table -->
      <div v-if="client" class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('clients.clientInvoices') }}</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.invoiceNumber') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.issueDate') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('invoices.dueDate') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('common.amount') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('common.status') }}
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="clientInvoices.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                  لا توجد فواتير لهذا العميل
                </td>
              </tr>
              <tr
                v-else
                v-for="invoice in clientInvoices"
                :key="invoice.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ invoice.invoice_number }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(invoice.issue_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(invoice.due_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ invoice.total_amount }} ر.س
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(invoice.status)">
                    {{ getStatusText(invoice.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link
                    :to="`/invoices/${invoice.id}`"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <i class="fas fa-eye mr-1"></i> {{ $t('common.view') }}
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
<<<<<<< Updated upstream
=======

      <!-- حالة عدم وجود فواتير -->
      <div v-else-if="client && !loading" class="bg-white shadow rounded-lg p-8 text-center">
        <i class="fas fa-file-invoice text-gray-300 text-4xl mb-4"></i>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('clients.noInvoices') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('clients.noInvoicesMessage') }}</p>
        <router-link
          v-if="$store.getters['auth/hasPermission']('create_invoice')"
          to="/invoices/create"
          class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-plus mr-2"></i>
          {{ $t('invoices.create') }}
        </router-link>
      </div>
>>>>>>> Stashed changes
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
      if (!name) return '?'
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ar-SA')
    },

    getStatusText(status) {
      const statusMap = {
        draft: this.$t('invoices.statuses.draft'),
        sent: this.$t('invoices.statuses.sent'),
        paid: this.$t('invoices.statuses.paid'),
        overdue: this.$t('invoices.statuses.overdue'),
      }
      return statusMap[status] || status
    },

    getStatusClasses(status) {
      const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
      const statusClasses = {
        draft: 'bg-yellow-100 text-yellow-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
    },

    async loadClientDetails() {
      this.loading = true
      try {
        const clientId = this.$route.params.id
<<<<<<< Updated upstream

        // Fetch client details
=======
>>>>>>> Stashed changes
        this.client = await this.$store.dispatch('clients/fetchClient', clientId)

        // Fetch all invoices to filter by client
        await this.$store.dispatch('invoices/fetchInvoices')

<<<<<<< Updated upstream
        const allInvoices = this.$store.state.invoices.invoices.data || []
=======
        const allInvoices = this.$store.getters['invoices/invoices'] || []
>>>>>>> Stashed changes
        this.clientInvoices = allInvoices.filter((inv) => inv.client_id === this.client.id)

        // Calculate stats
        this.stats.totalInvoices = this.clientInvoices.length
        this.stats.paidInvoices = this.clientInvoices.filter((inv) => inv.status === 'paid').length
        this.stats.overdueInvoices = this.clientInvoices.filter(
          (inv) => inv.status === 'overdue',
        ).length
      } catch (error) {
        console.error('Failed to load client details:', error)
<<<<<<< Updated upstream
=======
        this.$toast.error(this.$t('common.loadError'))
        this.$router.push('/clients')
>>>>>>> Stashed changes
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
