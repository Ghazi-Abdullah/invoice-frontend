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
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('invoices.create.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('invoices.create.subtitle') }}</p>
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
              <span class="hidden sm:inline">{{ $t('common.back') }}</span>
            </button>
          </div>
        </div>

        <!-- Progress Steps -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <div class="text-sm text-gray-600">
              {{ $t('common.step') }}
              <span class="font-bold text-blue-600">{{ currentStep + 1 }}</span>
              {{ $t('common.of') }} {{ steps.length }}
            </div>
            <div class="text-sm text-gray-600">
              <span class="font-bold text-gray-900">{{ getStepProgress() }}%</span>
              {{ $t('common.completed') }}
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
                >{{ $t(step.labelKey) }}</span
              >
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
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ $t('invoices.create.basic_info') }}
                  </h3>
                </div>
              </div>
              <div class="p-6">
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2"
                        >{{ $t('invoices.create.client') }} *</label
                      >
                      <div class="relative">
                        <select
                          v-model="invoiceData.client_id"
                          required
                          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                          :class="{ 'border-red-500': errors.client_id }"
                        >
                          <option value="">{{ $t('common.select_client') }}</option>
                          <option v-for="client in clients" :key="client.id" :value="client.id">
                            {{ client.name }} - {{ client.company_name || $t('common.no_company') }}
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
                        {{ $t('validation.client_required') }}
                      </div>
                      <div
                        v-if="selectedClient"
                        class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl"
                      >
                        <div class="flex items-start">
                          <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center ml-3"
                          >
                            <span class="text-blue-700 font-bold text-sm">{{
                              getInitials(selectedClient.name)
                            }}</span>
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
                                {{ selectedClient.phone || $t('common.no_phone') }}
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
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{
                        $t('invoices.create.invoice_number')
                      }}</label>
                      <div class="flex gap-2">
                        <input
                          v-model="invoiceData.invoice_number"
                          :placeholder="$t('common.auto_generated')"
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
                          <span class="hidden sm:inline">{{ $t('common.generate') }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{
                        $t('common.fromDate')
                      }}</label>
                      <div class="relative">
                        <input
                          type="date"
                          v-model="invoiceData.invoice_date"
                          class="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                          class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                      <label class="block text-sm font-medium text-gray-700 mb-2">{{
                        $t('common.toDate')
                      }}</label>
                      <div class="relative">
                        <input
                          type="date"
                          v-model="invoiceData.due_date"
                          class="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <svg
                          class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                  </div>
                </div>
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
                    {{ $t('common.cancel') }}
                  </button>
                  <button
                    @click="nextStep"
                    :disabled="!canProceedToStep1"
                    class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ $t('common.next') }}: {{ $t('invoices.create.items') }}
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
                    <h3 class="text-lg font-semibold text-gray-800">
                      {{ $t('invoices.create.items') }}
                    </h3>
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
                    {{ $t('invoices.create.add_item') }}
                  </button>
                </div>
              </div>
              <div class="p-6">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          {{ $t('invoices.create.description') }}
                        </th>
                        <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          {{ $t('invoices.create.quantity') }}
                        </th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          {{ $t('invoices.create.unit_price') }}
                        </th>
                        <th class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                          {{ $t('invoices.create.total') }}
                        </th>
                        <th class="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                          {{ $t('common.actions') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in invoiceData.items" :key="index">
                        <td class="px-4 py-4">
                          <input
                            v-model="item.description"
                            type="text"
                            class="w-full px-3 py-2 border rounded-lg"
                          />
                        </td>
                        <td class="px-4 py-4">
                          <div class="flex">
                            <button
                              @click="item.quantity > 1 ? item.quantity-- : null"
                              class="px-3 py-1 border rounded-l"
                            >
                              -
                            </button>
                            <input
                              v-model.number="item.quantity"
                              type="number"
                              min="1"
                              class="w-16 text-center border-y"
                            />
                            <button @click="item.quantity++" class="px-3 py-1 border rounded-r">
                              +
                            </button>
                          </div>
                        </td>
                        <td class="px-4 py-4">
                          <input
                            v-model.number="item.unit_price"
                            type="number"
                            min="0"
                            step="0.01"
                            class="w-full px-3 py-2 border rounded-lg"
                            @input="calculateItemTotal(index)"
                          />
                        </td>
                        <td class="px-4 py-4 text-right">{{ formatCurrency(item.total) }}</td>
                        <td class="px-4 py-4 text-center">
                          <button
                            @click="removeItem(index)"
                            :disabled="invoiceData.items.length === 1"
                            class="text-red-600 disabled:opacity-30"
                          >
                            {{ $t('common.delete') || 'حذف' }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex justify-between pt-6 mt-6 border-t border-gray-200">
                  <button
                    @click="prevStep"
                    class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {{ $t('common.previous') }}
                  </button>
                  <button
                    @click="nextStep"
                    :disabled="!canProceedToStep2"
                    class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ $t('common.next') }}: {{ $t('invoices.create.payment_settings') }}
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
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ $t('invoices.create.payment_settings') }}
                  </h3>
                </div>
              </div>
              <div class="p-6">
                <div class="space-y-8">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-4"
                      >{{ $t('invoices.create.status') }} *</label
                    >
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div
                        v-for="status in statusOptions"
                        :key="status.value"
                        @click="selectStatus(status.value)"
                        :class="[
                          'p-4 border-2 rounded-xl cursor-pointer',
                          invoiceData.status === status.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white',
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
                          <span class="font-semibold">{{
                            $t(`invoices.status.${status.value}`)
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- خطة الأقساط -->
                  <div class="border-t pt-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-lg font-bold">{{ $t('installments.title') }}</h4>
                        <p class="text-gray-600">
                          {{
                            $t('installments.create_offer_description') ||
                            'يمكنك تقسيط مبلغ هذه الفاتورة على العميل بعد إنشائها مباشرة.'
                          }}
                        </p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          v-model="wantsInstallmentPlan"
                          class="sr-only peer"
                          :disabled="
                            invoiceData.status === 'paid' || invoiceData.status === 'draft'
                          "
                        />
                        <div
                          class="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"
                        ></div>
                      </label>
                    </div>
                    <p v-if="invoiceData.status === 'draft'" class="text-xs text-gray-400 mt-2">
                      {{
                        $t('installments.not_available_for_draft') ||
                        'خطط الأقساط متاحة فقط للفواتير غير المسودة.'
                      }}
                    </p>
                    <p v-else-if="wantsInstallmentPlan" class="text-xs text-blue-600 mt-2">
                      {{
                        $t('installments.offer_hint') ||
                        'سنعرض عليك إعداد خطة الأقساط مباشرة بعد حفظ الفاتورة.'
                      }}
                    </p>
                  </div>

                  <div class="border-t pt-6">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-lg font-bold">Stripe Checkout</h4>
                        <p class="text-gray-600">{{ $t('invoices.create.stripe_description') }}</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          v-model="invoiceData.enable_stripe_checkout"
                          class="sr-only peer"
                          :disabled="invoiceData.status === 'paid' || wantsInstallmentPlan"
                        />
                        <div
                          class="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[4px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"
                        ></div>
                      </label>
                    </div>
                    <div
                      v-if="invoiceData.enable_stripe_checkout && errors.stripe_amount"
                      class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                    >
                      {{ errors.stripe_amount }}
                    </div>
                  </div>
                </div>
                <div class="flex justify-between pt-6 mt-6 border-t">
                  <button
                    @click="prevStep"
                    class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg"
                  >
                    {{ $t('common.previous') }}
                  </button>
                  <button @click="nextStep" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg">
                    {{ $t('common.next') }}: {{ $t('invoices.create.review') }}
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
                <h3 class="text-lg font-semibold">{{ $t('invoices.create.review') }}</h3>
              </div>
              <div class="p-6">
                <div class="bg-gray-50 p-6 rounded-xl">
                  <div class="flex justify-between">
                    <span>{{ $t('invoices.create.total') }}:</span>
                    <span class="text-2xl font-bold text-blue-600">{{
                      formatCurrency(invoiceData.total)
                    }}</span>
                  </div>
                  <div
                    v-if="wantsInstallmentPlan"
                    class="flex items-center gap-2 mt-3 text-sm text-blue-700"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{
                      $t('installments.will_offer_after_save') ||
                      'سيتم فتح إعداد خطة الأقساط بعد حفظ الفاتورة'
                    }}
                  </div>
                </div>
                <div class="flex justify-between pt-6 mt-6 border-t">
                  <button
                    @click="prevStep"
                    class="px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg"
                  >
                    {{ $t('common.previous') }}
                  </button>
                  <div class="flex gap-3">
                    <button
                      @click="saveAsDraft"
                      class="px-6 py-2.5 bg-gray-600 text-white rounded-lg disabled:opacity-50"
                      :disabled="loading"
                    >
                      {{ $t('common.save_draft') }}
                    </button>
                    <button
                      @click="submitInvoice"
                      class="px-6 py-2.5 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="loading || !isFormValid"
                    >
                      {{ loading ? $t('common.loading') || 'جاري...' : getSubmitButtonText() }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Right Column: Invoice Summary -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white rounded-xl border p-6 sticky top-6">
            <h3 class="font-bold mb-4">{{ $t('invoice.create.summary') }}</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span>{{ $t('invoices.create.subtotal') }}:</span>
                <span>{{ formatCurrency(invoiceData.subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('invoices.create.tax') }}:</span>
                <span>{{ formatCurrency(invoiceData.tax_amount) }}</span>
              </div>
              <div class="flex justify-between font-bold text-blue-600 border-t pt-3 mt-3">
                <span>{{ $t('invoices.create.total') }}:</span>
                <span>{{ formatCurrency(invoiceData.total) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- خطة الأقساط — تُعرض بعد إنشاء الفاتورة مباشرة إذا اختار المستخدم ذلك في الخطوة 3 -->
    <CreateInstallmentPlanModal
      v-if="newInvoiceId"
      :show="showInstallmentModal"
      :invoice-id="newInvoiceId"
      :invoice-total="newInvoiceTotal"
      :submitting="false"
      @close="finishAndRedirect"
      @created="finishAndRedirect"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateInstallmentPlanModal from '@/components/invoices/CreateInstallmentPlanModal.vue'

export default {
  name: 'CreateInvoice',
  components: {
    CreateInstallmentPlanModal,
  },
  data() {
    return {
      minStripeAmount: 5,
      currentStep: 0,
      steps: [
        { labelKey: 'steps.basic' },
        { labelKey: 'steps.items' },
        { labelKey: 'steps.payment' },
        { labelKey: 'steps.review' },
      ],
      invoiceData: {
        client_id: '',
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        items: [{ description: '', quantity: 1, unit_price: 0, total: 0 }],
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
      statusOptions: [
        {
          value: 'draft',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          iconBg: 'bg-gray-100',
        },
        {
          value: 'sent',
          icon: 'M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          iconBg: 'bg-blue-100',
        },
        {
          value: 'paid',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          iconBg: 'bg-green-100',
        },
        {
          value: 'overdue',
          icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          iconBg: 'bg-red-100',
        },
      ],
      // خطة الأقساط
      wantsInstallmentPlan: false,
      newInvoiceId: null,
      newInvoiceTotal: 0,
      showInstallmentModal: false,
    }
  },
  computed: {
    ...mapGetters('invoices', ['loading', 'error']),
    ...mapGetters('clients', ['clients']),
    selectedClient() {
      return this.clients.find((c) => c.id == this.invoiceData.client_id)
    },
    isFormValid() {
      return (
        this.invoiceData.client_id &&
        this.invoiceData.invoice_date &&
        this.invoiceData.due_date &&
        this.invoiceData.status &&
        this.invoiceData.items.every((i) => i.description && i.quantity > 0 && i.unit_price >= 0)
      )
    },
    canProceedToStep1() {
      return (
        this.invoiceData.client_id && this.invoiceData.invoice_date && this.invoiceData.due_date
      )
    },
    canProceedToStep2() {
      return this.invoiceData.items.every((i) => i.description && i.quantity > 0)
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
      } catch (e) {
        console.error(e)
      }
    },

    generateInvoiceNumber() {
      const d = new Date()
      this.invoiceData.invoice_number = `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, '0')}`
    },

    nextStep() {
      if (this.currentStep < this.steps.length - 1) this.currentStep++
    },

    prevStep() {
      if (this.currentStep > 0) this.currentStep--
    },

    selectStatus(status) {
      this.invoiceData.status = status
      if (status === 'paid') {
        this.invoiceData.payment_date = new Date().toISOString().split('T')[0]
        this.invoiceData.enable_stripe_checkout = false
        this.wantsInstallmentPlan = false
      }
      if (status === 'draft') {
        this.wantsInstallmentPlan = false
      }
    },

    addItem() {
      this.invoiceData.items.push({ description: '', quantity: 1, unit_price: 0, total: 0 })
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
      this.invoiceData.subtotal = this.invoiceData.items.reduce((s, i) => s + (i.total || 0), 0)
      this.invoiceData.tax_amount = this.invoiceData.subtotal * (this.invoiceData.tax_rate / 100)
      this.invoiceData.total =
        this.invoiceData.subtotal + this.invoiceData.tax_amount - this.invoiceData.discount_amount
    },

    saveAsDraft() {
      this.invoiceData.status = 'draft'
      this.wantsInstallmentPlan = false
      this.submitInvoice()
    },

    getInitials(name) {
      return name
        ? name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .substring(0, 2)
        : '؟؟'
    },

    formatCurrency(amount) {
      return parseFloat(amount || 0).toFixed(2) + ' ' + this.$t('currency.sar')
    },

    getSubmitButtonText() {
      if (this.invoiceData.status === 'paid') return this.$t('common.create_and_mark_paid')
      if (this.wantsInstallmentPlan)
        return this.$t('installments.create_and_setup_plan') || this.$t('common.create_invoice')
      if (this.invoiceData.status === 'sent') return this.$t('common.create_and_send')
      if (this.invoiceData.enable_stripe_checkout) return this.$t('common.create_and_enable_stripe')
      return this.$t('common.create_invoice')
    },

    validateStripeAmount() {
      if (
        this.invoiceData.enable_stripe_checkout &&
        this.invoiceData.total < this.minStripeAmount
      ) {
        this.errors.stripe_amount = `لا يمكن تفعيل Stripe للمبالغ الأقل من ${this.minStripeAmount} ريال. الرجاء زيادة المبلغ أو تعطيل Stripe.`
        return false
      }
      delete this.errors.stripe_amount
      return true
    },

    finishAndRedirect() {
      this.showInstallmentModal = false
      if (this.newInvoiceId) {
        this.$router.push(`/invoices/${this.newInvoiceId}`)
      } else {
        this.$router.push('/invoices')
      }
    },

    async submitInvoice() {
      this.errors = {}

      if (!this.invoiceData.client_id) this.errors.client_id = this.$t('validation.client_required')
      if (!this.invoiceData.invoice_date)
        this.errors.invoice_date = this.$t('validation.date_required')
      if (!this.invoiceData.due_date) this.errors.due_date = this.$t('validation.date_required')
      if (!this.invoiceData.status) this.errors.status = this.$t('validation.status_required')

      if (!this.validateStripeAmount()) {
        this.currentStep = 2
        return
      }

      if (Object.keys(this.errors).length) {
        this.currentStep = 0
        return
      }

      try {
        const data = {
          ...this.invoiceData,
          items: this.invoiceData.items.map((i) => ({
            description: i.description,
            quantity: parseFloat(i.quantity),
            unit_price: parseFloat(i.unit_price),
          })),
        }

        const result = await this.createInvoice(data)

        // ✅ الإصلاح: توجيه لـ Stripe إذا مفعّل
        if (result && result.redirectToStripe && result.stripeUrl) {
          window.location.href = result.stripeUrl
          return
        }

        this.$toast.success(this.$t('invoice.messages.created'))

        // ✅ الإصلاح الرئيسي: التوجيه لصفحة تفاصيل الفاتورة المنشأة
        if (result && result.invoice && result.invoice.id) {
          this.newInvoiceId = result.invoice.id
          this.newInvoiceTotal = result.invoice.total

          // إذا اختار المستخدم إعداد خطة أقساط في الخطوة 3، افتح النافذة
          // المخصصة لذلك (نفس المكوّن المستخدم في صفحة تفاصيل الفاتورة)
          // بدل التوجيه المباشر.
          if (this.wantsInstallmentPlan) {
            this.showInstallmentModal = true
            return
          }

          this.$router.push(`/invoices/${result.invoice.id}`)
        } else {
          this.$router.push('/invoices')
        }
      } catch (error) {
        console.error(error)
        this.$toast.error(error.response?.data?.message || this.$t('invoice.messages.error'))
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
    'invoiceData.tax_rate'() {
      this.calculateTotals()
    },
    'invoiceData.discount_amount'() {
      this.calculateTotals()
    },
  },
}
</script>

<style scoped></style>
