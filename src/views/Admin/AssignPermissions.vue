<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">تعيين الصلاحيات للمجموعات</h1>
      <p class="text-gray-600 mt-2">اختر مجموعة وقم بتعيين الصلاحيات المناسبة لها</p>
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

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- اختيار المجموعة -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">اختر مجموعة</h2>
          <div class="space-y-3">
            <div
              v-for="group in adminGroups"
              :key="group.id"
              @click="selectGroup(group)"
              :class="[
                'p-4 border rounded-lg cursor-pointer transition',
                selectedGroup?.id === group.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50',
              ]"
            >
              <div class="flex items-center">
                <div
                  class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ml-3"
                >
                  <i class="fas fa-users text-blue-600"></i>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ group.title_ar || group.title_en }}</h3>
                  <p class="text-sm text-gray-500">{{ group.title_en }}</p>
                </div>
              </div>
              <div class="mt-2 flex justify-between items-center">
                <span class="text-sm text-gray-600">
                  {{ group.permissions?.length || group.permissions_count || 0 }} صلاحية
                </span>
                <span class="text-sm text-gray-600">
                  {{ group.users?.length || group.users_count || 0 }} مستخدم
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- تعيين الصلاحيات -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div v-if="!selectedGroup" class="text-center py-12">
            <i class="fas fa-users text-4xl text-gray-300 mb-4"></i>
            <p class="text-gray-600">الرجاء اختيار مجموعة من القائمة</p>
          </div>

          <div v-else>
            <!-- Header -->
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-xl font-semibold text-gray-800">
                  صلاحيات مجموعة:
                  <span class="text-blue-600">{{
                    selectedGroup.title_ar || selectedGroup.title_en
                  }}</span>
                </h2>
                <p class="text-gray-600 mt-1">حدد الصلاحيات التي تريد منحها لهذه المجموعة</p>
              </div>
              <div class="flex space-x-3 space-x-reverse">
                <button
                  @click="selectAllPermissions"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <i class="fas fa-check-circle ml-2"></i>
                  تحديد الكل
                </button>
                <button
                  @click="deselectAllPermissions"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  <i class="fas fa-times-circle ml-2"></i>
                  إلغاء الكل
                </button>
              </div>
            </div>

            <!-- Search -->
            <div class="mb-6">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="ابحث في الصلاحيات..."
                  class="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
            </div>

            <!-- Permissions Loading -->
            <div v-if="permissionsLoading" class="text-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
              ></div>
              <p class="mt-2 text-gray-600">جاري تحميل الصلاحيات...</p>
            </div>

            <!-- Permissions List -->
            <div v-else class="space-y-4">
              <div
                v-for="permission in filteredPermissions"
                :key="permission.id"
                class="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <input
                  type="checkbox"
                  :id="`perm-${permission.id}`"
                  :value="permission.id"
                  v-model="selectedPermissionIds"
                  class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-3"
                />
                <label :for="`perm-${permission.id}`" class="flex-1 cursor-pointer">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">
                        {{ permission.description_ar || permission.title }}
                      </h4>
                      <p class="text-sm text-gray-500 mt-1">
                        {{ permission.description_en || permission.title }}
                      </p>
                      <p class="text-xs text-gray-400 mt-1">{{ permission.title }}</p>
                    </div>
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
                  </div>
                </label>
              </div>

              <!-- No Results -->
              <div v-if="filteredPermissions.length === 0" class="text-center py-12">
                <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-600">لم يتم العثور على صلاحيات تطابق البحث</p>
              </div>

              <!-- Stats and Save -->
              <div class="border-t pt-6 mt-6">
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-600">
                    تم تحديد {{ selectedPermissionIds.length }} من {{ permissions.length }} صلاحية
                  </div>
                  <button
                    @click="savePermissions"
                    :disabled="saving || !selectedGroup"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i class="fas fa-save ml-2"></i>
                    <span v-if="saving">جاري الحفظ...</span>
                    <span v-else>حفظ الصلاحيات</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Toast (via global $toast) -->
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AssignPermissions',

  data() {
    return {
      searchQuery: '',
      saving: false,
      permissionsLoading: false,
      selectedGroup: null,
      selectedPermissionIds: [],
      permissions: [],
      // نتجية جلب الصلاحيات المجمعة
      availablePermissions: null,
    }
  },

  computed: {
    ...mapState('adminGroups', {
      adminGroups: (state) => state.adminGroups,
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),

    ...mapState('permissions', {
      allPermissions: (state) => state.permissionsList,
    }),

    filteredPermissions() {
      if (!this.searchQuery.trim()) {
        return this.permissions
      }

      const search = this.searchQuery.toLowerCase()
      return this.permissions.filter(
        (permission) =>
          (permission.title && permission.title.toLowerCase().includes(search)) ||
          (permission.description_ar && permission.description_ar.toLowerCase().includes(search)) ||
          (permission.description_en && permission.description_en.toLowerCase().includes(search)),
      )
    },
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    ...mapActions('adminGroups', ['getAdminGroups', 'updateGroupPermissions']),
    ...mapActions('permissions', ['getAllPermissions']),

    async loadData() {
      try {
        // جلب المجموعات
        await this.getAdminGroups()

        // جلب جميع الصلاحيات
        await this.getAllPermissions()

        // تحميل الصلاحيات إلى المتغير المحلي
        this.permissions = this.allPermissions || []
      } catch (error) {
        console.error('Error loading data:', error)
        this.$toast.error('فشل في تحميل البيانات')
      }
    },

    async selectGroup(group) {
      this.selectedGroup = group
      this.selectedPermissionIds = []
      this.permissionsLoading = true

      try {
        // جلب الصلاحيات المعينة حاليًا للمجموعة
        if (group.permissions && Array.isArray(group.permissions)) {
          // إذا كانت الصلاحيات مدرجة بالفعل في بيانات المجموعة
          this.selectedPermissionIds = group.permissions.map((p) => p.id)
        } else {
          // إذا لم تكن الصلاحيات مدرجة، افترض أن المجموعة ليس لديها صلاحيات
          this.selectedPermissionIds = []
        }
      } catch (error) {
        console.error('Error loading group permissions:', error)
        this.$toast.error('فشل في تحميل صلاحيات المجموعة')
      } finally {
        this.permissionsLoading = false
      }
    },

    selectAllPermissions() {
      this.selectedPermissionIds = this.permissions.map((p) => p.id)
    },

    deselectAllPermissions() {
      this.selectedPermissionIds = []
    },

    async savePermissions() {
      if (!this.selectedGroup) {
        this.$toast.warning('الرجاء اختيار مجموعة أولاً')
        return
      }

      this.saving = true
      try {
        await this.updateGroupPermissions({
          id: this.selectedGroup.id,
          permissions: this.selectedPermissionIds,
        })

        this.$toast.success('تم حفظ الصلاحيات بنجاح!')

        // إعادة تحميل المجموعات لتحديث البيانات
        await this.getAdminGroups()
      } catch (error) {
        console.error('Error saving permissions:', error)
        const errorMsg = error.response?.data?.message || error.message || 'فشل في حفظ الصلاحيات'
        this.$toast.error(errorMsg)
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
