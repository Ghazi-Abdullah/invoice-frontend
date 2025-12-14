<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('invoices.create') }}</h1>
          <p class="text-gray-600 mt-2">{{ $t('invoices.createDescription') }}</p>
        </div>
        <div>
          <router-link
            to="/invoices"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            {{ $t('common.back') }}
          </router-link>
        </div>
      </div>

      <!-- Invoice Form -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <form @submit.prevent="createInvoice">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Client Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('invoices.client') }} *
              </label>
              <select
                v-model="invoiceData.client_id"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{{ $t('common.selectClient') }}</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }} - {{ client.company_name || client.email }}
                </option>
              </select>
            </div>

            <!-- Invoice Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('invoices.invoiceNumber') }} *
              </label>
              <input
                v-model="invoiceData.invoice_number"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="$t('invoices.invoiceNumberPlaceholder')"
              />
            </div>

            <!-- Issue Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('invoices.issueDate') }} *
              </label>
              <input
                v-model="invoiceData.issue_date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('invoices.dueDate') }} *
              </label>
              <input
                v-model="invoiceData.due_date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Invoice Items -->
          <div class="mb-8">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('invoices.items') }}</h3>
              <button
                type="button"
                @click="addItem"
                class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                <i class="fas fa-plus mr-2"></i> {{ $t('invoices.addItem') }}
              </button>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ $t('common.description') }}
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ $t('common.quantity') }}
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ $t('common.unitPrice') }}
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ $t('common.total') }}
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ $t('common.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in invoiceData.items" :key="index">
                    <td class="px-6 py-4">
                      <input
                        type="text"
                        v-model="item.description"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        :placeholder="$t('invoices.itemDescription')"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        type="number"
                        v-model="item.quantity"
                        min="1"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @input="calculateItemTotal(index)"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <input
                        type="number"
                        v-model="item.unit_price"
                        min="0"
                        step="0.01"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        @input="calculateItemTotal(index)"
                      />
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-medium">{{ calculateItemTotal(index) }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <button
                        type="button"
                        @click="removeItem(index)"
                        class="text-red-600 hover:text-red-900"
                        :disabled="invoiceData.items.length === 1"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right font-medium">
                      {{ $t('common.subtotal') }}:
                    </td>
                    <td colspan="2" class="px-6 py-4 font-bold text-lg">
                      {{ calculateSubtotal() }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right font-medium">
                      {{ $t('common.tax') }} (15%):
                    </td>
                    <td colspan="2" class="px-6 py-4 font-bold">
                      {{ calculateTax() }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right font-medium">
                      {{ $t('common.total') }}:
                    </td>
                    <td colspan="2" class="px-6 py-4 font-bold text-xl text-blue-600">
                      {{ calculateTotal() }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Notes -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('common.notes') }}
            </label>
            <textarea
              v-model="invoiceData.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :placeholder="$t('invoices.notesPlaceholder')"
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <router-link
              to="/invoices"
              class="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              {{ $t('common.cancel') }}
            </router-link>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <span v-if="loading">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                {{ $t('common.creating') }}
              </span>
              <span v-else>
                <i class="fas fa-save mr-2"></i>
                {{ $t('common.create') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateInvoice',
  data() {
    return {
      loading: false,
      clients: [],
      invoiceData: {
        client_id: '',
        invoice_number: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
            total: 0,
          },
        ],
        notes: '',
      },
    }
  },
  computed: {
    isFormValid() {
      return (
        this.invoiceData.client_id &&
        this.invoiceData.invoice_number &&
        this.invoiceData.issue_date &&
        this.invoiceData.due_date &&
        this.invoiceData.items.every(
          (item) => item.description && item.quantity > 0 && item.unit_price >= 0,
        )
      )
    },
  },
  mounted() {
    this.loadClients()
  },
  methods: {
    async loadClients() {
      try {
        await this.$store.dispatch('clients/fetchClients')
        this.clients = this.$store.getters['clients/clients']
      } catch (error) {
        this.$toast.error(this.$t('common.loadError'))
      }
    },
    addItem() {
      this.invoiceData.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
      })
    },
    removeItem(index) {
      if (this.invoiceData.items.length > 1) {
        this.invoiceData.items.splice(index, 1)
        this.calculateTotals()
      }
    },
    calculateItemTotal(index) {
      const item = this.invoiceData.items[index]
      if (item.quantity && item.unit_price) {
        item.total = parseFloat(item.quantity) * parseFloat(item.unit_price)
      } else {
        item.total = 0
      }
      this.calculateTotals()
      return item.total.toFixed(2)
    },
    calculateSubtotal() {
      return this.invoiceData.items.reduce((sum, item) => sum + (item.total || 0), 0).toFixed(2)
    },
    calculateTax() {
      const subtotal = parseFloat(this.calculateSubtotal())
      return (subtotal * 0.15).toFixed(2)
    },
    calculateTotal() {
      const subtotal = parseFloat(this.calculateSubtotal())
      const tax = parseFloat(this.calculateTax())
      return (subtotal + tax).toFixed(2)
    },
    calculateTotals() {
      // Update the invoice data with calculated totals
      this.invoiceData.subtotal = parseFloat(this.calculateSubtotal())
      this.invoiceData.tax_amount = parseFloat(this.calculateTax())
      this.invoiceData.total_amount = parseFloat(this.calculateTotal())
    },
    async createInvoice() {
      this.loading = true
      try {
        // Prepare data for API
        const data = {
          ...this.invoiceData,
          items: this.invoiceData.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
          })),
        }

        await this.$store.dispatch('invoices/createInvoice', data)
        this.$toast.success(this.$t('invoices.createSuccess'))
        this.$router.push('/invoices')
      } catch (error) {
        this.$toast.error(error.message || this.$t('invoices.createError'))
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
