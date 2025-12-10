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
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              + إضافة عنصر
            </button>
          </div>

          <div
            v-for="(item, index) in form.items"
            :key="index"
            class="mb-4 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-700">العنصر {{ index + 1 }}</h3>
              <button
                type="button"
                @click="removeItem(index)"
                class="text-red-500 hover:text-red-700"
                v-if="form.items.length > 1"
              >
                حذف
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> الوصف * </label>
                <input
                  type="text"
                  v-model="item.description"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': errors[`items.${index}.description`] }"
                  placeholder="وصف المنتج أو الخدمة"
                  required
                />
                <p v-if="errors[`items.${index}.description`]" class="mt-1 text-sm text-red-600">
                  {{ errors[`items.${index}.description`][0] }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> الكمية * </label>
                <input
                  type="number"
                  v-model="item.quantity"
                  min="0.01"
                  step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': errors[`items.${index}.quantity`] }"
                  required
                />
                <p v-if="errors[`items.${index}.quantity`]" class="mt-1 text-sm text-red-600">
                  {{ errors[`items.${index}.quantity`][0] }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"> سعر الوحدة * </label>
                <input
                  type="number"
                  v-model="item.unit_price"
                  min="0"
                  step="0.01"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-500': errors[`items.${index}.unit_price`] }"
                  required
                />
                <p v-if="errors[`items.${index}.unit_price`]" class="mt-1 text-sm text-red-600">
                  {{ errors[`items.${index}.unit_price`][0] }}
                </p>
              </div>
            </div>

            <div class="mt-4">
              <p class="text-gray-700">
                الإجمالي: <span class="font-bold">{{ calculateItemTotal(item) }} ر.س</span>
              </p>
            </div>
          </div>
        </div>

        <!-- الملاحظات -->
        <div class="mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-2"> ملاحظات </label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': errors.notes }"
            placeholder="أي ملاحظات إضافية..."
          ></textarea>
          <p v-if="errors.notes" class="mt-1 text-sm text-red-600">
            {{ errors.notes[0] }}
          </p>
        </div>

        <!-- ملخص الفاتورة -->
        <div class="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">ملخص الفاتورة</h2>

          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">المجموع الفرعي:</span>
              <span class="font-semibold">{{ calculateSubtotal() }} ر.س</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">الضريبة (15%):</span>
              <span class="font-semibold">{{ calculateTax() }} ر.س</span>
            </div>
            <div class="flex justify-between text-lg pt-3 border-t">
              <span class="font-bold text-gray-800">الإجمالي الكلي:</span>
              <span class="font-bold text-blue-600">{{ calculateTotal() }} ر.س</span>
            </div>
          </div>
        </div>

        <!-- أزرار التحكم -->
        <div class="flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            @click="$router.go(-1)"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            إلغاء
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting">جاري الحفظ...</span>
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
      form: {
        client_id: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        items: [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
          },
        ],
        notes: '',
      },
    }
  },

  methods: {
    // حساب المجاميع
    calculateItemTotal(item) {
      const total = item.quantity * item.unit_price
      return isNaN(total) ? '0.00' : total.toFixed(2)
    },

    calculateSubtotal() {
      let subtotal = 0
      this.form.items.forEach((item) => {
        const total = item.quantity * item.unit_price
        if (!isNaN(total)) {
          subtotal += total
        }
      })
      return subtotal.toFixed(2)
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

    // إضافة عنصر جديد
    addItem() {
      this.form.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
      })
    },

    // حذف عنصر
    removeItem(index) {
      if (this.form.items.length > 1) {
        this.form.items.splice(index, 1)
      }
    },

    // جلب العملاء
    async fetchClients() {
      try {
        const response = await this.$store.dispatch('clients/getSimpleList')
        this.clients = response
      } catch (error) {
        console.error('Error fetching clients:', error)
        this.$toast.error('فشل في تحميل قائمة العملاء')
      }
    },

    // إرسال الفاتورة
    async submitInvoice() {
      this.submitting = true
      this.errors = {}

      try {
        // تنظيف البيانات
        const invoiceData = {
          ...this.form,
          items: this.form.items.map((item) => ({
            ...item,
            quantity: parseFloat(item.quantity),
            unit_price: parseFloat(item.unit_price),
          })),
        }

        await this.$store.dispatch('invoices/createInvoice', invoiceData)

        this.$toast.success('تم إنشاء الفاتورة بنجاح')
        this.$router.push('/invoices')
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        }
        const errorMessage = error.response?.data?.message || 'فشل في إنشاء الفاتورة'
        this.$toast.error(errorMessage)
      } finally {
        this.submitting = false
      }
    },
  },

  async mounted() {
    await this.fetchClients()
    this.loading = false
  },
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
