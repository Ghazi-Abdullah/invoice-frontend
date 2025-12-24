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
          <button
            @click="openAddGroupModal"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
            :disabled="loading"
          >
            <i class="fas fa-plus ml-2"></i>
            إضافة مجموعة
          </button>
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
                الحالة
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
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="
                    group.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                >
                  {{ group.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editGroup(group)"
                  class="text-blue-600 hover:text-blue-900 ml-4"
                  title="تعديل"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="confirmDeleteGroup(group)"
                  class="text-red-600 hover:text-red-900 ml-4"
                  title="حذف"
                  v-if="!group.is_system && group.id !== 1"
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
      v-if="showModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'تعديل مجموعة' : 'إضافة مجموعة جديدة' }}
          </h3>

          <form @submit.prevent="isEditing ? updateGroup() : addGroup()">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >اسم المجموعة (العربية) *</label
              >
              <input
                type="text"
                v-model="groupForm.title_ar"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': formErrors.title_ar }"
                required
                :disabled="submitting"
                @input="clearError('title_ar')"
              />
              <p v-if="formErrors.title_ar" class="mt-1 text-sm text-red-600">
                {{ formErrors.title_ar }}
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >اسم المجموعة (الإنجليزية) *</label
              >
              <input
                type="text"
                v-model="groupForm.title_en"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': formErrors.title_en }"
                required
                :disabled="submitting"
                @input="clearError('title_en')"
              />
              <p v-if="formErrors.title_en" class="mt-1 text-sm text-red-600">
                {{ formErrors.title_en }}
              </p>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                v-model="groupForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :disabled="submitting"
              ></textarea>
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="groupForm.is_active"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  :disabled="submitting"
                />
                <span class="mr-2 text-sm text-gray-700">المجموعة مفعلة</span>
              </label>
            </div>

            <!-- Error Message -->
            <div v-if="formError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div class="flex items-center">
                <i class="fas fa-exclamation-circle text-red-500 ml-2"></i>
                <p class="text-red-700 text-sm">{{ formError }}</p>
              </div>
            </div>

            <div class="flex justify-end space-x-3 space-x-reverse mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                :disabled="submitting"
              >
                إلغاء
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 flex items-center"
              >
                <template v-if="submitting">
                  <svg
                    class="animate-spin h-4 w-4 text-white ml-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  جاري الحفظ...
                </template>
                <template v-else>
                  {{ isEditing ? 'تحديث' : 'إضافة' }}
                </template>
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
      showModal: false,
      isEditing: false,
      submitting: false,
      formError: '',
      formErrors: {},
      editingGroupId: null,

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

  async mounted() {
    await this.loadGroups()
  },

  methods: {
    ...mapActions('adminGroups', [
      'getAdminGroups',
      'createAdminGroup',
      'updateAdminGroup',
      'deleteAdminGroup',
    ]),

    async loadGroups() {
      try {
        await this.getAdminGroups()
      } catch (error) {
        console.error('Error loading groups:', error)
      }
    },

    openAddGroupModal() {
      this.isEditing = false
      this.formError = ''
      this.formErrors = {}
      this.editingGroupId = null
      this.groupForm = {
        title_ar: '',
        title_en: '',
        description: '',
        is_active: true,
      }
      this.showModal = true
    },

    editGroup(group) {
      this.isEditing = true
      this.formError = ''
      this.formErrors = {}
      this.editingGroupId = group.id
      this.groupForm = {
        title_ar: group.title_ar || '',
        title_en: group.title_en || '',
        description: group.description || '',
        is_active: group.is_active,
      }
      this.showModal = true
    },

    clearError(field) {
      if (this.formErrors[field]) {
        this.formErrors[field] = ''
      }
    },

    async addGroup() {
      this.submitting = true
      this.formError = ''
      this.formErrors = {}

      // Validate before sending
      if (!this.groupForm.title_ar.trim()) {
        this.formErrors.title_ar = 'اسم المجموعة بالعربية مطلوب'
        this.submitting = false
        return
      }

      if (!this.groupForm.title_en.trim()) {
        this.formErrors.title_en = 'اسم المجموعة بالإنجليزية مطلوب'
        this.submitting = false
        return
      }

      try {
        const groupData = {
          title_ar: this.groupForm.title_ar.trim(),
          title_en: this.groupForm.title_en.trim(),
          description: this.groupForm.description.trim() || null,
          is_active: this.groupForm.is_active,
        }

        console.log('إرسال بيانات المجموعة:', groupData)
        await this.createAdminGroup(groupData)

        this.closeModal()
        this.$toast.success('تم إضافة المجموعة بنجاح')
      } catch (error) {
        console.error('Error adding group:', error)
        this.formError = error.message || 'حدث خطأ أثناء إضافة المجموعة'
      } finally {
        this.submitting = false
      }
    },

    async updateGroup() {
      this.submitting = true
      this.formError = ''
      this.formErrors = {}

      // Validate before sending
      if (!this.groupForm.title_ar.trim()) {
        this.formErrors.title_ar = 'اسم المجموعة بالعربية مطلوب'
        this.submitting = false
        return
      }

      if (!this.groupForm.title_en.trim()) {
        this.formErrors.title_en = 'اسم المجموعة بالإنجليزية مطلوب'
        this.submitting = false
        return
      }

      try {
        const groupData = {
          title_ar: this.groupForm.title_ar.trim(),
          title_en: this.groupForm.title_en.trim(),
          description: this.groupForm.description.trim() || null,
          is_active: this.groupForm.is_active,
        }

        await this.updateAdminGroup({
          id: this.editingGroupId,
          data: groupData,
        })

        this.closeModal()
        this.$toast.success('تم تحديث المجموعة بنجاح')
      } catch (error) {
        console.error('Error updating group:', error)
        this.formError = error.message || 'حدث خطأ أثناء تحديث المجموعة'
      } finally {
        this.submitting = false
      }
    },

    confirmDeleteGroup(group) {
      if (confirm(`هل أنت متأكد من حذف المجموعة "${group.title_ar}"؟`)) {
        this.deleteGroup(group.id)
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
      this.showModal = false
      this.isEditing = false
      this.submitting = false
      this.formError = ''
      this.formErrors = {}
      this.editingGroupId = null
      this.groupForm = {
        title_ar: '',
        title_en: '',
        description: '',
        is_active: true,
      }
    },
  },
}
</script>
