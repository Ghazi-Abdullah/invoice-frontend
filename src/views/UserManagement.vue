<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- العنوان والإجراءات -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('users.management') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('users.managementDescription') }}</p>
          </div>
          <button
            v-if="hasPermission('create_user')"
            @click="showAddUserModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center transition-colors duration-200"
          >
            <i class="fas fa-plus ml-2"></i>
            {{ $t('users.add') }}
          </button>
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
      </div>

      <!-- جدول المستخدمين -->
      <div v-else>
        <!-- شريط البحث والإجراءات -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div class="relative flex-1 max-w-md">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="$t('users.searchPlaceholder')"
                @input="onSearch"
                class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
            </div>
          </div>
        </div>

        <!-- حالة عدم وجود مستخدمين -->
        <div v-if="users.length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
          <i class="fas fa-users text-gray-300 text-4xl mb-3"></i>
          <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('users.noUsers') }}</h3>
          <p class="text-gray-500 mb-4">{{ $t('users.startAdding') }}</p>
          <button
            v-if="hasPermission('create_user')"
            @click="showAddUserModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center transition-colors duration-200"
          >
            <i class="fas fa-plus ml-2"></i>
            {{ $t('users.add') }}
          </button>
        </div>

        <!-- جدول المستخدمين -->
        <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('users.title') }}</h3>
            <div class="text-sm text-gray-500 mt-1">
              {{
                $t('pagination.showing', {
                  from: pagination.from || 1,
                  to: pagination.to || users.length,
                  total: pagination.total || users.length,
                })
              }}
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('users.name') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('auth.email') }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('roles.title') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('common.status') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {{ $t('common.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in users"
                  :key="user.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3"
                      >
                        <span class="text-blue-600 text-xs font-semibold">
                          {{ getInitials(user.name) }}
                        </span>
                      </div>
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                        <div class="text-xs text-gray-500">{{ formatDate(user.created_at) }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="role in user.roles || []"
                        :key="role.id"
                        :class="getRoleBadgeClass(role.name)"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        {{ role.name }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      :class="
                        getStatusClass(user.status || (user.is_active ? 'active' : 'inactive'))
                      "
                      class="px-3 py-1 text-xs font-medium rounded-full inline-block min-w-[80px]"
                    >
                      {{ getStatusText(user.status || (user.is_active ? 'active' : 'inactive')) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <div class="flex items-center justify-center space-x-2 space-x-reverse">
                      <button
                        @click="editUser(user)"
                        class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.edit')"
                      >
                        <i class="fas fa-edit"></i>
                      </button>

                      <button
                        @click="managePermissions(user)"
                        class="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                        :title="$t('permissions.manage')"
                      >
                        <i class="fas fa-shield-alt"></i>
                      </button>

                      <button
                        v-if="user.id !== currentUserId && hasPermission('delete_user')"
                        @click="confirmDelete(user)"
                        class="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.delete')"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- الترقيم -->
          <div
            v-if="pagination.total > pagination.per_page"
            class="px-6 py-4 border-t border-gray-200"
          >
            <div
              class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0"
            >
              <div class="text-sm text-gray-700">
                {{
                  $t('pagination.showing', {
                    from: pagination.from || 1,
                    to: pagination.to || users.length,
                    total: pagination.total || users.length,
                  })
                }}
              </div>
              <div class="flex items-center space-x-2 space-x-reverse">
                <button
                  @click="previousPage"
                  :disabled="pagination.current_page === 1"
                  class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="fas fa-chevron-right ml-1"></i>
                  {{ $t('pagination.previous') }}
                </button>

                <div class="flex items-center space-x-2">
                  <template v-if="pagination.last_page <= 7">
                    <button
                      v-for="page in pagination.last_page"
                      :key="page"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-1 rounded text-sm transition-colors duration-200',
                        page === pagination.current_page
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50',
                      ]"
                    >
                      {{ page }}
                    </button>
                  </template>
                  <template v-else>
                    <button
                      v-for="page in getPaginationRange()"
                      :key="page"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-1 rounded text-sm transition-colors duration-200',
                        page === pagination.current_page
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50',
                        page === '...' ? 'cursor-default hover:bg-transparent' : '',
                      ]"
                      :disabled="page === '...'"
                    >
                      {{ page }}
                    </button>
                  </template>
                </div>

                <button
                  @click="nextPage"
                  :disabled="pagination.current_page === pagination.last_page"
                  class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ $t('pagination.next') }}
                  <i class="fas fa-chevron-left mr-1"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal إضافة/تعديل مستخدم -->
      <div
        v-if="showAddUserModal || showEditUserModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div
            class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50"
          >
            <h3 class="text-lg font-semibold text-gray-900">
              {{ showEditUserModal ? $t('users.edit') : $t('users.add') }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form
            @submit.prevent="showEditUserModal ? handleUpdateUser() : handleAddUser()"
            class="px-6 py-4 space-y-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('users.name') }}
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="userForm.name"
                type="text"
                :placeholder="$t('users.namePlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
              <div v-if="errors.name" class="mt-1 text-sm text-red-600">
                {{ errors.name }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.email') }}
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="userForm.email"
                type="email"
                :placeholder="$t('users.emailPlaceholder')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
              />
              <div v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ showEditUserModal ? $t('users.newPassword') : $t('auth.password') }}
                <span v-if="!showEditUserModal" class="text-red-500">*</span>
              </label>
              <input
                v-model="userForm.password"
                type="password"
                :placeholder="$t('auth.passwordPlaceholder')"
                :required="!showEditUserModal"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              <div v-if="errors.password" class="mt-1 text-sm text-red-600">
                {{ errors.password }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.confirm_password') }}
                <span v-if="!showEditUserModal" class="text-red-500">*</span>
              </label>
              <input
                v-model="userForm.password_confirmation"
                type="password"
                :placeholder="$t('auth.confirm_password')"
                :required="!showEditUserModal"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              <div v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">
                {{ errors.password_confirmation }}
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                @click="closeModal"
                :disabled="submitting"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                {{ $t('common.cancel') }}
              </button>

              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center transition-colors duration-200 disabled:opacity-50"
              >
                <span v-if="submitting" class="animate-spin mr-2">
                  <i class="fas fa-spinner"></i>
                </span>
                <i class="fas fa-save ml-2"></i>
                {{ showEditUserModal ? $t('common.update') : $t('common.add') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal إدارة الصلاحيات -->
      <div
        v-if="showPermissionsModal"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div
            class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50"
          >
            <h3 class="text-lg font-semibold text-gray-900">
              {{ $t('permissions.manageFor', { user: selectedUser?.name }) }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="px-6 py-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">{{
                $t('roles.title')
              }}</label>
              <div class="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div class="space-y-3">
                  <div
                    v-for="role in roles"
                    :key="role.id"
                    class="flex items-center p-2 hover:bg-gray-50 rounded transition-colors duration-200"
                  >
                    <input
                      :id="`role-${role.id}`"
                      v-model="selectedRoles"
                      :value="role.id"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      :for="`role-${role.id}`"
                      class="mr-3 text-sm text-gray-700 cursor-pointer flex-1"
                    >
                      <div class="font-medium">{{ role.name }}</div>
                      <div class="text-gray-500 text-xs mt-1">{{ role.description }}</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-t border-gray-200 pt-4 flex justify-end space-x-3 space-x-reverse">
              <button
                type="button"
                @click="closeModal"
                :disabled="submitting"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                {{ $t('common.cancel') }}
              </button>

              <button
                @click="savePermissions"
                :disabled="submitting"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center transition-colors duration-200 disabled:opacity-50"
              >
                <span v-if="submitting" class="animate-spin mr-2">
                  <i class="fas fa-spinner"></i>
                </span>
                <i class="fas fa-save ml-2"></i>
                {{ $t('common.save') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserManagement',

  data() {
    return {
      submitting: false,
      searchQuery: '',
      searchTimeout: null,

      showAddUserModal: false,
      showEditUserModal: false,
      showPermissionsModal: false,

      selectedUser: null,
      selectedRoles: [],

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
    // استخدام mapGetters لجلب البيانات من الـ store
    ...mapGetters('users', [
      'users',
      'loading',
      'error',
      'pagination',
      'groups',
      'userFilters',
      'userStats',
    ]),

    // معرف المستخدم الحالي من حالة المصادقة
    currentUserId() {
      return this.$store.state.auth.user?.id
    },

    // الحصول على الأدوار من الـ store
    roles() {
      return this.groups || []
    },

    // البحث عن مستخدم بالمعرف (استخدام getter من الـ store)
    getUserById() {
      return (id) => this.$store.getters['users/userById'](id)
    },
  },

  mounted() {
    console.log('🚀 User Management component mounted')

    // تحميل الفلاتر المخزنة
    this.searchQuery = this.userFilters.search || ''

    // تحميل المستخدمين والمجموعات
    this.loadData()
  },

  methods: {
    // استخدام mapActions لتحديد الإجراءات من الـ store
    ...mapActions('users', [
      'fetchUsers',
      'fetchGroups',
      'createUser',
      'updateUser',
      'deleteUser',
      'updateFilters',
      'clearFilters',
      'clearError',
    ]),

    // تحميل البيانات
    async loadData() {
      console.log('🔄 Loading users data...')
      try {
        await Promise.all([this.fetchUsers({ search: this.searchQuery }), this.fetchGroups()])
        console.log('✅ Users data loaded:', this.users.length, 'users')
      } catch (error) {
        console.error('❌ Error loading users data:', error)
        this.$toast.error(error.message || this.$t('errors.loadFailed'))
      }
    },

    // البحث عن المستخدمين
    onSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.updateFilters({ search: this.searchQuery, page: 1 })
        this.fetchUsers()
      }, 500)
    },

    // إضافة مستخدم جديد
    async handleAddUser() {
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

        await this.createUser(this.userForm)
        this.$toast.success(this.$t('messages.createSuccess', { item: this.$t('users.user') }))
        this.closeModal()
      } catch (error) {
        console.error('❌ Error creating user:', error)
        this.$toast.error(error.message || this.$t('errors.createError'))
      } finally {
        this.submitting = false
      }
    },

    // تعديل مستخدم
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

    async handleUpdateUser() {
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

        await this.updateUser({
          id: this.selectedUser.id,
          data: userData,
        })

        this.$toast.success(this.$t('messages.updateSuccess', { item: this.$t('users.user') }))
        this.closeModal()
      } catch (error) {
        console.error('❌ Error updating user:', error)
        this.$toast.error(error.message || this.$t('errors.updateError'))
      } finally {
        this.submitting = false
      }
    },

    // إدارة الصلاحيات
    managePermissions(user) {
      this.selectedUser = user
      this.selectedRoles = user.roles?.map((r) => r.id) || []
      this.showPermissionsModal = true
    },

    async savePermissions() {
      this.submitting = true
      try {
        // هنا يمكنك إضافة منطق حفظ الصلاحيات
        // await this.assignRolesToUser({
        //   userId: this.selectedUser.id,
        //   roles: this.selectedRoles,
        // })

        this.$toast.success(
          this.$t('messages.updateSuccess', { item: this.$t('permissions.title') }),
        )
        this.closeModal()
      } catch (error) {
        console.error('❌ Error saving permissions:', error)
        this.$toast.error(error.message || this.$t('errors.updateError'))
      } finally {
        this.submitting = false
      }
    },

    // تأكيد الحذف
    confirmDelete(user) {
      if (
        confirm(
          this.$t('messages.confirmDelete', { item: `${this.$t('users.user')} "${user.name}"` }),
        )
      ) {
        this.deleteUserHandler(user.id)
      }
    },

    async deleteUserHandler(id) {
      try {
        await this.deleteUser(id)
        this.$toast.success(this.$t('messages.deleteSuccess', { item: this.$t('users.user') }))
        // إعادة تحميل البيانات بعد الحذف
        await this.fetchUsers()
      } catch (error) {
        console.error('❌ Error deleting user:', error)
        this.$toast.error(error.message || this.$t('errors.deleteError'))
      }
    },

    // إغلاق النوافذ المنبثقة
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

    // التحقق من صحة البريد الإلكتروني
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },

    // التنقل بين الصفحات
    previousPage() {
      if (this.pagination.current_page > 1) {
        this.updateFilters({ page: this.pagination.current_page - 1 })
        this.fetchUsers()
      }
    },

    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.updateFilters({ page: this.pagination.current_page + 1 })
        this.fetchUsers()
      }
    },

    goToPage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      this.updateFilters({ page })
      this.fetchUsers()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    // الحصول على نطاق الترقيم
    getPaginationRange() {
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

    // تنسيق التاريخ
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    // الحصول على الأحرف الأولى من الاسم
    getInitials(name) {
      if (!name) return '؟؟'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    // الحصول على فئة الـ badge بناءً على نوع الدور
    getRoleBadgeClass(roleName) {
      const classes = {
        admin: 'bg-red-100 text-red-800',
        user: 'bg-blue-100 text-blue-800',
        accountant: 'bg-yellow-100 text-yellow-800',
        manager: 'bg-green-100 text-green-800',
        editor: 'bg-purple-100 text-purple-800',
      }
      return classes[roleName] || 'bg-gray-100 text-gray-800'
    },

    // الحصول على فئة الحالة
    getStatusClass(status) {
      const classes = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    // الحصول على نص الحالة
    getStatusText(status) {
      const texts = {
        active: 'نشط',
        inactive: 'غير نشط',
        suspended: 'موقوف',
      }
      return texts[status] || status
    },

    // التحقق من الصلاحيات
    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },
  },

  watch: {
    // مراقبة تغييرات الفلاتر
    userFilters: {
      immediate: true,
      handler(newFilters) {
        this.searchQuery = newFilters.search || ''
      },
    },
  },
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* تحسينات للجدول على الأجهزة المحمولة */
@media (max-width: 640px) {
  .table-responsive {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-buttons button {
    width: 100%;
    justify-content: center;
  }
}
</style>
