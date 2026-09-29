<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <button @click="$router.push({ name: 'AdminProperties' })" class="text-sm text-blue-700 hover:underline mb-3 flex items-center gap-1">
        &larr; {{ $t('property.back_to_properties') || 'رجوع للعقارات' }}
      </button>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ $t('floor.title') || 'الطوابق' }}</h1>
          <p class="text-gray-600 text-sm mt-1">{{ propertyName }}</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('floor.add_floor') || 'إضافة طابق' }}
        </button>
      </div>

      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div v-if="floors.length === 0" class="text-center py-12 px-4 text-gray-600">
          {{ $t('floor.empty') || 'لا توجد طوابق بعد' }}
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">{{ $t('floor.name') || 'الاسم' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('floor.number') || 'رقم الطابق' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('floor.units') || 'الوحدات' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('property.status') || 'الحالة' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('common.actions') || 'إجراءات' }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="floor in floors" :key="floor.id" class="hover:bg-blue-50/30">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ floor.name }}</div>
              </td>
              <td class="px-6 py-4 text-center text-sm text-gray-700">{{ floor.floor_number }}</td>
              <td class="px-6 py-4 text-center text-sm text-gray-700">{{ floor.units_count ?? 0 }}</td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="toggleActive(floor)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold"
                  :class="floor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                >
                  {{ floor.is_active ? ($t('branch.active') || 'نشط') : ($t('branch.inactive') || 'غير نشط') }}
                </button>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="goToUnits(floor)" class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg" :title="$t('floor.manage_units') || 'إدارة الوحدات'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <button @click="openEditModal(floor)" class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg" :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(floor)" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg" :title="$t('common.delete')">
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
          {{ editingFloor ? ($t('floor.edit_floor') || 'تعديل طابق') : ($t('floor.add_floor') || 'إضافة طابق') }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('floor.name') || 'الاسم' }} *</label>
            <input v-model="form.name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('floor.name_en') || 'الاسم (إنجليزي)' }}</label>
            <input v-model="form.name_en" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('floor.number') || 'رقم الطابق' }} *</label>
            <input v-model.number="form.floor_number" type="number" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('floor.description') || 'الوصف' }}</label>
            <input v-model="form.description" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
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
import axios from '@/api/axios'

export default {
  name: 'FloorsManagement',

  data() {
    return {
      floors: [],
      propertyName: '',
      loading: false,
      submitting: false,
      showModal: false,
      editingFloor: null,
      form: {
        name: '',
        name_en: '',
        floor_number: null,
        description: '',
        is_active: true,
      },
    }
  },

  computed: {
    propertyId() {
      return Number(this.$route.params.propertyId)
    },
  },

  mounted() {
    this.loadProperty()
    this.loadFloors()
  },

  methods: {
    ...mapActions('floors', [
      'fetchFloorsByProperty',
      'createFloor',
      'updateFloor',
      'deleteFloor',
    ]),

    async loadProperty() {
      try {
        const response = await axios.get(`/admin/properties/${this.propertyId}`)
        this.propertyName = response.data?.data?.name || ''
      } catch (e) {
        this.propertyName = ''
      }
    },

    async loadFloors() {
      this.loading = true
      try {
        const result = await this.fetchFloorsByProperty(this.propertyId)
        this.floors = result?.data?.data || result?.data || result || []
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      } finally {
        this.loading = false
      }
    },

    goToUnits(floor) {
      this.$router.push({ name: 'AdminFloorUnits', params: { floorId: floor.id } })
    },

    openCreateModal() {
      this.editingFloor = null
      this.form = { name: '', name_en: '', floor_number: null, description: '', is_active: true }
      this.showModal = true
    },

    openEditModal(floor) {
      this.editingFloor = floor
      this.form = {
        name: floor.name,
        name_en: floor.name_en,
        floor_number: floor.floor_number,
        description: floor.description,
        is_active: !!floor.is_active,
      }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    async submitForm() {
      this.submitting = true
      try {
        if (this.editingFloor) {
          await this.updateFloor({ id: this.editingFloor.id, payload: this.form })
          this.$toast?.success(this.$t('floor.updated') || 'تم تحديث الطابق')
        } else {
          await this.createFloor({ ...this.form, property_id: this.propertyId })
          this.$toast?.success(this.$t('floor.created') || 'تم إنشاء الطابق')
        }
        this.showModal = false
        await this.loadFloors()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      } finally {
        this.submitting = false
      }
    },

    async toggleActive(floor) {
      try {
        await this.updateFloor({ id: floor.id, payload: { is_active: !floor.is_active } })
        await this.loadFloors()
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      }
    },

    async confirmDelete(floor) {
      const result = await this.$swal?.fire({
        title: this.$t('common.are_you_sure') || 'هل أنت متأكد؟',
        text: floor.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete') || 'حذف',
        cancelButtonText: this.$t('common.cancel') || 'إلغاء',
      })
      if (result && !result.isConfirmed) return

      try {
        await this.deleteFloor(floor.id)
        this.$toast?.success(this.$t('messages.deleteSuccess') || 'تم الحذف بنجاح')
        await this.loadFloors()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      }
    },
  },
}
</script>
