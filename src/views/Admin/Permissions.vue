<template>
  <div class="min-h-screen py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
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

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">{{ $t('permissions.total_permissions') }}</p>
            <p class="stats-value">{{ permissions.length }}</p>
          </div>
        </div>
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">{{ $t('permissions.parent_permissions') }}</p>
            <p class="stats-value">{{ parentPermissionsCount }}</p>
          </div>
        </div>
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">{{ $t('permissions.child_permissions') }}</p>
            <p class="stats-value">{{ childPermissionsCount }}</p>
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
                class="w-full px-4 py-3 pr-11 bg-white/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
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
              <!-- عرض عدد الصلاحيات -->
              <div
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm"
              >
                <span class="font-bold">{{ filteredPermissions.length }}</span>
                <span class="text-blue-100 mr-1">{{ $t('common.total') }}</span>
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
                    <th class="table-header text-right">{{ $t('permissions.permission_name') }}</th>
                    <th class="table-header text-right">{{ $t('permissions.description_ar') }}</th>
                    <th class="table-header text-right">{{ $t('permissions.description_en') }}</th>
                    <th class="table-header text-center">{{ $t('permissions.type') }}</th>
                    <th class="table-header text-center">{{ $t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200/30">
                  <tr
                    v-for="permission in filteredPermissions"
                    :key="'perm-' + permission.id"
                    class="hover:bg-blue-50/30 transition-colors"
                  >
                    <td class="table-cell">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 ml-4">
                          <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md mr-4"
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
                          <div class="text-base font-bold text-gray-900">
                            {{ permission.title }}
                          </div>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-gray-500">ID: {{ permission.id }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="table-cell">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900 font-medium">
                          {{ permission.description_ar || $t('common.notAvailable') }}
                        </span>
                      </div>
                    </td>

                    <td class="table-cell">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900 font-medium">
                          {{ permission.description_en || $t('common.notAvailable') }}
                        </span>
                      </div>
                    </td>

                    <td class="table-cell text-center">
                      <span
                        :class="[
                          'status-badge',
                          permission.is_parent
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800',
                        ]"
                      >
                        <span
                          :class="[
                            'status-dot',
                            permission.is_parent ? 'bg-green-500' : 'bg-blue-500',
                          ]"
                        ></span>
                        {{
                          permission.is_parent ? $t('permissions.parent') : $t('permissions.child')
                        }}
                      </span>
                    </td>

                    <td class="table-cell text-center">
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

    <!-- Permission Form Modal -->
    <PermissionForm
      :show="showModal"
      :permission="editingPermission"
      :menus="menus"
      :parent-permissions="parentPermissions"
      @close="closeModal"
      @saved="refreshPermissions"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PermissionForm from './PermissionForm.vue'

export default {
  name: 'AdminPermissions',
  components: { PermissionForm },
  data() {
    return {
      searchQuery: '',
      showModal: false,
      editingPermission: null,
    }
  },

  computed: {
    ...mapState('permissions', {
      permissions: (state) => {
        console.log('🟢 permissions from state:', state.permissions)
        return state.permissions || []
      },
      menus: (state) => {
        console.log('🟢 menus from state:', state.menus)
        return state.menus || []
      },
      parentPermissions: (state) => state.parentPermissions || [],
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
    console.log('🟢 AdminPermissions mounted')
    await this.loadPermissions()
    await this.fetchMenus()
    await this.fetchParentPermissions()
  },

  methods: {
    ...mapActions('permissions', [
      'fetchPermissions',
      'deletePermission',
      'fetchMenus',
      'fetchParentPermissions',
      'clearError',
    ]),

    async loadPermissions() {
      console.trace('🔍 loadPermissions called')
      try {
        console.log('🟢 Loading permissions...')
        await this.fetchPermissions()
        console.log('🟢 Permissions loaded successfully')
      } catch (error) {
        console.error('🔴 Failed to load permissions:', error)
        this.$toast?.error?.(this.$t('errors.failed_to_load_permissions'))
      }
    },

    async refreshPermissions() {
      await this.fetchPermissions({ force: true })
    },

    openCreateModal() {
      this.editingPermission = null
      this.showModal = true
    },

    openEditModal(permission) {
      this.editingPermission = permission
      this.showModal = true
    },

    async handleDelete(id) {
      try {
        await this.deletePermission(id)
        this.$swal?.fire({
          icon: 'success',
          title: this.$t('permissions.messages.delete_success'),
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error('Error deleting permission:', error)
        this.$swal?.fire({
          icon: 'error',
          title: this.$t('errors.failed_to_delete_permission'),
          text: error.message,
        })
      }
    },

    async confirmDelete(permission) {
      const result = await this.$swal?.fire({
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
      })

      if (result?.isConfirmed) {
        await this.handleDelete(permission.id)
      }
    },

    closeModal() {
      this.showModal = false
      this.editingPermission = null
    },
  },
}
</script>

<style scoped>
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
</style>
