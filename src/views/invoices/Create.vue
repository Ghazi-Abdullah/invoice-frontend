<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">إنشاء فاتورة جديدة</h1>
      <p class="text-gray-600 mt-2">املأ النموذج أدناه لإنشاء فاتورة جديدة</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">جاري التحميل...</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="submitInvoice">
        <!-- معلومات العميل -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">معلومات العميل</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> العميل * </label>
              <select
                v-model="form.client_id"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.client_id }"
                required
                @change="onClientChange"
              >
                <option value="">اختر عميل</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }} - {{ client.email }}
                </option>
              </select>
              <p v-if="errors.client_id" class="mt-1 text-sm text-red-600">
                {{ errors.client_id[0] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> رقم الفاتورة * </label>
              <div class="flex items-center">
                <input
                  type="text"
                  v-model="form.invoice_number"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': errors.invoice_number }"
                  required
                  placeholder="سيتم توليد رقم تلقائياً"
                  readonly
                />
                <button
                  type="button"
                  @click="generateInvoiceNumber"
                  class="mr-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  title="توليد رقم جديد"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
              <p v-if="errors.invoice_number" class="mt-1 text-sm text-red-600">
                {{ errors.invoice_number[0] }}
              </p>
            </div>
          </div>
        </div>

        <!-- تواريخ الفاتورة -->
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">تواريخ الفاتورة</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> تاريخ الإصدار * </label>
              <input
                type="date"
                v-model="form.issue_date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.issue_date }"
                required
                @change="validateDates"
              />
              <p v-if="errors.issue_date" class="mt-1 text-sm text-red-600">
                {{ errors.issue_date[0] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الاستحقاق *
              </label>
              <input
                type="date"
                v-model="form.due_date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.due_date }"
                required
                @change="validateDates"
              />
              <p v-if="errors.due_date" class="mt-1 text-sm text-red-600">
                {{ errors.due_date[0] }}
              </p>
            </div>
          </div>
        </div>

        <!-- عناصر الفاتورة -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">عناصر الفاتورة</h2>
            <button
              type="button"
              @click="addItem"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center"
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

          <div
            v-if="form.items.length === 0"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p class="text-gray-500">لا توجد عناصر</p>
            <button
              type="button"
              @click="addItem"
              class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              إضافة أول عنصر
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in form.items"
              :key="index"
              class="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-medium text-gray-700">العنصر {{ index + 1 }}</h3>
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="text-red-500 hover:text-red-700 flex items-center"
                  v-if="form.items.length > 1"
                >
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  حذف
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> الوصف * </label>
                  <input
                    type="text"
                    v-model="item.description"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors[`items.${index}.description`] }"
                    placeholder="وصف المنتج أو الخدمة"
                    required
                    @input="calculateItemTotal(index)"
                  />
                  <p v-if="errors[`items.${index}.description`]" class="mt-1 text-sm text-red-600">
                    {{ errors[`items.${index}.description`][0] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> الكمية * </label>
                  <input
                    type="number"
                    v-model.number="item.quantity"
                    min="0.01"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors[`items.${index}.quantity`] }"
                    required
                    @input="calculateItemTotal(index)"
                  />
                  <p v-if="errors[`items.${index}.quantity`]" class="mt-1 text-sm text-red-600">
                    {{ errors[`items.${index}.quantity`][0] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"> سعر الوحدة * </label>
                  <input
                    type="number"
                    v-model.number="item.unit_price"
                    min="0"
                    step="0.01"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors[`items.${index}.unit_price`] }"
                    required
                    @input="calculateItemTotal(index)"
                  />
                  <p v-if="errors[`items.${index}.unit_price`]" class="mt-1 text-sm text-red-600">
                    {{ errors[`items.${index}.unit_price`][0] }}
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    نسبة الضريبة %
                  </label>
                  <input
                    type="number"
                    v-model.number="item.tax_rate"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :class="{ 'border-red-500': errors[`items.${index}.tax_rate`] }"
                    @input="calculateItemTotal(index)"
                  />
                  <p v-if="errors[`items.${index}.tax_rate`]" class="mt-1 text-sm text-red-600">
                    {{ errors[`items.${index}.tax_rate`][0] }}
                  </p>
                </div>
              </div>

              <div class="mt-4 flex justify-between items-center">
                <div>
                  <p class="text-sm text-gray-600">
                    المجموع للعنصر:
                    <span class="font-bold text-gray-800">{{ calculateItemTotal(index) }} ر.س</span>
                  </p>
                  <p v-if="item.tax_rate > 0" class="text-xs text-gray-500">
                    الضريبة:
                    {{ (item.quantity * item.unit_price * (item.tax_rate / 100)).toFixed(2) }} ر.س
                  </p>
                </div>
                <div>
                  <span
                    class="inline-block px-2 py-1 text-xs rounded-full"
                    :class="getItemStatusClass(item)"
                  >
                    {{ getItemStatusText(item) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- الملاحظات والشروط -->
        <div class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> ملاحظات </label>
              <textarea
                v-model="form.notes"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.notes }"
                placeholder="أي ملاحظات إضافية..."
              ></textarea>
              <p v-if="errors.notes" class="mt-1 text-sm text-red-600">
                {{ errors.notes[0] }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"> الشروط والأحكام </label>
              <textarea
                v-model="form.terms"
                rows="4"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': errors.terms }"
                placeholder="شروط الدفع والأحكام العامة..."
              ></textarea>
              <p v-if="errors.terms" class="mt-1 text-sm text-red-600">
                {{ errors.terms[0] }}
              </p>
            </div>
          </div>
        </div>

        <!-- ملخص الفاتورة -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">ملخص الفاتورة</h2>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">المجموع الفرعي:</span>
              <span class="font-semibold">{{ calculateSubtotal() }} ر.س</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">إجمالي الضريبة:</span>
              <span class="font-semibold">{{ calculateTax() }} ر.س</span>
            </div>
            <div v-if="discount > 0" class="flex justify-between text-green-600">
              <span>الخصم:</span>
              <span class="font-semibold">-{{ discount.toFixed(2) }} ر.س</span>
            </div>
            <div class="flex justify-between text-lg pt-3 border-t border-gray-300">
              <span class="font-bold text-gray-800">الإجمالي الكلي:</span>
              <span class="font-bold text-blue-600 text-xl">{{ calculateTotal() }} ر.س</span>
            </div>
          </div>

          <!-- معلومات إضافية -->
          <div class="mt-6 pt-6 border-t border-gray-300">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">عدد العناصر</label>
                <p class="text-gray-900 font-medium">{{ form.items.length }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">متوسط الضريبة</label>
                <p class="text-gray-900 font-medium">{{ calculateAverageTax() }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- أخطاء عامة -->
        <div
          v-if="Object.keys(errors).length > 0 && !isFieldErrors()"
          class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex items-center">
            <svg
              class="w-5 h-5 text-red-600 mr-2"
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
            <h3 class="text-sm font-medium text-red-800">يوجد أخطاء في النموذج</h3>
          </div>
          <ul class="mt-2 text-sm text-red-700 list-disc list-inside">
            <li v-for="(errorMessages, field) in errors" :key="field">
              <span v-if="!field.includes('items')">{{ errorMessages[0] }}</span>
            </li>
          </ul>
        </div>

        <!-- أزرار التحكم -->
        <div class="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            @click="cancelInvoice"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            إلغاء
          </button>
          <button
            type="button"
            @click="saveAsDraft"
            :disabled="submitting"
            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span v-if="submitting">جاري الحفظ...</span>
            <span v-else>حفظ كمسودة</span>
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span v-if="submitting">جاري الإنشاء...</span>
            <span v-else>إنشاء الفاتورة</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateInvoice',

  data() {
    return {
      loading: true,
      submitting: false,
      clients: [],
      errors: {},
      discount: 0,
      selectedClient: null,
      form: {
        client_id: '',
        invoice_number: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
            tax_rate: 15,
            total: 0,
          },
        ],
        notes: '',
        terms: '',
        status: 'draft',
      },
    }
  },

  computed: {
    hasIncompleteItems() {
      return this.form.items.some(
        (item) => !item.description || item.quantity <= 0 || item.unit_price <= 0,
      )
    },
  },

  methods: {
    // توليد رقم فاتورة تلقائياً
    generateInvoiceNumber() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const random = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')
      this.form.invoice_number = `INV-${year}${month}${day}-${random}`
    },

    // حساب إجمالي العنصر
    calculateItemTotal(index) {
      const item = this.form.items[index]
      if (!item) return '0.00'

      const quantity = parseFloat(item.quantity) || 0
      const unitPrice = parseFloat(item.unit_price) || 0
      const taxRate = parseFloat(item.tax_rate) || 0

      const subtotal = quantity * unitPrice
      const tax = subtotal * (taxRate / 100)
      const total = subtotal + tax

      item.total = total
      return total.toFixed(2)
    },

    // حساب المجموع الفرعي
    calculateSubtotal() {
      let subtotal = 0
      this.form.items.forEach((item) => {
        const quantity = parseFloat(item.quantity) || 0
        const unitPrice = parseFloat(item.unit_price) || 0
        subtotal += quantity * unitPrice
      })
      return subtotal.toFixed(2)
    },

    // حساب إجمالي الضريبة
    calculateTax() {
      let taxTotal = 0
      this.form.items.forEach((item) => {
        const quantity = parseFloat(item.quantity) || 0
        const unitPrice = parseFloat(item.unit_price) || 0
        const taxRate = parseFloat(item.tax_rate) || 0
        taxTotal += quantity * unitPrice * (taxRate / 100)
      })
      return taxTotal.toFixed(2)
    },

    // حساب الإجمالي الكلي
    calculateTotal() {
      const subtotal = parseFloat(this.calculateSubtotal()) || 0
      const tax = parseFloat(this.calculateTax()) || 0
      const total = subtotal + tax - this.discount
      return total.toFixed(2)
    },

    // حساب متوسط الضريبة
    calculateAverageTax() {
      if (this.form.items.length === 0) return '0.00'

      let totalTaxRate = 0
      let count = 0

      this.form.items.forEach((item) => {
        const taxRate = parseFloat(item.tax_rate) || 0
        if (taxRate > 0) {
          totalTaxRate += taxRate
          count++
        }
      })

      return count > 0 ? (totalTaxRate / count).toFixed(2) : '0.00'
    },

    // إضافة عنصر جديد
    addItem() {
      this.form.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
        tax_rate: 15,
        total: 0,
      })
      // التركيز على حقل الوصف للعنصر الجديد
      this.$nextTick(() => {
        const lastItemIndex = this.form.items.length - 1
        const input = this.$el.querySelector(
          `input[type="text"][v-model="form.items[${lastItemIndex}].description"]`,
        )
        if (input) input.focus()
      })
    },

    // حذف عنصر
    removeItem(index) {
      if (this.form.items.length > 1) {
        if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
          this.form.items.splice(index, 1)
          this.errors = {}
        }
      } else {
        alert('يجب أن تحتوي الفاتورة على عنصر واحد على الأقل')
      }
    },

    // التحقق من صحة التواريخ
    validateDates() {
      if (this.form.issue_date && this.form.due_date) {
        const issueDate = new Date(this.form.issue_date)
        const dueDate = new Date(this.form.due_date)

        if (dueDate < issueDate) {
          this.errors.due_date = ['تاريخ الاستحقاق يجب أن يكون بعد تاريخ الإصدار']
        } else {
          delete this.errors.due_date
        }
      }
    },

    // عند تغيير العميل
    onClientChange() {
      if (this.form.client_id) {
        this.selectedClient = this.clients.find((c) => c.id == this.form.client_id)
        this.errors.client_id = null
      }
    },

    // الحصول على حالة العنصر
    getItemStatusClass(item) {
      if (!item.description) return 'bg-yellow-100 text-yellow-800'
      if (item.quantity <= 0 || item.unit_price <= 0) return 'bg-red-100 text-red-800'
      return 'bg-green-100 text-green-800'
    },

    getItemStatusText(item) {
      if (!item.description) return 'ناقص الوصف'
      if (item.quantity <= 0) return 'كمية غير صالحة'
      if (item.unit_price <= 0) return 'سعر غير صالح'
      return 'مكتمل'
    },

    // التحقق من وجود أخطاء في الحقول
    isFieldErrors() {
      return Object.keys(this.errors).some(
        (key) =>
          key.includes('client_id') ||
          key.includes('invoice_number') ||
          key.includes('issue_date') ||
          key.includes('due_date') ||
          key.includes('items'),
      )
    },

    // جلب العملاء
    async fetchClients() {
      try {
        console.log('🔄 جلب قائمة العملاء...')

        // جلب العملاء من الـ API
        await this.$store.dispatch('clients/fetchClients', { per_page: 100 })

        // الحصول على البيانات من المتجر
        this.clients = this.$store.getters['clients/clients'] || []

        console.log('✅ العملاء المحملون:', this.clients.length)

        if (this.clients.length === 0) {
          console.warn('⚠️ لا توجد عملاء في النظام')
          this.$toast.warning('لا توجد عملاء في النظام. يرجى إضافة عميل أولاً')
        }
      } catch (error) {
        console.error('❌ خطأ في جلب العملاء:', error)
        this.$toast.error('فشل في تحميل قائمة العملاء: ' + (error.message || 'خطأ غير معروف'))
      }
    },

    // حذف جميع الأخطاء
    clearErrors() {
      this.errors = {}
    },

    // التحقق من صحة النموذج
    validateForm(status = 'draft') {
      this.clearErrors()

      const errors = {}
      let isValid = true

      // التحقق من العميل
      if (!this.form.client_id) {
        errors.client_id = ['يرجى اختيار عميل']
        isValid = false
      }

      // التحقق من رقم الفاتورة
      if (!this.form.invoice_number) {
        errors.invoice_number = ['يرجى إدخال رقم الفاتورة']
        isValid = false
      }

      // التحقق من التواريخ
      if (!this.form.issue_date) {
        errors.issue_date = ['يرجى إدخال تاريخ الإصدار']
        isValid = false
      }

      if (!this.form.due_date) {
        errors.due_date = ['يرجى إدخال تاريخ الاستحقاق']
        isValid = false
      }

      // التحقق من العناصر (للفواتير النهائية فقط)
      if (status !== 'draft') {
        if (this.hasIncompleteItems) {
          errors.items = ['يرجى إكمال جميع بيانات العناصر']
          isValid = false
        }

        // التحقق من كل عنصر
        this.form.items.forEach((item, index) => {
          if (!item.description) {
            errors[`items.${index}.description`] = ['يرجى إدخال وصف للعنصر']
            isValid = false
          }

          if (!item.quantity || item.quantity <= 0) {
            errors[`items.${index}.quantity`] = ['يرجى إدخال كمية صحيحة']
            isValid = false
          }

          if (!item.unit_price || item.unit_price < 0) {
            errors[`items.${index}.unit_price`] = ['يرجى إدخال سعر صحيح']
            isValid = false
          }
        })
      }

      this.errors = errors
      return isValid
    },

    // حفظ كمسودة
    async saveAsDraft() {
      if (this.validateForm('draft')) {
        this.form.status = 'draft'
        await this.submitInvoice()
      }
    },

    // إرسال الفاتورة
    async submitInvoice() {
      // إذا كانت المسودة، نحتاج فقط للتحقق الأساسي
      const isValid =
        this.form.status === 'draft' ? this.validateForm('draft') : this.validateForm('sent')

      if (!isValid) {
        this.$toast.error('يرجى تصحيح الأخطاء في النموذج')
        return
      }

      this.submitting = true

      try {
        console.log('📤 إرسال بيانات الفاتورة:', this.form)

        // تنظيف البيانات
        const invoiceData = {
          ...this.form,
          items: this.form.items.map((item) => ({
            description: item.description,
            quantity: parseFloat(item.quantity) || 0,
            unit_price: parseFloat(item.unit_price) || 0,
            tax_rate: parseFloat(item.tax_rate) || 0,
          })),
        }

        // إرسال البيانات
        const response = await this.$store.dispatch('invoices/createInvoice', invoiceData)

        console.log('✅ الفاتورة المنشأة:', response)

        this.$toast.success(`تم ${this.form.status === 'draft' ? 'حفظ' : 'إنشاء'} الفاتورة بنجاح`)

        // الانتقال إلى صفحة الفاتورة الجديدة
        this.$router.push(`/invoices/${response.id}`)
      } catch (error) {
        console.error('❌ خطأ في إنشاء الفاتورة:', error)

        if (error.errors) {
          this.errors = error.errors
          this.$toast.error('يرجى تصحيح الأخطاء في النموذج')
        } else if (error.message) {
          this.$toast.error(error.message)
        } else {
          this.$toast.error('فشل في إنشاء الفاتورة')
        }
      } finally {
        this.submitting = false
      }
    },

    // إلغاء العملية
    cancelInvoice() {
      if (confirm('هل أنت متأكد من الإلغاء؟ سيتم فقدان جميع البيانات غير المحفوظة.')) {
        this.$router.push('/invoices')
      }
    },
  },

  async mounted() {
    try {
      // توليد رقم الفاتورة تلقائياً
      this.generateInvoiceNumber()

      // جلب العملاء
      await this.fetchClients()

      this.loading = false
    } catch (error) {
      console.error('❌ خطأ في تحميل الصفحة:', error)
      this.$toast.error('فشل في تحميل الصفحة')
      this.loading = false
    }
  },

  watch: {
    'form.items': {
      handler() {
        // إعادة حساب المجاميع عند تغيير العناصر
        this.form.items.forEach((item, index) => {
          this.calculateItemTotal(index)
        })
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
/* تنسيقات مخصصة */
.container {
  max-width: 1200px;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}

/* تحسين مظهر حقول التاريخ */
input[type='date'] {
  direction: ltr;
}

/* تنسيق حقول الإدخال */
input:read-only {
  background-color: #f9fafb;
  cursor: not-allowed;
}

/* تنسيق العناصر */
.bg-gray-50 {
  background-color: #f9fafb;
}

/* تنسيق الأزرار */
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* تنسيق رسائل الخطأ */
.text-red-600 {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* تنسيق العنصر النشط */
.border-blue-500:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* تنسيق العناصر المحذوفة */
.remove-item {
  transition: all 0.3s ease;
}

.remove-item:hover {
  transform: scale(1.1);
}
</style>
