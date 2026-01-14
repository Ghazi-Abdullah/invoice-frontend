<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">إنشاء فاتورة جديدة</h1>
                <p class="text-gray-600 text-sm mt-1">املأ تفاصيل الفاتورة خطوة بخطوة</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="$router.push('/invoices')"
              class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span class="hidden sm:inline">رجوع</span>
            </button>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <div class="text-sm text-gray-600">
              الخطوة <span class="font-bold text-blue-600">{{ currentStep + 1 }}</span> من
              {{ steps.length }}
            </div>
            <div class="text-sm text-gray-600">
              <span class="font-bold text-gray-900">{{ getStepProgress() }}%</span> مكتمل
            </div>
          </div>

          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              :style="{ width: getStepProgress() + '%' }"
            ></div>
          </div>

          <div class="flex justify-between mt-4">
            <div v-for="(step, index) in steps" :key="index" class="flex flex-col items-center">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-2',
                  currentStep === index
                    ? 'bg-blue-600 border-blue-600 text-white scale-110'
                    : currentStep > index
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400',
                ]"
              >
                <svg
                  v-if="currentStep > index"
                  class="w-5 h-5"
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
                <span v-else class="font-bold">{{ index + 1 }}</span>
              </div>
              <span
                :class="[
                  'text-sm font-medium transition-colors duration-300',
                  currentStep === index
                    ? 'text-blue-600'
                    : currentStep > index
                      ? 'text-green-600'
                      : 'text-gray-500',
                ]"
              >
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Step 1: Basic Information -->
          <transition name="fade">
            <div
              v-if="currentStep === 0"
              class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800">معلومات الفاتورة الأساسية</h3>
                </div>
              </div>

              <div class="p-6">
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Client Selection -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2"> العميل * </label>
                      <div class="relative">
                        <select
                          v-model="invoiceData.client_id"
                          required
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                          :class="{ 'border-red-500': errors.client_id }"
                        >
                          <option value="">اختر عميلاً</option>
                          <option v-for="client in clients" :key="client.id" :value="client.id">
                            {{ client.name }} - {{ client.company_name || 'لا توجد شركة' }}
                          </option>
                        </select>
                        <svg
                          class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <div
                        v-if="errors.client_id"
                        class="mt-2 text-sm text-red-600 flex items-center gap-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {{ errors.client_id }}
                      </div>

                      <!-- Client Preview -->
                      <div
                        v-if="selectedClient"
                        class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl"
                      >
                        <div class="flex items-start">
                          <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center ml-3"
                          >
                            <span class="text-blue-700 font-bold text-sm">
                              {{ getInitials(selectedClient.name) }}
                            </span>
                          </div>
                          <div class="flex-1">
                            <h4 class="font-semibold text-gray-900">{{ selectedClient.name }}</h4>
                            <div class="flex items-center gap-2 mt-1">
                              <span class="text-sm text-gray-600 flex items-center gap-1">
                                <svg
                                  class="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                  />
                                </svg>
                                {{ selectedClient.email }}
                              </span>
                            </div>
                            <div class="flex items-center gap-2 mt-2">
                              <span
                                class="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center gap-1"
                              >
                                <svg
                                  class="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                {{ selectedClient.phone || 'لا يوجد هاتف' }}
                              </span>
                              <span
                                v-if="selectedClient.company_name"
                                class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                              >
                                <svg
                                  class="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                {{ selectedClient.company_name }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Invoice Number -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        رقم الفاتورة
                      </label>
                      <div class="flex gap-2">
                        <input
                          v-model="invoiceData.invoice_number"
                          placeholder="سيتم توليده تلقائياً"
                          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          :class="{ 'border-red-500': errors.invoice_number }"
                        />
                        <button
                          @click="generateInvoiceNumber"
                          class="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                        >
                          <svg
                            class="w-4 h-4"
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
                          <span class="hidden sm:inline">توليد</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Dates -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الإصدار *
                      </label>
                      <div class="relative">
                        <input
                          v-model="invoiceData.invoice_date"
                          type="date"
                          required
                          class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          :class="{ 'border-red-500': errors.invoice_date }"
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
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        تاريخ الاستحقاق *
                      </label>
                      <div class="relative">
                        <input
                          v-model="invoiceData.due_date"
                          type="date"
                          required
                          class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          :class="{ 'border-red-500': errors.due_date }"
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
                      <div class="mt-2">
                        <span
                          v-if="daysUntilDue > 0"
                          class="text-sm text-green-600 flex items-center gap-1"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {{ daysUntilDue }} يوم حتى الاستحقاق
                        </span>
                        <span
                          v-else-if="daysUntilDue === 0"
                          class="text-sm text-yellow-600 flex items-center gap-1"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          مستحق اليوم
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step Navigation -->
                <div class="flex justify-between pt-6 mt-6 border-t border-gray-200">
                  <button
                    @click="$router.push('/invoices')"
                    class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    إلغاء
                  </button>
                  <button
                    @click="nextStep"
                    :disabled="!canProceedToStep1"
                    class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي: العناصر
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <!-- Step 2: Invoice Items -->
          <transition name="fade">
            <div
              v-if="currentStep === 1"
              class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <div class="flex items-center justify-between">
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
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800">عناصر الفاتورة</h3>
                  </div>
                  <button
                    @click="addItem"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    إضافة عنصر
                  </button>
                </div>
              </div>

              <div class="p-6">
                <!-- Items Table -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-4 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          الوصف
                        </th>
                        <th
                          class="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          الكمية
                        </th>
                        <th
                          class="px-4 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          السعر
                        </th>
                        <th
                          class="px-4 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          المجموع
                        </th>
                        <th
                          class="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="(item, index) in invoiceData.items"
                        :key="index"
                        class="hover:bg-gray-50/50 transition-colors"
                      >
                        <td class="px-4 py-4">
                          <input
                            v-model="item.description"
                            type="text"
                            placeholder="وصف العنصر..."
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </td>
                        <td class="px-4 py-4">
                          <div class="flex items-center justify-center">
                            <button
                              @click="item.quantity > 1 ? item.quantity-- : null"
                              :class="[
                                'w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-lg transition-colors',
                                item.quantity <= 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-50 hover:bg-gray-100 text-gray-600',
                              ]"
                            >
                              <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M20 12H4"
                                />
                              </svg>
                            </button>
                            <input
                              v-model.number="item.quantity"
                              type="number"
                              min="1"
                              class="w-16 px-2 py-2.5 border-t border-b border-gray-300 text-center focus:outline-none"
                              @input="calculateItemTotal(index)"
                            />
                            <button
                              @click="item.quantity++"
                              class="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                            >
                              <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M12 4v16m8-8H4"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td class="px-4 py-4">
                          <input
                            v-model.number="item.unit_price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            @input="calculateItemTotal(index)"
                          />
                        </td>
                        <td class="px-4 py-4 text-right font-semibold text-gray-900">
                          {{ formatCurrency(item.total || 0) }}
                        </td>
                        <td class="px-4 py-4 text-center">
                          <button
                            @click="removeItem(index)"
                            :disabled="invoiceData.items.length === 1"
                            class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Quick Add Items -->
                <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <h4 class="font-medium text-gray-700 mb-3">أضف عناصر سريعة</h4>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="quickItem in quickItems"
                      :key="quickItem.id"
                      @click="addQuickItem(quickItem)"
                      class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2"
                    >
                      <span class="text-sm">{{ quickItem.description }}</span>
                      <span class="text-xs text-gray-500">{{
                        formatCurrency(quickItem.unit_price)
                      }}</span>
                    </button>
                  </div>
                </div>

                <!-- Step Navigation -->
                <div class="flex justify-between pt-6 mt-6 border-t border-gray-200">
                  <button
                    @click="prevStep"
                    class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    السابق
                  </button>
                  <button
                    @click="nextStep"
                    :disabled="!canProceedToStep2"
                    class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي: الدفع
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <!-- Step 3: Payment & Status -->
          <transition name="fade">
            <div
              v-if="currentStep === 2"
              class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
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
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800">إعدادات الدفع والحالة</h3>
                </div>
              </div>

              <div class="p-6">
                <div class="space-y-8">
                  <!-- Invoice Status -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-4">
                      حالة الفاتورة *
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        v-for="status in statusOptions"
                        :key="status.value"
                        @click="selectStatus(status.value)"
                        :class="[
                          'p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md',
                          invoiceData.status === status.value
                            ? 'border-blue-500 bg-blue-50 transform scale-105'
                            : 'border-gray-200 bg-white hover:border-gray-300',
                        ]"
                      >
                        <div class="flex flex-col items-center text-center">
                          <div :class="status.iconBg" class="p-2 rounded-lg mb-3">
                            <svg
                              class="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                :d="status.icon"
                              />
                            </svg>
                          </div>
                          <span class="font-semibold mb-1">{{ status.label }}</span>
                          <span class="text-xs text-gray-500">{{ status.description }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Method -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-4">
                      طريقة الدفع
                    </label>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div
                        v-for="method in paymentMethods"
                        :key="method.value"
                        @click="selectPaymentMethod(method.value)"
                        :class="[
                          'p-3 border-2 rounded-lg cursor-pointer transition-all duration-200',
                          invoiceData.payment_method === method.value
                            ? 'border-blue-500 bg-blue-50 transform scale-105'
                            : 'border-gray-200 bg-white hover:border-gray-300',
                        ]"
                      >
                        <div class="flex flex-col items-center">
                          <svg
                            class="w-6 h-6 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              :d="method.icon"
                            />
                          </svg>
                          <span class="text-sm font-medium">{{ method.label }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Stripe Integration -->
                  <div class="border-t border-gray-200 pt-6">
                    <div class="flex items-center justify-between mb-6">
                      <div>
                        <h4 class="text-lg font-bold text-gray-900">Stripe Checkout</h4>
                        <p class="text-gray-600 mt-1">تفعيل الدفع الإلكتروني الآمن للعميل</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          v-model="invoiceData.enable_stripe_checkout"
                          class="sr-only peer"
                          :disabled="invoiceData.status === 'paid'"
                        />
                        <div
                          class="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"
                        ></div>
                      </label>
                    </div>

                    <div
                      v-if="invoiceData.enable_stripe_checkout"
                      class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6"
                    >
                      <div class="flex items-start">
                        <div
                          class="w-12 h-12 bg-white border border-blue-200 rounded-xl flex items-center justify-center ml-4"
                        >
                          <svg
                            class="w-8 h-8 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.227 0 1.998.561 2.382 1.426h2.12c-.473-2.103-1.966-3.518-4.502-3.518-2.536 0-4.352 1.601-4.352 3.95 0 2.506 1.956 3.518 4.352 4.313 2.386.795 3.165 1.426 3.165 2.313 0 .976-.903 1.496-2.208 1.496-1.306 0-2.456-.62-2.97-1.776h-2.21c.514 2.103 2.11 3.518 5.18 3.518 3.06 0 5.16-1.601 5.16-4.103 0-2.7-2.148-3.617-4.534-4.412z"
                            />
                          </svg>
                        </div>
                        <div class="flex-1">
                          <h5 class="font-bold text-gray-900 text-lg">Stripe Checkout مفعل</h5>
                          <p class="text-gray-700 mt-2">
                            سيتم إنشاء رابط دفع آمن يمكن مشاركته مع العميل.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step Navigation -->
                <div class="flex justify-between pt-6 mt-6 border-t border-gray-200">
                  <button
                    @click="prevStep"
                    class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    السابق
                  </button>
                  <button
                    @click="nextStep"
                    class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    التالي: المراجعة
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <!-- Step 4: Summary -->
          <transition name="fade">
            <div
              v-if="currentStep === 3"
              class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800">مراجعة الفاتورة</h3>
                </div>
              </div>

              <div class="p-6">
                <!-- Invoice Preview -->
                <div
                  class="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6"
                >
                  <div class="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                    <div>
                      <h2 class="text-2xl font-bold text-gray-900">فاتورة</h2>
                      <div class="flex items-center gap-2 mt-2">
                        <span
                          :class="getStatusBadgeClass(invoiceData.status)"
                          class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <span
                            :class="getStatusDotClass(invoiceData.status)"
                            class="w-2 h-2 rounded-full"
                          ></span>
                          {{ getStatusText(invoiceData.status) }}
                        </span>
                        <span class="text-sm text-gray-500">
                          #{{ invoiceData.invoice_number || 'سيتم توليده' }}
                        </span>
                      </div>
                    </div>
                    <div class="text-left">
                      <div class="text-3xl font-bold text-blue-600">
                        {{ formatCurrency(invoiceData.total || 0) }}
                      </div>
                      <div class="text-sm text-gray-500 mt-1">المبلغ الإجمالي</div>
                    </div>
                  </div>

                  <!-- Summary Details -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 class="font-semibold text-gray-700 mb-3">معلومات العميل</h4>
                      <div class="space-y-2">
                        <div
                          v-if="selectedClient"
                          class="bg-white p-4 rounded-xl border border-gray-200"
                        >
                          <div class="flex items-start gap-3">
                            <div
                              class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                            >
                              <span class="text-blue-700 font-bold text-sm">
                                {{ getInitials(selectedClient.name) }}
                              </span>
                            </div>
                            <div>
                              <div class="font-medium text-gray-900">{{ selectedClient.name }}</div>
                              <div class="text-sm text-gray-600">{{ selectedClient.email }}</div>
                              <div class="text-sm text-gray-600">
                                {{ selectedClient.phone || 'لا يوجد هاتف' }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 class="font-semibold text-gray-700 mb-3">تفاصيل الفاتورة</h4>
                      <div class="space-y-3">
                        <div
                          class="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200"
                        >
                          <span class="text-gray-600">تاريخ الإصدار:</span>
                          <span class="font-medium">{{
                            formatDate(invoiceData.invoice_date)
                          }}</span>
                        </div>
                        <div
                          class="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200"
                        >
                          <span class="text-gray-600">تاريخ الاستحقاق:</span>
                          <span class="font-medium">{{ formatDate(invoiceData.due_date) }}</span>
                        </div>
                        <div
                          v-if="invoiceData.payment_date"
                          class="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200"
                        >
                          <span class="text-gray-600">تاريخ الدفع:</span>
                          <span class="font-medium text-green-600">{{
                            formatDate(invoiceData.payment_date)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Financial Summary -->
                  <div class="mt-8">
                    <div class="space-y-4">
                      <div
                        class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200"
                      >
                        <span class="text-gray-600">الإجمالي الفرعي:</span>
                        <span class="font-medium">{{
                          formatCurrency(invoiceData.subtotal || 0)
                        }}</span>
                      </div>
                      <div
                        class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200"
                      >
                        <span class="text-gray-600">الضريبة ({{ invoiceData.tax_rate }}%):</span>
                        <span class="font-medium">{{
                          formatCurrency(invoiceData.tax_amount || 0)
                        }}</span>
                      </div>
                      <div
                        class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200"
                      >
                        <span class="text-gray-600">الإجمالي النهائي:</span>
                        <span class="text-xl font-bold text-blue-600">{{
                          formatCurrency(invoiceData.total || 0)
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Final Actions -->
                <div
                  class="flex flex-col sm:flex-row justify-between gap-4 pt-6 mt-6 border-t border-gray-200"
                >
                  <button
                    @click="prevStep"
                    class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    السابق
                  </button>
                  <div class="flex flex-col sm:flex-row gap-3">
                    <button
                      @click="saveAsDraft"
                      class="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      :disabled="loading"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      حفظ كمسودة
                    </button>
                    <button
                      @click="submitInvoice"
                      class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                      :disabled="loading || !isFormValid"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      {{ getSubmitButtonText() }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Right Column: Invoice Summary -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Invoice Summary Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
            <div class="flex items-center gap-3 mb-6">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 class="font-bold text-gray-900">ملخص الفاتورة</h3>
            </div>

            <div class="space-y-4">
              <div class="text-center mb-4">
                <span
                  :class="getStatusBadgeClass(invoiceData.status)"
                  class="px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2"
                >
                  <span
                    :class="getStatusDotClass(invoiceData.status)"
                    class="w-2 h-2 rounded-full"
                  ></span>
                  {{ getStatusText(invoiceData.status) }}
                </span>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">عدد العناصر:</span>
                  <span class="font-medium">{{ invoiceData.items.length }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">الإجمالي الفرعي:</span>
                  <span class="font-medium">{{ formatCurrency(invoiceData.subtotal || 0) }}</span>
                </div>
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span class="text-gray-600">الضريبة:</span>
                  <span class="font-medium">{{ formatCurrency(invoiceData.tax_amount || 0) }}</span>
                </div>
                <div
                  class="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl"
                >
                  <span class="font-semibold text-gray-900">الإجمالي النهائي:</span>
                  <span class="text-xl font-bold text-blue-600">{{
                    formatCurrency(invoiceData.total || 0)
                  }}</span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-6">
                <div class="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div class="text-sm text-gray-600">أيام الاستحقاق</div>
                  <div class="text-lg font-bold text-blue-700">{{ daysUntilDue }}</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded-xl border border-green-100">
                  <div class="text-sm text-gray-600">متوسط السعر</div>
                  <div class="text-lg font-bold text-green-700">
                    {{ formatCurrency(averagePrice) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Help Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div class="flex items-center gap-3 mb-4">
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
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="font-bold text-gray-900">مساعدة سريعة</h3>
            </div>

            <div class="space-y-3">
              <div class="flex items-start gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p class="text-sm text-gray-600">
                  استخدم Stripe Checkout لتلقي المدفوعات أونلاين بسهولة.
                </p>
              </div>
              <div class="flex items-start gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p class="text-sm text-gray-600">انقر على العناصر السريعة لإضافة بنود شائعة.</p>
              </div>
              <div class="flex items-start gap-2">
                <div class="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <p class="text-sm text-gray-600">
                  تأكد من اختيار العميل وتاريخ الاستحقاق قبل المتابعة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CreateInvoice',

  data() {
    return {
      currentStep: 0,
      steps: [
        { label: 'المعلومات الأساسية' },
        { label: 'عناصر الفاتورة' },
        { label: 'إعدادات الدفع' },
        { label: 'المراجعة النهائية' },
      ],
      invoiceData: {
        client_id: '',
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        items: [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
            total: 0,
          },
        ],
        notes: '',
        payment_method: '',
        payment_date: '',
        payment_notes: '',
        tax_rate: 15,
        discount_amount: 0,
        subtotal: 0,
        tax_amount: 0,
        total: 0,
        enable_stripe_checkout: false,
      },
      errors: {},
      quickItems: [
        { id: 1, description: 'تصميم موقع', unit_price: 500 },
        { id: 2, description: 'استضافة سنوية', unit_price: 300 },
        { id: 3, description: 'صيانة شهرية', unit_price: 200 },
        { id: 4, description: 'استشارة تقنية', unit_price: 150 },
        { id: 5, description: 'تدريب', unit_price: 400 },
      ],
      statusOptions: [
        {
          value: 'draft',
          label: 'مسودة',
          description: 'فاتورة تحت الإنشاء',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          iconBg: 'bg-gray-100',
        },
        {
          value: 'sent',
          label: 'مرسلة',
          description: 'أرسلت للعميل',
          icon: 'M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          iconBg: 'bg-blue-100',
        },
        {
          value: 'paid',
          label: 'مدفوعة',
          description: 'تم السداد',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          iconBg: 'bg-green-100',
        },
        {
          value: 'overdue',
          label: 'متأخرة',
          description: 'تجاوزت الموعد',
          icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          iconBg: 'bg-red-100',
        },
      ],
      paymentMethods: [
        {
          value: 'cash',
          label: 'نقدي',
          icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
        },
        {
          value: 'bank_transfer',
          label: 'تحويل بنكي',
          icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        },
        {
          value: 'check',
          label: 'شيك',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        },
        {
          value: 'credit_card',
          label: 'بطاقة ائتمان',
          icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        },
        {
          value: 'paypal',
          label: 'PayPal',
          icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        },
        {
          value: 'other',
          label: 'أخرى',
          icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        },
      ],
    }
  },

  computed: {
    ...mapGetters('invoices', ['loading', 'error']),
    ...mapGetters('clients', ['clients']),

    selectedClient() {
      return this.clients.find((c) => c.id == this.invoiceData.client_id)
    },

    daysUntilDue() {
      if (!this.invoiceData.due_date) return 0
      const due = new Date(this.invoiceData.due_date)
      const today = new Date()
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays < 0 ? 0 : diffDays
    },

    averagePrice() {
      if (this.invoiceData.items.length === 0) return 0
      const total = this.invoiceData.items.reduce((sum, item) => sum + (item.unit_price || 0), 0)
      return total / this.invoiceData.items.length
    },

    isFormValid() {
      return (
        this.invoiceData.client_id &&
        this.invoiceData.invoice_date &&
        this.invoiceData.due_date &&
        this.invoiceData.status &&
        this.invoiceData.items.every(
          (item) => item.description && item.quantity > 0 && item.unit_price >= 0,
        )
      )
    },

    canProceedToStep1() {
      return (
        this.invoiceData.client_id && this.invoiceData.invoice_date && this.invoiceData.due_date
      )
    },

    canProceedToStep2() {
      return this.invoiceData.items.every((item) => item.description && item.quantity > 0)
    },
  },

  mounted() {
    this.loadClients()
    this.generateInvoiceNumber()
  },

  methods: {
    ...mapActions('invoices', ['createInvoice', 'clearError']),
    ...mapActions('clients', ['fetchClients']),

    getStepProgress() {
      return ((this.currentStep + 1) / this.steps.length) * 100
    },

    async loadClients() {
      try {
        await this.fetchClients({ per_page: 100 })
      } catch (error) {
        console.error('❌ Failed to load clients:', error)
      }
    },

    generateInvoiceNumber() {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')
      this.invoiceData.invoice_number = `INV-${year}${month}${day}-${random}`
    },

    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    selectStatus(status) {
      this.invoiceData.status = status
      if (status === 'paid') {
        this.invoiceData.payment_date = new Date().toISOString().split('T')[0]
        this.invoiceData.enable_stripe_checkout = false
      }
    },

    selectPaymentMethod(method) {
      this.invoiceData.payment_method = method
    },

    addItem() {
      this.invoiceData.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
      })
    },

    addQuickItem(item) {
      this.invoiceData.items.push({
        description: item.description,
        quantity: 1,
        unit_price: item.unit_price,
        total: item.unit_price,
      })
      this.calculateTotals()
    },

    removeItem(index) {
      if (this.invoiceData.items.length > 1) {
        this.invoiceData.items.splice(index, 1)
        this.calculateTotals()
      }
    },

    calculateItemTotal(index) {
      const item = this.invoiceData.items[index]
      item.total = (item.quantity || 0) * (item.unit_price || 0)
      this.calculateTotals()
    },

    calculateTotals() {
      this.invoiceData.subtotal = this.invoiceData.items.reduce(
        (sum, item) => sum + (item.total || 0),
        0,
      )
      this.invoiceData.tax_amount = this.invoiceData.subtotal * (this.invoiceData.tax_rate / 100)
      this.invoiceData.total =
        this.invoiceData.subtotal + this.invoiceData.tax_amount - this.invoiceData.discount_amount
    },

    saveAsDraft() {
      this.invoiceData.status = 'draft'
      this.submitInvoice()
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

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ر.س'
      return parseFloat(amount).toFixed(2) + ' ر.س'
    },

    formatDate(dateString) {
      if (!dateString) return 'غير محدد'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },

    getStatusBadgeClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800 border border-gray-200',
        sent: 'bg-blue-100 text-blue-800 border border-blue-200',
        paid: 'bg-green-100 text-green-800 border border-green-200',
        overdue: 'bg-red-100 text-red-800 border border-red-200',
      }
      return classes[status] || 'bg-gray-100 text-gray-800 border border-gray-200'
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
      const map = { draft: 'مسودة', sent: 'مرسلة', paid: 'مدفوعة', overdue: 'متأخرة' }
      return map[status] || status
    },

    getSubmitButtonText() {
      if (this.invoiceData.status === 'paid') return 'إنشاء وتعيين كمدفوعة'
      if (this.invoiceData.status === 'sent') return 'إنشاء وإرسال'
      if (this.invoiceData.enable_stripe_checkout) return 'إنشاء وتفعيل Stripe'
      return 'إنشاء الفاتورة'
    },

    async submitInvoice() {
      this.errors = {}

      if (!this.invoiceData.client_id) {
        this.errors.client_id = 'الرجاء اختيار عميل'
      }

      if (!this.invoiceData.invoice_date) {
        this.errors.invoice_date = 'الرجاء اختيار تاريخ الإصدار'
      }

      if (!this.invoiceData.due_date) {
        this.errors.due_date = 'الرجاء اختيار تاريخ الاستحقاق'
      }

      if (!this.invoiceData.status) {
        this.errors.status = 'الرجاء اختيار حالة الفاتورة'
      }

      if (this.invoiceData.status === 'paid' && !this.invoiceData.payment_method) {
        this.errors.payment_method = 'الرجاء اختيار طريقة الدفع'
      }

      if (Object.keys(this.errors).length > 0) {
        this.currentStep = 0
        return
      }

      try {
        const data = {
          client_id: this.invoiceData.client_id,
          invoice_number: this.invoiceData.invoice_number,
          invoice_date: this.invoiceData.invoice_date,
          due_date: this.invoiceData.due_date,
          status: this.invoiceData.status,
          items: this.invoiceData.items.map((item) => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unit_price: parseFloat(item.unit_price),
          })),
          subtotal: this.invoiceData.subtotal,
          tax_rate: this.invoiceData.tax_rate,
          tax_amount: this.invoiceData.tax_amount,
          discount_amount: this.invoiceData.discount_amount,
          total: this.invoiceData.total,
          notes: this.invoiceData.notes,
          payment_method: this.invoiceData.payment_method,
          payment_date: this.invoiceData.payment_date,
          payment_notes: this.invoiceData.payment_notes,
          enable_stripe_checkout: this.invoiceData.enable_stripe_checkout,
        }

        await this.createInvoice(data)

        let successMessage = 'تم إنشاء الفاتورة بنجاح'
        if (this.invoiceData.status === 'paid') {
          successMessage = 'تم إنشاء الفاتورة وتعيينها كمدفوعة'
        } else if (this.invoiceData.enable_stripe_checkout) {
          successMessage = 'تم إنشاء الفاتورة وتفعيل Stripe Checkout'
        }

        this.$toast.success(successMessage)
        this.$router.push('/invoices')
      } catch (error) {
        console.error('❌ خطأ في إنشاء الفاتورة:', error)
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error(error.response?.data?.message || 'حدث خطأ في إنشاء الفاتورة')
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
    'invoiceData.tax_rate': {
      handler() {
        this.calculateTotals()
      },
    },
    'invoiceData.discount_amount': {
      handler() {
        this.calculateTotals()
      },
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* تحسينات الجدول */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th {
  font-weight: 600;
  letter-spacing: 0.025em;
}

td {
  border-bottom: 1px solid #f3f4f6;
}

tr:last-child td {
  border-bottom: none;
}

/* تحسينات الأيقونات */
svg {
  display: inline-block;
  vertical-align: middle;
}

/* تأثيرات hover محسنة */
tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* تحسينات الأزرار */
button:not(:disabled):hover {
  transform: translateY(-1px);
}

/* تخصيص شريط التمرير */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* تحسينات للجوّال */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 768px;
  }
}
</style>
