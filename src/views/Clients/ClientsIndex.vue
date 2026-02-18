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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.75V21m0 0h-6m6 0h6"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('clients.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('clients.subtitle') }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              v-if="hasPermission('create_client')"
              @click="$router.push('/clients/create')"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
            >
              <svg
                class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300"
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
              <span class="font-medium">{{ $t('clients.add_new') }}</span>
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div
            class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">
                  {{ $t('clients.stats.total_clients') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total_clients || 0 }}</p>
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
            <div class="mt-3 text-xs text-gray-400">📈 +12% from last month</div>
          </div>

          <div
            class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('common.active') }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.active_clients || 0 }}</p>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="mt-3 text-xs text-gray-400">{{ activeRate }}% active rate</div>
          </div>

          <div
            class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">
                  {{ $t('clients.stats.totalInvoices') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">{{ stats.total_invoices || 0 }}</p>
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div class="mt-3 text-xs text-gray-400">📄 Total invoices issued</div>
          </div>

          <div
            class="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-500 mb-1">
                  {{ $t('dashboard.total_revenue') }}
                </p>
                <p class="text-2xl font-bold text-gray-900">
                  {{ formatCurrencyShort(stats.total_revenue) }}
                </p>
              </div>
              <div class="p-3 bg-orange-50 rounded-lg">
                <svg
                  class="w-6 h-6 text-orange-500"
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
            <div class="mt-3 text-xs text-gray-400">💰 Lifetime value</div>
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
            <h2 class="text-lg font-semibold text-gray-800">{{ $t('common.filters') }}</h2>
          </div>

          <div class="flex gap-2">
            <button
              @click="applyFilters"
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
              @click="clearFilters"
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
              $t('common.status')
            }}</label>
            <div class="relative">
              <select
                v-model="filters.status"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option value="active">{{ $t('common.active') }}</option>
                <option value="inactive">{{ $t('common.inactive') }}</option>
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
          </div>

          <!-- Start Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.fromDate')
            }}</label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.date_from"
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

          <!-- End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.toDate')
            }}</label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.date_to"
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

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.search')
            }}</label>
            <div class="relative">
              <input
                type="text"
                v-model="filters.search"
                @input="onSearch"
                :placeholder="$t('invoices.searchPlaceholder')"
                class="w-full px-3 py-2.5 pr-10 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <!-- أيقونة البحث على اليمين (مناسبة للعربية) -->
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <!-- زر المسح على اليسار -->
              <button
                v-if="filters.search"
                @click="clearSearch"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
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
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 mb-6">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
          ></div>
          <p class="text-gray-700 font-medium">{{ $t('clients.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('clients.loading_subtitle') }}</p>
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

      <!-- Table -->
      <div v-else>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-800">{{ $t('clients.table.title') }}</h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {{ pagination.total || 0 }} {{ $t('common.total') }}
                </span>
              </div>

              <div class="text-sm text-gray-600">
                {{ $t('clients.clientCount') }}:
                <span class="font-bold text-gray-900">{{ pagination.total || 0 }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="clients.length === 0" class="text-center py-12 px-4">
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
              {{ $t('clients.empty_title') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">{{ $t('clients.empty_subtitle') }}</p>
            <button
              v-if="hasPermission('create_client')"
              @click="$router.push('/clients/create')"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{ $t('clients.add_first_client') }}
            </button>
          </div>

          <!-- Table Content -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('clients.table.client') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('clients.contactInfo') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('invoices.title') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('common.status') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('clients.stats.totalInvoices') }}
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
                  v-for="client in clients"
                  :key="client.id"
                  class="hover:bg-blue-50/30 transition-colors duration-150"
                >
                  <!-- Client Info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 ml-3">
                        <div
                          class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4"
                        >
                          <span class="text-blue-700 font-bold text-sm">{{
                            getInitials(client.name)
                          }}</span>
                        </div>
                      </div>
                      <div class="mr-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ client.name || $t('common.notAvailable') }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          <span v-if="client.company_name" class="inline-flex items-center gap-1">
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
                            {{ client.company_name }}
                          </span>
                          <span v-else class="text-gray-400">{{ $t('clients.noCompany') }}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Contact Info -->
                  <td class="px-6 py-4">
                    <div class="space-y-1">
                      <div class="text-sm text-gray-900 flex items-center gap-2">
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
                            d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{{ client.email || $t('common.notAvailable') }}</span>
                      </div>
                      <div class="text-sm text-gray-900 flex items-center gap-2">
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
                        <span>{{ client.phone || $t('common.notAvailable') }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Invoices -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex flex-col items-center">
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {{ client.invoices_count || 0 }}
                      </span>
                      <div class="text-xs text-gray-500 mt-1">
                        {{
                          client.last_invoice_date
                            ? formatDate(client.last_invoice_date)
                            : $t('clients.noInvoicesForClient')
                        }}
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex flex-col items-center">
                      <span
                        :class="getStatusBadgeClass(client.status)"
                        class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span
                          :class="getStatusDotClass(client.status)"
                          class="w-2 h-2 rounded-full"
                        ></span>
                        {{ getStatusText(client.status) }}
                      </span>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ client.is_active ? $t('common.active') : $t('common.inactive') }}
                      </div>
                    </div>
                  </td>

                  <!-- Total Spent -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex flex-col items-center">
                      <span class="text-lg font-bold text-gray-900">{{
                        formatCurrency(client.total_spent || 0)
                      }}</span>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ $t('clients.stats.avgInvoices') }}:
                        {{ formatCurrencyShort(client.average_invoice || 0) }}
                      </div>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        @click="$router.push(`/clients/${client.id}`)"
                        class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.view')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        v-if="hasPermission('edit_client')"
                        @click="$router.push(`/clients/${client.id}/edit`)"
                        class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.edit')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        v-if="hasPermission('delete_client')"
                        @click="confirmDelete(client)"
                        class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.delete')"
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination && pagination.total > pagination.per_page"
          class="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4"
        >
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700">
              {{
                $t('pagination.showing', {
                  from: pagination.from || 1,
                  to: pagination.to || pagination.total,
                  total: pagination.total,
                })
              }}
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="previousPage"
                :disabled="pagination.current_page === 1"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span class="hidden sm:inline">{{ $t('pagination.previous') }}</span>
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="page in getPaginationRange()"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200',
                    page === pagination.current_page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50',
                    page === '...' ? 'cursor-default hover:bg-transparent' : '',
                  ]"
                  :disabled="page === '...'"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="nextPage"
                :disabled="pagination.current_page === pagination.last_page"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span class="hidden sm:inline">{{ $t('pagination.next') }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
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
  name: 'Clients',

  data() {
    return {
      filters: {
        status: '',
        search: '',
        date_from: '',
        date_to: '',
      },
      searchTimeout: null,
    }
  },

  computed: {
    ...mapGetters('clients', [
      'clients',
      'loading',
      'error',
      'pagination',
      'clientStats',
      'clientFilters',
    ]),

    stats() {
      return (
        this.clientStats || {
          total_clients: 0,
          active_clients: 0,
          total_invoices: 0,
          total_revenue: 0,
        }
      )
    },

    activeRate() {
      if (!this.stats.total_clients) return 0
      return Math.round((this.stats.active_clients / this.stats.total_clients) * 100)
    },
  },

  mounted() {
    this.filters = { ...this.filters, ...this.clientFilters }
    this.loadClients()
  },

  methods: {
    ...mapActions('clients', [
      'fetchClients',
      'deleteClient',
      'updateFilters',
      'clearFilters',
      'clearError',
    ]),

    async loadClients() {
      try {
        await this.fetchClients(this.filters)
      } catch (error) {
        console.error('❌ ' + this.$t('errors.loadFailed') + ':', error)
        this.$toast.error(error.message || this.$t('errors.loadClientsError'))
      }
    },

    applyFilters() {
      this.updateFilters(this.filters)
      this.loadClients()
    },

    onSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 500)
    },

    clearSearch() {
      this.filters.search = ''
      this.applyFilters()
    },

    clearFilters() {
      this.filters = {
        status: '',
        search: '',
        date_from: '',
        date_to: '',
      }
      this.clearFilters()
      this.loadClients()
    },

    async confirmDelete(client) {
      if (confirm(this.$t('clients.deleteConfirm', { name: client.name }))) {
        await this.deleteClientHandler(client.id)
      }
    },

    async deleteClientHandler(id) {
      try {
        await this.deleteClient(id)
        this.$toast.success(this.$t('messages.deleteSuccess'))
        this.loadClients()
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.deleteFailed'))
      }
    },

    goToPage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      this.filters.page = page
      this.loadClients()
    },

    previousPage() {
      if (this.pagination && this.pagination.current_page > 1) {
        this.filters.page = this.pagination.current_page - 1
        this.loadClients()
      }
    },

    nextPage() {
      if (this.pagination && this.pagination.current_page < this.pagination.last_page) {
        this.filters.page = this.pagination.current_page + 1
        this.loadClients()
      }
    },

    getPaginationRange() {
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
          range.push(i)
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      }

      return rangeWithDots
    },

    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
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

    formatCurrency(amount) {
      if (!amount && amount !== 0) return `0.00 ${this.$t('common.currency')}`
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    formatCurrencyShort(amount) {
      if (!amount && amount !== 0) return '0.00'
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`
      }
      if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`
      }
      return amount.toFixed(2)
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
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusDotClass(status) {
      const classes = {
        active: 'bg-green-500',
        inactive: 'bg-red-500',
        pending: 'bg-yellow-500',
      }
      return classes[status] || 'bg-gray-500'
    },

    getStatusText(status) {
      const texts = {
        active: this.$t('common.active'),
        inactive: this.$t('common.inactive'),
        pending: this.$t('common.pending'),
      }
      return texts[status] || status
    },
  },

  watch: {
    clientFilters: {
      immediate: true,
      handler(newFilters) {
        this.filters = { ...newFilters }
      },
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
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
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
</style>
