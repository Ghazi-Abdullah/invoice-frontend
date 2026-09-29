<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <button @click="$router.back()" class="text-sm text-blue-700 hover:underline mb-3 flex items-center gap-1">
        &larr; {{ $t('floor.back_to_floors') || 'رجوع للطوابق' }}
      </button>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ $t('unit.title') || 'الوحدات' }}</h1>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('unit.add_unit') || 'إضافة وحدة' }}
        </button>
      </div>

      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div v-if="units.length === 0" class="text-center py-12 px-4 text-gray-600">
          {{ $t('unit.empty') || 'لا توجد وحدات بعد' }}
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">{{ $t('unit.name') || 'الوحدة' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('unit.rent') || 'الإيجار الشهري' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('unit.tenant') || 'المستأجر' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('property.status') || 'الحالة' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">{{ $t('common.actions') || 'إجراءات' }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="unit in units" :key="unit.id" class="hover:bg-blue-50/30">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900">{{ unit.name }}</div>
                <div class="text-xs text-gray-500" v-if="unit.area">{{ unit.area }} م²</div>
              </td>
              <td class="px-6 py-4 text-center text-sm text-gray-700">{{ unit.monthly_rent || '-' }}</td>
              <td class="px-6 py-4 text-center text-sm">
                <span v-if="unit.tenant" class="text-gray-900">{{ unit.tenant.name }}</span>
                <span v-else class="text-gray-400">{{ $t('unit.vacant') || 'شاغرة' }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="toggleActive(unit)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold"
                  :class="unit.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
                >
                  {{ unit.is_active ? ($t('branch.active') || 'نشط') : ($t('branch.inactive') || 'غير نشط') }}
                </button>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="openTenantModal(unit)" class="p-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg" :title="$t('unit.assign_tenant') || 'تعيين مستأجر'">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                  <button @click="openEditModal(unit)" class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg" :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(unit)" class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg" :title="$t('common.delete')">
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

    <!-- Unit Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingUnit ? ($t('unit.edit_unit') || 'تعديل وحدة') : ($t('unit.add_unit') || 'إضافة وحدة') }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.name') || 'اسم الوحدة' }} *</label>
            <input v-model="form.name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.area') || 'المساحة (م²)' }}</label>
              <input v-model.number="form.area" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.rent') || 'الإيجار الشهري' }}</label>
              <input v-model.number="form.monthly_rent" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.description') || 'الوصف' }}</label>
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

    <!-- Tenant Modal -->
    <div v-if="showTenantModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ $t('unit.tenant_details') || 'بيانات المستأجر' }}</h3>
        <form @submit.prevent="submitTenant" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.tenant_name') || 'اسم المستأجر' }} *</label>
            <input v-model="tenantForm.name" required class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.tenant_phone') || 'الهاتف' }}</label>
              <input v-model="tenantForm.phone" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.tenant_email') || 'الإيميل' }}</label>
              <input v-model="tenantForm.email" type="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ $t('unit.tenant_id_number') || 'الرقم المدني/السجل' }}</label>
            <input v-model="tenantForm.id_number" class="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div class="flex justify-between items-center pt-3 border-t">
            <button
              v-if="activeUnit && activeUnit.tenant"
              type="button"
              @click="unassignTenant"
              class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
            >
              {{ $t('unit.unassign_tenant') || 'إلغاء تعيين المستأجر' }}
            </button>
            <div class="flex gap-3 ms-auto">
              <button type="button" @click="closeTenantModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg">
                {{ $t('common.cancel') || 'إلغاء' }}
              </button>
              <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                {{ submitting ? ($t('common.saving') || 'جاري الحفظ...') : ($t('common.save') || 'حفظ') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UnitsManagement',

  data() {
    return {
      units: [],
      loading: false,
      submitting: false,
      showModal: false,
      editingUnit: null,
      form: {
        name: '',
        area: null,
        monthly_rent: null,
        description: '',
        is_active: true,
      },
      showTenantModal: false,
      activeUnit: null,
      tenantForm: {
        name: '',
        phone: '',
        email: '',
        id_number: '',
      },
    }
  },

  computed: {
    floorId() {
      return Number(this.$route.params.floorId)
    },
  },

  mounted() {
    this.loadUnits()
  },

  methods: {
    ...mapActions('units', ['fetchUnitsByFloor', 'createUnit', 'updateUnit', 'deleteUnit']),
    ...mapActions('tenants', ['createTenant', 'updateTenant', 'deleteTenant']),

    async loadUnits() {
      this.loading = true
      try {
        const result = await this.fetchUnitsByFloor(this.floorId)
        this.units = result?.data?.data || result?.data || result || []
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      } finally {
        this.loading = false
      }
    },

    openCreateModal() {
      this.editingUnit = null
      this.form = { name: '', area: null, monthly_rent: null, description: '', is_active: true }
      this.showModal = true
    },

    openEditModal(unit) {
      this.editingUnit = unit
      this.form = {
        name: unit.name,
        area: unit.area,
        monthly_rent: unit.monthly_rent,
        description: unit.description,
        is_active: !!unit.is_active,
      }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    async submitForm() {
      this.submitting = true
      try {
        if (this.editingUnit) {
          await this.updateUnit({ id: this.editingUnit.id, payload: this.form })
          this.$toast?.success(this.$t('unit.updated') || 'تم تحديث الوحدة')
        } else {
          await this.createUnit({ ...this.form, floor_id: this.floorId })
          this.$toast?.success(this.$t('unit.created') || 'تم إنشاء الوحدة')
        }
        this.showModal = false
        await this.loadUnits()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      } finally {
        this.submitting = false
      }
    },

    async toggleActive(unit) {
      try {
        await this.updateUnit({ id: unit.id, payload: { is_active: !unit.is_active } })
        await this.loadUnits()
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      }
    },

    async confirmDelete(unit) {
      const result = await this.$swal?.fire({
        title: this.$t('common.are_you_sure') || 'هل أنت متأكد؟',
        text: unit.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete') || 'حذف',
        cancelButtonText: this.$t('common.cancel') || 'إلغاء',
      })
      if (result && !result.isConfirmed) return

      try {
        await this.deleteUnit(unit.id)
        this.$toast?.success(this.$t('messages.deleteSuccess') || 'تم الحذف بنجاح')
        await this.loadUnits()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      }
    },

    openTenantModal(unit) {
      this.activeUnit = unit
      this.tenantForm = unit.tenant
        ? {
            name: unit.tenant.name,
            phone: unit.tenant.phone,
            email: unit.tenant.email,
            id_number: unit.tenant.id_number,
          }
        : { name: '', phone: '', email: '', id_number: '' }
      this.showTenantModal = true
    },

    closeTenantModal() {
      this.showTenantModal = false
      this.activeUnit = null
    },

    async submitTenant() {
      this.submitting = true
      try {
        if (this.activeUnit.tenant) {
          await this.updateTenant({ id: this.activeUnit.tenant.id, payload: this.tenantForm })
        } else {
          await this.createTenant({ ...this.tenantForm, unit_id: this.activeUnit.id })
        }
        this.$toast?.success(this.$t('unit.tenant_saved') || 'تم حفظ بيانات المستأجر')
        this.showTenantModal = false
        await this.loadUnits()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      } finally {
        this.submitting = false
      }
    },

    async unassignTenant() {
      if (!this.activeUnit?.tenant) return
      try {
        await this.deleteTenant(this.activeUnit.tenant.id)
        this.$toast?.success(this.$t('unit.tenant_unassigned') || 'تم إلغاء تعيين المستأجر')
        this.showTenantModal = false
        await this.loadUnits()
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      }
    },
  },
}
</script>
