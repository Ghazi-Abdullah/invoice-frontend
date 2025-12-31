<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('invoices.create') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('invoices.createDescription') }}</p>
          </div>

          <BaseButton
            type="outline"
            @click="$router.push('/invoices')"
            :icon="['fas', 'arrow-left']"
          >
            {{ $t('common.back') }}
          </BaseButton>
        </div>
      </div>

      <!-- Error Alert -->
      <BaseAlert
        v-if="error"
        type="error"
        title="حدث خطأ"
        :message="error"
        @close="clearError"
        class="mb-6"
      />

      <!-- Invoice Form -->
      <BaseCard>
        <form @submit.prevent="createInvoice" class="space-y-6">
          <!-- Basic Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="invoiceData.invoice_number"
              :label="$t('invoices.invoiceNumber')"
              :placeholder="$t('invoices.invoiceNumberPlaceholder')"
              :error="errors.invoice_number"
            />

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >{{ $t('invoices.client') }} *</label
              >
              <select
                v-model="invoiceData.client_id"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.client_id }"
              >
                <option value="">{{ $t('common.selectClient') }}</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }} - {{ client.company_name || client.email }}
                </option>
              </select>
              <div v-if="errors.client_id" class="mt-1 text-sm text-red-600">
                {{ errors.client_id }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="invoiceData.invoice_date"
              type="date"
              :label="$t('invoices.issueDate')"
              required
              :error="errors.invoice_date"
            />

            <BaseInput
              v-model="invoiceData.due_date"
              type="date"
              :label="$t('invoices.dueDate')"
              required
              :error="errors.due_date"
            />
          </div>

          <!-- Invoice Items -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('invoices.items') }}</h3>
              <BaseButton type="button" @click="addItem" size="sm" :icon="['fas', 'plus']">
                {{ $t('invoices.addItem') }}
              </BaseButton>
            </div>

            <div
              v-for="(item, index) in invoiceData.items"
              :key="index"
              class="mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div class="md:col-span-5">
                  <BaseInput
                    v-model="item.description"
                    :label="$t('common.description')"
                    :placeholder="$t('invoices.itemDescription')"
                    required
                  />
                </div>

                <div class="md:col-span-3">
                  <BaseInput
                    v-model="item.quantity"
                    type="number"
                    min="1"
                    :label="$t('common.quantity')"
                    required
                    @input="calculateItemTotal(index)"
                  />
                </div>

                <div class="md:col-span-3">
                  <BaseInput
                    v-model="item.unit_price"
                    type="number"
                    min="0"
                    step="0.01"
                    :label="$t('common.unitPrice')"
                    required
                    @input="calculateItemTotal(index)"
                  />
                </div>

                <div class="md:col-span-1 flex items-end">
                  <BaseButton
                    type="button"
                    @click="removeItem(index)"
                    size="sm"
                    variant="danger"
                    :icon="['fas', 'trash']"
                    :disabled="invoiceData.items.length === 1"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center mt-3">
                <span class="text-gray-600">
                  {{ $t('common.total') }}:
                  <span class="font-semibold">{{ formatCurrency(item.total || 0) }}</span>
                </span>
              </div>
            </div>

            <!-- Summary -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">{{ $t('common.subtotal') }}:</span>
                <span class="font-semibold">{{ formatCurrency(calculateSubtotal()) }}</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">{{ $t('common.tax') }} (15%):</span>
                <span class="font-semibold">{{ formatCurrency(calculateTax()) }}</span>
              </div>
              <div class="flex justify-between items-center text-lg font-bold">
                <span>{{ $t('common.total') }}:</span>
                <span class="text-primary-600">{{ formatCurrency(calculateTotal()) }}</span>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <BaseInput
            v-model="invoiceData.notes"
            :label="$t('common.notes')"
            :placeholder="$t('invoices.notesPlaceholder')"
            type="textarea"
            rows="3"
          />

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <BaseButton type="outline" @click="$router.push('/invoices')" :disabled="loading">
              {{ $t('common.cancel') }}
            </BaseButton>

            <BaseButton
              type="primary"
              :loading="loading"
              :disabled="loading || !isFormValid"
              :icon="['fas', 'save']"
              html-type="submit"
            >
              {{ $t('common.create') }}
            </BaseButton>
          </div>
        </form>
      </BaseCard>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CreateInvoice',

  data() {
    return {
      invoiceData: {
        client_id: '',
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
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
        tax_amount: 0,
        subtotal: 0,
        total: 0,
      },
      errors: {},
    }
  },

  computed: {
    ...mapGetters('invoices', ['loading', 'error']),
    ...mapGetters('clients', ['clients']),

    isFormValid() {
      return (
        this.invoiceData.client_id &&
        this.invoiceData.invoice_date &&
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
    ...mapActions('invoices', ['createInvoice', 'clearError']),
    ...mapActions('clients', ['fetchClients']),

    async loadClients() {
      try {
        await this.fetchClients({ per_page: 100 })
      } catch (error) {
        console.error('❌ Failed to load clients:', error)
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
      return item.total
    },

    calculateSubtotal() {
      return this.invoiceData.items.reduce((sum, item) => sum + (item.total || 0), 0)
    },

    calculateTax() {
      const subtotal = this.calculateSubtotal()
      return subtotal * 0.15
    },

    calculateTotal() {
      const subtotal = this.calculateSubtotal()
      const tax = this.calculateTax()
      return subtotal + tax
    },

    calculateTotals() {
      this.invoiceData.subtotal = this.calculateSubtotal()
      this.invoiceData.tax_amount = this.calculateTax()
      this.invoiceData.total = this.calculateTotal()
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ر.س'
      return parseFloat(amount).toFixed(2) + ' ر.س'
    },

    async createInvoice() {
      this.errors = {}

      try {
        // التحقق من البيانات
        if (!this.invoiceData.client_id) {
          this.errors.client_id = 'الرجاء اختيار عميل'
        }

        if (!this.invoiceData.invoice_date) {
          this.errors.invoice_date = 'الرجاء اختيار تاريخ الإصدار'
        }

        if (!this.invoiceData.due_date) {
          this.errors.due_date = 'الرجاء اختيار تاريخ الاستحقاق'
        }

        if (Object.keys(this.errors).length > 0) {
          return
        }

        // إعداد البيانات للإرسال
        const data = {
          client_id: this.invoiceData.client_id,
          invoice_number: this.invoiceData.invoice_number,
          invoice_date: this.invoiceData.invoice_date,
          due_date: this.invoiceData.due_date,
          items: this.invoiceData.items.map((item) => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unit_price: parseFloat(item.unit_price),
          })),
          subtotal: this.invoiceData.subtotal,
          tax_amount: this.invoiceData.tax_amount,
          total: this.invoiceData.total,
          notes: this.invoiceData.notes,
          status: 'draft',
        }

        await this.createInvoice(data)
        this.$toast.success(this.$t('invoices.createSuccess'))
        this.$router.push('/invoices')
      } catch (error) {
        console.error('❌ خطأ في إنشاء الفاتورة:', error)

        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error(error.response?.data?.message || this.$t('invoices.createError'))
        }
      }
    },
  },

  watch: {
    'invoiceData.items': {
      handler() {
        this.calculateTotals()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}
</style>
