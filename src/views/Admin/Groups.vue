<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">إدارة المجموعات</h1>
      <p class="text-gray-600 mt-2">إدارة مجموعات المستخدمين والصلاحيات</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">جاري تحميل المجموعات...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-500 ml-2"></i>
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Groups List -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-800">المجموعات</h2>
          <div class="flex space-x-3 space-x-reverse">
            <button
              @click="openAddPermissionModal"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              <i class="fas fa-shield-alt ml-2"></i>
              إضافة صلاحية
            </button>
            <button
              @click="showAddGroupModal = true"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <i class="fas fa-plus ml-2"></i>
              إضافة مجموعة
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                المجموعة
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الوصف
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                عدد المستخدمين
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                عدد الصلاحيات
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="group in adminGroups" :key="group.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                      <i class="fas fa-users text-blue-600"></i>
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ group.title_ar || group.title_en }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ group.title_en }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ group.description || 'لا يوجد وصف' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {{ group.users_count || 0 }} مستخدم
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {{ group.permissions_count || 0 }} صلاحية
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editGroup(group)" class="text-blue-600 hover:text-blue-900 ml-4">
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="managePermissions(group)"
                  class="text-purple-600 hover:text-purple-900 ml-4"
                >
                  <i class="fas fa-shield-alt"></i>
                </button>
                <button
                  @click="confirmDeleteGroup(group)"
                  class="text-red-600 hover:text-red-900 ml-4"
                  v-if="group.id !== 1"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="adminGroups.length === 0" class="text-center py-12">
          <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">لا توجد مجموعات لعرضها</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Group Modal -->
    <div
      v-if="showAddGroupModal || showEditGroupModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditGroupModal ? 'تعديل مجموعة' : 'إضافة مجموعة جديدة' }}
          </h3>

          <form @submit.prevent="showEditGroupModal ? updateGroup() : addGroup()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >اسم المجموعة (العربية) *</label
              >
              <input
                type="text"
                v-model="groupForm.title_ar"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >اسم المجموعة (الإنجليزية) *</label
              >
              <input
                type="text"
                v-model="groupForm.title_en"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                v-model="groupForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
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
                {{ showEditGroupModal ? 'تحديث' : 'إضافة' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Manage Permissions Modal -->
    <div
      v-if="showPermissionsModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              إدارة صلاحيات: {{ selectedGroup?.title_ar }}
            </h3>
            <button
              @click="showAddPermissionModal = true"
              class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <i class="fas fa-plus ml-2"></i>
              إضافة صلاحية جديدة
            </button>
          </div>

          <div v-if="permissionsLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p class="mt-2 text-gray-600">جاري تحميل الصلاحيات...</p>
          </div>

          <div v-else class="space-y-6">
            <!-- Search and Filter -->
            <div class="flex justify-between items-center">
              <div class="relative w-64">
                <input
                  v-model="permissionSearch"
                  type="text"
                  placeholder="بحث في الصلاحيات..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i class="fas fa-search absolute right-3 top-3 text-gray-400"></i>
              </div>
              <div class="flex items-center space-x-4 space-x-reverse">
                <span class="text-sm text-gray-600">
                  {{ filteredPermissions.length }} من {{ availablePermissions.length }} صلاحية
                </span>
              </div>
            </div>

            <!-- Permissions List -->
            <div
              v-if="filteredPermissions.length > 0"
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div
                v-for="permission in filteredPermissions"
                :key="permission.id"
                class="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div class="flex items-start justify-between">
                  <div class="flex items-center flex-1">
                    <input
                      type="checkbox"
                      :id="`permission-${permission.id}`"
                      :value="permission.id"
                      v-model="selectedPermissions"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                    />
                    <div class="mr-3 flex-1">
                      <label :for="`permission-${permission.id}`" class="block cursor-pointer">
                        <div class="text-sm font-medium text-gray-900 mb-1">
                          {{ permission.description_ar || permission.title }}
                        </div>
                        <div class="text-xs text-gray-500 mb-1">
                          {{ permission.description_en || permission.title }}
                        </div>
                        <div class="text-xs text-gray-400">
                          {{ permission.title }}
                        </div>
                        <div v-if="permission.menu" class="mt-2">
                          <span
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {{ permission.menu.title_ar || permission.menu.title_en }}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <i class="fas fa-shield-alt text-4xl text-gray-300 mb-4"></i>
              <p class="text-gray-500">لا توجد صلاحيات لعرضها</p>
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
              حفظ الصلاحيات للمجموعة
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Permission Modal -->
    <div
      v-if="showAddPermissionModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">إضافة صلاحية جديدة</h3>

          <form @submit.prevent="createPermission">
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

            <div class="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                type="button"
                @click="showAddPermissionModal = false"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                إلغاء
              </button>
              <button
                type="submit"
                :disabled="permissionSubmitting"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                إضافة
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
  name: 'AdminGroups',

  data() {
    return {
      showAddGroupModal: false,
      showEditGroupModal: false,
      submitting: false,
      selectedGroup: null,

      groupForm: {
        title_ar: '',
        title_en: '',
        description: '',
        is_active: true,
      },
    }
  },

  computed: {
    ...mapState('adminGroups', {
      adminGroups: (state) => state.adminGroups,
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),
  },

  methods: {
    ...mapActions('adminGroups', [
      'getAdminGroups',
      'createAdminGroup',
      'updateAdminGroup',
      'deleteAdminGroup',
    ]),

    async addGroup() {
      this.submitting = true
      try {
        console.log('Adding group with data:', this.groupForm) // للتتبع

        await this.createAdminGroup(this.groupForm)
        this.closeModal()
        this.$toast.success('تم إضافة المجموعة بنجاح')
      } catch (error) {
        console.error('Error adding group:', error)

        if (error.message && error.message.includes('Validation Error')) {
          this.$toast.error(`خطأ في التحقق: ${error.message.replace('Validation Error: ', '')}`)
        } else {
          this.$toast.error(error.message || 'فشل في إضافة المجموعة')
        }
      } finally {
        this.submitting = false
      }
    },

    editGroup(group) {
      this.selectedGroup = group
      this.groupForm = {
        title_ar: group.title_ar,
        title_en: group.title_en,
        description: group.description || '',
        is_active: group.is_active,
      }
      this.showEditGroupModal = true
    },

    async updateGroup() {
      this.submitting = true
      try {
        console.log('Updating group with data:', this.groupForm) // للتتبع

        await this.updateAdminGroup({
          id: this.selectedGroup.id,
          data: this.groupForm,
        })
        this.closeModal()
        this.$toast.success('تم تحديث المجموعة بنجاح')
      } catch (error) {
        console.error('Error updating group:', error)

        if (error.message && error.message.includes('Validation Error')) {
          this.$toast.error(`خطأ في التحقق: ${error.message.replace('Validation Error: ', '')}`)
        } else {
          this.$toast.error(error.message || 'فشل في تحديث المجموعة')
        }
      } finally {
        this.submitting = false
      }
    },

    async deleteGroup(id) {
      try {
        await this.deleteAdminGroup(id)
        this.$toast.success('تم حذف المجموعة بنجاح')
      } catch (error) {
        console.error('Error deleting group:', error)
        this.$toast.error(error.message || 'فشل في حذف المجموعة')
      }
    },

    closeModal() {
      this.showAddGroupModal = false
      this.showEditGroupModal = false
      this.selectedGroup = null
      this.groupForm = {
        title_ar: '',
        title_en: '',
        description: '',
        is_active: true,
      }
    },
  },

  async mounted() {
    await this.getAdminGroups()
  },
}
</script>
