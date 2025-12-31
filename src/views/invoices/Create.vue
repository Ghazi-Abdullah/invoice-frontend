<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('invoices.create')"
        :subtitle="$t('invoices.createDescription')"
        :breadcrumbs="breadcrumbs"
        :actions="headerActions"
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
              required
              :error="errors.invoice_number"
            />

            <div>
              <label class="form-label">{{ $t('invoices.client') }} *</label>
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
              v-model="invoiceData.issue_date"
              type="date"
              :label="$t('invoices.issueDate')"
              required
              :error="errors.issue_date"
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
              <BaseButton type="button" @click="addItem" size="sm" icon="plus">
                {{ $t('invoices.addItem') }}
              </BaseButton>
            </div>

            <div
              v-for="(item, index) in invoiceData.items"
              :key="index"
              class="mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <BaseInput
                  v-model="item.description"
                  :label="$t('common.description')"
                  :placeholder="$t('invoices.itemDescription')"
                  required
                  class="md:col-span-2"
                />

                <BaseInput
                  v-model="item.quantity"
                  type="number"
                  min="1"
                  :label="$t('common.quantity')"
                  required
                  @input="calculateItemTotal(index)"
                />

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

              <div class="flex justify-between items-center mt-3">
                <span class="text-gray-600">
                  {{ $t('common.total') }}:
                  <span class="font-semibold">{{ item.total || 0 }} ر.س</span>
                </span>
                <BaseButton
                  type="button"
                  @click="removeItem(index)"
                  size="sm"
                  type="danger"
                  icon="trash"
                  :disabled="invoiceData.items.length === 1"
                >
                  {{ $t('common.remove') }}
                </BaseButton>
              </div>
            </div>

            <!-- Summary -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">{{ $t('common.subtotal') }}:</span>
                <span class="font-semibold">{{ calculateSubtotal() }} ر.س</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">{{ $t('common.tax') }} (15%):</span>
                <span class="font-semibold">{{ calculateTax() }} ر.س</span>
              </div>
              <div class="flex justify-between items-center text-lg font-bold">
                <span>{{ $t('common.total') }}:</span>
                <span class="text-primary-600">{{ calculateTotal() }} ر.س</span>
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
              icon="save"
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
export default {
  name: 'CreateInvoice',
  data() {
    return {
      loading: false,
      clients: [],
      errors: {},
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
    breadcrumbs() {
      return [
        { text: this.$t('invoices.title'), to: '/invoices' },
        { text: this.$t('invoices.create') },
      ]
    },
    headerActions() {
      return [
        {
          text: this.$t('common.back'),
          type: 'outline',
          icon: ['fas', 'arrow-left'],
          onClick: () => this.$router.push('/invoices'),
        },
      ]
    },
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
      this.invoiceData.subtotal = parseFloat(this.calculateSubtotal())
      this.invoiceData.tax_amount = parseFloat(this.calculateTax())
      this.invoiceData.total_amount = parseFloat(this.calculateTotal())
    },
    async createInvoice() {
      this.errors = {}
      this.loading = true

      try {
        // التحقق من البيانات
        if (!this.invoiceData.client_id) {
          this.errors.client_id = 'الرجاء اختيار عميل'
        }

        if (!this.invoiceData.invoice_number.trim()) {
          this.errors.invoice_number = 'الرجاء إدخال رقم الفاتورة'
        }

        if (Object.keys(this.errors).length > 0) {
          return
        }

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
        console.error('❌ خطأ في إنشاء الفاتورة:', error)

        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error(error.message || this.$t('invoices.createError'))
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
