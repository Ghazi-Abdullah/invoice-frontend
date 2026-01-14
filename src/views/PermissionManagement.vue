<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-2">إدارة الصلاحيات</h1>
      <p class="text-gray-600">إدارة صلاحيات النظام والمستخدمين</p>
    </div>

    <!-- Filters Card -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800">فلاتر البحث</h2>
        <div class="flex space-x-2 space-x-reverse">
          <button
            @click="loadPermissions"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <i class="fas fa-search ml-2"></i>
            بحث
          </button>
          <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            <i class="fas fa-redo ml-2"></i>
            إعادة تعيين
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">بحث</label>
          <input
            type="text"
            v-model="localFilters.search"
            placeholder="ابحث بالاسم أو الوصف"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
          <select
            v-model="localFilters.status"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">الكل</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">القائمة</label>
          <select
            v-model="localFilters.menu_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">الكل</option>
            <option v-for="menu in menus" :key="menu.id" :value="menu.id">
              {{ menu.title_ar || menu.title_en }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">الصلاحية الأم</label>
          <select
            v-model="localFilters.parent_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">الكل</option>
            <option v-for="parent in parentPermissions" :key="parent.id" :value="parent.id">
              {{ parent.title }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">قائمة الصلاحيات</h3>
        <div class="flex items-center space-x-3 space-x-reverse">
          <div class="text-sm text-gray-500">
            عدد الصلاحيات:
            <span class="font-bold text-gray-900">{{ pagination.total || 0 }}</span>
          </div>
          <button
            @click="showCreateModal = true"
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            <i class="fas fa-plus ml-2"></i>
            إضافة صلاحية
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 m-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fas fa-exclamation-circle text-red-400"></i>
          </div>
          <div class="mr-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
          <button @click="clearError" class="text-red-700 hover:text-red-900">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="permissions.length === 0" class="text-center py-12">
        <i class="fas fa-shield-alt text-gray-300 text-4xl mb-3"></i>
        <p class="text-gray-500">لا توجد صلاحيات</p>
        <button
          @click="showCreateModal = true"
          class="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <i class="fas fa-plus ml-2"></i>
          إضافة صلاحية
        </button>
      </div>

      <!-- Permissions Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الاسم
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                الوصف
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                القائمة
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                الأم
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                تاريخ الإنشاء
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                الحالة
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="permission in permissions" :key="permission.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3"
                  >
                    <i class="fas fa-shield-alt text-blue-600"></i>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ permission.title }}</div>
                    <div class="text-xs text-gray-500 mt-1">ID: {{ permission.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ permission.description_ar || permission.description_en || 'لا يوجد وصف' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  v-if="permission.menu"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {{ permission.menu.title_ar || permission.menu.title_en }}
                </span>
                <span v-else class="text-gray-500 text-sm">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  v-if="permission.parent_permission"
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                >
                  {{ permission.parent_permission.title }}
                </span>
                <span v-else class="text-gray-500 text-sm">—</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                {{ formatDate(permission.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="
                    permission.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  "
                  class="px-3 py-1 text-xs font-medium rounded-full"
                >
                  {{ permission.is_active ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    @click="editPermission(permission)"
                    class="text-blue-600 hover:text-blue-900"
                    title="تعديل"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDelete(permission)"
                    class="text-red-600 hover:text-red-900"
                    title="حذف"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination && pagination.total > pagination.per_page"
        class="px-6 py-4 border-t border-gray-200 bg-gray-50"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div class="text-sm text-gray-700">
            عرض {{ pagination.from || 1 }} إلى {{ pagination.to || pagination.total }} من
            {{ pagination.total }}
          </div>
          <div class="flex items-center space-x-2 space-x-reverse">
            <button
              @click="previousPage"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              <i class="fas fa-chevron-right ml-1"></i>
              السابق
            </button>

            <div class="flex items-center space-x-2">
              <button
                v-for="page in getPaginationRange()"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 rounded text-sm',
                  page === pagination.current_page
                    ? 'bg-blue-500 text-white'
                    : 'border border-gray-300 hover:bg-gray-50',
                  page === '...' ? 'cursor-default' : '',
                ]"
                :disabled="page === '...'"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="nextPage"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50"
            >
              التالي
              <i class="fas fa-chevron-left mr-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showCreateModal || showEditModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ isEditing ? 'تعديل صلاحية' : 'إضافة صلاحية جديدة' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="savePermission" class="p-6">
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الاسم *</label>
                <input
                  type="text"
                  v-model="form.title"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="أدخل اسم الصلاحية"
                />
              </div>

              <!-- Menu -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">القائمة</label>
                <select
                  v-model="form.admin_menu_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">اختر القائمة</option>
                  <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                    {{ menu.title_ar || menu.title_en }}
                  </option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- English Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >الوصف بالإنجليزية</label
                >
                <textarea
                  v-model="form.description_en"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="الوصف بالإنجليزية"
                ></textarea>
              </div>

              <!-- Arabic Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الوصف بالعربية</label>
                <textarea
                  v-model="form.description_ar"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="الوصف بالعربية"
                ></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Parent Permission -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الصلاحية الأم</label>
                <select
                  v-model="form.parent_id"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">اختر الصلاحية الأم</option>
                  <option v-for="parent in parentPermissions" :key="parent.id" :value="parent.id">
                    {{ parent.title }}
                  </option>
                </select>
              </div>

              <!-- Is Parent -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">صلاحية أم</label>
                <div class="mt-2">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="form.is_parent"
                      class="rounded border-gray-300 text-blue-600"
                    />
                    <span class="mr-2 text-sm text-gray-600">صلاحية أم</span>
                  </label>
                </div>
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                <div class="mt-2">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="form.is_active"
                      class="rounded border-gray-300 text-green-600"
                    />
                    <span class="mr-2 text-sm text-gray-600">نشط</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="mt-6 flex justify-end space-x-3 space-x-reverse">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <span v-if="saving">
                <i class="fas fa-spinner fa-spin ml-2"></i>
                جاري الحفظ...
              </span>
              <span v-else>
                <i class="fas fa-save ml-2"></i>
                {{ isEditing ? 'تحديث' : 'حفظ' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PermissionManagement',

  data() {
    return {
      showCreateModal: false,
      showEditModal: false,

      localFilters: {
        search: '',
        status: 'all',
        menu_id: '',
        parent_id: '',
        page: 1,
        per_page: 10,
      },

      form: {
        id: null,
        title: '',
        description_en: '',
        description_ar: '',
        admin_menu_id: '',
        admin_sub_menu_id: '',
        parent_id: '',
        is_parent: false,
        is_active: true,
      },

      saving: false,
    }
  },

  computed: {
    ...mapGetters('permissions', [
      'permissions',
      'menus',
      'parentPermissions',
      'isLoading',
      'error',
      'pagination',
      'filters',
    ]),

    isEditing() {
      return this.showEditModal && this.form.id !== null
    },
  },

  watch: {
    'localFilters.search'(newVal) {
      this.updateFilters({ search: newVal })
    },
    'localFilters.status'(newVal) {
      this.updateFilters({ status: newVal })
    },
    'localFilters.menu_id'(newVal) {
      this.updateFilters({ menu_id: newVal })
    },
    'localFilters.parent_id'(newVal) {
      this.updateFilters({ parent_id: newVal })
    },
    'localFilters.page'(newVal) {
      this.updateFilters({ page: newVal })
      this.getPermissions()
    },
    'localFilters.per_page'(newVal) {
      this.updateFilters({ per_page: newVal })
      this.getPermissions()
    },

    filters: {
      immediate: true,
      handler(newFilters) {
        this.localFilters = { ...this.localFilters, ...newFilters }
      },
    },
  },

  mounted() {
    this.loadInitialData()
  },

  methods: {
    ...mapActions('permissions', [
      'getPermissions',
      'fetchMenus',
      'fetchParentPermissions',
      'createPermission',
      'updatePermission',
      'deletePermission',
      'updateFilters',
      'resetFilters',
      'resetForm',
      'loadPermissionIntoForm',
      'clearError',
    ]),

    async loadInitialData() {
      try {
        await Promise.all([this.getPermissions(), this.fetchMenus(), this.fetchParentPermissions()])
      } catch (error) {
        console.error('Failed to load initial data:', error)
      }
    },

    async loadPermissions() {
      try {
        await this.getPermissions()
      } catch (error) {
        console.error('Failed to load permissions:', error)
      }
    },

    openCreateModal() {
      this.resetForm()
      this.showCreateModal = true
    },

    editPermission(permission) {
      this.loadPermissionIntoForm(permission)
      this.showEditModal = true
    },

    closeModal() {
      this.showCreateModal = false
      this.showEditModal = false
      this.resetForm()
    },

    async savePermission() {
      this.saving = true
      try {
        if (this.isEditing) {
          await this.updatePermission({
            id: this.form.id,
            data: this.form,
          })
        } else {
          await this.createPermission(this.form)
        }

        this.closeModal()
        await this.getPermissions()
      } catch (error) {
        console.error('Failed to save permission:', error)
        alert(error.message || 'فشل في حفظ الصلاحية')
      } finally {
        this.saving = false
      }
    },

    confirmDelete(permission) {
      if (confirm(`هل تريد حذف الصلاحية "${permission.title}"؟`)) {
        this.deletePermission(permission.id)
      }
    },

    goToPage(page) {
      if (page === '...') return
      this.localFilters.page = page
    },

    previousPage() {
      if (this.pagination.current_page > 1) {
        this.goToPage(this.pagination.current_page - 1)
      }
    },

    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.goToPage(this.pagination.current_page + 1)
      }
    },

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

      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      })

      return rangeWithDots
    },

    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('ar-SA')
    },
  },
}
</script>
