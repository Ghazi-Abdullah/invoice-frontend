<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">إدارة المستخدمين</h1>
      <p class="text-gray-600 mt-2">إدارة حسابات المستخدمين والصلاحيات</p>
    </div>

    <!-- User List -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">المستخدمين</h2>
          <button
            @click="openAddModal"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <i class="fas fa-plus ml-2"></i>
            إضافة مستخدم
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="storeLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري التحميل...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="storeError" class="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <div class="flex items-center">
          <i class="fas fa-exclamation-circle text-red-500 ml-2"></i>
          <p class="text-red-700">{{ storeError }}</p>
        </div>
      </div>

      <!-- Users Table -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الاسم
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  البريد الإلكتروني
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المجموعة
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الحالة
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  تاريخ التسجيل
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="user in storeUsers" :key="user.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                      >
                        <span class="text-gray-600 font-medium">{{ getInitials(user.name) }}</span>
                      </div>
                    </div>
                    <div class="mr-4">
                      <div class="text-sm font-medium text-gray-900">
                        {{ user.name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ user.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ user.admin_group?.title_ar || user.admin_group?.title_en || 'بدون مجموعة' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="{
                      'bg-green-100 text-green-800': user.is_active,
                      'bg-red-100 text-red-800': !user.is_active,
                    }"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ user.is_active ? 'نشط' : 'غير نشط' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(user.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 ml-4">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="toggleUserStatus(user)"
                    :class="{
                      'text-green-600 hover:text-green-900': !user.is_active,
                      'text-yellow-600 hover:text-yellow-900': user.is_active,
                    }"
                    class="ml-4"
                  >
                    <i :class="user.is_active ? 'fas fa-user-slash' : 'fas fa-user-check'"></i>
                  </button>
                  <button
                    @click="deleteUser(user)"
                    class="text-red-600 hover:text-red-900 ml-4"
                    v-if="user.id !== currentUser?.id"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="storeUsers.length === 0" class="text-center py-12">
          <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">لا يوجد مستخدمين لعرضهم</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد' }}
          </h3>

          <!-- Form Error -->
          <div v-if="formError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div class="flex items-center">
              <i class="fas fa-exclamation-circle text-red-500 ml-2"></i>
              <p class="text-red-700">{{ formError }}</p>
            </div>
          </div>

          <form @submit.prevent="editingUser ? updateUser() : addUser()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
              <input
                type="text"
                v-model="userForm.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >البريد الإلكتروني *</label
              >
              <input
                type="email"
                v-model="userForm.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">المجموعة *</label>
              <select
                v-model="userForm.admin_group_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">اختر مجموعة</option>
                <option v-for="group in storeGroups" :key="group.id" :value="group.id">
                  {{ group.title_ar || group.title_en }}
                </option>
              </select>
            </div>

            <div v-if="!editingUser" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور *
                <span class="text-xs text-gray-500">(8 أحرف على الأقل)</span>
              </label>
              <input
                type="password"
                v-model="userForm.password"
                required
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل كلمة مرور قوية"
              />
            </div>

            <div v-if="!editingUser" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >تأكيد كلمة المرور *</label
              >
              <input
                type="password"
                v-model="userForm.password_confirmation"
                required
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أعد إدخال كلمة المرور"
              />
            </div>

            <div v-if="editingUser" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور الجديدة
                <span class="text-xs text-gray-500">(اتركه فارغاً إذا لم ترد تغييرها)</span>
              </label>
              <input
                type="password"
                v-model="userForm.password"
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل كلمة مرور جديدة"
              />
            </div>

            <div v-if="editingUser" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >تأكيد كلمة المرور الجديدة</label
              >
              <input
                type="password"
                v-model="userForm.password_confirmation"
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أعد إدخال كلمة المرور الجديدة"
              />
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="userForm.is_active"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="mr-2 text-sm text-gray-700">حساب نشط</span>
              </label>
            </div>

            <div class="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {{ editingUser ? 'تحديث' : 'إضافة' }}
              </button>
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
  name: 'AdminUsers',

  data() {
    return {
      showModal: false,
      submitting: false,
      editingUser: null,
      formError: null,
      userForm: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_group_id: '',
        is_active: true,
      },
    }
  },

  computed: {
    ...mapState('users', {
      storeUsers: (state) => state.users,
      storeGroups: (state) => state.groups,
      storeLoading: (state) => state.isLoading,
      storeError: (state) => state.error,
    }),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    ...mapActions('users', [
      'getUsers',
      'getUserGroups',
      'createUser',
      'updateUser',
      'deleteUser',
      'updateUserStatus',
    ]),

    async loadData() {
      try {
        await Promise.all([this.getUsers(), this.getUserGroups()])
      } catch (error) {
        console.error('Error loading data:', error)
      }
    },

    getInitials(name) {
      if (!name) return '??'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    formatDate(date) {
      if (!date) return 'غير محدد'
      return new Date(date).toLocaleDateString('ar-SA')
    },

    openAddModal() {
      this.editingUser = null
      this.formError = null
      this.userForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_group_id: '',
        is_active: true,
      }
      this.showModal = true
    },

    editUser(user) {
      this.editingUser = user
      this.formError = null
      this.userForm = {
        name: user.name,
        email: user.email,
        admin_group_id: user.admin_group_id,
        is_active: user.is_active,
        password: '',
        password_confirmation: '',
      }
      this.showModal = true
    },

    validatePassword() {
      if (!this.editingUser) {
        // عند الإضافة
        if (!this.userForm.password || this.userForm.password.length < 8) {
          throw new Error('Password must be at least 8 characters')
        }
      } else {
        // عند التحديث (إذا أدخل كلمة مرور جديدة)
        if (this.userForm.password && this.userForm.password.length < 8) {
          throw new Error('Password must be at least 8 characters')
        }
      }

      if (this.userForm.password !== this.userForm.password_confirmation) {
        throw new Error('Password confirmation does not match')
      }
    },

    async addUser() {
      this.submitting = true
      this.formError = null

      try {
        this.validatePassword()

        await this.createUser(this.userForm)
        this.closeModal()
        this.$toast.success('تم إضافة المستخدم بنجاح')
      } catch (error) {
        this.formError = error.message
        this.$toast.error(error.message)
      } finally {
        this.submitting = false
      }
    },

    async updateUser() {
      this.submitting = true
      this.formError = null

      try {
        // التحقق من كلمة المرور فقط إذا تم إدخالها
        if (this.userForm.password) {
          this.validatePassword()
        }

        await this.updateUser({
          id: this.editingUser.id,
          data: this.userForm,
        })
        this.closeModal()
        this.$toast.success('تم تحديث المستخدم بنجاح')
      } catch (error) {
        this.formError = error.message
        this.$toast.error(error.message)
      } finally {
        this.submitting = false
      }
    },

    async toggleUserStatus(user) {
      const action = user.is_active ? 'تعطيل' : 'تفعيل'
      if (confirm(`هل أنت متأكد من ${action} المستخدم "${user.name}"؟`)) {
        try {
          await this.updateUserStatus({
            id: user.id,
            is_active: !user.is_active,
          })
          this.$toast.success(`تم ${action} المستخدم بنجاح`)
        } catch (error) {
          this.$toast.error(error.message)
        }
      }
    },

    async deleteUser(user) {
      if (confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟`)) {
        try {
          await this.deleteUser(user.id)
          this.$toast.success('تم حذف المستخدم بنجاح')
        } catch (error) {
          this.$toast.error(error.message)
        }
      }
    },

    closeModal() {
      this.showModal = false
      this.editingUser = null
      this.formError = null
      this.userForm = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        admin_group_id: '',
        is_active: true,
      }
    },
  },
}
</script>
