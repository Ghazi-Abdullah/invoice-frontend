<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
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
                  {{ $t('invoices.invoicedetails') || 'تفاصيل الفاتورة' }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">
                  {{ $t('invoices.detailsDescription') || 'عرض معلومات الفاتورة كاملة' }}
                </p>
              </div>
            </div>
            <nav class="flex mt-3" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-1 space-x-reverse">
                <li>
                  <router-link
                    to="/invoices"
                    class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {{ $t('invoices.title') || 'الفواتير' }}
                  </router-link>
                </li>
                <li>
                  <svg class="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </li>
                <li class="text-sm font-medium text-blue-600">
                  {{ invoice?.invoice_number || '...' }}
                </li>
              </ol>
            </nav>
          </div>
          <div class="flex gap-3">
            <button
              @click="$router.push('/invoices')"
              class="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {{ $t('common.back') || 'رجوع' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
        ></div>
        <p class="text-gray-600 text-lg mt-4">{{ $t('common.loading') || 'جاري التحميل...' }}</p>
      </div>

      <!-- Not Found State -->
      <div
        v-else-if="notFound"
        class="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center"
      >
        <svg
          class="w-16 h-16 text-yellow-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-xl font-bold text-yellow-800 mb-2">
          {{ $t('invoices.notFound') || 'الفاتورة غير موجودة' }}
        </h3>
        <p class="text-yellow-700 mb-6">
          {{ $t('invoices.notFoundMessage') || 'لم يتم العثور على فاتورة بهذا الرقم' }}
        </p>
        <button
          @click="$router.push('/invoices')"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ $t('common.backToList') || 'العودة إلى القائمة' }}
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-red-400 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="mr-3 flex-1">
            <h3 class="text-sm font-medium text-red-800">{{ $t('common.error') || 'خطأ' }}</h3>
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
        <div class="mt-3">
          <button
            @click="loadInvoice"
            class="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
          >
            {{ $t('common.retry') || 'إعادة المحاولة' }}
          </button>
        </div>
      </div>

      <!-- Invoice Details -->
      <div v-else-if="invoice" class="space-y-6" id="invoiceDetails">
        <!-- شريط تنبيه "مدفوعة — التعديل غير متاح" -->
        <div
          v-if="invoice.status === 'paid'"
          class="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg">
            <svg
              class="w-5 h-5 text-green-600"
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
          <div class="flex-1">
            <p class="text-green-800 font-semibold text-sm">
              {{ $t('invoices.paidInvoiceNotice') || 'هذه الفاتورة مدفوعة — لا يمكن تعديلها' }}
            </p>
            <p class="text-green-700 text-xs mt-0.5">
              {{
                $t('invoices.paidInvoiceSubNotice') || 'يمكنك فقط حذفها أو إلغاؤها إذا لزم الأمر'
              }}
            </p>
          </div>
          <span class="text-xs text-green-600 font-medium">
            {{ $t('invoices.paidAt') || 'دُفعت في' }}: {{ formatDate(invoice.paid_at) }}
          </span>
        </div>

        <!-- Invoice Summary Card -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div
            class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex flex-wrap items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-100 rounded-lg">
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
              <h2 class="text-lg font-semibold text-gray-800">
                {{ $t('invoices.basicInfo') || 'معلومات الفاتورة' }}
              </h2>
            </div>
            <div class="flex items-center gap-4">
              <span
                :class="getStatusBadgeClass(invoice.status)"
                class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
              >
                <span
                  :class="getStatusDotClass(invoice.status)"
                  class="w-2 h-2 rounded-full"
                ></span>
                {{ getStatusText(invoice.status) }}
              </span>
              <div
                v-if="invoice.enable_stripe_checkout"
                class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Stripe
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- العمود الأول -->
              <div class="space-y-3">
                <div class="flex items-center gap-2">
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
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                  <span class="font-semibold text-gray-900">{{ invoice.invoice_number }}</span>
                </div>
                <div class="flex items-center gap-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-gray-700">
                    {{ $t('invoices.issueDate') || 'تاريخ الإصدار' }}:
                    <span class="font-medium">{{ formatDate(invoice.invoice_date) }}</span>
                  </span>
                </div>
                <div class="flex items-center gap-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-gray-700">
                    {{ $t('invoices.dueDate') || 'تاريخ الاستحقاق' }}:
                    <span class="font-medium">{{ formatDate(invoice.due_date) }}</span>
                  </span>
                </div>
                <div v-if="invoice.paid_at" class="flex items-center gap-2">
                  <svg
                    class="w-5 h-5 text-green-500"
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
                  <span class="text-gray-700">
                    {{ $t('invoices.paymentDate') || 'تاريخ الدفع' }}:
                    <span class="font-medium text-green-700">{{
                      formatDate(invoice.paid_at)
                    }}</span>
                  </span>
                </div>
              </div>

              <!-- العمود الثاني -->
              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                  {{ $t('clients.client') || 'العميل' }}
                </h3>
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0"
                  >
                    {{ getInitials(invoice.client?.name) }}
                  </div>
                  <div>
                    <div class="font-medium">{{ invoice.client?.name }}</div>
                    <div class="text-sm text-gray-500">{{ invoice.client?.email }}</div>
                  </div>
                </div>
                <div class="text-sm text-gray-700 flex items-center gap-2">
                  <svg
                    class="w-4 h-4 text-gray-400"
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
                  <span>{{ invoice.client?.phone || $t('common.notAvailable') }}</span>
                </div>
                <div
                  v-if="invoice.client?.company_name && invoice.client.company_name !== '.'"
                  class="text-sm text-gray-700 flex items-center gap-2"
                >
                  <svg
                    class="w-4 h-4 text-gray-400"
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
                  <span>{{ invoice.client.company_name }}</span>
                </div>
              </div>

              <!-- العمود الثالث -->
              <div class="space-y-3">
                <h3 class="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                  {{ $t('invoices.summary') || 'ملخص' }}
                </h3>
                <div class="flex justify-between text-sm">
                  <span>{{ $t('invoices.subtotal') || 'المجموع الفرعي' }}:</span>
                  <span class="font-medium">{{ formatCurrency(invoice.subtotal) }}</span>
                </div>
                <div
                  v-if="parseFloat(invoice.discount_amount) > 0"
                  class="flex justify-between text-sm"
                >
                  <span>{{ $t('invoices.discount') || 'الخصم' }}:</span>
                  <span class="font-medium text-red-600"
                    >-{{ formatCurrency(invoice.discount_amount) }}</span
                  >
                </div>
                <div class="flex justify-between text-sm">
                  <span>{{ $t('invoices.tax') || 'الضريبة' }} ({{ invoice.tax_rate || 0 }}%):</span>
                  <span class="font-medium">{{ formatCurrency(invoice.tax_amount) }}</span>
                </div>
                <div
                  class="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2"
                >
                  <span>{{ $t('invoices.total') || 'الإجمالي' }}:</span>
                  <span class="text-blue-600">{{ formatCurrency(invoice.total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table Card -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
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
              {{ $t('invoices.items') || 'عناصر الفاتورة' }}
            </h2>
          </div>
          <div class="p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.description') || 'الوصف' }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.quantity') || 'الكمية' }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.unitPrice') || 'السعر' }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.total') || 'الإجمالي' }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, idx) in invoice.items" :key="idx" class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ item.description }}
                      <span v-if="item.notes" class="block text-xs text-gray-500">{{
                        item.notes
                      }}</span>
                    </td>
                    <td class="px-6 py-4 text-sm text-center">{{ item.quantity }}</td>
                    <td class="px-6 py-4 text-sm text-center">
                      {{ formatCurrency(item.unit_price) }}
                    </td>
                    <td class="px-6 py-4 text-sm text-center font-medium">
                      {{ formatCurrency(item.total) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Created/Printed Info -->
        <div
          class="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm p-5 text-sm"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-2 text-gray-600">
              <div class="p-1.5 bg-blue-50 rounded-lg">
                <svg
                  class="w-4 h-4 text-blue-500"
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
              <span class="font-medium">{{ $t('reports.created_by') || 'أنشئ بواسطة' }}:</span>
              <span class="font-semibold text-gray-800">{{
                invoice.created_by?.name || 'N/A'
              }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <div class="p-1.5 bg-green-50 rounded-lg">
                <svg
                  class="w-4 h-4 text-green-500"
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
              <span class="font-medium">{{ $t('reports.created_on') || 'تاريخ الإنشاء' }}:</span>
              <span class="font-semibold text-gray-800">{{
                formatDateTime(invoice.created_at)
              }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <div class="p-1.5 bg-purple-50 rounded-lg">
                <svg
                  class="w-4 h-4 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </div>
              <span class="font-medium">{{ $t('reports.printed_by') || 'طبع بواسطة' }}:</span>
              <span class="font-semibold text-gray-800">{{ printedBy }}</span>
            </div>
            <div class="flex items-center gap-2 text-gray-600">
              <div class="p-1.5 bg-orange-50 rounded-lg">
                <svg
                  class="w-4 h-4 text-orange-500"
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
              </div>
              <span class="font-medium">{{ $t('reports.printed_on') || 'تاريخ الطباعة' }}:</span>
              <span class="font-semibold text-gray-800">{{ printedOn }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        v-if="invoice"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mt-6 flex flex-wrap gap-3 justify-between items-center"
      >
        <!-- الأزرار اليسرى: طباعة، إيميل، Stripe -->
        <div class="flex flex-wrap gap-3">
          <button
            @click="printInvoice"
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            {{ $t('invoices.print_invoice') || 'طباعة' }}
          </button>

          <button
            v-if="invoice.client?.email"
            @click="sendEmail"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {{ $t('invoices.sendEmail') || 'إرسال بالبريد' }}
          </button>

          <button
            v-if="invoice.enable_stripe_checkout && invoice.status !== 'paid'"
            @click="payWithStripe"
            :disabled="stripeLoading"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="stripeLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            {{
              stripeLoading
                ? $t('common.loading') || 'جاري التحميل...'
                : $t('invoices.payWithStripe') || 'ادفع عبر Stripe'
            }}
          </button>
        </div>

        <!-- الأزرار اليمنى -->
        <div class="flex flex-wrap gap-3">
          <router-link
            v-if="hasEditPermission && invoice.status !== 'paid'"
            :to="`/invoices/${invoice.id}/edit`"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            {{ $t('common.edit') || 'تعديل' }}
          </router-link>

          <button
            v-if="hasEditPermission && invoice.status === 'paid'"
            @click="confirmCancel"
            :disabled="cancelLoading"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="cancelLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            {{ $t('invoices.cancelInvoice') || 'إلغاء الفاتورة' }}
          </button>

          <button
            v-if="hasDeletePermission"
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {{ $t('common.delete') || 'حذف' }}
          </button>
        </div>
      </div>

      <!-- Installment Plan Section -->
      <InstallmentPlanSection
        v-if="invoice"
        :invoice-id="invoice.id"
        :invoice-total="invoice.total"
        :can-manage="canManageInstallments"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import InstallmentPlanSection from '@/components/invoices/InstallmentPlanSection.vue'

export default {
  components: {
    InstallmentPlanSection,
  },
  name: 'InvoiceDetails',

  data() {
    return {
      loading: true,
      error: null,
      notFound: false,
      invoice: null,
      printedOn: moment().format('DD-MM-YYYY hh:mm a'),
      printedBy: JSON.parse(localStorage.getItem('userInfo') || '{}')?.user?.name || 'User',
      hasEditPermission: false,
      hasDeletePermission: false,
      stripeLoading: false,
      cancelLoading: false,
    }
  },

  computed: {
    ...mapGetters('auth', ['user', 'permissions']),

    isPaid() {
      return this.invoice?.status === 'paid'
    },

    // دمج صلاحيات التعديل وإنشاء الأقساط في متحساب واحد
    canManageInstallments() {
      return this.hasEditPermission // أو يمكن إضافة صلاحية منفصلة مستقبلاً
    },
  },

  mounted() {
    this.checkPermissions()
    this.loadInvoice()
    this.checkPaymentReturn()
  },

  methods: {
    ...mapActions('invoices', ['fetchInvoice', 'deleteInvoice', 'updateInvoiceStatus']),
    ...mapActions('payments', ['createPaymentSession']),

    checkPermissions() {
      const perms = this.permissions || []
      this.hasEditPermission = perms.includes('edit_invoice')
      this.hasDeletePermission = perms.includes('delete_invoice')
    },

    async loadInvoice() {
      this.loading = true
      this.error = null
      this.notFound = false

      const id = this.$route.params.id
      if (!id) {
        this.error = 'رقم الفاتورة غير صالح'
        this.loading = false
        return
      }

      try {
        const invoice = await this.fetchInvoice(id)
        if (invoice && invoice.id) {
          this.invoice = invoice
        } else {
          this.notFound = true
        }
      } catch (err) {
        if (err.response?.status === 404) {
          this.notFound = true
        } else {
          this.error = err.message || 'حدث خطأ أثناء تحميل الفاتورة'
        }
      } finally {
        this.loading = false
      }
    },

    checkPaymentReturn() {
      const status = this.$route.query.payment
      if (!status) return

      if (status === 'success') {
        this.$toast.success(this.$t('invoices.paymentSuccess') || 'تم الدفع بنجاح!')
        this.loadInvoice()
      } else if (status === 'cancelled') {
        this.$toast.warning(this.$t('invoices.paymentCancelled') || 'تم إلغاء الدفع')
      }

      this.$router.replace({ query: {} })
    },

    async payWithStripe() {
      this.stripeLoading = true
      try {
        const data = await this.createPaymentSession(this.invoice.id)
        if (data?.url) {
          window.location.href = data.url
        }
      } catch (err) {
        this.$toast.error(err.message || this.$t('invoices.paymentError') || 'فشل في بدء الدفع')
      } finally {
        this.stripeLoading = false
      }
    },

    confirmCancel() {
      this.$swal
        .fire({
          title: this.$t('invoices.cancelConfirmTitle') || 'إلغاء الفاتورة المدفوعة؟',
          html: `
            <p>${this.$t('invoices.cancelConfirmText') || 'سيتم تغيير حالة الفاتورة إلى "ملغاة".'}</p>
            <p class="text-sm text-orange-600 mt-2 font-medium">
              ${this.$t('invoices.cancelWarning') || 'تأكد من معالجة استرجاع المبلغ (Refund) في Stripe إذا لزم.'}
            </p>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#F97316',
          cancelButtonColor: '#6B7280',
          confirmButtonText: this.$t('invoices.confirmCancel') || 'نعم، إلغاء الفاتورة',
          cancelButtonText: this.$t('common.back') || 'تراجع',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.cancelInvoice()
          }
        })
    },

    async cancelInvoice() {
      this.cancelLoading = true
      try {
        await this.updateInvoiceStatus({ id: this.invoice.id, status: 'cancelled' })
        this.$toast.success(this.$t('invoices.cancelSuccess') || 'تم إلغاء الفاتورة')
        await this.loadInvoice()
      } catch (err) {
        this.$toast.error(err.message || 'فشل إلغاء الفاتورة')
      } finally {
        this.cancelLoading = false
      }
    },

    clearError() {
      this.error = null
    },

    getInitials(name) {
      if (!name) return '?'
      return name.substring(0, 2).toUpperCase()
    },

    formatDate(date) {
      if (!date) return '-'
      return moment(date).format('DD/MM/YYYY')
    },

    formatDateTime(date) {
      if (!date) return '-'
      return moment(date).format('DD/MM/YYYY hh:mm a')
    },

    formatCurrency(amount) {
      if (amount === null || amount === undefined) return '-'
      const currency = this.invoice?.currency || 'SAR'
      return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount)
    },

    getStatusBadgeClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800 border border-gray-200',
        sent: 'bg-blue-100 text-blue-800 border border-blue-200',
        paid: 'bg-green-100 text-green-800 border border-green-200',
        overdue: 'bg-red-100 text-red-800 border border-red-200',
        cancelled: 'bg-gray-200 text-gray-700 border border-gray-300',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusDotClass(status) {
      const classes = {
        draft: 'bg-gray-500',
        sent: 'bg-blue-500',
        paid: 'bg-green-500',
        overdue: 'bg-red-500',
        cancelled: 'bg-gray-600',
      }
      return classes[status] || 'bg-gray-500'
    },

    getStatusText(status) {
      const map = {
        draft: this.$t('invoices.status.draft') || 'مسودة',
        sent: this.$t('invoices.status.sent') || 'مرسلة',
        paid: this.$t('invoices.status.paid') || 'مدفوعة',
        overdue: this.$t('invoices.status.overdue') || 'متأخرة',
        cancelled: this.$t('invoices.status.cancelled') || 'ملغاة',
      }
      return map[status] || status
    },

    printInvoice() {
      const invoice = this.invoice
      if (!invoice) return

      const currentLocale = this.$i18n.locale
      const dir = currentLocale === 'ar' ? 'rtl' : 'ltr'
      const printWindow = window.open('', '_blank')

      const styles = `
        <style>
          body { font-family: 'Tajawal', sans-serif; direction: ${dir}; padding: 30px; background: #fff; color: #333; margin: 0; }
          .invoice-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 20px; }
          .invoice-title h1 { font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 0; }
          .status-badge { display: inline-block; padding: 6px 12px; border-radius: 9999px; font-size: 14px; font-weight: 600; }
          .status-draft { background: #f3f4f6; color: #1f2937; }
          .status-sent { background: #dbeafe; color: #1e40af; }
          .status-paid { background: #d1fae5; color: #065f46; }
          .status-overdue { background: #fee2e2; color: #991b1b; }
          .status-cancelled { background: #e5e7eb; color: #4b5563; }
          .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
          .client-box { background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 30px; }
          .client-name { font-size: 16px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #f3f4f6; padding: 12px; text-align: center; font-size: 14px; font-weight: 600; color: #374151; border: 1px solid #d1d5db; }
          td { padding: 10px; text-align: center; border: 1px solid #d1d5db; }
          .text-start { text-align: start; }
          .totals { width: 300px; margin-inline-start: auto; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
          .totals-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .border-top { border-top: 2px solid #d1d5db; margin-top: 10px; padding-top: 10px; font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
        </style>
      `

      const itemsHtml = invoice.items
        .map(
          (item) => `
        <tr>
          <td class="text-start">${item.description} ${item.notes ? `<br><small>${item.notes}</small>` : ''}</td>
          <td>${item.quantity}</td>
          <td>${this.formatCurrency(item.unit_price)}</td>
          <td>${this.formatCurrency(item.total)}</td>
        </tr>
      `,
        )
        .join('')

      const html = `
        <html dir="${dir}">
          <head>
            <title>${this.$t('invoices.invoice') || 'فاتورة'} ${invoice.invoice_number}</title>
            ${styles}
          </head>
          <body>
            <div class="invoice-header">
              <div class="invoice-title">
                <h1>${this.$t('invoices.invoice') || 'فاتورة'} رقم ${invoice.invoice_number}</h1>
              </div>
              <div><span class="status-badge status-${invoice.status}">${this.getStatusText(invoice.status)}</span></div>
            </div>
            <div class="grid-3">
              <div>${this.$t('invoices.issueDate') || 'تاريخ الإصدار'}: ${this.formatDate(invoice.invoice_date)}</div>
              <div>${this.$t('invoices.dueDate') || 'تاريخ الاستحقاق'}: ${this.formatDate(invoice.due_date)}</div>
              ${invoice.paid_at ? `<div>${this.$t('invoices.paymentDate') || 'تاريخ الدفع'}: ${this.formatDate(invoice.paid_at)}</div>` : ''}
            </div>
            <div class="client-box">
              <div class="client-name">${this.$t('clients.client') || 'العميل'}: ${invoice.client?.name || 'N/A'}</div>
              <div>${this.$t('clients.email') || 'البريد'}: ${invoice.client?.email || 'N/A'}</div>
              <div>${this.$t('clients.phone') || 'الهاتف'}: ${invoice.client?.phone || 'N/A'}</div>
              ${invoice.client?.company_name && invoice.client.company_name !== '.' ? `<div>${invoice.client.company_name}</div>` : ''}
            </div>
            <table>
              <thead>
                <tr>
                  <th>${this.$t('invoices.description') || 'الوصف'}</th>
                  <th>${this.$t('invoices.quantity') || 'الكمية'}</th>
                  <th>${this.$t('invoices.unitPrice') || 'سعر الوحدة'}</th>
                  <th>${this.$t('invoices.total') || 'الإجمالي'}</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
            <div class="totals">
              <div class="totals-row"><span>${this.$t('invoices.subtotal') || 'المجموع الفرعي'}:</span><span>${this.formatCurrency(invoice.subtotal)}</span></div>
              ${parseFloat(invoice.discount_amount) > 0 ? `<div class="totals-row"><span>${this.$t('invoices.discount') || 'الخصم'}:</span><span>${this.formatCurrency(invoice.discount_amount)}</span></div>` : ''}
              <div class="totals-row"><span>${this.$t('invoices.tax') || 'الضريبة'} (${invoice.tax_rate || 0}%):</span><span>${this.formatCurrency(invoice.tax_amount)}</span></div>
              <div class="totals-row border-top"><span>${this.$t('invoices.total') || 'الإجمالي'}:</span><span>${this.formatCurrency(invoice.total)}</span></div>
            </div>
            <div class="footer">
              <div>تم الإنشاء بواسطة ${invoice.created_by?.name || 'N/A'} في ${this.formatDateTime(invoice.created_at)}</div>
              <div>تمت الطباعة بواسطة ${this.printedBy} في ${this.printedOn}</div>
            </div>
          </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    },

    sendEmail() {
      if (!this.invoice?.client?.email) {
        this.$toast.warning('لا يوجد بريد إلكتروني للعميل')
        return
      }
      const subject = `فاتورة ${this.invoice.invoice_number}`
      const body = `مرحباً،\n\nفاتورة رقم ${this.invoice.invoice_number} بمبلغ ${this.formatCurrency(this.invoice.total)}.\n\nشكراً لتعاملكم.`
      window.location.href = `mailto:${this.invoice.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },

    confirmDelete() {
      const isPaid = this.invoice?.status === 'paid'
      const baseText =
        this.$t('invoices.deleteConfirm', { number: this.invoice.invoice_number }) ||
        `سيتم حذف الفاتورة رقم ${this.invoice.invoice_number}`
      const paidWarn = isPaid
        ? `<br><span style="color:#dc2626;font-weight:600;">⚠️ تنبيه: هذه الفاتورة مدفوعة — تأكد من الاحتفاظ بسجل خارجي قبل الحذف.</span>`
        : ''

      this.$swal
        .fire({
          title: this.$t('common.are_you_sure') || 'هل أنت متأكد؟',
          html: baseText + paidWarn,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280',
          confirmButtonText: this.$t('common.delete') || 'حذف',
          cancelButtonText: this.$t('common.cancel') || 'إلغاء',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.deleteInvoice(this.invoice.id)
              this.$toast.success(this.$t('messages.deleteSuccess') || 'تم الحذف بنجاح')
              this.$router.push('/invoices')
            } catch (err) {
              this.$toast.error(err.message || 'فشل الحذف')
            }
          }
        })
    },
  },

  watch: {
    '$route.params.id': {
      immediate: false,
      handler(newId) {
        if (newId) this.loadInvoice()
      },
    },
  },
}
</script>

<style scoped></style>
