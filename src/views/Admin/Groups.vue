<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 md:mb-10">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-3">
              <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <svg
                  class="w-6 h-6 text-white"
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
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
                  {{ $t('groups.title') }}
                </h1>
                <p class="text-sm text-gray-600 mt-1">
                  {{ $t('groups.subtitle') }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex-shrink-0">
            <button
              @click="openAddModal"
              class="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-medium">{{ $t('groups.create_new') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Groups -->
        <div class="stats-card bg-gradient-to-br from-blue-50 to-blue-100">
          <div class="stats-icon bg-blue-100">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">{{ $t('groups.total_groups') }}</p>
            <p class="stats-value">{{ storeGroups.length }}</p>
          </div>
        </div>

        <!-- Active Groups -->
        <div class="stats-card bg-gradient-to-br from-green-50 to-green-100">
          <div class="stats-icon bg-green-100">
            <svg
              class="w-6 h-6 text-green-600"
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
          <div>
            <p class="stats-label">{{ $t('groups.active_groups') }}</p>
            <p class="stats-value">{{ activeGroupsCount }}</p>
          </div>
        </div>

        <!-- Inactive Groups -->
        <div class="stats-card bg-gradient-to-br from-red-50 to-red-100">
          <div class="stats-icon bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">{{ $t('groups.inactive_groups') }}</p>
            <p class="stats-value">{{ inactiveGroupsCount }}</p>
          </div>
        </div>

        <!-- Total Users in Groups (optional) -->
        <div class="stats-card bg-gradient-to-br from-purple-50 to-purple-100">
          <div class="stats-icon bg-purple-100">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">{{ $t('groups.total_users') }}</p>
            <p class="stats-value">{{ totalUsersInGroups }}</p>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-50 rounded-lg">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">
                {{ $t('common.filters') }}
              </h2>
              <p class="text-sm text-gray-500">
                {{ $t('groups.filter_subtitle') }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              @click="loadData"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {{ $t('buttons.search') }}
            </button>
            <button
              @click="resetFilters"
              class="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors duration-200 flex items-center gap-2"
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
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('common.search') }}
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="filters.search"
                :placeholder="$t('groups.search_placeholder')"
                class="w-full px-4 py-2.5 pl-10 pr-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
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

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('common.status') }}
            </label>
            <div class="relative">
              <select
                v-model="filters.status"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
              >
                <option value="all">{{ $t('common.all') }}</option>
                <option value="active">{{ $t('groups.status.active') }}</option>
                <option value="inactive">{{ $t('groups.status.inactive') }}</option>
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

          <!-- System Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('groups.system_group') }}
            </label>
            <div class="relative">
              <select
                v-model="filters.is_system"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option value="1">{{ $t('common.yes') }}</option>
                <option value="0">{{ $t('common.no') }}</option>
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

          <!-- Date Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('common.date_from') }}
            </label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.date_from"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
              />
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="storeLoading"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 mb-6"
      >
        <div class="text-center">
          <div class="inline-block relative">
            <div class="w-14 h-14 border-4 border-blue-100 rounded-full"></div>
            <div
              class="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
            ></div>
          </div>
          <p class="text-gray-700 font-medium mt-4">{{ $t('common.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('groups.loading_subtitle') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="storeError" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0 pt-0.5">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p class="text-sm text-red-700 mt-1">{{ storeError }}</p>
          </div>
          <button
            @click="clearStoreError"
            class="p-1.5 text-red-700 hover:text-red-900 rounded-lg hover:bg-red-100"
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

      <!-- Table Section -->
      <div v-else>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ $t('groups.group_list') }}
                </h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {{ storeGroups.length }} {{ $t('common.total') }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                {{ $t('groups.list_subtitle') }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="storeGroups.length === 0" class="text-center py-16 px-4">
            <div class="max-w-sm mx-auto">
              <div
                class="w-20 h-20 bg-blue-50 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              >
                <svg
                  class="w-10 h-10 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ $t('groups.no_groups') }}
              </h3>
              <p class="text-gray-600 mb-6">{{ $t('groups.start_creating_message') }}</p>
              <button
                @click="openAddModal"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ $t('groups.create_first') }}
              </button>
            </div>
          </div>

          <!-- Table Content -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('groups.name_en') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('groups.name_ar') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('groups.users_count') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('groups.permissions_count') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('common.status') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('groups.system_group') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('common.created_at') }}
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
                  v-for="group in filteredGroups"
                  :key="group.id"
                  class="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  <!-- Name English -->
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-gray-900">
                      {{ group.title_en }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1" v-if="group.description">
                      {{ group.description }}
                    </div>
                  </td>

                  <!-- Name Arabic -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 font-medium">{{ group.title_ar }}</div>
                  </td>

                  <!-- Users Count -->
                  <td class="px-6 py-4 text-center">
                    <span
                      class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
                    >
                      {{ group.users_count || 0 }}
                    </span>
                  </td>

                  <!-- Permissions Count -->
                  <td class="px-6 py-4 text-center">
                    <span
                      class="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full"
                    >
                      {{ group.permissions_count || 0 }}
                    </span>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="
                        group.is_active
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      "
                      class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border"
                    >
                      <span
                        :class="group.is_active ? 'bg-green-500' : 'bg-red-500'"
                        class="w-2 h-2 rounded-full ml-2"
                      ></span>
                      {{
                        group.is_active ? $t('groups.status.active') : $t('groups.status.inactive')
                      }}
                    </span>
                  </td>

                  <!-- System Group -->
                  <td class="px-6 py-4 text-center">
                    <span
                      v-if="group.is_system"
                      class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200"
                    >
                      {{ $t('common.yes') }}
                    </span>
                    <span v-else class="text-gray-400">-</span>
                  </td>

                  <!-- Created Date -->
                  <td class="px-6 py-4 text-center">
                    <div class="text-sm text-gray-900 font-medium">
                      {{ formatDate(group.created_at) }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">{{ $t('common.created') }}</div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        @click="editGroup(group)"
                        class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
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
                        @click="managePermissions(group)"
                        class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        :title="$t('groups.manage_permissions')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="toggleGroupStatus(group)"
                        :class="
                          group.is_active
                            ? 'hover:text-yellow-600 hover:bg-yellow-50'
                            : 'hover:text-green-600 hover:bg-green-50'
                        "
                        class="p-2 text-gray-600 rounded-lg transition-colors duration-200"
                        :title="group.is_active ? $t('groups.deactivate') : $t('groups.activate')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            v-if="!group.is_active"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                          <path
                            v-else
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                      </button>
                      <button
                        v-if="!group.is_system"
                        @click="confirmDelete(group)"
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
      </div>
    </div>

    <!-- Group Form Modal -->
    <GroupForm
      :show="showModal"
      :group="editingGroup"
      @close="closeModal"
      @saved="onGroupSaved"
    />

    <!-- Permissions Modal -->
    <transition name="modal-fade">
      <div
        v-if="showPermissionsModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="closePermissionsModal"
      >
        <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-purple-100 rounded-lg">
                  <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ $t('groups.manage_permissions') }}: {{ selectedGroup?.title_ar }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ $t('groups.permissions_subtitle') }}
                  </p>
                </div>
              </div>
              <button
                @click="closePermissionsModal"
                class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <!-- Modal Body -->
          <div class="p-6">
            <div v-if="permissionsLoading" class="text-center py-8">
              <div class="inline-block relative">
                <div class="w-10 h-10 border-4 border-purple-100 rounded-full"></div>
                <div
                  class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
                ></div>
              </div>
              <p class="text-gray-600 mt-4">{{ $t('common.loading') }}</p>
            </div>

            <div v-else>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('groups.select_permissions') }}
                </label>
                <div
                  class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4"
                >
                  <div
                    v-for="permission in availablePermissions"
                    :key="permission.id"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      :id="'perm_' + permission.id"
                      :value="permission.id"
                      v-model="selectedPermissions"
                      class="ml-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label :for="'perm_' + permission.id" class="text-sm text-gray-700">
                      {{ permission.title }}
                      <span class="text-xs text-gray-500 block">
                        {{ permission.description_ar || permission.description_en }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  @click="closePermissionsModal"
                  class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-300"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  @click="savePermissions"
                  :disabled="permissionsSubmitting"
                  class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg
                    v-if="permissionsSubmitting"
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
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span>{{ $t('common.save') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GroupForm from './GroupForm.vue'

export default {
  name: 'AdminGroups',
  components: {
    GroupForm,
  },

  data() {
    return {
      showModal: false,
      showPermissionsModal: false,
      permissionsSubmitting: false,
      permissionsLoading: false,
      editingGroup: null,
      selectedGroup: null,
      filters: {
        search: '',
        status: 'all',
        is_system: '',
        date_from: '',
      },
      availablePermissions: [],
      selectedPermissions: [],
    }
  },

  computed: {
    ...mapState('groups', {
      storeGroups: (state) => state.adminGroups,
      storeLoading: (state) => state.isLoading,
      storeError: (state) => state.error,
    }),
    activeGroupsCount() {
      return this.storeGroups.filter((g) => g.is_active).length
    },
    inactiveGroupsCount() {
      return this.storeGroups.filter((g) => !g.is_active).length
    },
    totalUsersInGroups() {
      return this.storeGroups.reduce((sum, g) => sum + (g.users_count || 0), 0)
    },
    filteredGroups() {
      let groups = this.storeGroups
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        groups = groups.filter(
          (g) =>
            g.title_en.toLowerCase().includes(search) ||
            g.title_ar.includes(search) ||
            (g.description && g.description.toLowerCase().includes(search)),
        )
      }
      if (this.filters.status !== 'all') {
        const active = this.filters.status === 'active'
        groups = groups.filter((g) => g.is_active === active)
      }
      if (this.filters.is_system !== '') {
        const isSystem = this.filters.is_system === '1'
        groups = groups.filter((g) => g.is_system === isSystem)
      }
      if (this.filters.date_from) {
        const fromDate = new Date(this.filters.date_from)
        groups = groups.filter((g) => new Date(g.created_at) >= fromDate)
      }
      return groups
    },
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    ...mapActions('groups', [
      'getAdminGroups',
      'createAdminGroup',
      'updateAdminGroup',
      'deleteAdminGroup',
      'updateGroupStatus',
      'getAvailablePermissions',
      'updateGroupPermissions',
      'clearError',
    ]),

    async loadData() {
      try {
        await this.getAdminGroups()
      } catch (error) {
        console.error('Error loading groups:', error)
        this.$toast.error(this.$t('errors.failed_to_load_data'))
      }
    },

    clearSearch() {
      this.filters.search = ''
      this.loadData()
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: 'all',
        is_system: '',
        date_from: '',
      }
      this.loadData()
      this.$toast.info(this.$t('reports.buttons.reset_filters'))
    },

    clearStoreError() {
      this.clearError()
    },

    formatDate(date) {
      if (!date) return '-'
      const dateObj = new Date(date)
      return dateObj.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    openAddModal() {
      this.editingGroup = null
      this.showModal = true
    },

    editGroup(group) {
      this.editingGroup = group
      this.showModal = true
    },

    async onGroupSaved() {
      await this.loadData()
    },

    closeModal() {
      this.showModal = false
      this.editingGroup = null
    },

    async toggleGroupStatus(group) {
      const action = group.is_active ? this.$t('groups.deactivate') : this.$t('groups.activate')
      const confirmed = await this.$swal({
        title: this.$t('groups.confirm_status_change_title'),
        text: this.$t('groups.confirm_status_change', { name: group.title_ar, action: action }),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: group.is_active ? '#EAB308' : '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: action,
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.updateGroupStatus({
            id: group.id,
            is_active: !group.is_active,
          })
          await this.loadData()
          this.$toast.success(this.$t('groups.messages.status_change_success', { action: action }))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_change_status'))
        }
      }
    },

    async confirmDelete(group) {
      const confirmed = await this.$swal({
        title: this.$t('groups.delete_confirm_title'),
        text: this.$t('groups.delete_confirm', { name: group.title_ar }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.deleteAdminGroup(group.id)
          await this.loadData()
          this.$toast.success(this.$t('groups.messages.delete_success'))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_delete_group'))
        }
      }
    },

    async managePermissions(group) {
      this.selectedGroup = group
      this.selectedPermissions = []
      this.availablePermissions = []
      this.showPermissionsModal = true
      this.permissionsLoading = true

      try {
        const { permissions, selectedPermissions } = await this.getAvailablePermissions(group.id)
        this.availablePermissions = permissions
        this.selectedPermissions = selectedPermissions
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failed_to_load_permissions'))
        this.closePermissionsModal()
      } finally {
        this.permissionsLoading = false
      }
    },

    async savePermissions() {
      if (!this.selectedGroup) return

      this.permissionsSubmitting = true
      try {
        await this.updateGroupPermissions({
          id: this.selectedGroup.id,
          permissions: this.selectedPermissions,
        })
        this.$toast.success(this.$t('groups.messages.permissions_updated'))
        this.closePermissionsModal()
        await this.loadData()
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failed_to_update_permissions'))
      } finally {
        this.permissionsSubmitting = false
      }
    },

    closePermissionsModal() {
      this.showPermissionsModal = false
      this.selectedGroup = null
      this.selectedPermissions = []
      this.availablePermissions = []
    },
  },
}
</script>

<style scoped>
/* استيراد أنماط التصميم الموحدة من InvoiceReportSection */
.stats-card {
  @apply rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300;
}
.stats-icon {
  @apply p-3 rounded-lg w-fit mb-3;
}
.stats-label {
  @apply text-sm font-medium text-gray-500 mb-1;
}
.stats-value {
  @apply text-2xl font-bold text-gray-900;
}
.table-header {
  @apply px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4;
}
.status-badge {
  @apply px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1;
}
.status-dot {
  @apply w-2 h-2 rounded-full;
}
/* باقي الأنماط من النسخة السابقة */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
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
tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}
button {
  transition: all 0.15s ease-in-out;
}
button:active {
  transform: translateY(0);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
@media (max-width: 640px) {
  .container-padding {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .mobile-stack {
    flex-direction: column;
    gap: 0.75rem;
  }
}
.form-input {
  transition: all 0.2s ease;
}
.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.icon-button {
  transition: all 0.15s ease;
}
.icon-button:hover {
  transform: scale(1.05);
}
.padding-consistent {
  padding: 1rem 1.5rem;
}
.heading-large {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.heading-medium {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.heading-small {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-body {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-small {
  font-size: 0.75rem;
  line-height: 1rem;
}
.card-shadow {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.card-shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.text-primary {
  color: #1f2937;
}
.text-secondary {
  color: #6b7280;
}
.text-accent {
  color: #3b82f6;
}
.bg-primary {
  background-color: #ffffff;
}
.bg-secondary {
  background-color: #f9fafb;
}
.bg-accent {
  background-color: #3b82f6;
}
.border-light {
  border-color: #e5e7eb;
}
.border-medium {
  border-color: #d1d5db;
}
.rounded-sm {
  border-radius: 0.25rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-2xl {
  border-radius: 1rem;
}
</style>
