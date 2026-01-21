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
              @click="openCreateModal"
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
              <span class="font-medium">{{ $t('permissions.add_permission') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Search -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 class="text-lg font-semibold text-gray-800">{{ $t('common.search') }}</h2>
          </div>

          <div class="flex-1 max-w-lg">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('permissions.search_placeholder')"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                v-if="searchQuery"
                @click="searchQuery = ''"
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

      <!-- Permissions Table -->
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
                  {{ filteredPermissions.length }} {{ $t('common.total') }}
                </span>
              </div>

              <div class="text-sm text-gray-600">
                {{ $t('permissions.parent_permissions') }}:
                <span class="font-semibold text-gray-900">{{ parentPermissionsCount }}</span>
                • {{ $t('permissions.child_permissions') }}:
                <span class="font-semibold text-gray-900">{{ childPermissionsCount }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredPermissions.length === 0" class="text-center py-12 px-4">
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
              @click="openCreateModal"
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
                    {{ $t('permissions.permission_name') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('permissions.description_ar') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('permissions.description_en') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {{ $t('permissions.type') }}
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
                  v-for="permission in filteredPermissions"
                  :key="permission.id"
                  class="hover:bg-blue-50/30 transition-colors duration-150"
                >
                  <!-- Permission Name -->
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

                  <!-- Arabic Description -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ permission.description_ar || $t('common.notAvailable') }}
                    </div>
                  </td>

                  <!-- English Description -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ permission.description_en || $t('common.notAvailable') }}
                    </div>
                  </td>

                  <!-- Type -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex flex-col items-center">
                      <span
                        :class="
                          permission.is_parent
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        "
                        class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <span
                          :class="permission.is_parent ? 'bg-green-500' : 'bg-blue-500'"
                          class="w-2 h-2 rounded-full"
                        ></span>
                        {{
                          permission.is_parent ? $t('permissions.parent') : $t('permissions.child')
                        }}
                      </span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        @click="openEditModal(permission)"
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
      </div>
    </div>

    <!-- Create/Edit Permission Modal -->
    <div
      v-if="showModal"
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h3 class="text-lg font-semibold text-gray-800">
                {{
                  editingPermission
                    ? $t('permissions.edit_permission')
                    : $t('permissions.add_permission')
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
        <form
          @submit.prevent="editingPermission ? updatePermission() : createPermission()"
          class="p-6"
        >
          <div class="space-y-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.permission_name') }} *
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

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('permissions.type') }}
                </label>
                <div class="mt-2">
                  <label class="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="permissionForm.is_parent"
                      class="sr-only peer"
                    />
                    <div
                      class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    ></div>
                    <span class="mr-3 text-sm font-medium text-gray-700">
                      {{
                        permissionForm.is_parent
                          ? $t('permissions.parent')
                          : $t('permissions.child')
                      }}
                    </span>
                  </label>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ $t('permissions.parent_permission_hint') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="closeModal"
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
        this.$toast.success(this.$t('permissions.messages.create_success'))
        await this.getPermissions()
      } catch (error) {
        console.error('Error creating permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_create_permission'))
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
        this.$toast.success(this.$t('permissions.messages.update_success'))
        await this.getPermissions()
      } catch (error) {
        console.error('Error updating permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_update_permission'))
      } finally {
        this.submitting = false
      }
    },

    async deletePermission(id) {
      try {
        await this.deletePermission(id)
        this.$toast.success(this.$t('permissions.messages.delete_success'))
        await this.getPermissions()
      } catch (error) {
        console.error('Error deleting permission:', error)
        this.$toast.error(error.message || this.$t('errors.failed_to_delete_permission'))
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
