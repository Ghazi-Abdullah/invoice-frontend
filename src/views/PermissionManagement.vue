<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('permissions.title')"
        :subtitle="$t('permissions.subtitle')"
        :breadcrumbs="breadcrumbs"
        :actions="headerActions"
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Tabs -->
      <BaseCard class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 space-x-reverse">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </BaseCard>

      <!-- Roles Tab -->
      <div v-if="activeTab === 'roles'">
        <!-- Add Role Card -->
        <BaseCard :title="$t('roles.add')" class="mb-6">
          <form @submit.prevent="createNewRole" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BaseInput
                v-model="newRole.name"
                :label="$t('roles.name')"
                :placeholder="$t('roles.namePlaceholder')"
                required
                :error="errors.name"
              />

              <BaseInput
                v-model="newRole.description"
                :label="$t('roles.description')"
                :placeholder="$t('roles.descriptionPlaceholder')"
                :error="errors.description"
              />
            </div>

            <div class="flex justify-end">
              <BaseButton
                type="primary"
                :loading="creatingRole"
                :disabled="creatingRole"
                icon="plus"
                html-type="submit"
              >
                {{ $t('roles.addRole') }}
              </BaseButton>
            </div>
          </form>
        </BaseCard>

        <!-- Roles List -->
        <BaseCard :title="$t('roles.list')">
          <div v-if="roles.length === 0" class="text-center py-12">
            <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-gray-300 text-4xl mb-3" />
            <p class="text-gray-500">{{ $t('roles.noRoles') }}</p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="role in roles"
              :key="role.id"
              class="py-6 px-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-4"
                    >
                      <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-blue-600" />
                    </div>
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ role.name }}</h3>
                      <p class="text-sm text-gray-600">{{ role.description }}</p>
                    </div>
                  </div>

                  <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">
                      {{ $t('permissions.title') }}:
                    </h4>
                    <div class="flex flex-wrap gap-2">
                      <BaseBadge
                        v-for="permission in role.permissions"
                        :key="permission.id"
                        type="success"
                        size="sm"
                        :show-dot="true"
                      >
                        {{ permission.description }}
                      </BaseBadge>
                    </div>
                  </div>
                </div>

                <div class="flex items-center space-x-2 space-x-reverse">
                  <BaseButton
                    @click="editRole(role)"
                    type="ghost"
                    size="sm"
                    icon="edit"
                    :title="$t('common.edit')"
                  />

                  <BaseButton
                    v-if="role.name !== 'admin'"
                    @click="confirmDeleteRole(role)"
                    type="ghost"
                    size="sm"
                    icon="trash"
                    :title="$t('common.delete')"
                    class="text-red-600 hover:text-red-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Permissions Tab -->
      <div v-if="activeTab === 'permissions'">
        <BaseCard :title="$t('permissions.list')">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="permission in permissions"
              :key="permission.id"
              class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div class="flex items-start">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center ml-3">
                  <font-awesome-icon :icon="['fas', 'check-circle']" class="text-green-600" />
                </div>
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900 mb-1">{{ permission.name }}</h3>
                  <p class="text-xs text-gray-600">{{ permission.description }}</p>
                  <div class="mt-2">
                    <BaseBadge type="info" size="xs">
                      {{ permission.module || $t('common.general') }}
                    </BaseBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'">
        <BaseCard :title="$t('users.title')">
          <div v-if="users.length === 0" class="text-center py-12">
            <font-awesome-icon :icon="['fas', 'users']" class="text-gray-300 text-4xl mb-3" />
            <p class="text-gray-500">{{ $t('users.noUsers') }}</p>
          </div>

          <BaseTable
            v-else
            :columns="userColumns"
            :data="users"
            :show-actions="true"
            bordered
            striped
            hoverable
          >
            <template #cell-name="{ row }">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
                  <span class="text-blue-600 text-xs font-semibold">
                    {{ getInitials(row.name) }}
                  </span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ row.name }}</div>
                  <div class="text-xs text-gray-500">{{ row.email }}</div>
                </div>
              </div>
            </template>

            <template #cell-roles="{ row }">
              <div class="flex flex-wrap gap-2">
                <BaseBadge
                  v-for="role in row.roles || []"
                  :key="role.id"
                  :type="getRoleBadgeType(role.name)"
                  size="sm"
                >
                  {{ role.name }}
                </BaseBadge>
              </div>
            </template>

            <template #cell-status="{ row }">
              <StatusBadge :status="row.status === 'active' ? 'paid' : 'overdue'" />
            </template>

            <template #actions="{ row }">
              <div class="flex items-center space-x-2 space-x-reverse">
                <BaseButton
                  @click="assignRolesToUser(row)"
                  type="ghost"
                  size="sm"
                  icon="shield-alt"
                  :title="$t('permissions.assignRoles')"
                />
              </div>
            </template>
          </BaseTable>
        </BaseCard>
      </div>

      <!-- Edit Role Modal -->
      <BaseModal
        v-model:show="showEditModal"
        :title="$t('roles.edit')"
        size="lg"
        :close-on-overlay="false"
      >
        <form @submit.prevent="updateCurrentRole" class="space-y-6">
          <BaseInput
            v-model="editingRole.name"
            :label="$t('roles.name')"
            :placeholder="$t('roles.namePlaceholder')"
            required
            :error="editErrors.name"
          />

          <BaseInput
            v-model="editingRole.description"
            :label="$t('roles.description')"
            :placeholder="$t('roles.descriptionPlaceholder')"
            :error="editErrors.description"
          />

          <div>
            <label class="form-label mb-3">{{ $t('permissions.title') }}</label>
            <div class="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div class="space-y-3">
                <div
                  v-for="permission in permissions"
                  :key="permission.id"
                  class="flex items-center"
                >
                  <input
                    :id="`permission-${permission.id}`"
                    v-model="editingRole.permissionIds"
                    :value="permission.id"
                    type="checkbox"
                    class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label :for="`permission-${permission.id}`" class="mr-3 text-sm text-gray-700">
                    <span class="font-medium">{{ permission.name }}</span>
                    <span class="text-gray-500 text-xs block">{{ permission.description }}</span>
                  </label>
                </div>
              </div>
            </div>
            <div v-if="editErrors.permissionIds" class="mt-1 text-sm text-red-600">
              {{ editErrors.permissionIds }}
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end space-x-3 space-x-reverse">
              <BaseButton type="outline" @click="showEditModal = false" :disabled="updatingRole">
                {{ $t('common.cancel') }}
              </BaseButton>

              <BaseButton
                type="primary"
                :loading="updatingRole"
                :disabled="updatingRole"
                icon="save"
                html-type="submit"
              >
                {{ $t('common.save') }}
              </BaseButton>
            </div>
          </template>
        </form>
      </BaseModal>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PermissionManagement',
  data() {
    return {
      loading: false,
      activeTab: 'roles',
      showEditModal: false,
      creatingRole: false,
      updatingRole: false,

      tabs: [
        { id: 'roles', name: this.$t('roles.title') },
        { id: 'permissions', name: this.$t('permissions.title') },
        { id: 'users', name: this.$t('users.title') },
      ],

      userColumns: [
        { key: 'name', label: this.$t('users.name'), align: 'right' },
        { key: 'email', label: this.$t('auth.email'), align: 'right' },
        { key: 'roles', label: this.$t('roles.title'), align: 'right' },
        { key: 'status', label: this.$t('common.status'), align: 'center' },
      ],

      editingRole: {
        id: null,
        name: '',
        description: '',
        permissionIds: [],
      },

      newRole: {
        name: '',
        description: '',
      },

      errors: {},
      editErrors: {},
    }
  },

  computed: {
    breadcrumbs() {
      return [
        { text: this.$t('dashboard.title'), to: '/dashboard' },
        { text: this.$t('permissions.title') },
      ]
    },

    headerActions() {
      return [
        {
          text: this.$t('roles.add'),
          type: 'primary',
          icon: 'plus',
          onClick: () => {
            this.activeTab = 'roles'
          },
          disabled: !this.hasPermission('create_role'),
        },
      ]
    },

    roles() {
      return this.$store.state.permissions?.roles || []
    },

    permissions() {
      return this.$store.state.permissions?.permissions || []
    },

    users() {
      return this.$store.state.permissions?.users || []
    },
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },

    async loadData() {
      this.loading = true
      try {
        await Promise.all([
          this.$store.dispatch('permissions/fetchRoles'),
          this.$store.dispatch('permissions/fetchPermissions'),
          this.$store.dispatch('permissions/fetchUsers'),
        ])
      } catch (error) {
        console.error('❌ ' + this.$t('errors.loadData'), error)
        this.$toast.error(this.$t('errors.loadFailed'))
      } finally {
        this.loading = false
      }
    },

    getInitials(name) {
      if (!name) return '?'
      return name.substring(0, 2).toUpperCase()
    },

    getRoleBadgeType(roleName) {
      const types = {
        admin: 'danger',
        user: 'primary',
        accountant: 'warning',
        manager: 'success',
        editor: 'info',
      }
      return types[roleName] || 'default'
    },

    async createNewRole() {
      this.errors = {}
      this.creatingRole = true

      try {
        if (!this.newRole.name.trim()) {
          this.errors.name = this.$t('validation.required', { field: this.$t('roles.name') })
          return
        }

        await this.$store.dispatch('permissions/createRole', this.newRole)
        this.$toast.success(this.$t('messages.createSuccess', { item: this.$t('roles.role') }))
        this.newRole = { name: '', description: '' }
        await this.loadData()
      } catch (error) {
        console.error('❌ ' + this.$t('errors.createFailed'), error)
        this.$toast.error(error.message || this.$t('errors.createError'))
      } finally {
        this.creatingRole = false
      }
    },

    editRole(role) {
      this.editingRole = {
        id: role.id,
        name: role.name,
        description: role.description,
        permissionIds: role.permissions.map((p) => p.id),
      }
      this.editErrors = {}
      this.showEditModal = true
    },

    async updateCurrentRole() {
      this.editErrors = {}
      this.updatingRole = true

      try {
        if (!this.editingRole.name.trim()) {
          this.editErrors.name = this.$t('validation.required', { field: this.$t('roles.name') })
          return
        }

        if (this.editingRole.permissionIds.length === 0) {
          this.editErrors.permissionIds = this.$t('validation.required', {
            field: this.$t('permissions.title'),
          })
          return
        }

        await this.$store.dispatch('permissions/updateRole', {
          id: this.editingRole.id,
          roleData: {
            name: this.editingRole.name,
            description: this.editingRole.description,
          },
        })

        await this.$store.dispatch('permissions/assignPermissionsToRole', {
          roleId: this.editingRole.id,
          permissions: this.editingRole.permissionIds,
        })

        this.$toast.success(this.$t('messages.updateSuccess', { item: this.$t('roles.role') }))
        this.showEditModal = false
        await this.loadData()
      } catch (error) {
        console.error('❌ ' + this.$t('errors.updateFailed'), error)
        this.$toast.error(error.message || this.$t('errors.updateError'))
      } finally {
        this.updatingRole = false
      }
    },

    confirmDeleteRole(role) {
      this.$toast.confirm(
        this.$t('messages.confirmDelete', { item: `${this.$t('roles.role')} "${role.name}"` }),
        async () => {
          await this.deleteRole(role.id)
        },
      )
    },

    async deleteRole(roleId) {
      try {
        await this.$store.dispatch('permissions/deleteRole', roleId)
        this.$toast.success(this.$t('messages.deleteSuccess', { item: this.$t('roles.role') }))
        await this.loadData()
      } catch (error) {
        console.error('❌ ' + this.$t('errors.deleteFailed'), error)
        this.$toast.error(error.message || this.$t('errors.deleteError'))
      }
    },

    assignRolesToUser(user) {
      this.$toast.info(this.$t('permissions.assignRolesToUser', { user: user.name }))
      // يمكن إضافة منطق لإدارة أدوار المستخدم
    },
  },
}
</script>

<style scoped>
/* يمكن إضافة أي ستايلات مخصصة هنا */
</style>
