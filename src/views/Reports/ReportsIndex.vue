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
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('reports.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('reports.subtitle') }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="exportReport"
              class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
            >
              <svg
                class="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="font-medium">{{ $t('common.export') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <h2 class="text-lg font-semibold text-gray-800">{{ $t('reports.filters') }}</h2>
          </div>

          <div class="flex gap-2">
            <button
              @click="loadReport"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {{ $t('common.search') }}
            </button>
            <button
              @click="resetFilters"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ $t('reports.buttons.reset_filters') }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.fromDate')
            }}</label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.start_date"
                class="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.toDate')
            }}</label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.end_date"
                class="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
              $t('reports.invoiceStatus')
            }}</label>
            <div class="relative">
              <select
                v-model="filters.status"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option value="draft">{{ $t('invoices.status.draft') }}</option>
                <option value="sent">{{ $t('invoices.status.sent') }}</option>
                <option value="paid">{{ $t('invoices.status.paid') }}</option>
                <option value="overdue">{{ $t('invoices.status.overdue') }}</option>
              </select>
              <svg
                class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
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
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('clients.title')
            }}</label>
            <div class="relative">
              <select
                v-model="filters.client_id"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.name }}
                </option>
              </select>
              <svg
                class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
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
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="flex overflow-x-auto">
          <button
            @click="switchTab('invoices')"
            :class="{
              'border-b-2 border-blue-500 text-blue-600 bg-blue-50': activeTab === 'invoices',
              'text-gray-500 hover:text-gray-700 hover:bg-gray-50': activeTab !== 'invoices',
            }"
            class="flex-1 px-6 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {{ $t('reports.invoicesReport') }}
          </button>
          <button
            @click="switchTab('clients')"
            :class="{
              'border-b-2 border-blue-500 text-blue-600 bg-blue-50': activeTab === 'clients',
              'text-gray-500 hover:text-gray-700 hover:bg-gray-50': activeTab !== 'clients',
            }"
            class="flex-1 px-6 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {{ $t('reports.clientsReport') }}
          </button>
          <button
            @click="switchTab('revenue')"
            :class="{
              'border-b-2 border-blue-500 text-blue-600 bg-blue-50': activeTab === 'revenue',
              'text-gray-500 hover:text-gray-700 hover:bg-gray-50': activeTab !== 'revenue',
            }"
            class="flex-1 px-6 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {{ $t('reports.revenueReport') }}
          </button>
          <button
            @click="switchTab('overdue')"
            :class="{
              'border-b-2 border-blue-500 text-blue-600 bg-blue-50': activeTab === 'overdue',
              'text-gray-500 hover:text-gray-700 hover:bg-gray-50': activeTab !== 'overdue',
            }"
            class="flex-1 px-6 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 flex items-center justify-center gap-2 relative"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            {{ $t('reports.overdueInvoices') }}
            <span
              v-if="overdueCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ overdueCount }}
            </span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 mb-6">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
          ></div>
          <p class="text-gray-700 font-medium">{{ $t('common.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('reports.loading_subtitle') }}</p>
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
            <h3 class="text-sm font-medium text-red-800">{{ $t('errors.load_failed') }}</h3>
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

      <!-- Reports Content -->
      <div v-else>
        <!-- Invoices Report -->
        <div v-if="activeTab === 'invoices'">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalInvoices') }}
                  </p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats.invoices.total_invoices || 0 }}
                  </p>
                </div>
                <div class="p-3 bg-blue-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-blue-500"
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
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalAmount') }}
                  </p>
                  <p class="text-2xl font-bold text-green-600">
                    {{ formatCurrency(stats.invoices.total_amount) }}
                  </p>
                </div>
                <div class="p-3 bg-green-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalPaid') }}
                  </p>
                  <p class="text-2xl font-bold text-blue-600">
                    {{ formatCurrency(stats.invoices.total_paid) }}
                  </p>
                </div>
                <div class="p-3 bg-blue-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-blue-500"
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
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalDue') }}
                  </p>
                  <p class="text-2xl font-bold text-red-600">
                    {{ formatCurrency(stats.invoices.total_due) }}
                  </p>
                </div>
                <div class="p-3 bg-red-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-red-500"
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
                </div>
              </div>
            </div>
          </div>

          <!-- Invoices Table -->
          <div
            v-if="reports.invoices.length > 0"
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
          >
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ $t('reports.invoicesList') }}
                  </h3>
                  <span
                    class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {{ reports.invoices.length }} {{ $t('common.total') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.invoice_number') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.client') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.date') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.due_date') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.amount') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.status') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="invoice in reports.invoices"
                    :key="invoice.id"
                    class="hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td class="px-6 py-4">
                      <router-link :to="`/invoices/${invoice.id}`" class="block group/link">
                        <p
                          class="text-base font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors"
                        >
                          {{ invoice.invoice_number || `#${invoice.id}` }}
                        </p>
                      </router-link>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 ml-3">
                          <div
                            class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                          >
                            <span class="text-blue-700 font-bold text-sm">
                              {{ getInitials(invoice.client?.name) }}
                            </span>
                          </div>
                        </div>
                        <div class="mr-3">
                          <div class="text-sm font-medium text-gray-900">
                            {{ invoice.client?.name || $t('common.notAvailable') }}
                          </div>
                          <div class="text-xs text-gray-500 mt-1">
                            {{ invoice.client?.email || $t('common.notAvailable') }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="text-sm text-gray-900 font-medium">
                        {{ formatDate(invoice.issue_date) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div
                        :class="getDaysRemainingClass(invoice.due_date)"
                        class="flex flex-col items-center"
                      >
                        <span class="text-sm font-medium">
                          {{ formatDate(invoice.due_date) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <span class="text-lg font-bold text-gray-900">
                          {{ formatCurrency(invoice.total_amount) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex flex-col items-center">
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
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-gray-400"
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
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('reports.noInvoices') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ $t('reports.noDataForPeriod') }}
            </p>
          </div>
        </div>

        <!-- Clients Report -->
        <div v-if="activeTab === 'clients'">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalClients') }}
                  </p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats.clients.total_clients || 0 }}
                  </p>
                </div>
                <div class="p-3 bg-blue-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalInvoices') }}
                  </p>
                  <p class="text-2xl font-bold text-green-600">
                    {{ stats.clients.total_invoices || 0 }}
                  </p>
                </div>
                <div class="p-3 bg-green-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-green-500"
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
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalRevenue') }}
                  </p>
                  <p class="text-2xl font-bold text-blue-600">
                    {{ formatCurrency(stats.clients.total_revenue) }}
                  </p>
                </div>
                <div class="p-3 bg-blue-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Clients Table -->
          <div
            v-if="reports.clients.length > 0"
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
          >
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ $t('reports.clientsReport') }}
                  </h3>
                  <span
                    class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {{ reports.clients.length }} {{ $t('common.total') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('clients.name') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('clients.email') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.invoicesCount') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.totalSpent') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.averageInvoice') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="client in reports.clients"
                    :key="client.id"
                    class="hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 ml-3">
                          <div
                            class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                          >
                            <span class="text-blue-700 font-bold text-sm">
                              {{ getInitials(client.name) }}
                            </span>
                          </div>
                        </div>
                        <div class="mr-3">
                          <div class="text-sm font-medium text-gray-900">
                            {{ client.name }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{{ client.email }}</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                      >
                        {{ client.invoices_count || 0 }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <span class="text-lg font-bold text-gray-900">
                          {{ formatCurrency(client.total_spent) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <span class="text-base font-semibold text-gray-700">
                          {{ formatCurrency(client.total_spent / (client.invoices_count || 1)) }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('reports.noClients') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ $t('reports.noDataForPeriod') }}
            </p>
          </div>
        </div>

        <!-- Revenue Report -->
        <div v-if="activeTab === 'revenue'">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalRevenue') }}
                  </p>
                  <p class="text-2xl font-bold text-green-600">
                    {{ formatCurrency(stats.revenue.total_revenue) }}
                  </p>
                </div>
                <div class="p-3 bg-green-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.collectedRevenue') }}
                  </p>
                  <p class="text-2xl font-bold text-blue-600">
                    {{ formatCurrency(stats.revenue.collected_revenue) }}
                  </p>
                </div>
                <div class="p-3 bg-blue-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-blue-500"
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
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.outstandingRevenue') }}
                  </p>
                  <p class="text-2xl font-bold text-yellow-600">
                    {{ formatCurrency(stats.revenue.outstanding_revenue) }}
                  </p>
                </div>
                <div class="p-3 bg-yellow-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-yellow-500"
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
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.collectionRate') }}
                  </p>
                  <p class="text-2xl font-bold text-purple-600">
                    {{ Math.round(stats.revenue.collection_rate || 0) }}%
                  </p>
                </div>
                <div class="p-3 bg-purple-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Revenue Table -->
          <div
            v-if="reports.revenue.length > 0"
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
          >
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ $t('reports.monthlyRevenue') }}
                  </h3>
                  <span
                    class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
                  >
                    {{ reports.revenue.length }} {{ $t('common.months') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('common.month') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.invoicesCount') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.totalAmount') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.collectedAmount') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.outstandingAmount') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="month in reports.revenue"
                    :key="month.month"
                    class="hover:bg-blue-50/30 transition-colors duration-150"
                  >
                    <td class="px-6 py-4">
                      <div class="text-sm font-medium text-gray-900">{{ month.month }}</div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                      >
                        {{ month.invoice_count || 0 }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <span class="text-lg font-bold text-gray-900">
                          {{ formatCurrency(month.total_amount) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <span class="text-base font-semibold text-green-600">
                          {{ formatCurrency(month.paid_amount) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <span class="text-base font-semibold text-yellow-600">
                          {{ formatCurrency(month.total_amount - month.paid_amount) }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('reports.noRevenue') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ $t('reports.noDataForPeriod') }}
            </p>
          </div>
        </div>

        <!-- Overdue Report -->
        <div v-if="activeTab === 'overdue'">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.overdueInvoices') }}
                  </p>
                  <p class="text-2xl font-bold text-red-600">
                    {{ stats.overdue.total_overdue || 0 }}
                  </p>
                </div>
                <div class="p-3 bg-red-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.totalOverdueAmount') }}
                  </p>
                  <p class="text-2xl font-bold text-red-600">
                    {{ formatCurrency(stats.overdue.total_amount) }}
                  </p>
                </div>
                <div class="p-3 bg-red-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 mb-1">
                    {{ $t('reports.averageDaysOverdue') }}
                  </p>
                  <p class="text-2xl font-bold text-red-600">
                    {{ Math.round(stats.overdue.average_days_overdue || 0) }}
                    {{ $t('common.days') }}
                  </p>
                </div>
                <div class="p-3 bg-red-50 rounded-lg">
                  <svg
                    class="w-6 h-6 text-red-500"
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
              </div>
            </div>
          </div>

          <!-- Overdue Table -->
          <div
            v-if="reports.overdue.length > 0"
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6"
          >
            <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ $t('reports.overdueInvoicesList') }}
                  </h3>
                  <span class="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    {{ reports.overdue.length }} {{ $t('common.total') }}
                  </span>
                </div>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.invoice_number') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.client') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.due_date') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('reports.daysOverdue') }}
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('invoices.table.amount') }}
                    </th>
                    <th
                      class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('common.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="invoice in reports.overdue"
                    :key="invoice.id"
                    class="hover:bg-red-50/30 transition-colors duration-150"
                  >
                    <td class="px-6 py-4">
                      <router-link :to="`/invoices/${invoice.id}`" class="block group/link">
                        <p
                          class="text-base font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors"
                        >
                          {{ invoice.invoice_number || `#${invoice.id}` }}
                        </p>
                      </router-link>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 ml-3">
                          <div
                            class="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center"
                          >
                            <span class="text-red-700 font-bold text-sm">
                              {{ getInitials(invoice.client?.name) }}
                            </span>
                          </div>
                        </div>
                        <div class="mr-3">
                          <div class="text-sm font-medium text-gray-900">
                            {{ invoice.client?.name || $t('common.notAvailable') }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center text-red-600">
                      <div class="text-sm font-medium">
                        {{ formatDate(invoice.due_date) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span
                        class="px-3 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-full"
                      >
                        {{ invoice.days_overdue || 0 }} {{ $t('common.days') }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex flex-col items-end">
                        <span class="text-lg font-bold text-gray-900">
                          {{ formatCurrency(invoice.total_amount) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          @click="sendReminder(invoice.id)"
                          class="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-1"
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
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {{ $t('reports.sendReminder') }}
                        </button>
                        <button
                          @click="markAsPaid(invoice.id)"
                          class="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors duration-200 flex items-center gap-1"
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {{ $t('reports.markAsPaid') }}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg
                class="w-8 h-8 text-gray-400"
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
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('reports.noOverdue') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ $t('reports.noOverdueInvoices') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from '@/api/axios'

export default {
  name: 'ReportsIndex',

  data() {
    return {
      activeTab: 'invoices',
      filters: {
        start_date: '',
        end_date: '',
        status: '',
        client_id: '',
      },
      clients: [],
    }
  },

  computed: {
    ...mapGetters('report', [
      'invoicesReport',
      'clientsReport',
      'revenueReport',
      'overdueReport',
      'invoiceStats',
      'clientStats',
      'revenueStats',
      'overdueStats',
      'isLoading',
      'reportError',
      'reportFilters',
    ]),

    loading() {
      return this.isLoading
    },

    error() {
      return this.reportError
    },

    reports() {
      return {
        invoices: this.invoicesReport,
        clients: this.clientsReport,
        revenue: this.revenueReport,
        overdue: this.overdueReport,
      }
    },

    stats() {
      return {
        invoices: this.invoiceStats,
        clients: this.clientStats,
        revenue: this.revenueStats,
        overdue: this.overdueStats,
      }
    },

    overdueCount() {
      return this.stats.overdue.total_overdue || 0
    },
  },

  watch: {
    reportFilters: {
      immediate: true,
      handler(newFilters) {
        this.filters = { ...newFilters }
      },
    },
  },

  mounted() {
    this.initFilters()
    this.loadReport()
    this.loadClients()
  },

  methods: {
    ...mapActions('report', [
      'getInvoicesReport',
      'getClientsReport',
      'getRevenueReport',
      'getOverdueReport',
      'updateFilters',
      'exportReport',
      'sendReminder',
      'markAsPaid',
      'resetFilters',
      'clearError',
    ]),

    // تهيئة الفلاتر
    initFilters() {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)

      this.filters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
      }

      this.updateFilters(this.filters)
    },

    // تحميل التقرير
    async loadReport() {
      this.updateFilters(this.filters)

      const actions = {
        invoices: 'getInvoicesReport',
        clients: 'getClientsReport',
        revenue: 'getRevenueReport',
        overdue: 'getOverdueReport',
      }

      try {
        await this[actions[this.activeTab]]()
        this.$toast.success(this.$t('messages.reportLoaded'))
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failedToLoadReport'))
      }
    },

    // تبديل التبويب
    switchTab(tab) {
      this.activeTab = tab
      this.loadReport()
    },

    // تصدير التقرير
    async exportReport() {
      try {
        await this.exportReport(this.activeTab)
        this.$toast.success(this.$t('messages.reportExported'))
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failedToExportReport'))
      }
    },

    // إعادة تعيين الفلاتر
    resetFilters() {
      this.resetFilters()
      this.loadReport()
      this.$toast.info(this.$t('messages.filtersReset'))
    },

    // تحميل العملاء للفلتر
    async loadClients() {
      try {
        const response = await axios.get('/api/admin/clients', {
          params: { per_page: 100, is_active: true },
        })

        if (response.data && response.data.data) {
          this.clients = response.data.data
        } else {
          this.clients = []
        }
      } catch (error) {
        console.error(this.$t('errors.failedToLoadClients'), error)
        this.clients = []
      }
    },

    // إرسال تذكير
    async sendReminder(invoiceId) {
      const confirmed = await this.$swal({
        title: this.$t('reports.confirmSendReminderTitle'),
        text: this.$t('reports.confirmSendReminder'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EAB308',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('reports.sendReminder'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.sendReminder(invoiceId)
          this.$toast.success(this.$t('messages.reminderSent'))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failedToSendReminder'))
        }
      }
    },

    // تسديد فاتورة
    async markAsPaid(invoiceId) {
      const confirmed = await this.$swal({
        title: this.$t('reports.confirmMarkAsPaidTitle'),
        text: this.$t('reports.confirmMarkAsPaid'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('reports.markAsPaid'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.markAsPaid(invoiceId)
          this.$toast.success(this.$t('messages.invoicePaid'))
          // تحديث تقرير المتأخرات
          setTimeout(() => {
            this.getOverdueReport()
          }, 1000)
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failedToMarkAsPaid'))
        }
      }
    },

    // تنسيق العملات
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    // تنسيق التاريخ
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    // الحصول على الأحرف الأولى
    getInitials(name) {
      if (!name) return '؟؟'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    // كلاس الحالة
    getStatusBadgeClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    // كلاس نقطة الحالة
    getStatusDotClass(status) {
      const classes = {
        draft: 'bg-gray-500',
        sent: 'bg-blue-500',
        paid: 'bg-green-500',
        overdue: 'bg-red-500',
      }
      return classes[status] || 'bg-gray-500'
    },

    // نص الحالة
    getStatusText(status) {
      return this.$t(`invoices.status.${status}`) || status
    },

    // حساب الأيام المتبقية
    getDaysRemainingClass(dueDate) {
      if (!dueDate) return 'text-gray-600'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'text-red-600'
      if (diffDays <= 3) return 'text-yellow-600'
      return 'text-green-600'
    },
  },
}
</script>

<style scoped>
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

/* تأثيرات hover محسنة */
tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* تحسينات الأزرار */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
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

/* تحسينات علامات التبويب */
.tabs-container {
  scrollbar-width: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}
</style>
