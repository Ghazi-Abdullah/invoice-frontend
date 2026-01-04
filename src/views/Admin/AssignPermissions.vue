<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('nav.assign_permissions')"
        :subtitle="$t('permissions.assignRoles')"
        :breadcrumbs="breadcrumbs"
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="text-gray-600 text-lg mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <BaseAlert
        v-else-if="error"
        type="error"
        :title="$t('common.error')"
        :message="error"
        :actions="errorActions"
        class="mb-6"
      />

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Groups List Card -->
        <BaseCard class="groups-card">
          <template #header>
            <h2 class="text-xl font-bold text-gray-900">{{ $t('nav.groups') }}</h2>
          </template>

          <div class="space-y-3">
            <div
              v-for="group in adminGroups"
              :key="group.id"
              @click="selectGroup(group)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition-all duration-200',
                selectedGroup?.id === group.id
                  ? 'border-primary-500 bg-primary-50 transform scale-[1.02]'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50',
              ]"
            >
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center ml-3"
                >
                  <font-awesome-icon :icon="['fas', 'users']" class="text-primary-600" />
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">
                    {{ group.title_ar || group.title_en }}
                  </h3>
                  <p class="text-sm text-gray-500">{{ group.title_en }}</p>
                </div>
              </div>
              <div class="mt-3 flex justify-between items-center text-sm">
                <BaseBadge
                  :label="`${group.permissions_count || 0} ${$t('permissions.permission')}`"
                />
                <BaseBadge
                  :label="`${group.users_count || 0} ${$t('common.user')}`"
                  type="success"
                />
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Permissions Card -->
        <div class="lg:col-span-2">
          <BaseCard>
            <template #header>
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 class="text-xl font-bold text-gray-900">
                    {{ $t('permissions.list') }}
                    <span v-if="selectedGroup" class="text-primary-600">
                      - {{ selectedGroup.title_ar || selectedGroup.title_en }}
                    </span>
                  </h2>
                  <p v-if="selectedGroup" class="text-gray-600 text-sm mt-1">
                    {{
                      $t('permissions.manageFor', {
                        user: selectedGroup.title_ar || selectedGroup.title_en,
                      })
                    }}
                  </p>
                </div>
                <div class="mt-3 md:mt-0 flex space-x-2 space-x-reverse">
                  <BaseButton
                    @click="selectAllPermissions"
                    type="outline"
                    size="sm"
                    icon="check-square"
                  >
                    {{ $t('buttons.selectAll') }}
                  </BaseButton>
                  <BaseButton
                    @click="deselectAllPermissions"
                    type="outline"
                    size="sm"
                    icon="square"
                  >
                    {{ $t('buttons.deselectAll') }}
                  </BaseButton>
                </div>
              </div>
            </template>

            <div v-if="!selectedGroup" class="text-center py-12">
              <div class="empty-state">
                <font-awesome-icon
                  :icon="['fas', 'hand-pointer']"
                  class="text-gray-300 text-4xl mb-3"
                />
                <p class="text-gray-500">{{ $t('permissions.selectGroupFirst') }}</p>
              </div>
            </div>

            <div v-else>
              <!-- Search -->
              <BaseInput
                v-model="searchQuery"
                :placeholder="$t('common.search') + '...'"
                :prefix-icon="['fas', 'search']"
                class="mb-6"
                @input="onSearch"
              />

              <!-- Permissions Loading -->
              <div v-if="permissionsLoading" class="flex justify-center py-8">
                <LoadingSpinner size="md" :text="$t('common.loading')" />
              </div>

              <!-- Permissions List -->
              <div v-else class="space-y-3">
                <div
                  v-for="permission in filteredPermissions"
                  :key="permission.id"
                  class="permission-item"
                >
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      :id="`perm-${permission.id}`"
                      :value="permission.id"
                      v-model="selectedPermissionIds"
                      class="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ml-3"
                    />
                    <label :for="`perm-${permission.id}`" class="flex-1 cursor-pointer">
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="font-medium text-gray-900">
                            {{ permission.description_ar || permission.title }}
                          </h4>
                          <p class="text-sm text-gray-500 mt-1">
                            {{ permission.description_en || permission.title }}
                          </p>
                          <p class="text-xs text-gray-400 mt-1 font-mono">
                            {{ permission.title }}
                          </p>
                        </div>
                        <BaseBadge
                          :label="
                            permission.is_parent
                              ? $t('permissions.parent')
                              : $t('permissions.child')
                          "
                          :type="permission.is_parent ? 'primary' : 'info'"
                          size="sm"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <!-- No Results -->
                <div v-if="filteredPermissions.length === 0" class="text-center py-12">
                  <font-awesome-icon
                    :icon="['fas', 'search']"
                    class="text-gray-300 text-4xl mb-3"
                  />
                  <p class="text-gray-500">{{ $t('common.noResults') }}</p>
                </div>
              </div>

              <!-- Stats and Actions -->
              <div v-if="selectedGroup" class="mt-8 pt-6 border-t border-gray-200">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div class="text-sm text-gray-600">
                    {{
                      $t('permissions.selectedCount', {
                        selected: selectedPermissionIds.length,
                        total: permissions.length,
                      })
                    }}
                  </div>
                  <div class="flex space-x-3 space-x-reverse">
                    <BaseButton @click="resetSelection" type="outline" :disabled="saving">
                      {{ $t('common.cancel') }}
                    </BaseButton>
                    <BaseButton
                      @click="savePermissions"
                      type="primary"
                      :loading="saving"
                      :disabled="saving"
                      icon="save"
                    >
                      {{ $t('buttons.save') }}
                    </BaseButton>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
    adminGroups() {
      return this.$store.state.adminGroups.adminGroups || []
    },
    loading() {
      return this.$store.state.adminGroups.isLoading
    },
    error() {
      return this.$store.state.adminGroups.error
    },
    allPermissions() {
      return this.$store.state.permissions.permissionsList || []
    },
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
    breadcrumbs() {
      return [
        { text: this.$t('nav.permissions'), to: '/permissions' },
        { text: this.$t('nav.assign_permissions') },
      ]
    },
    errorActions() {
      return [
        {
          text: this.$t('common.retry'),
          onClick: this.loadData,
          type: 'danger',
        },
      ]
    },
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      try {
        await Promise.all([
          this.$store.dispatch('adminGroups/getAdminGroups'),
          this.$store.dispatch('permissions/getAllPermissions'),
        ])
        this.permissions = this.allPermissions
      } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error)
        this.$toast.error(this.$t('errors.loadFailed'))
      }
    },
    async selectGroup(group) {
      this.selectedGroup = group
      this.selectedPermissionIds = []
      this.permissionsLoading = true

      try {
        if (group.permissions && Array.isArray(group.permissions)) {
          this.selectedPermissionIds = group.permissions.map((p) => p.id)
        } else {
          this.selectedPermissionIds = []
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل صلاحيات المجموعة:', error)
        this.$toast.error(this.$t('errors.loadFailed'))
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
    onSearch() {
      // البحث الفوري
    },
    async savePermissions() {
      if (!this.selectedGroup) {
        this.$toast.warning(this.$t('permissions.selectGroupFirst'))
        return
      }

      this.saving = true
      try {
        await this.$store.dispatch('adminGroups/updateGroupPermissions', {
          id: this.selectedGroup.id,
          permissions: this.selectedPermissionIds,
        })

        this.$toast.success(this.$t('adminGroups.messages.permissionsUpdateSuccess'))

        // تحديث بيانات المجموعات
        await this.$store.dispatch('adminGroups/getAdminGroups')

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
          this.$t('adminGroups.messages.permissionsUpdateError')
        this.$toast.error(errorMsg)
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.groups-card {
  @apply border-primary-100;
}

.permission-item {
  @apply p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150;
}

.empty-state {
  @apply py-12 text-center;
}

.permission-item:hover {
  @apply border-primary-300 shadow-sm;
}
</style>
