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
            @click="showAddUserModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <i class="fas fa-plus ml-2"></i>
            إضافة مستخدم
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">جاري التحميل...</p>
      </div>

      <div v-else>
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
                الأدوار
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
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                    >
                      <i class="fas fa-user text-gray-500"></i>
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
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="role in user.roles"
                    :key="role.id"
                    :class="{
                      'bg-blue-100 text-blue-800': role.name === 'admin',
                      'bg-green-100 text-green-800': role.name === 'user',
                      'bg-purple-100 text-purple-800': role.name === 'accountant',
                    }"
                    class="px-2 py-1 text-xs rounded-full"
                  >
                    {{ role.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editUser(user)" class="text-blue-600 hover:text-blue-900 ml-4">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="managePermissions(user)"
                  class="text-purple-600 hover:text-purple-900 ml-4"
                >
                  <i class="fas fa-shield-alt"></i>
                </button>
                <button
                  @click="confirmDeleteUser(user)"
                  class="text-red-600 hover:text-red-900 ml-4"
                  v-if="user.id !== currentUser.id"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit User Modal -->
    <div
      v-if="showAddUserModal || showEditUserModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditUserModal ? 'تعديل مستخدم' : 'إضافة مستخدم جديد' }}
          </h3>

          <form @submit.prevent="showEditUserModal ? updateUser() : addUser()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"> الاسم الكامل * </label>
              <input
                type="text"
                v-model="userForm.name"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                v-model="userForm.email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ showEditUserModal ? 'كلمة المرور الجديدة (اختياري)' : 'كلمة المرور *' }}
              </label>
              <input
                type="password"
                v-model="userForm.password"
                :required="!showEditUserModal"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                تأكيد كلمة المرور *
              </label>
              <input
                type="password"
                v-model="userForm.password_confirmation"
                :required="!showEditUserModal"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                {{ showEditUserModal ? 'تحديث' : 'إضافة' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Manage Permissions Modal -->
    <div
      v-if="showPermissionsModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            إدارة صلاحيات: {{ selectedUser?.name }}
          </h3>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"> الأدوار </label>
            <div class="space-y-2">
              <div v-for="role in roles" :key="role.id" class="flex items-center">
                <input
                  type="checkbox"
                  :id="`role-${role.id}`"
                  :value="role.id"
                  v-model="selectedRoles"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label :for="`role-${role.id}`" class="mr-2 text-sm text-gray-900">
                  {{ role.name }}
                  <span class="text-gray-500 text-xs">({{ role.description }})</span>
                </label>
              </div>
            </div>
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
              @click="savePermissions"
              :disabled="submitting"
              class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
            >
              حفظ الصلاحيات
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from '@/api/axios'
import { toast } from 'vue3-toastify'

export default {
  name: 'UserManagement',

  data() {
    return {
      loading: false,
      submitting: false,
      users: [],
      roles: [],

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
    }
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.auth.user,
    }),
  },

  mounted() {
    this.fetchUsers()
    this.fetchRoles()
  },

  methods: {
    async fetchUsers() {
      this.loading = true
      try {
        const res = await axios.get('/api/permissions/users')
        this.users = res.data
      } catch (e) {
        toast.error('فشل في تحميل المستخدمين')
      } finally {
        this.loading = false
      }
    },

    async fetchRoles() {
      try {
        const res = await axios.get('/api/permissions/roles')
        this.roles = res.data
      } catch (e) {
        console.error(e)
      }
    },

    async addUser() {
      this.submitting = true
      try {
        const res = await axios.post('/api/register', this.userForm)
        this.users.push(res.data.user)
        this.closeModal()
        toast.success('تم إضافة المستخدم بنجاح')
      } catch (e) {
        toast.error(e.response?.data?.message || 'فشل في الإضافة')
      } finally {
        this.submitting = false
      }
    },

    editUser(user) {
      this.selectedUser = user
      this.userForm.name = user.name
      this.userForm.email = user.email
      this.showEditUserModal = true
    },

    async updateUser() {
      this.submitting = true
      try {
        const res = await axios.put(`/api/users/${this.selectedUser.id}`, this.userForm)
        const index = this.users.findIndex((u) => u.id === this.selectedUser.id)
        if (index !== -1) this.users[index] = res.data.user
        this.closeModal()
        toast.success('تم التحديث بنجاح')
      } catch (e) {
        toast.error('فشل في التحديث')
      } finally {
        this.submitting = false
      }
    },

    managePermissions(user) {
      this.selectedUser = user
      this.selectedRoles = user.roles.map((r) => r.id)
      this.showPermissionsModal = true
    },

    async savePermissions() {
      this.submitting = true
      try {
        await axios.post(`/api/permissions/users/${this.selectedUser.id}/assign-roles`, {
          roles: this.selectedRoles,
        })

        this.selectedUser.roles = this.roles.filter((r) => this.selectedRoles.includes(r.id))

        this.closeModal()
        toast.success('تم حفظ الصلاحيات')
      } catch (e) {
        toast.error('فشل في حفظ الصلاحيات')
      } finally {
        this.submitting = false
      }
    },

    async deleteUser(id) {
      try {
        await axios.delete(`/api/users/${id}`)
        this.users = this.users.filter((u) => u.id !== id)
        toast.success('تم حذف المستخدم')
      } catch {
        toast.error('فشل في الحذف')
      }
    },

    confirmDeleteUser(user) {
      if (confirm(`هل أنت متأكد من حذف ${user.name}؟`)) {
        this.deleteUser(user.id)
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('ar-SA')
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
    },
  },
}
</script>
