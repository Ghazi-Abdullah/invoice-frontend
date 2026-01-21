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
              <div
                class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200/50 border border-blue-100"
              >
                <svg
                  class="w-7 h-7 text-white"
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
                <p class="text-gray-600 text-sm mt-1 flex items-center gap-2">
                  <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                  {{ $t('permissions.subtitle') }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="openCreateModal"
              class="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group transform hover:-translate-y-0.5"
            >
              <svg
                class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
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
              <span class="font-semibold">{{ $t('permissions.add_permission') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Search Card -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg shadow-blue-100/30 p-6 mb-8"
      >
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border border-blue-200/50"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('common.search') }}</h2>
              <p class="text-sm text-gray-500">{{ $t('permissions.search_subtitle') }}</p>
            </div>
          </div>

          <div class="flex-1 max-w-lg">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('permissions.search_placeholder')"
                class="w-full px-4 py-3 pl-11 bg-white/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
              />
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="mb-8">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-12">
          <div class="text-center space-y-4">
            <div class="relative inline-block">
              <div class="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
              <div
                class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
              ></div>
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-800">{{ $t('common.loading') }}</p>
              <p class="text-sm text-gray-500 mt-2">{{ $t('permissions.loading_subtitle') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-8">
        <div
          class="bg-gradient-to-r from-red-50/80 to-red-100/50 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 shadow-lg"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="p-2 bg-red-100 rounded-lg">
                <svg
                  class="w-6 h-6 text-red-600"
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
            <div class="mr-4 flex-1">
              <h3 class="text-lg font-semibold text-red-800">{{ $t('errors.load_failed') }}</h3>
              <p class="text-red-700 mt-2">{{ error }}</p>
            </div>
            <button
              @click="clearError"
              class="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
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
      </div>

      <!-- Permissions Table -->
      <div v-else>
        <div
          class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-blue-100/20 overflow-hidden"
        >
          <!-- Table Header -->
          <div
            class="px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-white"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    {{ $t('permissions.permission_list') }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">{{ $t('permissions.list_subtitle') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-sm text-gray-600 hidden md:block">
                  <span class="font-semibold text-green-600">{{ parentPermissionsCount }}</span>
                  {{ $t('permissions.parent_permissions') }} •
                  <span class="font-semibold text-blue-600">{{ childPermissionsCount }}</span>
                  {{ $t('permissions.child_permissions') }}
                </div>
                <div
                  class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm"
                >
                  <span class="font-bold">{{ filteredPermissions.length }}</span>
                  <span class="text-blue-100 ml-1">{{ $t('common.total') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPermissions.length === 0" class="text-center py-16 px-4">
            <div class="max-w-md mx-auto">
              <div class="relative mb-6">
                <div
                  class="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mx-auto flex items-center justify-center shadow-lg"
                >
                  <svg
                    class="w-12 h-12 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">
                {{ $t('permissions.no_permissions') }}
              </h3>
              <p class="text-gray-600 mb-8">{{ $t('permissions.start_creating_message') }}</p>
              <button
                @click="openCreateModal"
                class="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>

          <!-- Table Content -->
          <div v-else class="overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200/50">
                <thead>
                  <tr class="bg-gradient-to-r from-gray-50 to-gray-100/30">
                    <th
                      class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('permissions.permission_name') }}
                    </th>
                    <th
                      class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('permissions.description_ar') }}
                    </th>
                    <th
                      class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('permissions.description_en') }}
                    </th>
                    <th
                      class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('permissions.type') }}
                    </th>
                    <th
                      class="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                    >
                      {{ $t('common.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200/30">
                  <tr
                    v-for="permission in filteredPermissions"
                    :key="permission.id"
                    class="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-white transition-all duration-200 group"
                  >
                    <!-- Permission Name -->
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 ml-4">
                          <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200"
                          >
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
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div class="mr-4">
                          <div class="text-base font-bold text-gray-900 group-hover:text-blue-700">
                            {{ permission.title }}
                          </div>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-gray-500">ID: {{ permission.id }}</span>
                            <span
                              v-if="permission.menu"
                              class="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium"
                            >
                              {{ permission.menu.title_ar || permission.menu.title_en }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Arabic Description -->
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900 font-medium">
                          {{ permission.description_ar || $t('common.notAvailable') }}
                        </span>
                        <span v-if="!permission.description_ar" class="text-xs text-gray-400 mt-1">
                          {{ $t('common.no_arabic_description') }}
                        </span>
                      </div>
                    </td>

                    <!-- English Description -->
                    <td class="px-6 py-4">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900 font-medium">
                          {{ permission.description_en || $t('common.notAvailable') }}
                        </span>
                        <span v-if="!permission.description_en" class="text-xs text-gray-400 mt-1">
                          {{ $t('common.no_english_description') }}
                        </span>
                      </div>
                    </td>

                    <!-- Type -->
                    <td class="px-6 py-4">
                      <div class="flex justify-center">
                        <span
                          :class="
                            permission.is_parent
                              ? 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-200/50'
                              : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-200/50'
                          "
                          class="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border"
                        >
                          <span
                            :class="permission.is_parent ? 'bg-green-500' : 'bg-blue-500'"
                            class="w-2 h-2 rounded-full ml-2"
                          ></span>
                          {{
                            permission.is_parent
                              ? $t('permissions.parent')
                              : $t('permissions.child')
                          }}
                        </span>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          @click="openEditModal(permission)"
                          class="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                          :title="$t('buttons.edit')"
                        >
                          <svg
                            class="w-5 h-5"
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
                        </button>
                        <button
                          @click="confirmDelete(permission)"
                          class="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 transform hover:scale-110"
                          :title="$t('buttons.delete')"
                        >
                          <svg
                            class="w-5 h-5"
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
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Permission Modal -->
    <transition name="modal-fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        @click.self="closeModal"
      >
        <div
          class="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/50"
        >
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-white">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900">
                    {{
                      editingPermission
                        ? $t('permissions.edit_permission')
                        : $t('permissions.add_permission')
                    }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    {{
                      editingPermission
                        ? $t('permissions.edit_subtitle')
                        : $t('permissions.create_subtitle')
                    }}
                  </p>
                </div>
              </div>
              <button
                @click="closeModal"
                class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <form
            @submit.prevent="editingPermission ? updatePermission() : createPermission()"
            class="p-8"
          >
            <div class="space-y-6">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    {{ $t('permissions.permission_name') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="permissionForm.title"
                    required
                    class="w-full px-4 py-3.5 bg-white/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                    :placeholder="$t('permissions.name_placeholder')"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    {{ $t('permissions.description_ar') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="permissionForm.description_ar"
                    required
                    class="w-full px-4 py-3.5 bg-white/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                    :placeholder="$t('permissions.description_ar_placeholder')"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    {{ $t('permissions.description_en') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    v-model="permissionForm.description_en"
                    required
                    class="w-full px-4 py-3.5 bg-white/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                    :placeholder="$t('permissions.description_en_placeholder')"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    {{ $t('permissions.type') }}
                  </label>
                  <div
                    class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/30 rounded-xl border border-gray-200/50"
                  >
                    <span class="text-gray-700 font-medium">
                      {{
                        permissionForm.is_parent
                          ? $t('permissions.parent')
                          : $t('permissions.child')
                      }}
                    </span>
                    <label class="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="permissionForm.is_parent"
                        class="sr-only peer"
                      />
                      <div
                        class="relative w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"
                      ></div>
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ $t('permissions.parent_permission_hint') }}
                  </p>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="mt-10 flex justify-end gap-3">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 rounded-xl hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200/50"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="submitting"
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg
                    v-if="submitting"
                    class="w-5 h-5 animate-spin"
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
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span class="font-semibold">
                    {{
                      submitting
                        ? $t('common.saving')
                        : editingPermission
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
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdminPermissions',

  data() {
    return {
      searchQuery: '',
      showModal: false,
      submitting: false,
      editingPermission: null,
      permissionForm: {
        title: '',
        description_ar: '',
        description_en: '',
        is_parent: false,
      },
    }
  },

  computed: {
    ...mapState('permissions', {
      permissions: (state) => state.permissions || [],
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),

    filteredPermissions() {
      if (!this.searchQuery) {
        return this.permissions
      }

      const search = this.searchQuery.toLowerCase()
      return this.permissions.filter((permission) => {
        return (
          (permission.title && permission.title.toLowerCase().includes(search)) ||
          (permission.description_ar && permission.description_ar.toLowerCase().includes(search)) ||
          (permission.description_en && permission.description_en.toLowerCase().includes(search))
        )
      })
    },

    parentPermissionsCount() {
      return this.permissions.filter((p) => p.is_parent).length
    },

    childPermissionsCount() {
      return this.permissions.filter((p) => !p.is_parent).length
    },
  },

  async mounted() {
    await this.loadPermissions()
  },

  methods: {
    ...mapActions('permissions', [
      'getPermissions',
      'createPermission',
      'updatePermission',
      'deletePermission',
      'clearError',
    ]),

    async loadPermissions() {
      try {
        await this.getPermissions()
      } catch (error) {
        console.error('Failed to load permissions:', error)
        this.$toast.error(this.$t('errors.failed_to_load_permissions'))
      }
    },

    openCreateModal() {
      this.editingPermission = null
      this.permissionForm = {
        title: '',
        description_ar: '',
        description_en: '',
        is_parent: false,
      }
      this.showModal = true
    },

    openEditModal(permission) {
      this.editingPermission = permission
      this.permissionForm = {
        title: permission.title,
        description_ar: permission.description_ar,
        description_en: permission.description_en,
        is_parent: permission.is_parent || false,
      }
      this.showModal = true
    },

    async createPermission() {
      this.submitting = true
      try {
        await this.createPermission(this.permissionForm)
        this.closeModal()
        this.$toast.success(this.$t('permissions.messages.create_success'), {
          icon: '✅',
          position: 'top-right',
        })
        await this.getPermissions()
      } catch (error) {
        console.error('Error creating permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_create_permission'), {
          icon: '❌',
          position: 'top-right',
        })
      } finally {
        this.submitting = false
      }
    },

    async updatePermission() {
      this.submitting = true
      try {
        await this.updatePermission({
          id: this.editingPermission.id,
          data: this.permissionForm,
        })
        this.closeModal()
        this.$toast.success(this.$t('permissions.messages.update_success'), {
          icon: '✅',
          position: 'top-right',
        })
        await this.getPermissions()
      } catch (error) {
        console.error('Error updating permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_update_permission'), {
          icon: '❌',
          position: 'top-right',
        })
      } finally {
        this.submitting = false
      }
    },

    async deletePermission(id) {
      try {
        await this.deletePermission(id)
        this.$toast.success(this.$t('permissions.messages.delete_success'), {
          icon: '✅',
          position: 'top-right',
        })
        await this.getPermissions()
      } catch (error) {
        console.error('Error deleting permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_delete_permission'), {
          icon: '❌',
          position: 'top-right',
        })
      }
    },

    async confirmDelete(permission) {
      const confirmed = await this.$swal({
        title: this.$t('permissions.delete_confirm_title'),
        text: this.$t('permissions.delete_confirm', {
          name: permission.description_ar || permission.title,
        }),
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
        await this.deletePermission(permission.id)
      }
    },

    closeModal() {
      this.showModal = false
      this.editingPermission = null
      this.permissionForm = {
        title: '',
        description_ar: '',
        description_en: '',
        is_parent: false,
      }
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

th:first-child {
  border-top-right-radius: 12px;
}

th:last-child {
  border-top-left-radius: 12px;
}

tr:last-child td:first-child {
  border-bottom-right-radius: 12px;
}

tr:last-child td:last-child {
  border-bottom-left-radius: 12px;
}

/* تأثيرات hover محسنة */
tr {
  transition: all 0.2s ease-in-out;
}

tr:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(255, 255, 255, 0.8) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

/* تحسينات الأزرار */
button {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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

/* تأثيرات المودال */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* تدرجات لونية محسنة */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* ظلال ناعمة */
.shadow-lg {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.shadow-xl {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* تأثيرات النص */
.text-shadow {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* تحسينات الشعار الدائري */
.avatar-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

/* تحسينات الأيقونات */
.icon-hover {
  transition: all 0.2s ease-in-out;
}

.icon-hover:hover {
  transform: scale(1.1);
}

/* تأثيرات الإدخال */
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* تحسينات العناوين */
h1,
h2,
h3 {
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* تحسينات التباين */
.text-gray-900 {
  color: #1f2937;
}

.text-gray-800 {
  color: #374151;
}

.text-gray-700 {
  color: #4b5563;
}

.text-gray-600 {
  color: #6b7280;
}

/* تحسينات الاستجابة */
@media (max-width: 640px) {
  .table-responsive {
    margin: 0 -1rem;
    width: calc(100% + 2rem);
  }

  .mobile-stack {
    flex-direction: column;
    gap: 1rem;
  }
}

/* تحسينات شريط التمرير */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* تأثيرات focus محسنة */
.focus-ring {
  transition: box-shadow 0.2s ease-in-out;
}

.focus-ring:focus {
  box-shadow:
    0 0 0 3px rgba(59, 130, 246, 0.1),
    0 0 0 1px rgba(59, 130, 246, 0.2);
  outline: none;
}
</style>
