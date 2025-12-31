<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('users.management')"
        :subtitle="$t('users.managementDescription')"
        :breadcrumbs="breadcrumbs"
        :actions="headerActions"
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <LoadingSpinner />
      </div>

      <!-- Users Table -->
      <BaseCard v-else>
        <template #actions>
          <div class="flex items-center space-x-2">
            <BaseInput
              v-model="searchQuery"
              :placeholder="$t('users.searchPlaceholder')"
              :prefix-icon="['fas', 'search']"
              @input="onSearch"
              size="sm"
              class="w-64"
            />

            <BaseButton
              v-if="hasPermission('create_user')"
              @click="showAddUserModal = true"
              type="primary"
              icon="plus"
            >
              {{ $t('users.add') }}
            </BaseButton>
          </div>
        </template>

        <!-- Empty State -->
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <font-awesome-icon :icon="['fas', 'users']" class="text-gray-300 text-4xl mb-3" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('users.noUsers') }}</h3>
          <p class="text-gray-500 mb-4">{{ $t('users.startAdding') }}</p>
          <BaseButton
            v-if="hasPermission('create_user')"
            @click="showAddUserModal = true"
            type="primary"
            icon="plus"
          >
            {{ $t('users.add') }}
          </BaseButton>
        </div>

        <!-- Users Table -->
        <BaseTable
          v-else
          :columns="tableColumns"
          :data="filteredUsers"
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
                <div class="text-xs text-gray-500">{{ formatDate(row.created_at) }}</div>
              </div>
            </div>
          </template>

          <template #cell-email="{ row }">
            <div class="text-sm text-gray-900">{{ row.email }}</div>
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
                @click="editUser(row)"
                type="ghost"
                size="sm"
                icon="edit"
                :title="$t('common.edit')"
              />

              <BaseButton
                @click="managePermissions(row)"
                type="ghost"
                size="sm"
                icon="shield-alt"
                :title="$t('permissions.manage')"
              />

              <BaseButton
                v-if="row.id !== currentUser.id && hasPermission('delete_user')"
                @click="confirmDelete(row)"
                type="ghost"
                size="sm"
                icon="trash"
                :title="$t('common.delete')"
                class="text-red-600 hover:text-red-700"
              />
            </div>
          </template>
        </BaseTable>

        <!-- Pagination -->
        <div v-if="pagination && pagination.total > pagination.per_page" class="mt-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              {{
                $t('pagination.showing', {
                  from: pagination.from,
                  to: pagination.to,
                  total: pagination.total,
                })
              }}
            </div>
            <div class="flex space-x-2">
              <BaseButton
                @click="previousPage"
                :disabled="pagination.current_page === 1"
                type="outline"
                size="sm"
                :icon="['fas', 'chevron-right']"
              />

              <span class="flex items-center px-3">
                {{
                  $t('pagination.pageOf', {
                    current: pagination.current_page,
                    total: pagination.last_page,
                  })
                }}
              </span>

              <BaseButton
                @click="nextPage"
                :disabled="pagination.current_page === pagination.last_page"
                type="outline"
                size="sm"
                :icon="['fas', 'chevron-left']"
              />
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Add/Edit User Modal -->
    <BaseModal
      v-model:show="showAddUserModal || showEditUserModal"
      :title="showEditUserModal ? $t('users.edit') : $t('users.add')"
      size="md"
      :close-on-overlay="false"
    >
      <form @submit.prevent="showEditUserModal ? updateUser() : addUser()" class="space-y-4">
        <BaseInput
          v-model="userForm.name"
          :label="$t('users.name')"
          :placeholder="$t('users.namePlaceholder')"
          required
          :error="errors.name"
        />

        <BaseInput
          v-model="userForm.email"
          type="email"
          :label="$t('auth.email')"
          :placeholder="$t('users.emailPlaceholder')"
          required
          :error="errors.email"
        />

        <BaseInput
          v-model="userForm.password"
          type="password"
          :label="showEditUserModal ? $t('users.newPassword') : $t('auth.password')"
          :required="!showEditUserModal"
          :placeholder="$t('auth.passwordPlaceholder')"
          :error="errors.password"
        />

        <BaseInput
          v-model="userForm.password_confirmation"
          type="password"
          :label="$t('auth.confirmPassword')"
          :required="!showEditUserModal"
          :placeholder="$t('auth.confirmPasswordPlaceholder')"
          :error="errors.password_confirmation"
        />

        <template #footer>
          <div class="flex justify-end space-x-3 space-x-reverse">
            <BaseButton type="outline" @click="closeModal" :disabled="submitting">
              {{ $t('common.cancel') }}
            </BaseButton>

            <BaseButton
              type="primary"
              :loading="submitting"
              :disabled="submitting"
              icon="save"
              html-type="submit"
            >
              {{ showEditUserModal ? $t('common.update') : $t('common.add') }}
            </BaseButton>
          </div>
        </template>
      </form>
    </BaseModal>

    <!-- Manage Permissions Modal -->
    <BaseModal
      v-model:show="showPermissionsModal"
      :title="$t('permissions.manageFor', { user: selectedUser?.name })"
      size="md"
      :close-on-overlay="false"
    >
      <div class="space-y-4">
        <div>
          <label class="form-label mb-3">{{ $t('roles.title') }}</label>
          <div class="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div class="space-y-2">
              <div v-for="role in roles" :key="role.id" class="flex items-center">
                <input
                  :id="`role-${role.id}`"
                  v-model="selectedRoles"
                  :value="role.id"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label :for="`role-${role.id}`" class="mr-3 text-sm text-gray-900">
                  <span class="font-medium">{{ role.name }}</span>
                  <span class="text-gray-500 text-xs block">{{ role.description }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3 space-x-reverse">
            <BaseButton type="outline" @click="closeModal" :disabled="submitting">
              {{ $t('common.cancel') }}
            </BaseButton>

            <BaseButton
              type="primary"
              :loading="submitting"
              :disabled="submitting"
              icon="save"
              @click="savePermissions"
            >
              {{ $t('common.save') }}
            </BaseButton>
          </div>
        </template>
      </div>
    </BaseModal>
  </div>
</template>

<script>
export default {
  name: 'UserManagement',
  data() {
    return {
      loading: false,
      submitting: false,
      searchQuery: '',
      searchTimeout: null,
      currentPage: 1,

      showAddUserModal: false,
      showEditUserModal: false,
      showPermissionsModal: false,

      selectedUser: null,
      selectedRoles: [],

      tableColumns: [
        { key: 'name', label: this.$t('users.name'), align: 'right' },
        { key: 'email', label: this.$t('auth.email'), align: 'right' },
        { key: 'roles', label: this.$t('roles.title'), align: 'right' },
        { key: 'status', label: this.$t('common.status'), align: 'center' },
      ],

      userForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },

      errors: {},
    }
  },

  computed: {
    breadcrumbs() {
      return [
        { text: this.$t('dashboard.title'), to: '/dashboard' },
        { text: this.$t('users.management') },
      ]
    },

    headerActions() {
      return [
        {
          text: this.$t('users.add'),
          type: 'primary',
          icon: 'plus',
          onClick: () => (this.showAddUserModal = true),
          disabled: !this.hasPermission('create_user'),
        },
      ]
    },

    currentUser() {
      return this.$store.state.auth.user || {}
    },

    users() {
      return this.$store.state.permissions?.users || []
    },

    filteredUsers() {
      if (!this.searchQuery.trim()) {
        return this.users
      }

      const query = this.searchQuery.toLowerCase()
      return this.users.filter(
        (user) =>
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)),
      )
    },

    roles() {
      return this.$store.state.permissions?.roles || []
    },

    pagination() {
      return (
        this.$store.state.permissions?.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
          from: 0,
          to: 0,
        }
      )
    },
  },

  mounted() {
    this.loadUsers()
    this.loadRoles()
  },

  methods: {
    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString(this.$i18n.locale)
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

    async loadUsers() {
      this.loading = true
      try {
        await this.$store.dispatch('permissions/fetchUsers', {
          page: this.currentPage,
          search: this.searchQuery,
        })
      } catch (error) {
        console.error('❌ ' + this.$t('errors.loadFailed'), error)
        this.$toast.error(this.$t('errors.loadUsersFailed'))
      } finally {
        this.loading = false
      }
    },

    async loadRoles() {
      try {
        await this.$store.dispatch('permissions/fetchRoles')
      } catch (error) {
        console.error('❌ ' + this.$t('errors.loadFailed'), error)
      }
    },

    onSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.loadUsers()
      }, 500)
    },

    async addUser() {
      this.errors = {}
      this.submitting = true

      try {
        // التحقق من البيانات
        if (!this.userForm.name.trim()) {
          this.errors.name = this.$t('validation.required', { field: this.$t('users.name') })
          return
        }

        if (!this.userForm.email.trim()) {
          this.errors.email = this.$t('validation.required', { field: this.$t('auth.email') })
          return
        }

        if (!this.isValidEmail(this.userForm.email)) {
          this.errors.email = this.$t('validation.email')
          return
        }

        if (!this.userForm.password) {
          this.errors.password = this.$t('validation.required', { field: this.$t('auth.password') })
          return
        }

        if (this.userForm.password.length < 6) {
          this.errors.password = this.$t('validation.minLength', {
            field: this.$t('auth.password'),
            min: 6,
          })
          return
        }

        if (this.userForm.password !== this.userForm.password_confirmation) {
          this.errors.password_confirmation = this.$t('validation.passwordMatch')
          return
        }

        await this.$store.dispatch('auth/register', this.userForm)
        this.$toast.success(this.$t('messages.createSuccess', { item: this.$t('users.user') }))
        this.closeModal()
        await this.loadUsers()
      } catch (error) {
        console.error('❌ ' + this.$t('errors.createFailed'), error)
        this.$toast.error(error.message || this.$t('errors.createError'))
      } finally {
        this.submitting = false
      }
    },

    editUser(user) {
      this.selectedUser = user
      this.userForm = {
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
      }
      this.errors = {}
      this.showEditUserModal = true
    },

    async updateUser() {
      this.errors = {}
      this.submitting = true

      try {
        if (!this.userForm.name.trim()) {
          this.errors.name = this.$t('validation.required', { field: this.$t('users.name') })
          return
        }

        if (!this.userForm.email.trim()) {
          this.errors.email = this.$t('validation.required', { field: this.$t('auth.email') })
          return
        }

        if (!this.isValidEmail(this.userForm.email)) {
          this.errors.email = this.$t('validation.email')
          return
        }

        if (this.userForm.password && this.userForm.password.length < 6) {
          this.errors.password = this.$t('validation.minLength', {
            field: this.$t('auth.password'),
            min: 6,
          })
          return
        }

        if (this.userForm.password !== this.userForm.password_confirmation) {
          this.errors.password_confirmation = this.$t('validation.passwordMatch')
          return
        }

        // إزالة الحقول الفارغة
        const userData = { ...this.userForm }
        if (!userData.password) {
          delete userData.password
          delete userData.password_confirmation
        }

        await this.$store.dispatch('users/updateUser', {
          id: this.selectedUser.id,
          data: userData,
        })

        this.$toast.success(this.$t('messages.updateSuccess', { item: this.$t('users.user') }))
        this.closeModal()
        await this.loadUsers()
      } catch (error) {
        console.error('❌ ' + this.$t('errors.updateFailed'), error)
        this.$toast.error(error.message || this.$t('errors.updateError'))
      } finally {
        this.submitting = false
      }
    },

    managePermissions(user) {
      this.selectedUser = user
      this.selectedRoles = user.roles?.map((r) => r.id) || []
      this.showPermissionsModal = true
    },

    async savePermissions() {
      this.submitting = true
      try {
        await this.$store.dispatch('permissions/assignRolesToUser', {
          userId: this.selectedUser.id,
          roles: this.selectedRoles,
        })

        this.$toast.success(
          this.$t('messages.updateSuccess', { item: this.$t('permissions.title') }),
        )
        this.closeModal()
        await this.loadUsers()
      } catch (error) {
        console.error('❌ ' + this.$t('errors.updateFailed'), error)
        this.$toast.error(error.message || this.$t('errors.updateError'))
      } finally {
        this.submitting = false
      }
    },

    confirmDelete(user) {
      this.$toast.confirm(
        this.$t('messages.confirmDelete', { item: `${this.$t('users.user')} "${user.name}"` }),
        async () => {
          await this.deleteUser(user.id)
        },
      )
    },

    async deleteUser(id) {
      try {
        await this.$store.dispatch('users/deleteUser', id)
        this.$toast.success(this.$t('messages.deleteSuccess', { item: this.$t('users.user') }))
        await this.loadUsers()
      } catch (error) {
        console.error('❌ ' + this.$t('errors.deleteFailed'), error)
        this.$toast.error(error.message || this.$t('errors.deleteError'))
      }
    },

    closeModal() {
      this.showAddUserModal = false
      this.showEditUserModal = false
      this.showPermissionsModal = false
      this.selectedUser = null
      this.selectedRoles = []
      this.userForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      }
      this.errors = {}
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.loadUsers()
      }
    },

    nextPage() {
      if (this.currentPage < this.pagination.last_page) {
        this.currentPage++
        this.loadUsers()
      }
    },
  },
}
</script>
