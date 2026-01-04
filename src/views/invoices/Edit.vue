<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        :title="$t('invoices.edit')"
        :subtitle="$t('invoices.editDescription')"
        :breadcrumbs="breadcrumbs"
        :actions="headerActions"
      />

      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="text-gray-600 text-lg mt-4">{{ $t('common.loading') }}</p>
      </div>

      <BaseAlert
        v-else-if="error"
        type="error"
        :title="$t('common.error')"
        :message="error"
        :actions="errorActions"
        class="mb-6"
      />

      <BaseCard v-else class="edit-invoice-card">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg ml-4">
                <font-awesome-icon :icon="['fas', 'edit']" class="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">
                  {{ $t('invoices.editInvoice') }} #{{ invoice?.invoice_number }}
                </h2>
                <p class="text-gray-600 text-sm">{{ $t('invoices.updateInfo') }}</p>
              </div>
            </div>
            <StatusBadge :status="invoice?.status" />
          </div>
        </template>

        <form @submit.prevent="submitInvoice" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="form.invoice_number"
              :label="$t('invoices.invoiceNumber')"
              :placeholder="$t('invoices.invoiceNumberPlaceholder')"
              required
              :error="errors.invoice_number"
            />

            <div>
              <label class="form-label">{{ $t('invoices.client') }} *</label>
              <select
                v-model="form.client_id"
                required
                class="form-input"
                :class="{ 'border-red-500': errors.client_id }"
                disabled
              >
                <option value="">{{ invoice?.client?.name || $t('common.selectClient') }}</option>
              </select>
              <div v-if="errors.client_id" class="mt-1 text-sm text-red-600">
                {{ errors.client_id }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="form.invoice_date"
              type="date"
              :label="$t('invoices.issueDate')"
              required
              :error="errors.invoice_date"
            />

            <BaseInput
              v-model="form.due_date"
              type="date"
              :label="$t('invoices.dueDate')"
              required
              :error="errors.due_date"
            />
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ $t('invoices.items') }}</h3>
              <BaseButton type="button" @click="addItem" size="sm" :icon="['fas', 'plus']">
                {{ $t('invoices.addItem') }}
              </BaseButton>
            </div>

            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
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
                    @input="calculateTotals"
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
                    @input="calculateTotals"
                  />
                </div>

                <div class="md:col-span-1 flex items-end">
                  <BaseButton
                    type="button"
                    @click="removeItem(index)"
                    size="sm"
                    variant="danger"
                    :icon="['fas', 'trash']"
                    :disabled="form.items.length === 1"
                    class="w-full"
                  />
                </div>
              </div>

              <div class="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                <span class="text-gray-600">
                  {{ $t('common.total') }}:
                  <span class="font-semibold">{{ item.total || 0 }} ر.س</span>
                </span>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">{{ $t('common.subtotal') }}:</span>
                <span class="font-semibold">{{ form.subtotal }} ر.س</span>
              </div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-gray-600">{{ $t('common.tax') }} (15%):</span>
                <span class="font-semibold">{{ form.tax_amount }} ر.س</span>
              </div>
              <div
                class="flex justify-between items-center text-lg font-bold pt-2 border-t border-gray-200"
              >
                <span>{{ $t('common.total') }}:</span>
                <span class="text-primary-600">{{ form.total }} ر.س</span>
              </div>
            </div>
          </div>

          <BaseInput
            v-model="form.notes"
            :label="$t('common.notes')"
            :placeholder="$t('invoices.notesPlaceholder')"
            type="textarea"
            rows="3"
          />

          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <BaseButton
              type="outline"
              @click="$router.push(`/invoices/${invoice.id}`)"
              :disabled="submitting"
            >
              {{ $t('common.cancel') }}
            </BaseButton>

            <BaseButton
              type="primary"
              :loading="submitting"
              :disabled="submitting || !isFormValid"
              :icon="['fas', 'save']"
              html-type="submit"
            >
              {{ $t('common.update') }}
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
  name: 'EditInvoice',

  data() {
    return {
      form: {
        client_id: '',
        invoice_number: '',
        invoice_date: '',
        due_date: '',
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
        total: 0,
      },
      errors: {},
      submitting: false,
    }
  },

  computed: {
    ...mapGetters('invoices', ['currentInvoice', 'loading', 'error']),

    invoice() {
      return this.currentInvoice
    },

    breadcrumbs() {
      return [
        { text: this.$t('invoices.title'), to: '/invoices' },
        {
          text: `فاتورة #${this.invoice?.invoice_number || ''}`,
          to: `/invoices/${this.invoice?.id}`,
        },
        { text: this.$t('common.edit') },
      ]
    },

    headerActions() {
      return [
        {
          text: this.$t('common.back'),
          type: 'outline',
          icon: ['fas', 'arrow-left'],
          onClick: () => this.$router.push(`/invoices/${this.invoice?.id}`),
        },
      ]
    },

    errorActions() {
      return [
        {
          text: this.$t('common.retry'),
          onClick: this.loadInvoice,
          type: 'danger',
        },
      ]
    },

    isFormValid() {
      return (
        this.form.client_id &&
        this.form.invoice_number &&
        this.form.invoice_date &&
        this.form.due_date &&
        this.form.items.every(
          (item) => item.description && item.quantity > 0 && item.unit_price >= 0,
        )
      )
    },
  },

  mounted() {
    this.loadInvoice()
  },

  methods: {
    ...mapActions('invoices', ['fetchInvoice', 'updateInvoice']),

    async loadInvoice() {
      const invoiceId = this.$route.params.id

      try {
        await this.fetchInvoice(invoiceId)

        if (this.invoice) {
          this.form = {
            client_id: this.invoice.client_id,
            invoice_number: this.invoice.invoice_number || '',
            invoice_date: this.invoice.invoice_date?.split('T')[0] || '',
            due_date: this.invoice.due_date?.split('T')[0] || '',
            items: this.invoice.items?.map((item) => ({
              description: item.description || '',
              quantity: item.quantity || 1,
              unit_price: item.unit_price || 0,
              total: (item.quantity || 1) * (item.unit_price || 0),
            })) || [
              {
                description: '',
                quantity: 1,
                unit_price: 0,
                total: 0,
              },
            ],
            notes: this.invoice.notes || '',
            subtotal: this.invoice.subtotal || 0,
            tax_amount: this.invoice.tax_amount || 0,
            total: this.invoice.total || 0,
          }

          this.calculateTotals()
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل الفاتورة:', error)
        this.error = error.message || this.$t('common.loadError')
      }
    },

    calculateTotals() {
      this.form.items.forEach((item) => {
        item.total = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
      })

      const subtotal = this.form.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
      const tax_amount = subtotal * 0.15
      const total = subtotal + tax_amount

      this.form.subtotal = subtotal.toFixed(2)
      this.form.tax_amount = tax_amount.toFixed(2)
      this.form.total = total.toFixed(2)
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
      }
    },

    async submitInvoice() {
      this.errors = {}
      this.submitting = true

      try {
        if (!this.form.invoice_number.trim()) {
          this.errors.invoice_number = 'الرجاء إدخال رقم الفاتورة'
          return
        }

        const invoiceData = {
          ...this.form,
          subtotal: parseFloat(this.form.subtotal),
          tax_amount: parseFloat(this.form.tax_amount),
          total: parseFloat(this.form.total),
          items: this.form.items.map((item) => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unit_price: parseFloat(item.unit_price),
          })),
        }

        await this.updateInvoice({
          id: this.invoice.id,
          data: invoiceData,
        })

        this.$toast.success(this.$t('invoices.updateSuccess'))
        this.$router.push(`/invoices/${this.invoice.id}`)
      } catch (error) {
        console.error('❌ خطأ في تحديث الفاتورة:', error)

        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error(error.response?.data?.message || this.$t('invoices.updateError'))
        }
      } finally {
        this.submitting = false
      }
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
}
</script>

<style scoped>
.edit-invoice-card {
  @apply border-blue-100;
}
</style>
