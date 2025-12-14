<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">تعديل الفاتورة</h1>
        <p class="text-gray-600 mt-2">تعديل الفاتورة {{ invoice?.invoice_number }}</p>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="invoice" class="bg-white shadow rounded-lg p-6">
        <form @submit.prevent="submitInvoice">
          <!-- Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ الإصدار</label>
              <input
                type="date"
                v-model="form.issue_date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">تاريخ الاستحقاق</label>
              <input
                type="date"
                v-model="form.due_date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Invoice Items -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">عناصر الفاتورة</h3>
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
                إضافة عنصر
              </button>
            </div>

            <div class="space-y-4">
              <div
                v-for="(item, index) in form.items"
                :key="index"
                class="grid grid-cols-12 gap-4 items-start p-4 border border-gray-200 rounded-lg"
              >
                <div class="col-span-5">
                  <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                  <input
                    type="text"
                    v-model="item.description"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="وصف المنتج أو الخدمة"
                  />
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">الكمية</label>
                  <input
                    type="number"
                    v-model="item.quantity"
                    min="1"
                    required
                    @input="calculateItemTotal(item)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="col-span-3">
                  <label class="block text-sm font-medium text-gray-700 mb-2">سعر الوحدة</label>
                  <input
                    type="number"
                    v-model="item.unit_price"
                    min="0"
                    step="0.01"
                    required
                    @input="calculateItemTotal(item)"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-2">الإجمالي</label>
                  <p class="px-3 py-2 bg-gray-100 rounded-lg text-gray-700">
                    {{ item.total || 0 }} ر.س
                  </p>
                </div>
                <div class="col-span-1 flex justify-end pt-6">
                  <button
                    type="button"
                    @click="removeItem(index)"
                    v-if="form.items.length > 1"
                    class="text-red-600 hover:text-red-800 transition-colors"
                    title="حذف"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ملاحظات إضافية..."
            ></textarea>
          </div>

          <!-- Summary -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">ملخص الفاتورة</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">المجموع الفرعي:</span>
                <span class="font-medium">{{ form.subtotal }} ر.س</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">الضريبة (15%):</span>
                <span class="font-medium">{{ form.tax_amount }} ر.س</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-2">
                <span class="text-lg font-semibold text-gray-900">الإجمالي الكلي:</span>
                <span class="text-lg font-bold text-blue-600">{{ form.total_amount }} ر.س</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 space-x-reverse">
            <router-link
              :to="`/invoices/${invoice.id}`"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </router-link>
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="submitting">جاري الحفظ...</span>
              <span v-else>تحديث</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditInvoice',

  data() {
    return {
      invoice: null,
      loading: true,
      submitting: false,
      form: {
        issue_date: '',
        due_date: '',
        items: [],
        notes: '',
        subtotal: 0,
        tax_amount: 0,
        total_amount: 0,
      },
    }
  },

  methods: {
    calculateTotals() {
      const subtotal = this.form.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
      const tax_amount = subtotal * 0.15
      const total_amount = subtotal + tax_amount

      this.form.subtotal = subtotal.toFixed(2)
      this.form.tax_amount = tax_amount.toFixed(2)
      this.form.total_amount = total_amount.toFixed(2)
    },

    calculateItemTotal(item) {
      item.total = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
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
      }
    },

    async submitInvoice() {
      if (
        this.form.items.some(
          (item) => !item.description || item.quantity <= 0 || item.unit_price <= 0,
        )
      ) {
        alert('يرجى ملء جميع حقول العناصر بشكل صحيح')
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

        await this.$store.dispatch('invoices/updateInvoice', {
          id: this.invoice.id,
          data: invoiceData,
        })

        this.$toast.success('تم تحديث الفاتورة بنجاح')
        this.$router.push(`/invoices/${this.invoice.id}`)
      } catch (error) {
        console.error('Failed to update invoice:', error)
        this.$toast.error('فشل في تحديث الفاتورة: ' + error.message)
      } finally {
        this.submitting = false
      }
    },

    async loadInvoice() {
      try {
        const invoiceId = this.$route.params.id
        this.invoice = await this.$store.dispatch('invoices/fetchInvoice', invoiceId)

        this.form = {
          issue_date: this.invoice.issue_date.split('T')[0],
          due_date: this.invoice.due_date.split('T')[0],
          items: this.invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
          })),
          notes: this.invoice.notes || '',
          subtotal: this.invoice.subtotal,
          tax_amount: this.invoice.tax_amount,
          total_amount: this.invoice.total_amount,
        }
      } catch (error) {
        console.error('Failed to fetch invoice:', error)
        this.$toast.error('فشل في تحميل الفاتورة')
        this.$router.push('/invoices')
      } finally {
        this.loading = false
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

  mounted() {
    this.loadInvoice()
  },
}
</script>
