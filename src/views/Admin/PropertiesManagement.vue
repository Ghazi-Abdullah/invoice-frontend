<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ $t('property.title') || 'العقارات' }}</h1>
          <p class="text-gray-600 text-sm mt-1">{{ $t('property.subtitle') || 'إدارة العقارات' }}</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('property.add_property') || 'إضافة عقار' }}
        </button>
      </div>

      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div v-if="properties.length === 0" class="text-center py-12 px-4 text-gray-600">
          {{ $t('property.empty') || 'لا توجد عقارات بعد' }}
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">{{ $t('property.name') || 'الاسم' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('property.city') || 'المدينة' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('property.floors') || 'الطوابق' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('property.status') || 'الحالة' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('common.actions') || 'إجراءات' }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="property in properties" :key="property.id" class="hover:bg-blue-50/30">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ property.name }}</div>
              </td>
              <td class="px-6 py-4 text-center text-sm text-gray-700">{{ property.city || '-' }}</td>
              <td class="px-6 py-4 text-center text-sm text-gray-700">{{ property.floors_count ?? 0 }}</td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="toggleActive(property)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold"
                  :class="property.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                >
                  {{ property.is_active ? ($t('branch.active') || 'نشط') : ($t('branch.inactive') || 'غير نشط') }}
                </button>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="goToFloors(property)" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg" :title="$t('property.manage_floors') || 'إدارة الطوابق'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5" />
                    </svg>
                  </button>
                  <button @click="openEditModal(property)" class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg" :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(property)" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg" :title="$t('common.delete')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingProperty ? ($t('property.edit_property') || 'تعديل عقار') : ($t('property.add_property') || 'إضافة عقار') }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('property.name') || 'الاسم' }} *</label>
            <input v-model="form.name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('property.name_en') || 'الاسم (إنجليزي)' }}</label>
            <input v-model="form.name_en" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('property.city') || 'المدينة' }}</label>
              <input v-model="form.city" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('property.phone') || 'الهاتف' }}</label>
              <input v-model="form.phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('property.address') || 'العنوان' }}</label>
            <input v-model="form.address" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('property.email') || 'الإيميل' }}</label>
            <input v-model="form.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <label class="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" v-model="form.is_active" />
            {{ $t('branch.active') || 'نشط' }}
          </label>
          <div class="flex justify-end gap-3 pt-3 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg">
              {{ $t('common.cancel') || 'إلغاء' }}
            </button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {{ submitting ? ($t('common.saving') || 'جاري الحفظ...') : ($t('common.save') || 'حفظ') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PropertiesManagement',

  data() {
    return {
      properties: [],
      loading: false,
      submitting: false,
      showModal: false,
      editingProperty: null,
      form: {
        name: '',
        name_en: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        is_active: true,
      },
    }
  },

  mounted() {
    this.loadProperties()
  },

  methods: {
    ...mapActions('properties', [
      'fetchAllProperties',
      'createProperty',
      'updateProperty',
      'deleteProperty',
    ]),

    async loadProperties() {
      this.loading = true
      try {
        const result = await this.fetchAllProperties()
        this.properties = result?.data?.data || result?.data || result || []
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      } finally {
        this.loading = false
      }
    },

    goToFloors(property) {
      this.$router.push({ name: 'AdminPropertyFloors', params: { propertyId: property.id } })
    },

    openCreateModal() {
      this.editingProperty = null
      this.form = { name: '', name_en: '', address: '', city: '', phone: '', email: '', is_active: true }
      this.showModal = true
    },

    openEditModal(property) {
      this.editingProperty = property
      this.form = {
        name: property.name,
        name_en: property.name_en,
        address: property.address,
        city: property.city,
        phone: property.phone,
        email: property.email,
        is_active: !!property.is_active,
      }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    async submitForm() {
      this.submitting = true
      try {
        if (this.editingProperty) {
          await this.updateProperty({ id: this.editingProperty.id, payload: this.form })
          this.$toast?.success(this.$t('property.updated') || 'تم تحديث العقار')
        } else {
          await this.createProperty(this.form)
          this.$toast?.success(this.$t('property.created') || 'تم إنشاء العقار')
        }
        this.showModal = false
        await this.loadProperties()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      } finally {
        this.submitting = false
      }
    },

    async toggleActive(property) {
      try {
        await this.updateProperty({ id: property.id, payload: { is_active: !property.is_active } })
        await this.loadProperties()
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      }
    },

    async confirmDelete(property) {
      const result = await this.$swal?.fire({
        title: this.$t('common.are_you_sure') || 'هل أنت متأكد؟',
        text: property.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete') || 'حذف',
        cancelButtonText: this.$t('common.cancel') || 'إلغاء',
      })
      if (result && !result.isConfirmed) return

      try {
        await this.deleteProperty(property.id)
        this.$toast?.success(this.$t('messages.deleteSuccess') || 'تم الحذف بنجاح')
        await this.loadProperties()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      }
    },
  },
}
</script>
