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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('permissions.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('permissions.subtitle') }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="showCreateModal = true"
              class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
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
              <span class="font-medium">{{ $t('permissions.create_new') }}</span>
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
            <h2 class="text-lg font-semibold text-gray-800">{{ $t('common.filters') }}</h2>
          </div>

          <div class="flex gap-2">
            <button
              @click="loadPermissions"
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
              {{ $t('buttons.search') }}
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
              $t('common.search')
            }}</label>
            <div class="relative">
              <input
                type="text"
                v-model="localFilters.search"
                :placeholder="$t('permissions.search_placeholder')"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                v-if="localFilters.search"
                @click="clearSearch"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.status')
            }}</label>
            <div class="relative">
              <select
                v-model="localFilters.status"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
              >
                <option value="all">{{ $t('common.all') }}</option>
                <option value="active">{{ $t('permissions.status.active') }}</option>
                <option value="inactive">{{ $t('permissions.status.inactive') }}</option>
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
              $t('permissions.menu')
            }}</label>
            <div class="relative">
              <select
                v-model="localFilters.menu_id"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                  {{ menu.title_ar || menu.title_en }}
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('permissions.parent_permission')
            }}</label>
            <div class="relative">
              <select
                v-model="localFilters.parent_id"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option v-for="parent in parentPermissions" :key="parent.id" :value="parent.id">
                  {{ parent.title }}
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

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 mb-6">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
          ></div>
          <p class="text-gray-700 font-medium">{{ $t('common.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('permissions.loading_subtitle') }}</p>
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
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ $t('permissions.permission_list') }}
                </h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {{ pagination.total || 0 }} {{ $t('common.total') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="permissions.length === 0" class="text-center py-12 px-4">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('permissions.no_permissions') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ $t('permissions.start_creating_message') }}
            </p>
            <button
              @click="showCreateModal = true"
              class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {{ $t('permissions.create_first') }}
            </button>
          </div>

          <!-- Table Content -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('permissions.name') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('permissions.description') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('permissions.menu') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('permissions.parent') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('common.created_at') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('common.status') }}
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
                  v-for="permission in permissions"
                  :key="permission.id"
                  class="hover:bg-blue-50/30 transition-colors duration-150"
                >
                  <!-- Name -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 ml-3">
                        <div
                          class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
                        >
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
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div class="mr-3">
                        <div class="text-base font-semibold text-gray-900">
                          {{ permission.title }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">ID: {{ permission.id }}</div>
                      </div>
                    </div>
                  </td>

                  <!-- Description -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{
                        permission.description_ar ||
                        permission.description_en ||
                        $t('common.notAvailable')
                      }}
                    </div>
                  </td>

                  <!-- Menu -->
                  <td class="px-6 py-4 text-center">
                    <div v-if="permission.menu">
                      <span
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800"
                      >
                        {{ permission.menu.title_ar || permission.menu.title_en }}
                      </span>
                    </div>
                    <div v-else class="text-sm text-gray-500">—</div>
                  </td>

                  <!-- Parent -->
                  <td class="px-6 py-4 text-center">
                    <div v-if="permission.parent_permission">
                      <span
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"
                      >
                        {{ permission.parent_permission.title }}
                      </span>
                    </div>
                    <div v-else class="text-sm text-gray-500">—</div>
                  </td>

                  <!-- Created Date -->
                  <td class="px-6 py-4 text-center">
                    <div class="text-sm text-gray-900 font-medium">
                      {{ formatDate(permission.created_at) }}
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex flex-col items-center">
                      <span
                        :class="
                          permission.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        "
                        class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span
                          :class="permission.is_active ? 'bg-green-500' : 'bg-red-500'"
                          class="w-2 h-2 rounded-full"
                        ></span>
                        {{
                          permission.is_active
                            ? $t('permissions.status.active')
                            : $t('permissions.status.inactive')
                        }}
                      </span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="editPermission(permission)"
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
                        @click="confirmDelete(permission)"
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

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 class="text-lg font-semibold text-gray-800">
                {{
                  isEditing
                    ? $t('permissions.edit_permission')
                    : $t('permissions.create_permission')
                }}
              </h3>
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
        <form @submit.prevent="savePermission" class="p-6">
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.name') }} *
                </label>
                <input
                  type="text"
                  v-model="form.title"
                  required
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="$t('permissions.name_placeholder')"
                />
              </div>

              <!-- Menu -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.menu') }}
                </label>
                <div class="relative">
                  <select
                    v-model="form.admin_menu_id"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                  >
                    <option value="">{{ $t('permissions.select_menu') }}</option>
                    <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                      {{ menu.title_ar || menu.title_en }}
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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- English Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.description_en') }}
                </label>
                <textarea
                  v-model="form.description_en"
                  rows="3"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  :placeholder="$t('permissions.description_en_placeholder')"
                ></textarea>
              </div>

              <!-- Arabic Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.description_ar') }}
                </label>
                <textarea
                  v-model="form.description_ar"
                  rows="3"
                  class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  :placeholder="$t('permissions.description_ar_placeholder')"
                ></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Parent Permission -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.parent_permission') }}
                </label>
                <div class="relative">
                  <select
                    v-model="form.parent_id"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
                  >
                    <option value="">{{ $t('permissions.select_parent') }}</option>
                    <option v-for="parent in parentPermissions" :key="parent.id" :value="parent.id">
                      {{ parent.title }}
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

              <!-- Is Parent -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.is_parent') }}
                </label>
                <div class="mt-2">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="form.is_parent" class="sr-only peer" />
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                    ></div>
                    <span class="mr-3 text-sm font-medium text-gray-700">
                      {{ form.is_parent ? $t('common.yes') : $t('common.no') }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('common.status') }}
                </label>
                <div class="mt-2">
                  <label class="inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="form.is_active" class="sr-only peer" />
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    ></div>
                    <span class="mr-3 text-sm font-medium text-gray-700">
                      {{
                        form.is_active
                          ? $t('permissions.status.active')
                          : $t('permissions.status.inactive')
                      }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="mt-8 flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                v-if="saving"
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
                  saving ? $t('common.saving') : isEditing ? $t('common.update') : $t('common.save')
                }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PermissionManagement',

  data() {
    return {
      showCreateModal: false,
      showEditModal: false,

      localFilters: {
        search: '',
        status: 'all',
        menu_id: '',
        parent_id: '',
        page: 1,
        per_page: 10,
      },

      form: {
        id: null,
        title: '',
        description_en: '',
        description_ar: '',
        admin_menu_id: '',
        admin_sub_menu_id: '',
        parent_id: '',
        is_parent: false,
        is_active: true,
      },

      saving: false,
      searchTimeout: null,
    }
  },

  computed: {
    ...mapGetters('permissions', [
      'permissions',
      'menus',
      'parentPermissions',
      'isLoading',
      'error',
      'pagination',
      'filters',
    ]),

    isEditing() {
      return this.showEditModal && this.form.id !== null
    },
  },

  watch: {
    'localFilters.search': {
      handler(newVal) {
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        this.searchTimeout = setTimeout(() => {
          this.updateFilters({ search: newVal })
          this.loadPermissions()
        }, 500)
      },
    },
    'localFilters.status'(newVal) {
      this.updateFilters({ status: newVal })
      this.loadPermissions()
    },
    'localFilters.menu_id'(newVal) {
      this.updateFilters({ menu_id: newVal })
      this.loadPermissions()
    },
    'localFilters.parent_id'(newVal) {
      this.updateFilters({ parent_id: newVal })
      this.loadPermissions()
    },
    'localFilters.page'(newVal) {
      this.updateFilters({ page: newVal })
      this.loadPermissions()
    },
    'localFilters.per_page'(newVal) {
      this.updateFilters({ per_page: newVal })
      this.loadPermissions()
    },

    filters: {
      immediate: true,
      handler(newFilters) {
        this.localFilters = { ...this.localFilters, ...newFilters }
      },
    },
  },

  mounted() {
    this.loadInitialData()
  },

  methods: {
    ...mapActions('permissions', [
      'getPermissions',
      'fetchMenus',
      'fetchParentPermissions',
      'createPermission',
      'updatePermission',
      'deletePermission',
      'updateFilters',
      'resetFilters',
      'resetForm',
      'loadPermissionIntoForm',
      'clearError',
    ]),

    async loadInitialData() {
      try {
        await Promise.all([this.getPermissions(), this.fetchMenus(), this.fetchParentPermissions()])
      } catch (error) {
        console.error('Failed to load initial data:', error)
        this.$toast.error(this.$t('errors.failed_to_load_data'))
      }
    },

    async loadPermissions() {
      try {
        await this.getPermissions()
      } catch (error) {
        console.error('Failed to load permissions:', error)
        this.$toast.error(this.$t('errors.failed_to_load_permissions'))
      }
    },

    clearSearch() {
      this.localFilters.search = ''
      this.updateFilters({ search: '' })
      this.loadPermissions()
    },

    openCreateModal() {
      this.resetForm()
      this.showCreateModal = true
    },

    editPermission(permission) {
      this.loadPermissionIntoForm(permission)
      this.form = { ...permission }
      this.showEditModal = true
    },

    closeModal() {
      this.showCreateModal = false
      this.showEditModal = false
      this.resetForm()
      this.form = {
        id: null,
        title: '',
        description_en: '',
        description_ar: '',
        admin_menu_id: '',
        admin_sub_menu_id: '',
        parent_id: '',
        is_parent: false,
        is_active: true,
      }
    },

    async savePermission() {
      this.saving = true
      try {
        if (this.isEditing) {
          await this.updatePermission({
            id: this.form.id,
            data: this.form,
          })
          this.$toast.success(this.$t('permissions.messages.update_success'))
        } else {
          await this.createPermission(this.form)
          this.$toast.success(this.$t('permissions.messages.create_success'))
        }

        this.closeModal()
        await this.getPermissions()
      } catch (error) {
        console.error('Failed to save permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_save_permission'))
      } finally {
        this.saving = false
      }
    },

    async confirmDelete(permission) {
      const confirmed = await this.$swal({
        title: this.$t('permissions.delete_confirm_title'),
        text: this.$t('permissions.delete_confirm', { name: permission.title }),
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
          await this.deletePermission(permission.id)
          this.$toast.success(this.$t('permissions.messages.delete_success'))
          await this.getPermissions()
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_delete_permission'))
        }
      }
    },

    goToPage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      this.localFilters.page = page
    },

    previousPage() {
      if (this.pagination && this.pagination.current_page > 1) {
        this.goToPage(this.pagination.current_page - 1)
      }
    },

    nextPage() {
      if (this.pagination && this.pagination.current_page < this.pagination.last_page) {
        this.goToPage(this.pagination.current_page + 1)
      }
    },

    getPaginationRange() {
      if (!this.pagination) return []
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

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    resetFilters() {
      this.localFilters = {
        search: '',
        status: 'all',
        menu_id: '',
        parent_id: '',
        page: 1,
        per_page: 10,
      }
      this.resetFilters()
      this.loadPermissions()
      this.$toast.info(this.$t('reports.buttons.reset_filters'))
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

/* تحسينات المودال */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
