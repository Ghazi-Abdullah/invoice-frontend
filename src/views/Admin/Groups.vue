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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('admin_groups.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('admin_groups.subtitle') }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="openAddPermissionModal"
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span class="font-medium">{{ $t('admin_groups.add_permission') }}</span>
            </button>
            <button
              @click="showAddGroupModal = true"
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
              <span class="font-medium">{{ $t('admin_groups.add_group') }}</span>
            </button>
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
          <p class="text-sm text-gray-500 mt-2">{{ $t('admin_groups.loading_subtitle') }}</p>
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

      <!-- Groups List -->
      <div v-else>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ $t('admin_groups.groups_list') }}
                </h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {{ adminGroups.length }} {{ $t('common.total') }}
                </span>
              </div>

              <div class="text-sm text-gray-600">
                <span class="font-semibold">{{ getTotalUsers() }}</span>
                {{ $t('admin_groups.total_users') }} •
                <span class="font-semibold">{{ getTotalPermissions() }}</span>
                {{ $t('admin_groups.total_permissions') }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="adminGroups.length === 0" class="text-center py-12 px-4">
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
              {{ $t('admin_groups.no_groups') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ $t('admin_groups.start_creating_message') }}
            </p>
            <button
              @click="showAddGroupModal = true"
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
              {{ $t('admin_groups.create_first') }}
            </button>
          </div>

          <!-- Groups Grid -->
          <div v-else class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="group in adminGroups"
                :key="group.id"
                class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
              >
                <!-- Group Header -->
                <div
                  class="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center"
                      >
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
                        <h3 class="text-lg font-bold text-gray-900">
                          {{ group.title_ar || group.title_en }}
                        </h3>
                        <p class="text-sm text-gray-600 mt-1">
                          {{ group.title_en }}
                        </p>
                      </div>
                    </div>
                    <span
                      v-if="group.id === 1"
                      class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full"
                    >
                      {{ $t('admin_groups.default_group') }}
                    </span>
                  </div>
                </div>

                <!-- Group Info -->
                <div class="p-5">
                  <p class="text-sm text-gray-600 mb-6 line-clamp-2">
                    {{ group.description || $t('admin_groups.no_description') }}
                  </p>

                  <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-blue-600 mb-1">
                        {{ group.users_count || 0 }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ $t('admin_groups.users') }}
                      </div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-purple-600 mb-1">
                        {{ group.permissions_count || 0 }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ $t('admin_groups.permissions') }}
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div class="flex items-center gap-2">
                      <button
                        @click="editGroup(group)"
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
                        @click="managePermissions(group)"
                        class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        :title="$t('admin_groups.manage_permissions')"
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
                    </div>
                    <button
                      v-if="group.id !== 1"
                      @click="confirmDeleteGroup(group)"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Group Modal -->
      <div
        v-if="showAddGroupModal || showEditGroupModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">
                  {{
                    showEditGroupModal
                      ? $t('admin_groups.edit_group')
                      : $t('admin_groups.add_group')
                  }}
                </h3>
              </div>
              <button
                @click="closeGroupModal"
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
          <form @submit.prevent="showEditGroupModal ? updateGroup() : addGroup()" class="p-6">
            <div class="space-y-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('admin_groups.group_name_ar') }} *
                  </label>
                  <input
                    type="text"
                    v-model="groupForm.title_ar"
                    required
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="$t('admin_groups.group_name_ar_placeholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('admin_groups.group_name_en') }} *
                  </label>
                  <input
                    type="text"
                    v-model="groupForm.title_en"
                    required
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="$t('admin_groups.group_name_en_placeholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('admin_groups.description') }}
                  </label>
                  <textarea
                    v-model="groupForm.description"
                    rows="3"
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    :placeholder="$t('admin_groups.description_placeholder')"
                  ></textarea>
                </div>

                <div v-if="showEditGroupModal">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('common.status') }}
                  </label>
                  <div class="mt-2">
                    <label class="inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="groupForm.is_active" class="sr-only peer" />
                      <div
                        class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                      ></div>
                      <span class="mr-3 text-sm font-medium text-gray-700">
                        {{ groupForm.is_active ? $t('common.active') : $t('common.inactive') }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeGroupModal"
                  class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                        : showEditGroupModal
                          ? $t('common.update')
                          : $t('common.save')
                    }}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Manage Permissions Modal -->
      <div
        v-if="showPermissionsModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
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
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ $t('admin_groups.manage_permissions_for') }}:
                  {{ selectedGroup?.title_ar || selectedGroup?.title_en }}
                </h3>
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
            <div v-if="permissionsLoading" class="text-center py-12">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
              ></div>
              <p class="text-gray-700 font-medium">{{ $t('common.loading') }}</p>
            </div>

            <div v-else class="space-y-6">
              <!-- Search -->
              <div class="relative">
                <input
                  type="text"
                  v-model="permissionSearch"
                  :placeholder="$t('common.search_permissions')"
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
              </div>

              <!-- Info Cards -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div class="text-2xl font-bold text-blue-600 mb-1">
                    {{ filteredPermissions.length }}
                  </div>
                  <div class="text-sm text-blue-800">
                    {{ $t('admin_groups.available_permissions') }}
                  </div>
                </div>
                <div class="bg-green-50 border border-green-100 rounded-xl p-4">
                  <div class="text-2xl font-bold text-green-600 mb-1">
                    {{ selectedPermissions.length }}
                  </div>
                  <div class="text-sm text-green-800">
                    {{ $t('admin_groups.selected_permissions') }}
                  </div>
                </div>
                <div class="bg-purple-50 border border-purple-100 rounded-xl p-4">
                  <div class="text-2xl font-bold text-purple-600 mb-1">
                    {{ availablePermissions.length }}
                  </div>
                  <div class="text-sm text-purple-800">
                    {{ $t('admin_groups.total_permissions') }}
                  </div>
                </div>
              </div>

              <!-- Select All -->
              <div class="flex items-center justify-between">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="mr-2 text-sm font-medium text-gray-700">
                    {{ $t('admin_groups.select_all') }}
                  </span>
                </label>
                <button
                  @click="openAddPermissionModal"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {{ $t('admin_groups.add_new_permission') }}
                </button>
              </div>

              <!-- Permissions Grid -->
              <div
                v-if="filteredPermissions.length > 0"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto p-1"
              >
                <div
                  v-for="permission in filteredPermissions"
                  :key="permission.id"
                  class="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                  :class="{
                    'border-blue-300 bg-blue-50': selectedPermissions.includes(permission.id),
                  }"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-start flex-1">
                      <input
                        type="checkbox"
                        :id="`permission-${permission.id}`"
                        :value="permission.id"
                        v-model="selectedPermissions"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div class="mr-3 flex-1">
                        <label :for="`permission-${permission.id}`" class="block cursor-pointer">
                          <div class="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                            {{ permission.description_ar || permission.title }}
                          </div>
                          <div class="text-xs text-gray-500 mb-2 line-clamp-2">
                            {{ permission.description_en || permission.title }}
                          </div>
                          <div class="text-xs text-gray-400 font-mono mb-2">
                            {{ permission.title }}
                          </div>
                          <div v-if="permission.menu">
                            <span
                              class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {{ permission.menu.title_ar || permission.menu.title_en }}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div v-else class="text-center py-12">
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
                  {{ $t('admin_groups.no_permissions_found') }}
                </h3>
                <p class="text-gray-600 mb-6 max-w-md mx-auto">
                  {{ $t('admin_groups.no_permissions_message') }}
                </p>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                @click="closePermissionsModal"
                class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                @click="savePermissions"
                :disabled="submitting"
                class="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span class="font-medium">
                  {{ submitting ? $t('common.saving') : $t('admin_groups.save_permissions') }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Permission Modal -->
      <div
        v-if="showAddPermissionModal"
        class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ $t('admin_groups.add_new_permission') }}
                </h3>
              </div>
              <button
                @click="closeAddPermissionModal"
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
          <form @submit.prevent="createPermission" class="p-6">
            <div class="space-y-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('permissions.name') }} *
                  </label>
                  <input
                    type="text"
                    v-model="permissionForm.title"
                    required
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="$t('permissions.name_placeholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('permissions.description_ar') }} *
                  </label>
                  <input
                    type="text"
                    v-model="permissionForm.description_ar"
                    required
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="$t('permissions.description_ar_placeholder')"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('permissions.description_en') }} *
                  </label>
                  <input
                    type="text"
                    v-model="permissionForm.description_en"
                    required
                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="$t('permissions.description_en_placeholder')"
                  />
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  @click="closeAddPermissionModal"
                  class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="permissionSubmitting"
                  class="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg
                    v-if="permissionSubmitting"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span class="font-medium">
                    {{ permissionSubmitting ? $t('common.saving') : $t('common.add') }}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdminGroups',

  data() {
    return {
      showAddGroupModal: false,
      showEditGroupModal: false,
      showPermissionsModal: false,
      showAddPermissionModal: false,
      submitting: false,
      permissionSubmitting: false,
      selectedGroup: null,
      availablePermissions: [],
      permissionsLoading: false,
      permissionSearch: '',
      selectedPermissions: [],
      selectAll: false,

      groupForm: {
        title_ar: '',
        title_en: '',
        description: '',
        is_active: true,
      },

      permissionForm: {
        title: '',
        description_ar: '',
        description_en: '',
      },
    }
  },

  computed: {
    ...mapState('adminGroups', {
      adminGroups: (state) => state.adminGroups || [],
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),

    filteredPermissions() {
      if (!this.permissionSearch) {
        return this.availablePermissions
      }
      const search = this.permissionSearch.toLowerCase()
      return this.availablePermissions.filter(
        (permission) =>
          (permission.title && permission.title.toLowerCase().includes(search)) ||
          (permission.description_ar && permission.description_ar.toLowerCase().includes(search)) ||
          (permission.description_en && permission.description_en.toLowerCase().includes(search)),
      )
    },
  },

  methods: {
    ...mapActions('adminGroups', [
      'getAdminGroups',
      'createAdminGroup',
      'updateAdminGroup',
      'deleteAdminGroup',
    ]),

    ...mapActions('permissions', [
      'getPermissions',
      'createPermission',
      'getGroupPermissions',
      'updateGroupPermissions',
    ]),

    async loadInitialData() {
      try {
        await this.getAdminGroups()
      } catch (error) {
        console.error('Failed to load groups:', error)
        this.$toast.error(this.$t('errors.failed_to_load_data'))
      }
    },

    async loadPermissionsForGroup(groupId) {
      this.permissionsLoading = true
      try {
        // Fetch all permissions
        const permissionsResponse = await this.getPermissions()
        this.availablePermissions = permissionsResponse.data || []

        // Fetch group permissions
        const groupPermissionsResponse = await this.getGroupPermissions(groupId)
        this.selectedPermissions = groupPermissionsResponse.map((p) => p.id) || []

        this.selectAll = this.selectedPermissions.length === this.availablePermissions.length
      } catch (error) {
        console.error('Failed to load permissions:', error)
        this.$toast.error(this.$t('errors.failed_to_load_permissions'))
      } finally {
        this.permissionsLoading = false
      }
    },

    async addGroup() {
      this.submitting = true
      try {
        await this.createAdminGroup(this.groupForm)
        this.closeGroupModal()
        this.$toast.success(this.$t('admin_groups.messages.create_success'))
        await this.getAdminGroups()
      } catch (error) {
        console.error('Error adding group:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_save_group'))
      } finally {
        this.submitting = false
      }
    },

    editGroup(group) {
      this.selectedGroup = group
      this.groupForm = {
        title_ar: group.title_ar,
        title_en: group.title_en,
        description: group.description || '',
        is_active: group.is_active,
      }
      this.showEditGroupModal = true
    },

    async updateGroup() {
      this.submitting = true
      try {
        await this.updateAdminGroup({
          id: this.selectedGroup.id,
          data: this.groupForm,
        })
        this.closeGroupModal()
        this.$toast.success(this.$t('admin_groups.messages.update_success'))
        await this.getAdminGroups()
      } catch (error) {
        console.error('Error updating group:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_update_group'))
      } finally {
        this.submitting = false
      }
    },

    async confirmDeleteGroup(group) {
      if (group.id === 1) {
        this.$toast.error(this.$t('admin_groups.messages.cannot_delete_default'))
        return
      }

      const confirmed = await this.$swal({
        title: this.$t('admin_groups.delete_confirm_title'),
        text: this.$t('admin_groups.delete_confirm', { name: group.title_ar || group.title_en }),
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
          this.$toast.success(this.$t('admin_groups.messages.delete_success'))
          await this.getAdminGroups()
        } catch (error) {
          console.error('Error deleting group:', error)
          this.$toast.error(error.message || this.$t('errors.failed_to_delete_group'))
        }
      }
    },

    async managePermissions(group) {
      this.selectedGroup = group
      this.showPermissionsModal = true
      await this.loadPermissionsForGroup(group.id)
    },

    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedPermissions = this.filteredPermissions.map((p) => p.id)
      } else {
        this.selectedPermissions = []
      }
    },

    async savePermissions() {
      if (!this.selectedGroup) return

      this.submitting = true
      try {
        await this.updateGroupPermissions({
          groupId: this.selectedGroup.id,
          permissionIds: this.selectedPermissions,
        })
        this.$toast.success(this.$t('admin_groups.messages.permissions_updated'))
        this.closePermissionsModal()
      } catch (error) {
        console.error('Error saving permissions:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_update_permissions'))
      } finally {
        this.submitting = false
      }
    },

    async createPermission() {
      this.permissionSubmitting = true
      try {
        await this.createPermission(this.permissionForm)
        this.closeAddPermissionModal()
        this.$toast.success(this.$t('permissions.messages.create_success'))

        // Reload permissions if permissions modal is open
        if (this.selectedGroup) {
          await this.loadPermissionsForGroup(this.selectedGroup.id)
        }
      } catch (error) {
        console.error('Error creating permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_create_permission'))
      } finally {
        this.permissionSubmitting = false
      }
    },

    openAddPermissionModal() {
      this.permissionForm = {
        title: '',
        description_ar: '',
        description_en: '',
      }
      this.showAddPermissionModal = true
    },

    closeGroupModal() {
      this.showAddGroupModal = false
      this.showEditGroupModal = false
      this.selectedGroup = null
      this.groupForm = {
        title_ar: '',
        title_en: '',
        description: '',
        is_active: true,
      }
    },

    closePermissionsModal() {
      this.showPermissionsModal = false
      this.selectedGroup = null
      this.permissionSearch = ''
      this.selectedPermissions = []
      this.selectAll = false
      this.availablePermissions = []
    },

    closeAddPermissionModal() {
      this.showAddPermissionModal = false
      this.permissionForm = {
        title: '',
        description_ar: '',
        description_en: '',
      }
    },

    getTotalUsers() {
      return this.adminGroups.reduce((total, group) => total + (group.users_count || 0), 0)
    },

    getTotalPermissions() {
      return this.adminGroups.reduce((total, group) => total + (group.permissions_count || 0), 0)
    },
  },

  watch: {
    selectedPermissions: {
      handler(newVal) {
        this.selectAll = newVal.length === this.filteredPermissions.length
      },
      deep: true,
    },
  },

  async mounted() {
    await this.loadInitialData()
  },
}
</script>

<style scoped>
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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
