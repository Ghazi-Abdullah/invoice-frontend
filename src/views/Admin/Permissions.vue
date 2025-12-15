<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">إدارة الصلاحيات</h1>
      <p class="text-gray-600 mt-2">عرض وتنظيم الصلاحيات المتاحة في النظام</p>
    </div>

    <!-- Search and Actions -->
    <div class="flex justify-between items-center mb-6">
      <div class="relative w-64">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="بحث في الصلاحيات..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
      </div>

      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <i class="fas fa-plus ml-2"></i>
        إضافة صلاحية
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">جاري تحميل الصلاحيات...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 ml-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Permissions List -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الصلاحية
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الوصف (العربية)
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الوصف (الإنجليزية)
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                القائمة
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                نوع
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="permission in filteredPermissions" :key="permission.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {{ permission.title }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ permission.description_ar }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ permission.description_en }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-500">
                  {{ permission.menu?.title_ar || 'لا توجد' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="
                    permission.is_parent
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  "
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ permission.is_parent ? 'رئيسية' : 'فرعية' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="openEditModal(permission)"
                  class="text-blue-600 hover:text-blue-900 ml-4"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="confirmDelete(permission)"
                  class="text-red-600 hover:text-red-900 ml-4"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPermissions.length === 0" class="text-center py-12">
        <i class="fas fa-shield-alt text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500">لا توجد صلاحيات لعرضها</p>
      </div>
    </div>

    <!-- Create/Edit Permission Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingPermission ? 'تعديل صلاحية' : 'إضافة صلاحية جديدة' }}
          </h3>

          <form @submit.prevent="editingPermission ? updatePermission() : createPermission()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">اسم الصلاحية *</label>
              <input
                v-model="permissionForm.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: view_clients"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">الوصف (العربية) *</label>
              <input
                v-model="permissionForm.description_ar"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="عرض العملاء"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >الوصف (الإنجليزية) *</label
              >
              <input
                v-model="permissionForm.description_en"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="View Clients"
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">القائمة الرئيسية</label>
              <select
                v-model="permissionForm.admin_menu_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">اختر قائمة</option>
                <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                  {{ menu.title_ar }} ({{ menu.title_en }})
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  v-model="permissionForm.is_parent"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="mr-2 text-sm text-gray-700">صلاحية رئيسية</span>
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
                {{ editingPermission ? 'تحديث' : 'إضافة' }}
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
        admin_menu_id: '',
        is_parent: false,
      },
      menus: [],
    }
  },

  computed: {
    ...mapState('permissions', {
      permissions: (state) => state.permissions,
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),

    filteredPermissions() {
      if (!this.searchQuery) {
        return this.permissions || []
      }

      const search = this.searchQuery.toLowerCase()
      return (this.permissions || []).filter((permission) => {
        return (
          permission.title?.toLowerCase().includes(search) ||
          permission.description_ar?.toLowerCase().includes(search) ||
          permission.description_en?.toLowerCase().includes(search)
        )
      })
    },
  },

  async mounted() {
    await this.loadPermissions()
    await this.loadMenus()
  },

  methods: {
    ...mapActions('permissions', [
      'getPermissions',
      'createPermission',
      'updatePermission',
      'deletePermission',
    ]),

    async loadPermissions() {
      try {
        await this.getPermissions()
      } catch (error) {
        this.$toast.error('فشل في تحميل الصلاحيات')
      }
    },

    async loadMenus() {
      try {
        const response = await this.$store.dispatch('permissions/getMenusWithPermissions')
        this.menus = response || []
      } catch (error) {
        console.error('Failed to load menus:', error)
      }
    },

    openCreateModal() {
      this.editingPermission = null
      this.permissionForm = {
        title: '',
        description_ar: '',
        description_en: '',
        admin_menu_id: '',
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
        admin_menu_id: permission.admin_menu_id,
        is_parent: permission.is_parent,
      }
      this.showModal = true
    },

    async createPermission() {
      this.submitting = true
      try {
        await this.createPermission(this.permissionForm)
        this.closeModal()
        this.$toast.success('تم إضافة الصلاحية بنجاح')
      } catch (error) {
        this.$toast.error(error.message || 'فشل في إضافة الصلاحية')
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
        this.$toast.success('تم تحديث الصلاحية بنجاح')
      } catch (error) {
        this.$toast.error(error.message || 'فشل في تحديث الصلاحية')
      } finally {
        this.submitting = false
      }
    },

    async deletePermission(id) {
      try {
        await this.deletePermission(id)
        this.$toast.success('تم حذف الصلاحية بنجاح')
      } catch (error) {
        this.$toast.error(error.message || 'فشل في حذف الصلاحية')
      }
    },

    confirmDelete(permission) {
      if (confirm(`هل أنت متأكد من حذف الصلاحية "${permission.description_ar}"؟`)) {
        this.deletePermission(permission.id)
      }
    },

    closeModal() {
      this.showModal = false
      this.editingPermission = null
      this.permissionForm = {
        title: '',
        description_ar: '',
        description_en: '',
        admin_menu_id: '',
        is_parent: false,
      }
    },
  },
}
</script>
