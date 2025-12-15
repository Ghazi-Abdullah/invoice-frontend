<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-800">تعيين الصلاحيات للمجموعات</h1>
      <p class="text-gray-600 mt-2">اختر مجموعة وقم بتعيين الصلاحيات المناسبة لها</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-600">جاري التحميل...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- اختيار المجموعة -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">اختر مجموعة</h2>
          <div class="space-y-3">
            <div
              v-for="group in groups"
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
                  <h3 class="font-medium text-gray-900">{{ group.title_ar }}</h3>
                  <p class="text-sm text-gray-500">{{ group.title_en }}</p>
                </div>
              </div>
              <p class="text-sm text-gray-600 mt-2">{{ group.permissions_count || 0 }} صلاحية</p>
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
            <div class="flex justify-between items-center mb-6">
              <div>
                <h2 class="text-xl font-semibold text-gray-800">
                  صلاحيات مجموعة: <span class="text-blue-600">{{ selectedGroup.title_ar }}</span>
                </h2>
                <p class="text-gray-600 mt-1">حدد الصلاحيات التي تريد منحها لهذه المجموعة</p>
              </div>
              <div class="flex space-x-3 space-x-reverse">
                <button
                  @click="selectAll"
                  class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <i class="fas fa-check-circle ml-2"></i>
                  تحديد الكل
                </button>
                <button
                  @click="deselectAll"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  <i class="fas fa-times-circle ml-2"></i>
                  إلغاء الكل
                </button>
              </div>
            </div>

            <!-- بحث في الصلاحيات -->
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

            <!-- قائمة الصلاحيات -->
            <div v-if="permissionsLoading" class="text-center py-8">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"
              ></div>
              <p class="mt-2 text-gray-600">جاري تحميل الصلاحيات...</p>
            </div>

            <div v-else class="space-y-4">
              <div
                v-for="permission in filteredPermissions"
                :key="permission.id"
                class="flex items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  :id="`perm-${permission.id}`"
                  :value="permission.id"
                  v-model="selectedPermissions"
                  class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-3"
                />
                <label :for="`perm-${permission.id}`" class="flex-1 cursor-pointer">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-medium text-gray-900">{{ permission.description_ar }}</h4>
                      <p class="text-sm text-gray-500 mt-1">{{ permission.description_en }}</p>
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

              <!-- لا توجد نتائج -->
              <div v-if="filteredPermissions.length === 0" class="text-center py-12">
                <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                <p class="text-gray-600">لم يتم العثور على صلاحيات تطابق البحث</p>
              </div>

              <!-- الإحصائيات وحفظ -->
              <div class="border-t pt-6">
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-600">
                    تم تحديد {{ selectedPermissions.length }} من {{ permissions.length }} صلاحية
                  </div>
                  <button
                    @click="savePermissions"
                    :disabled="saving"
                    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <i class="fas fa-save ml-2"></i>
                    حفظ الصلاحيات للمجموعة
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AssignPermissions',

  data() {
    return {
      selectedGroup: null,
      permissions: [],
      permissionsLoading: false,
      selectedPermissions: [],
      searchQuery: '',
      saving: false,
    }
  },

  computed: {
    ...mapState('adminGroups', {
      groups: (state) => state.adminGroups,
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),

    filteredPermissions() {
      if (!this.searchQuery) {
        return this.permissions
      }

      const search = this.searchQuery.toLowerCase()
      return this.permissions.filter(
        (permission) =>
          permission.title?.toLowerCase().includes(search) ||
          permission.description_ar?.toLowerCase().includes(search) ||
          permission.description_en?.toLowerCase().includes(search),
      )
    },
  },

  methods: {
    ...mapActions('adminGroups', [
      'getAdminGroups',
      'getAvailablePermissions',
      'updateGroupPermissions',
    ]),

    async selectGroup(group) {
      this.selectedGroup = group
      this.selectedPermissions = []
      this.permissionsLoading = true

      try {
        // جلب الصلاحيات المتاحة والصلاحيات المعينة
        const response = await this.getAvailablePermissions(group.id)

        if (response && response.data) {
          this.permissions = response.data // جميع الصلاحيات
          this.selectedPermissions = response.selected_permissions || [] // الصلاحيات المعينة
        }
      } catch (error) {
        console.error('Error loading permissions:', error)
        this.$toast.error('فشل في تحميل الصلاحيات')
      } finally {
        this.permissionsLoading = false
      }
    },

    selectAll() {
      this.selectedPermissions = this.permissions.map((p) => p.id)
    },

    deselectAll() {
      this.selectedPermissions = []
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
          permissions: this.selectedPermissions,
        })

        this.$toast.success('تم حفظ الصلاحيات بنجاح!')
      } catch (error) {
        console.error('Error saving permissions:', error)
        this.$toast.error(error.message || 'فشل في حفظ الصلاحيات')
      } finally {
        this.saving = false
      }
    },
  },

  async mounted() {
    await this.getAdminGroups()
  },
}
</script>
