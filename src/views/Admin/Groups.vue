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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
                  {{ $t('users.title') }}
                </h1>
                <p class="text-sm text-gray-600 mt-1">
                  {{ $t('users.subtitle') }}
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
              <span class="font-medium">{{ $t('users.create_new') }}</span>
            </button>
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
                {{ $t('users.filter_subtitle') }}
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
                :placeholder="$t('users.search_placeholder')"
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

          <!-- Group Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('users.group') }}
            </label>
            <div class="relative">
              <select
                v-model="filters.group_id"
                class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="group in storeGroups" :key="group.id" :value="group.id">
                  {{ group.title_ar || group.title_en }}
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
                <option value="active">{{ $t('users.status.active') }}</option>
                <option value="inactive">{{ $t('users.status.inactive') }}</option>
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
          <p class="text-sm text-gray-500 mt-2">{{ $t('users.loading_subtitle') }}</p>
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
                  {{ $t('users.user_list') }}
                </h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                  {{ storeUsers.length }} {{ $t('common.total') }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                {{ $t('users.list_subtitle') }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="storeUsers.length === 0" class="text-center py-16 px-4">
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ $t('users.no_users') }}
              </h3>
              <p class="text-gray-600 mb-6">{{ $t('users.start_creating_message') }}</p>
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
                {{ $t('users.create_first') }}
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
                    {{ $t('users.name') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('users.email') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('users.group') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('common.status') }}
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
                  v-for="user in storeUsers"
                  :key="user.id"
                  class="hover:bg-blue-50/50 transition-colors duration-150"
                >
                  <!-- Name -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 ml-4">
                        <div
                          class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center"
                        >
                          <span class="text-white font-bold text-sm">
                            {{ getInitials(user.name) }}
                          </span>
                        </div>
                      </div>
                      <div class="mr-4">
                        <div class="text-sm font-semibold text-gray-900">
                          {{ user.name }}
                        </div>
                        <div class="flex items-center gap-2 mt-1">
                          <span class="text-xs text-gray-500">ID: {{ user.id }}</span>
                          <span
                            v-if="user.id === currentUser?.id"
                            class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium"
                          >
                            {{ $t('users.you') }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Email -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ user.email }}</div>
                  </td>

                  <!-- Group -->
                  <td class="px-6 py-4">
                    <div class="flex justify-center">
                      <span
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
                      >
                        {{
                          user.admin_group?.title_ar ||
                          user.admin_group?.title_en ||
                          $t('users.no_group')
                        }}
                      </span>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4">
                    <div class="flex justify-center">
                      <span
                        :class="
                          user.is_active
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        "
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border"
                      >
                        <span
                          :class="user.is_active ? 'bg-green-500' : 'bg-red-500'"
                          class="w-2 h-2 rounded-full ml-2"
                        ></span>
                        {{
                          user.is_active ? $t('users.status.active') : $t('users.status.inactive')
                        }}
                      </span>
                    </div>
                  </td>

                  <!-- Created Date -->
                  <td class="px-6 py-4">
                    <div class="text-center">
                      <div class="text-sm text-gray-900 font-medium">
                        {{ formatDate(user.created_at) }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">{{ $t('common.created') }}</div>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        @click="editUser(user)"
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
                        @click="toggleUserStatus(user)"
                        :class="
                          user.is_active
                            ? 'hover:text-yellow-600 hover:bg-yellow-50'
                            : 'hover:text-green-600 hover:bg-green-50'
                        "
                        class="p-2 text-gray-600 rounded-lg transition-colors duration-200"
                        :title="user.is_active ? $t('users.deactivate') : $t('users.activate')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            v-if="!user.is_active"
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
                        v-if="user.id !== currentUser?.id"
                        @click="confirmDelete(user)"
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

    <!-- Create/Edit Modal -->
    <transition name="modal-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div class="flex justify-between items-center">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">
                    {{ editingUser ? $t('users.edit_user') : $t('users.create_user') }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ editingUser ? $t('users.edit_subtitle') : $t('users.create_subtitle') }}
                  </p>
                </div>
              </div>
              <button
                @click="closeModal"
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
          <form @submit.prevent="editingUser ? updateUser() : addUser()" class="p-6">
            <!-- Form Error -->
            <div v-if="formError" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0 pt-0.5">
                  <svg
                    class="w-5 h-5 text-red-500"
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
                <div class="mr-3 flex-1">
                  <p class="text-sm text-red-700">{{ formError }}</p>
                </div>
                <button @click="formError = null" class="p-1 text-red-500 hover:text-red-700">
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

            <div class="space-y-4">
              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('users.full_name') }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  v-model="userForm.name"
                  required
                  class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  :placeholder="$t('users.name_placeholder')"
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('users.email') }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  v-model="userForm.email"
                  required
                  class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  :placeholder="$t('users.email_placeholder')"
                />
              </div>

              <!-- Group -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('users.group') }}
                  <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select
                    v-model="userForm.admin_group_id"
                    required
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
                  >
                    <option value="">{{ $t('users.select_group') }}</option>
                    <option v-for="group in storeGroups" :key="group.id" :value="group.id">
                      {{ group.title_ar || group.title_en }}
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

              <!-- Password Section -->
              <div v-if="!editingUser" class="space-y-4">
                <!-- Password for New User -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('users.password') }}
                    <span class="text-red-500">*</span>
                    <span class="text-xs text-gray-500">
                      ({{ $t('users.password_min_length') }})
                    </span>
                  </label>
                  <input
                    type="password"
                    v-model="userForm.password"
                    required
                    minlength="8"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.password_placeholder')"
                  />
                </div>

                <!-- Confirm Password for New User -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('users.confirm_password') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    v-model="userForm.password_confirmation"
                    required
                    minlength="8"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.confirm_password_placeholder')"
                  />
                </div>
              </div>

              <!-- Password Section for Editing -->
              <div v-if="editingUser" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('users.new_password') }}
                    <span class="text-xs text-gray-500">
                      ({{ $t('users.password_optional') }})
                    </span>
                  </label>
                  <input
                    type="password"
                    v-model="userForm.password"
                    minlength="8"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.new_password_placeholder')"
                  />
                </div>

                <div v-if="userForm.password">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('users.confirm_new_password') }}
                  </label>
                  <input
                    type="password"
                    v-model="userForm.password_confirmation"
                    minlength="8"
                    class="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.confirm_new_password_placeholder')"
                  />
                </div>
              </div>

              <!-- Status Toggle -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('common.status') }}
                </label>
                <div
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <span class="text-gray-700">
                    {{
                      userForm.is_active ? $t('users.status.active') : $t('users.status.inactive')
                    }}
                  </span>
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="userForm.is_active" class="sr-only peer" />
                    <div
                      class="relative w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    ></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="mt-8 flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-300"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  v-if="submitting"
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
                <span class="font-medium">
                  {{
                    submitting
                      ? $t('common.saving')
                      : editingUser
                        ? $t('common.update')
                        : $t('common.save')
                  }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdminUsers',

  data() {
    return {
      showModal: false,
      submitting: false,
      editingUser: null,
      formError: null,
      filters: {
        search: '',
        group_id: '',
        status: 'all',
        date_from: '',
      },
      userForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_group_id: '',
        is_active: true,
      },
    }
  },

  computed: {
    ...mapState('users', {
      storeUsers: (state) => state.users,
      storeGroups: (state) => state.groups,
      storeLoading: (state) => state.isLoading,
      storeError: (state) => state.error,
    }),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    ...mapActions('users', [
      'getUsers',
      'getUserGroups',
      'createUser',
      'updateUser',
      'deleteUser',
      'updateUserStatus',
      'clearError',
    ]),

    async loadData() {
      try {
        await Promise.all([this.getUsers(this.filters), this.getUserGroups()])
      } catch (error) {
        console.error('Error loading data:', error)
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
        group_id: '',
        status: 'all',
        date_from: '',
      }
      this.loadData()
      this.$toast.info(this.$t('reports.buttons.reset_filters'))
    },

    clearStoreError() {
      this.clearError()
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
      this.editingUser = null
      this.formError = null
      this.userForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_group_id: '',
        is_active: true,
      }
      this.showModal = true
    },

    editUser(user) {
      this.editingUser = user
      this.formError = null
      this.userForm = {
        name: user.name,
        email: user.email,
        admin_group_id: user.admin_group_id,
        is_active: user.is_active,
        password: '',
        password_confirmation: '',
      }
      this.showModal = true
    },

    validatePassword() {
      if (!this.editingUser) {
        if (!this.userForm.password || this.userForm.password.length < 8) {
          throw new Error(this.$t('errors.password_min_length'))
        }
      } else {
        if (this.userForm.password && this.userForm.password.length < 8) {
          throw new Error(this.$t('errors.password_min_length'))
        }
      }

      if (this.userForm.password !== this.userForm.password_confirmation) {
        throw new Error(this.$t('errors.password_mismatch'))
      }
    },

    async addUser() {
      this.submitting = true
      this.formError = null

      try {
        this.validatePassword()

        await this.createUser(this.userForm)
        this.closeModal()
        await this.loadData()
        this.$toast.success(this.$t('users.messages.create_success'))
      } catch (error) {
        this.formError = error.message || this.$t('errors.failed_to_create_user')
        this.$toast.error(error.message || this.$t('errors.failed_to_create_user'))
      } finally {
        this.submitting = false
      }
    },

    async updateUser() {
      this.submitting = true
      this.formError = null

      try {
        if (this.userForm.password) {
          this.validatePassword()
        }

        await this.updateUser({
          id: this.editingUser.id,
          data: this.userForm,
        })
        this.closeModal()
        await this.loadData()
        this.$toast.success(this.$t('users.messages.update_success'))
      } catch (error) {
        this.formError = error.message || this.$t('errors.failed_to_update_user')
        this.$toast.error(error.message || this.$t('errors.failed_to_update_user'))
      } finally {
        this.submitting = false
      }
    },

    async toggleUserStatus(user) {
      const action = user.is_active ? this.$t('users.deactivate') : this.$t('users.activate')
      const confirmed = await this.$swal({
        title: this.$t('users.confirm_status_change_title'),
        text: this.$t('users.confirm_status_change', { name: user.name, action: action }),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: user.is_active ? '#EAB308' : '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: action,
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.updateUserStatus({
            id: user.id,
            is_active: !user.is_active,
          })
          await this.loadData()
          this.$toast.success(this.$t('users.messages.status_change_success', { action: action }))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_change_status'))
        }
      }
    },

    async confirmDelete(user) {
      const confirmed = await this.$swal({
        title: this.$t('users.delete_confirm_title'),
        text: this.$t('users.delete_confirm', { name: user.name }),
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
          await this.deleteUser(user.id)
          await this.loadData()
          this.$toast.success(this.$t('users.messages.delete_success'))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_delete_user'))
        }
      }
    },

    closeModal() {
      this.showModal = false
      this.editingUser = null
      this.formError = null
      this.userForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_group_id: '',
        is_active: true,
      }
    },
  },
}
</script>

<style scoped>
/* تحسينات القياسات والمسافات */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
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

/* تأثيرات hover محسنة */
tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* تحسينات الأزرار */
button {
  transition: all 0.15s ease-in-out;
}

button:active {
  transform: translateY(0);
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

/* تدرجات لونية محسنة */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* تأثيرات focus محسنة */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: 2px solid transparent;
  outline-offset: 2px;
}

/* تحسينات للشاشات الصغيرة */
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

/* تحسينات لعناصر النموذج */
.form-input {
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* تحسينات للأيقونات */
.icon-button {
  transition: all 0.15s ease;
}

.icon-button:hover {
  transform: scale(1.05);
}

/* تحسينات المسافات الداخلية */
.padding-consistent {
  padding: 1rem 1.5rem;
}

/* تحسينات للعناوين */
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

/* تحسينات للنصوص */
.text-body {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-small {
  font-size: 0.75rem;
  line-height: 1rem;
}

/* تحسينات للبطاقات */
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

/* تحسينات للألوان */
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

/* تحسينات الحدود */
.border-light {
  border-color: #e5e7eb;
}

.border-medium {
  border-color: #d1d5db;
}

/* تحسينات الزوايا */
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
