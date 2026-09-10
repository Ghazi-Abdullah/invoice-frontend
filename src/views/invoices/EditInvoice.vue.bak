<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Page Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <svg
                class="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                {{ $t('invoices.edit') }}
              </h1>
              <p class="text-gray-600 text-sm mt-1">{{ $t('invoices.editDescription') }}</p>
            </div>
          </div>

          <button
            @click="$router.push(`/invoices/${invoice?.id}`)"
            class="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {{ $t('common.back') }}
          </button>
        </div>

        <!-- Invoice Info Card -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm"
              >
                <span class="text-blue-700 font-bold text-lg">
                  {{ getInitials(invoice?.client?.name) }}
                </span>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">
                  {{ $t('invoices.editInvoice') }} #{{ invoice?.invoice_number }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    :class="getStatusBadgeClass(invoice?.status)"
                    class="px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1"
                  >
                    <span
                      :class="getStatusDotClass(invoice?.status)"
                      class="w-2 h-2 rounded-full"
                    ></span>
                    {{ getStatusText(invoice?.status) }}
                  </span>
                  <span class="text-xs text-gray-500">• {{ formatDate(invoice?.created_at) }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm text-gray-500">{{ $t('invoices.total') }}</div>
              <div class="text-2xl font-bold text-gray-900">
                {{ formatCurrency(invoice?.total || 0) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 mb-6">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
          ></div>
          <p class="text-gray-700 font-medium">{{ $t('common.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('invoices.loadingInvoice') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0 pt-0.5">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mr-3 flex-1">
            <h3 class="text-sm font-medium text-red-800">{{ $t('common.error') }}</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
          <button @click="clearError" class="p-1.5 text-red-700 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Edit Invoice Form -->
      <div v-else>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Form Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ $t('invoices.updateInfo') }}</h2>
                <p class="text-sm text-gray-600">{{ $t('invoices.updateDescription') }}</p>
              </div>
            </div>
          </div>

          <!-- Form Content -->
          <form @submit.prevent="submitInvoice" class="p-6 space-y-6">
            <!-- Basic Information -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ $t('invoices.basicInfo') }}
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{
                    $t('invoices.invoiceNumber')
                  }}</label>
                  <input
                    v-model="form.invoice_number"
                    type="text"
                    :placeholder="$t('invoices.invoiceNumberPlaceholder')"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    :class="{ 'border-red-300': errors.invoice_number }"
                    required
                  />
                  <p v-if="errors.invoice_number" class="text-sm text-red-600">
                    {{ errors.invoice_number }}
                  </p>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{
                    $t('invoices.client')
                  }}</label>
                  <div
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div
                      class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                    >
                      <span class="text-blue-700 font-bold text-sm">
                        {{ getInitials(invoice?.client?.name) }}
                      </span>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">
                        {{ invoice?.client?.name || $t('common.notAvailable') }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ invoice?.client?.email || $t('common.notAvailable') }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{
                    $t('invoices.issueDate')
                  }}</label>
                  <div class="relative">
                    <input
                      v-model="form.invoice_date"
                      type="date"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      :class="{ 'border-red-300': errors.invoice_date }"
                      required
                    />
                    <svg
                      class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p v-if="errors.invoice_date" class="text-sm text-red-600">
                    {{ errors.invoice_date }}
                  </p>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">{{
                    $t('invoices.dueDate')
                  }}</label>
                  <div class="relative">
                    <input
                      v-model="form.due_date"
                      type="date"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      :class="{ 'border-red-300': errors.due_date }"
                      required
                    />
                    <svg
                      class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p v-if="errors.due_date" class="text-sm text-red-600">{{ errors.due_date }}</p>
                </div>
              </div>
            </div>

            <!-- Invoice Items -->
            <div
              class="border border-gray-200 rounded-xl p-5 bg-gradient-to-b from-gray-50 to-white"
            >
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    class="w-5 h-5 text-gray-400"
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
                  {{ $t('invoices.items') }}
                </h3>
                <button
                  type="button"
                  @click="addItem"
                  class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {{ $t('invoices.addItem') }}
                </button>
              </div>

              <!-- Items List -->
              <div class="space-y-4">
                <div
                  v-for="(item, index) in form.items"
                  :key="index"
                  class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <!-- Description -->
                    <div class="md:col-span-5">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('common.description') }}
                      </label>
                      <input
                        v-model="item.description"
                        type="text"
                        :placeholder="$t('invoices.itemDescription')"
                        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <!-- Quantity -->
                    <div class="md:col-span-3">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('common.quantity') }}
                      </label>
                      <input
                        v-model="item.quantity"
                        type="number"
                        min="1"
                        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @input="calculateTotals"
                        required
                      />
                    </div>

                    <!-- Unit Price -->
                    <div class="md:col-span-3">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('common.unitPrice') }}
                      </label>
                      <div class="relative">
                        <input
                          v-model="item.unit_price"
                          type="number"
                          min="0"
                          step="0.01"
                          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                          @input="calculateTotals"
                          required
                        />
                        <span
                          class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm"
                        >
                          {{ $t('common.currency') }}
                        </span>
                      </div>
                    </div>

                    <!-- Remove Button -->
                    <div class="md:col-span-1 flex items-end">
                      <button
                        type="button"
                        @click="removeItem(index)"
                        :disabled="form.items.length === 1"
                        class="w-full h-10 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                  <!-- Item Total -->
                  <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span class="text-sm text-gray-600">{{ $t('common.itemTotal') }}:</span>
                    <span class="text-lg font-semibold text-gray-900">
                      {{ formatCurrency(item.total || 0) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Invoice Summary -->
              <div class="mt-8 pt-8 border-t border-gray-200">
                <div class="max-w-md ml-auto space-y-3">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">{{ $t('common.subtotal') }}:</span>
                    <span class="font-semibold text-gray-900">{{
                      formatCurrency(form.subtotal)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">{{ $t('common.tax') }} (15%):</span>
                    <span class="font-semibold text-gray-900">{{
                      formatCurrency(form.tax_amount)
                    }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span class="text-lg font-bold text-gray-900">{{ $t('common.total') }}:</span>
                    <span class="text-2xl font-bold text-blue-600">{{
                      formatCurrency(form.total)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                {{ $t('common.notes') }}
              </h3>
              <textarea
                v-model="form.notes"
                :placeholder="$t('invoices.notesPlaceholder')"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              ></textarea>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="$router.push(`/invoices/${invoice.id}`)"
                :disabled="updating"
                class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {{ $t('common.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="updating || !isFormValid"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="!updating"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg
                  v-if="updating"
                  class="w-4 h-4 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {{ updating ? $t('common.updating') : $t('common.update') }}
              </button>
            </div>
          </form>
        </div>
      </div>
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
      updating: false,
    }
  },

  computed: {
    ...mapGetters('invoices', ['loading', 'error', 'currentInvoice']),

    invoice() {
      return this.currentInvoice
    },

    isFormValid() {
      return (
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
    ...mapActions('invoices', ['fetchInvoice', 'updateInvoice', 'clearError']),

    async loadInvoice() {
      const invoiceId = this.$route.params.id
      await this.fetchInvoice(invoiceId)

      if (this.invoice) {
        this.form = {
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
    },

    calculateTotals() {
      this.form.items.forEach((item) => {
        item.total = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
      })

      const subtotal = this.form.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
      const tax_amount = subtotal * 0.15
      const total = subtotal + tax_amount

      this.form.subtotal = subtotal
      this.form.tax_amount = tax_amount
      this.form.total = total
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

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ر.س'
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    getInitials(name) {
      if (!name) return '؟؟'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    getStatusBadgeClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusDotClass(status) {
      const classes = {
        draft: 'bg-gray-500',
        sent: 'bg-blue-500',
        paid: 'bg-green-500',
        overdue: 'bg-red-500',
      }
      return classes[status] || 'bg-gray-500'
    },

    getStatusText(status) {
      const texts = {
        draft: 'مسودة',
        sent: 'مرسلة',
        paid: 'مدفوعة',
        overdue: 'متأخرة',
      }
      return texts[status] || status
    },

    async submitInvoice() {
      this.errors = {}
      this.updating = true

      try {
        if (!this.form.invoice_number.trim()) {
          this.errors.invoice_number = 'الرجاء إدخال رقم الفاتورة'
          return
        }

        if (!this.form.invoice_date) {
          this.errors.invoice_date = 'الرجاء اختيار تاريخ الإصدار'
          return
        }

        if (!this.form.due_date) {
          this.errors.due_date = 'الرجاء اختيار تاريخ الاستحقاق'
          return
        }

        const invoiceData = {
          invoice_number: this.form.invoice_number,
          invoice_date: this.form.invoice_date,
          due_date: this.form.due_date,
          subtotal: this.form.subtotal,
          tax_amount: this.form.tax_amount,
          total: this.form.total,
          notes: this.form.notes,
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

        this.$toast.success(this.$t('invoices.updateSuccess'), {
          position: 'bottom-left',
          duration: 3000,
        })
        this.$router.push(`/invoices/${this.invoice.id}`)
      } catch (error) {
        console.error('❌ خطأ في تحديث الفاتورة:', error)

        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error(error.response?.data?.message || this.$t('invoices.updateError'), {
            position: 'bottom-left',
            duration: 3000,
          })
        }
      } finally {
        this.updating = false
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
/* تحسينات التصميم */
input:focus,
textarea:focus {
  outline: none;
  ring: 2px;
  ring-color: rgba(59, 130, 246, 0.5);
}

/* تحسينات للجوّال */
@media (max-width: 768px) {
  .grid-cols-12 > * {
    grid-column: span 12;
  }
}

/* تأثيرات الـ loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* تدرجات لونية */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* تحسينات الظلال والحدود */
.shadow-sm {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.hover\:shadow-md:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* تحسينات الأزرار */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* تخصيص شريط التمرير */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
