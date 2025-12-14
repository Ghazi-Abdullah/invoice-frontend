<template>
  <div class="permission-management">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">إدارة الصلاحيات</h1>
      <p class="mt-2 text-gray-600">إدارة أدوار المستخدمين والصلاحيات</p>
    </div>

    <div class="border-b border-gray-200 mb-8">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <div v-if="activeTab === 'roles'" class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">إضافة دور جديد</h2>
        <form @submit.prevent="createNewRole" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">اسم الدور</label>
              <input
                v-model="newRole.name"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">الوصف</label>
              <input
                v-model="newRole.description"
                type="text"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="creatingRole"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span v-if="creatingRole">جاري الإضافة...</span>
              <span v-else>إضافة دور</span>
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">الأدوار</h2>
        </div>
        <div class="divide-y divide-gray-200">
          <div v-for="role in roles" :key="role.id" class="px-6 py-4 hover:bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ role.name }}</h3>
                <p class="text-sm text-gray-500">{{ role.description }}</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span
                    v-for="permission in role.permissions"
                    :key="permission.id"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                  >
                    {{ permission.description }}
                  </span>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button @click="editRole(role)" class="text-blue-600 hover:text-blue-900">
                  تعديل
                </button>
                <button
                  @click="deleteRole(role.id)"
                  v-if="role.name !== 'admin'"
                  class="text-red-600 hover:text-red-900"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'permissions'" class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">الصلاحيات</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
        <div
          v-for="permission in permissions"
          :key="permission.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <h3 class="text-sm font-medium text-gray-900">{{ permission.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ permission.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'users'" class="space-y-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">المستخدمين</h2>
        </div>
        <div class="divide-y divide-gray-200">
          <div v-for="user in users" :key="user.id" class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">{{ user.name }}</h3>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
                <div class="mt-2">
                  <h4 class="text-xs font-medium text-gray-700 mb-1">الأدوار:</h4>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="role in user.roles || []"
                      :key="role.id"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ role.name }}
                    </span>
                  </div>
                </div>
              </div>
              <button @click="assignRolesToUser(user)" class="text-blue-600 hover:text-blue-900">
                إدارة الأدوار
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg max-w-md w-full">
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">تعديل الدور</h3>
          <form @submit.prevent="updateCurrentRole">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">اسم الدور</label>
                <input
                  v-model="editingRole.name"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">الوصف</label>
                <input
                  v-model="editingRole.description"
                  type="text"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الصلاحيات</label>
                <div class="space-y-2 max-h-60 overflow-y-auto">
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
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label :for="`permission-${permission.id}`" class="ml-3 text-sm text-gray-700">
                      {{ permission.description }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                :disabled="updatingRole"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                حفظ
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
  name: 'PermissionManagement',

  data() {
    return {
      tabs: [
        { id: 'roles', name: 'الأدوار' },
        { id: 'permissions', name: 'الصلاحيات' },
        { id: 'users', name: 'المستخدمين' },
      ],
      activeTab: 'roles',
      showEditModal: false,
      creatingRole: false,
      updatingRole: false,
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
    }
  },

  computed: {
    ...mapState('permissions', ['roles', 'permissions', 'users', 'loading']),
  },

  async mounted() {
    await this.fetchRoles()
    await this.fetchPermissions()
    await this.fetchUsers()
  },

  methods: {
    ...mapActions('permissions', [
      'fetchRoles',
      'fetchPermissions',
      'fetchUsers',
      'createRole',
      'updateRole',
      'deleteRole',
      'assignPermissionsToRole',
      'assignRolesToUser',
    ]),

    async createNewRole() {
      this.creatingRole = true
      try {
        await this.createRole(this.newRole)
        this.newRole = { name: '', description: '' }
      } catch (error) {
        console.error('Error creating role:', error)
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
      this.showEditModal = true
    },

    async updateCurrentRole() {
      this.updatingRole = true
      try {
        await this.updateRole({
          id: this.editingRole.id,
          roleData: {
            name: this.editingRole.name,
            description: this.editingRole.description,
          },
        })

        await this.assignPermissionsToRole({
          roleId: this.editingRole.id,
          permissions: this.editingRole.permissionIds,
        })

        this.showEditModal = false
      } catch (error) {
        console.error('Error updating role:', error)
      } finally {
        this.updatingRole = false
      }
    },

    async deleteRole(roleId) {
      if (confirm('هل أنت متأكد من حذف هذا الدور؟')) {
        try {
          await this.deleteRole(roleId)
        } catch (error) {
          console.error('Error deleting role:', error)
        }
      }
    },

    async assignRolesToUser(user) {
      const roles = this.roles.map((role) => role.id)
      try {
        await this.assignRolesToUser({
          userId: user.id,
          roles,
        })
        await this.fetchUsers()
      } catch (error) {
        console.error('Error assigning roles to user:', error)
      }
    },
  },
}
</script>

<style scoped>
.permission-management {
  @apply p-6;
}
</style>
