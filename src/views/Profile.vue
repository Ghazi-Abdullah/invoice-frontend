<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('profile.title') }}</h1>
      <p class="text-gray-600 mt-2">{{ $t('profile.subtitle') }}</p>
    </div>

    <!-- حالة التحميل العامة -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- حالة الخطأ العامة -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
      <i class="fas fa-exclamation-circle mr-2"></i>
      {{ error }}
    </div>

    <!-- محتوى الملف الشخصي -->
    <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- العمود الأيسر: بطاقة المستخدم -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div class="relative px-6 pb-6">
            <div class="flex justify-center -mt-16">
              <div
                class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg"
              >
                {{ initials }}
              </div>
            </div>
            <div class="text-center mt-4">
              <h2 class="text-xl font-bold text-gray-900">{{ user.name }}</h2>
              <p class="text-gray-600 mt-1">{{ user.email }}</p>
              <div
                class="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                <span
                  class="w-2 h-2 rounded-full mr-2"
                  :class="user.is_active ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                {{ user.is_active ? $t('profile.active') : $t('profile.inactive') }}
              </div>
            </div>
            <div class="mt-6 space-y-3 border-t border-gray-100 pt-4">
              <div class="flex items-center text-gray-700">
                <i class="fas fa-phone-alt w-6 text-blue-500"></i>
                <span class="ml-2">{{ user.phone || $t('profile.not_provided') }}</span>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-building w-6 text-blue-500"></i>
                <span class="ml-2">{{ user.company_name || $t('profile.not_provided') }}</span>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-layer-group w-6 text-blue-500"></i>
                <span class="ml-2">{{ user.adminGroup?.title_ar || $t('profile.no_group') }}</span>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-id-badge w-6 text-blue-500"></i>
                <span class="ml-2">{{
                  user.is_admin ? $t('profile.administrator') : $t('profile.user')
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- العمود الأيمن -->
      <div class="lg:col-span-2 space-y-6">
        <!-- معلومات الحساب مع إمكانية التعديل -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <i class="fas fa-user-circle text-blue-500 mr-2"></i>
              {{ $t('profile.account_info') }}
            </h3>
            <button
              @click="toggleEditMode"
              class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <i class="fas fa-pen mr-1"></i>
              {{ editMode ? $t('common.cancel') : $t('common.edit') }}
            </button>
          </div>

          <!-- عرض البيانات -->
          <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">{{ $t('profile.full_name') }}</label>
              <p class="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">{{ user.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">{{ $t('profile.email') }}</label>
              <p class="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">{{ user.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">{{ $t('profile.phone') }}</label>
              <p class="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">{{ user.phone || $t('profile.not_provided') }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">{{ $t('profile.company') }}</label>
              <p class="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">{{ user.company_name || $t('profile.not_provided') }}</p>
            </div>
          </div>

          <!-- نموذج التعديل -->
          <div v-else>
            <form @submit.prevent="submitProfileUpdate">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.full_name') }}</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.email') }}</label>
                  <input
                    v-model="editForm.email"
                    type="email"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.phone') }}</label>
                  <input
                    v-model="editForm.phone"
                    type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.company') }}</label>
                  <input
                    v-model="editForm.company_name"
                    type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  @click="cancelEdit"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="profileUpdating"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  <i v-if="profileUpdating" class="fas fa-spinner fa-spin mr-2"></i>
                  {{ $t('common.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- الأمان (تغيير كلمة المرور) -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <i class="fas fa-lock text-blue-500 mr-2"></i>
            {{ $t('profile.security') }}
          </h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-700">{{ $t('profile.password_info') }}</p>
            </div>
            <button
              @click="openPasswordModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {{ $t('profile.change_password') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal تغيير كلمة المرور -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div class="p-6">
          <h3 class="text-xl font-bold text-gray-900 mb-4">{{ $t('profile.change_password') }}</h3>
          <form @submit.prevent="submitPasswordChange">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.current_password') }}</label>
                <input
                  v-model="passwordForm.current_password"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.new_password') }}</label>
                <input
                  v-model="passwordForm.new_password"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('profile.confirm_password') }}</label>
                <input
                  v-model="passwordForm.new_password_confirmation"
                  type="password"
                  class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div v-if="passwordError" class="mt-2 text-red-600 text-sm">{{ passwordError }}</div>
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="closePasswordModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="passwordUpdating"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                <i v-if="passwordUpdating" class="fas fa-spinner fa-spin mr-2"></i>
                {{ $t('common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- رسالة النجاح المؤقتة (اختياري) -->
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      editMode: false,
      editForm: {
        name: '',
        email: '',
        phone: '',
        company_name: ''
      },
      profileUpdating: false,
      showPasswordModal: false,
      passwordForm: {
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
      },
      passwordUpdating: false,
      passwordError: null,
      successMessage: ''
    }
  },
  computed: {
    ...mapGetters('profile', ['user', 'permissions', 'loading', 'error', 'initials'])
  },
  methods: {
    ...mapActions('profile', ['fetchProfile', 'updateProfile', 'changePassword']),

    // التحكم في وضع التعديل
    toggleEditMode() {
      if (!this.editMode) {
        // تهيئة النموذج ببيانات المستخدم الحالية
        this.editForm = {
          name: this.user.name || '',
          email: this.user.email || '',
          phone: this.user.phone || '',
          company_name: this.user.company_name || ''
        }
      }
      this.editMode = !this.editMode
    },
    cancelEdit() {
      this.editMode = false
      this.editForm = { name: '', email: '', phone: '', company_name: '' }
    },
    async submitProfileUpdate() {
      this.profileUpdating = true
      try {
        const success = await this.updateProfile(this.editForm)
        if (success) {
          this.editMode = false
          this.showSuccess(this.$t('profile.update_success'))
        } else {
          // يمكن عرض الخطأ من store عبر getter error
        }
      } finally {
        this.profileUpdating = false
      }
    },

    // تغيير كلمة المرور
    openPasswordModal() {
      this.passwordForm = { current_password: '', new_password: '', new_password_confirmation: '' }
      this.passwordError = null
      this.showPasswordModal = true
    },
    closePasswordModal() {
      this.showPasswordModal = false
    },
    async submitPasswordChange() {
      // تحقق بسيط من تطابق كلمة المرور الجديدة
      if (this.passwordForm.new_password !== this.passwordForm.new_password_confirmation) {
        this.passwordError = this.$t('profile.password_mismatch')
        return
      }
      this.passwordUpdating = true
      this.passwordError = null
      try {
        const success = await this.changePassword({
          current_password: this.passwordForm.current_password,
          new_password: this.passwordForm.new_password,
          new_password_confirmation: this.passwordForm.new_password_confirmation
        })
        if (success) {
          this.closePasswordModal()
          this.showSuccess(this.$t('profile.password_changed'))
        } else {
          // في حالة الفشل، يمكن قراءة الخطأ من store (error getter)
          this.passwordError = this.error || this.$t('profile.password_error')
        }
      } finally {
        this.passwordUpdating = false
      }
    },

    // عرض رسالة نجاح مؤقتة
    showSuccess(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    }
  },
  created() {
    this.fetchProfile()
  }
}
</script>

<style scoped>
/* أي تنسيقات إضافية */
</style>
