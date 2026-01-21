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
                  class="w-6 h-6 text-purple-600"
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
                  {{ $t('assign_permissions.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('assign_permissions.subtitle') }}</p>
              </div>
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
          <p class="text-sm text-gray-500 mt-2">{{ $t('assign_permissions.loading_subtitle') }}</p>
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
          <button @click="loadData" class="p-1.5 text-red-700 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Groups List Card -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div
            class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
          >
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
              <h2 class="text-lg font-semibold text-gray-800">{{ $t('nav.groups') }}</h2>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-3">
              <div
                v-for="group in adminGroups"
                :key="group.id"
                @click="selectGroup(group)"
                :class="[
                  'p-4 border rounded-xl cursor-pointer transition-all duration-200 group',
                  selectedGroup?.id === group.id
                    ? 'border-blue-500 bg-blue-50 transform scale-[1.02] shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
                ]"
              >
                <div class="flex items-center">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center ml-3"
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
                  <div class="mr-3 flex-1">
                    <h3 class="font-bold text-gray-900">
                      {{ group.title_ar || group.title_en }}
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">{{ group.title_en }}</p>
                  </div>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full inline-flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      {{ group.permissions_count || 0 }} {{ $t('permissions.permission') }}
                    </span>
                    <span
                      class="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full inline-flex items-center gap-1"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {{ group.users_count || 0 }} {{ $t('common.user') }}
                    </span>
                  </div>
                  <div
                    v-if="selectedGroup?.id === group.id"
                    class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div
              class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50"
            >
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
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
                    <h2 class="text-lg font-semibold text-gray-800">
                      {{ $t('permissions.list') }}
                      <span v-if="selectedGroup" class="text-purple-600">
                        - {{ selectedGroup.title_ar || selectedGroup.title_en }}
                      </span>
                    </h2>
                  </div>
                  <p v-if="selectedGroup" class="text-gray-600 text-sm mt-1">
                    {{
                      $t('permissions.manage_for', {
                        group: selectedGroup.title_ar || selectedGroup.title_en,
                      })
                    }}
                  </p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="selectAllPermissions"
                    class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ $t('buttons.select_all') }}
                  </button>
                  <button
                    @click="deselectAllPermissions"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {{ $t('buttons.deselect_all') }}
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6">
              <!-- No Group Selected -->
              <div v-if="!selectedGroup" class="text-center py-12">
                <div
                  class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
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
                  {{ $t('assign_permissions.select_group_first') }}
                </h3>
                <p class="text-gray-600 mb-6 max-w-md mx-auto">
                  {{ $t('assign_permissions.select_group_message') }}
                </p>
              </div>

              <div v-else>
                <!-- Search -->
                <div class="relative mb-6">
                  <input
                    type="text"
                    v-model="searchQuery"
                    :placeholder="$t('common.search_permissions')"
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

                <!-- Permissions Loading -->
                <div v-if="permissionsLoading" class="text-center py-12">
                  <div
                    class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-4"
                  ></div>
                  <p class="text-gray-700 font-medium">{{ $t('common.loading') }}</p>
                </div>

                <!-- Permissions List -->
                <div v-else>
                  <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <div class="text-2xl font-bold text-blue-600 mb-1">
                        {{ selectedPermissionIds.length }}
                      </div>
                      <div class="text-sm text-blue-800">
                        {{ $t('assign_permissions.selected') }}
                      </div>
                    </div>
                    <div class="bg-gray-50 border border-gray-100 rounded-xl p-4">
                      <div class="text-2xl font-bold text-gray-600 mb-1">
                        {{ filteredPermissions.length }}
                      </div>
                      <div class="text-sm text-gray-800">
                        {{ $t('assign_permissions.filtered') }}
                      </div>
                    </div>
                    <div class="bg-purple-50 border border-purple-100 rounded-xl p-4">
                      <div class="text-2xl font-bold text-purple-600 mb-1">
                        {{ permissions.length }}
                      </div>
                      <div class="text-sm text-purple-800">
                        {{ $t('assign_permissions.total') }}
                      </div>
                    </div>
                  </div>

                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-1"
                  >
                    <div
                      v-for="permission in filteredPermissions"
                      :key="permission.id"
                      :class="[
                        'border rounded-xl p-4 transition-all duration-200 cursor-pointer',
                        selectedPermissionIds.includes(permission.id)
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
                      ]"
                    >
                      <div class="flex items-start">
                        <input
                          type="checkbox"
                          :id="`perm-${permission.id}`"
                          :value="permission.id"
                          v-model="selectedPermissionIds"
                          class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-3 mt-0.5"
                        />
                        <label :for="`perm-${permission.id}`" class="flex-1 cursor-pointer">
                          <div class="flex justify-between items-start">
                            <div class="mr-3 flex-1">
                              <h4 class="font-semibold text-gray-900 mb-1">
                                {{ permission.description_ar || permission.title }}
                              </h4>
                              <p class="text-sm text-gray-600 mb-2 line-clamp-2">
                                {{ permission.description_en || permission.title }}
                              </p>
                              <p class="text-xs text-gray-400 font-mono mb-3">
                                {{ permission.title }}
                              </p>
                              <span
                                :class="
                                  permission.is_parent
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                "
                                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                              >
                                {{
                                  permission.is_parent
                                    ? $t('permissions.parent')
                                    : $t('permissions.child')
                                }}
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- No Results -->
                  <div v-if="filteredPermissions.length === 0" class="text-center py-12">
                    <div
                      class="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
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
                      {{ $t('common.no_results') }}
                    </h3>
                    <p class="text-gray-600 mb-6 max-w-md mx-auto">
                      {{ $t('assign_permissions.no_results_message') }}
                    </p>
                    <button
                      @click="searchQuery = ''"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      {{ $t('assign_permissions.clear_search') }}
                    </button>
                  </div>
                </div>

                <!-- Stats and Actions -->
                <div class="mt-8 pt-6 border-t border-gray-200">
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="text-sm text-gray-600">
                      {{
                        $t('permissions.selected_count', {
                          selected: selectedPermissionIds.length,
                          total: permissions.length,
                        })
                      }}
                    </div>
                    <div class="flex gap-3">
                      <button
                        @click="resetSelection"
                        :disabled="saving"
                        class="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                      >
                        {{ $t('common.cancel') }}
                      </button>
                      <button
                        @click="savePermissions"
                        :disabled="saving"
                        class="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                        <svg
                          v-else
                          class="w-4 h-4"
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
                        <span class="font-medium">
                          {{ saving ? $t('common.saving') : $t('buttons.save') }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AssignPermissions',

  data() {
    return {
      searchQuery: '',
      saving: false,
      permissionsLoading: false,
      selectedGroup: null,
      selectedPermissionIds: [],
      permissions: [],
    }
  },

  computed: {
    ...mapState('adminGroups', {
      adminGroups: (state) => state.adminGroups || [],
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),

    ...mapState('permissions', {
      allPermissions: (state) => state.permissions || [],
    }),

    filteredPermissions() {
      if (!this.searchQuery.trim()) {
        return this.permissions
      }

      const search = this.searchQuery.toLowerCase()
      return this.permissions.filter(
        (permission) =>
          (permission.title && permission.title.toLowerCase().includes(search)) ||
          (permission.description_ar && permission.description_ar.toLowerCase().includes(search)) ||
          (permission.description_en && permission.description_en.toLowerCase().includes(search)),
      )
    },
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    ...mapActions('adminGroups', ['getAdminGroups', 'updateGroupPermissions']),

    ...mapActions('permissions', ['getPermissions']),

    async loadData() {
      try {
        await Promise.all([this.getAdminGroups(), this.getPermissions()])
        this.permissions = this.allPermissions
      } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error)
        this.$toast.error(this.$t('errors.load_failed'))
      }
    },

    async selectGroup(group) {
      this.selectedGroup = group
      this.selectedPermissionIds = []
      this.permissionsLoading = true

      try {
        // تحميل صلاحيات المجموعة المحددة
        if (group.permissions && Array.isArray(group.permissions)) {
          this.selectedPermissionIds = group.permissions.map((p) => p.id)
        } else {
          this.selectedPermissionIds = []
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل صلاحيات المجموعة:', error)
        this.$toast.error(this.$t('errors.load_failed'))
      } finally {
        this.permissionsLoading = false
      }
    },

    selectAllPermissions() {
      this.selectedPermissionIds = this.permissions.map((p) => p.id)
    },

    deselectAllPermissions() {
      this.selectedPermissionIds = []
    },

    resetSelection() {
      this.selectedGroup = null
      this.selectedPermissionIds = []
      this.searchQuery = ''
    },

    async savePermissions() {
      if (!this.selectedGroup) {
        this.$toast.warning(this.$t('assign_permissions.select_group_first'))
        return
      }

      this.saving = true
      try {
        await this.updateGroupPermissions({
          id: this.selectedGroup.id,
          permissions: this.selectedPermissionIds,
        })

        this.$toast.success(this.$t('assign_permissions.messages.update_success'))

        // تحديث بيانات المجموعات
        await this.getAdminGroups()

        // إعادة تحديد المجموعة الحالية
        const updatedGroup = this.adminGroups.find((g) => g.id === this.selectedGroup.id)
        if (updatedGroup) {
          this.selectedGroup = updatedGroup
        }
      } catch (error) {
        console.error('❌ خطأ في حفظ الصلاحيات:', error)
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          this.$t('assign_permissions.messages.update_error')
        this.$toast.error(errorMsg)
      } finally {
        this.saving = false
      }
    },
  },

  watch: {
    searchQuery() {
      // البحث الفوري
    },
  },
}
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* تحسينات الجداول */
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

button:hover:not(:disabled) {
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

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
