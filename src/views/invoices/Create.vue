<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('invoices.create') }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('invoices.add_new') }}</p>
      </div>

      <!-- Client Selection Card -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ $t('clients.choose_client') }}</h2>

        <div v-if="clientsLoading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="text-gray-600 mt-2">{{ $t('common.loading') }}</p>
        </div>

        <div
          v-else-if="clients.length === 0"
          class="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"
        >
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
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p class="text-gray-600 mb-4">{{ $t('clients.no_clients') }}</p>
          <router-link
            to="/clients/create"
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
          </router-link>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="client in clients"
            :key="client.id"
            @click="selectClient(client)"
            :class="[
              'border-2 rounded-lg p-4 cursor-pointer transition-all duration-200',
              selectedClient?.id === client.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm',
            ]"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-blue-600 font-semibold text-sm">
                  {{ getInitials(client.name) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 truncate">{{ client.name }}</h3>
                <p class="text-gray-600 text-sm truncate">
                  {{ client.email || $t('clients.noEmail') }}
                </p>
              </div>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              {{ client.phone || $t('clients.notProvided') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Invoice Form -->
      <div v-if="selectedClient" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">{{ $t('invoices.details') }}</h2>

        <form @submit.prevent="submitInvoice">
          <!-- Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('invoices.issue_date') }}
              </label>
              <input
                type="date"
                v-model="form.issue_date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('invoices.due_date') }}
              </label>
              <input
                type="date"
                v-model="form.due_date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <!-- Invoice Items -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">{{ $t('invoices.items') }}</h3>
              <button
                type="button"
                @click="addItem"
                class="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                {{ $t('invoices.add_item') }}
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(item, index) in form.items"
                :key="index"
                class="grid grid-cols-12 gap-4 items-start p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div class="col-span-5">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('invoices.description') }}
                  </label>
                  <input
                    type="text"
                    v-model="item.description"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    :placeholder="$t('invoices.description_placeholder')"
                  />
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('invoices.quantity') }}
                  </label>
                  <input
                    type="number"
                    v-model="item.quantity"
                    min="1"
                    required
                    @input="calculateItemTotal(item)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div class="col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('invoices.unit_price') }}
                  </label>
                  <input
                    type="number"
                    v-model="item.unit_price"
                    min="0"
                    step="0.01"
                    required
                    @input="calculateItemTotal(item)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('invoices.total') }}
                  </label>
                  <p class="px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm font-medium">
                    {{ formatCurrency(item.total) }}
                  </p>
                </div>
                <div class="col-span-1 flex justify-end pt-6">
                  <button
                    type="button"
                    @click="removeItem(index)"
                    class="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                    :title="$t('common.delete')"
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
                </div>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('invoices.notes') }}
            </label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              :placeholder="$t('invoices.notes_placeholder')"
            ></textarea>
          </div>

          <!-- Summary -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">{{ $t('invoices.summary') }}</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">{{ $t('invoices.subtotal') }}:</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(form.subtotal) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">{{ $t('invoices.tax_amount') }} (15%):</span>
                <span class="font-medium text-gray-900">{{ formatCurrency(form.tax_amount) }}</span>
              </div>
              <div class="flex justify-between items-center border-t border-gray-200 pt-3">
                <span class="text-lg font-semibold text-gray-900"
                  >{{ $t('invoices.total_amount') }}:</span
                >
                <span class="text-lg font-bold text-blue-600">{{
                  formatCurrency(form.total_amount)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex items-center justify-end space-x-4"
            :class="{ 'space-x-reverse': $i18n.locale === 'ar' }"
          >
            <router-link
              to="/invoices"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {{ $t('common.cancel') }}
            </router-link>
            <button
              type="submit"
              :disabled="submitting || !isFormValid"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg
                v-if="submitting"
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span>{{ submitting ? $t('common.saving') : $t('invoices.create_invoice') }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- No Client Selected Message -->
      <div
        v-else-if="!clientsLoading && clients.length > 0"
        class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center"
      >
        <svg
          class="w-12 h-12 text-yellow-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <h3 class="text-lg font-medium text-yellow-800 mb-2">{{ $t('common.attention') }}</h3>
        <p class="text-yellow-700">{{ $t('invoices.choose_client_first') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateInvoice',
  data() {
    const today = new Date().toISOString().split('T')[0]
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    return {
      clients: [],
      clientsLoading: false,
      selectedClient: null,
      submitting: false,
      form: {
        client_id: null,
        issue_date: today,
        due_date: dueDate,
        items: [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
            total: 0,
          },
        ],
        notes: '',
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
      },
    }
  },
  computed: {
    isFormValid() {
      if (!this.selectedClient) return false

      // التحقق من أن جميع العناصر مملوءة بشكل صحيح
      const itemsValid = this.form.items.every(
        (item) => item.description.trim() && item.quantity > 0 && item.unit_price >= 0,
      )

      // التحقق من أن التاريخين موجودين
      const datesValid = this.form.issue_date && this.form.due_date

      return itemsValid && datesValid && this.form.items.length > 0
    },
  },
  methods: {
    calculateTotals() {
      const subtotal = this.form.items.reduce((sum, item) => {
        return sum + (parseFloat(item.total) || 0)
      }, 0)

      const tax_amount = subtotal * 0.15
      const total_amount = subtotal + tax_amount

      this.form.subtotal = parseFloat(subtotal.toFixed(2))
      this.form.tax_amount = parseFloat(tax_amount.toFixed(2))
      this.form.total_amount = parseFloat(total_amount.toFixed(2))
    },

    calculateItemTotal(item) {
      const quantity = parseFloat(item.quantity) || 0
      const unitPrice = parseFloat(item.unit_price) || 0
      item.total = parseFloat((quantity * unitPrice).toFixed(2))
      this.calculateTotals()
    },

    addItem() {
      this.form.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
      })
    },

    removeItem(index) {
      if (this.form.items.length > 1) {
        this.form.items.splice(index, 1)
        this.calculateTotals()
      } else {
        // إذا كان العنصر الأخير، نعيد تعيينه بدلاً من حذفه
        this.form.items[0] = {
          description: '',
          quantity: 1,
          unit_price: 0,
          total: 0,
        }
        this.calculateTotals()
      }
    },

    selectClient(client) {
      this.selectedClient = client
      this.form.client_id = client.id
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

    formatCurrency(amount) {
      return (
        new Intl.NumberFormat('ar-SA', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount) + ' ر.س'
      )
    },

    async submitInvoice() {
      if (!this.isFormValid) {
        this.showToast('error', this.$t('messages.fill_all_fields'))
        return
      }

      this.submitting = true
      try {
        const invoiceData = {
          ...this.form,
          items: this.form.items.map((item) => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unit_price: parseFloat(item.unit_price),
          })),
        }

        await this.$store.dispatch('invoices/createInvoice', invoiceData)

        this.showToast('success', this.$t('messages.invoice_created'))
        this.$router.push('/invoices')
      } catch (error) {
        console.error('Failed to create invoice:', error)
        this.showToast('error', error.message || this.$t('messages.create_invoice_error'))
      } finally {
        this.submitting = false
      }
    },

    async loadClients() {
      this.clientsLoading = true
      try {
        await this.$store.dispatch('clients/fetchClients')
        this.clients = this.$store.state.clients.clients.data || []
      } catch (error) {
        console.error('Failed to fetch clients:', error)
        this.showToast('error', this.$t('messages.load_clients_error'))
      } finally {
        this.clientsLoading = false
      }
    },

    showToast(type, message) {
      // استخدام نظام الـ toasts الموجود في المشروع
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: {
            type,
            message,
          },
        }),
      )
    },
  },
  watch: {
    'form.items': {
      handler() {
        this.calculateTotals()
      },
      deep: true,
    },
  },
  mounted() {
    this.loadClients()
    this.calculateTotals() // حساب القيم الأولية
  },
}
</script>
