<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="closeModal"
  >
    <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
      <!-- Header -->
      <div
        class="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200"
      >
        <div>
          <h2 class="text-xl font-bold text-gray-900">
            {{ isEdit ? $t('contracts.edit') : $t('contracts.add') }}
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            {{ isEdit ? $t('contracts.editDescription') : $t('contracts.addDescription') }}
          </p>
        </div>

        <button
          type="button"
          @click="closeModal"
          class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" />
        </button>
      </div>

      <!-- Loading -->
      <div v-if="initialLoading" class="flex items-center justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>

      <!-- Form -->
      <form v-else class="p-6 space-y-6" @submit.prevent="submit">
        <!-- Tenant & Location -->
        <div>
          <h3 class="mb-4 text-base font-semibold text-gray-900">
            {{ $t('contracts.contractDetails') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Tenant -->
            <div>
              <label class="form-label">
                {{ $t('contracts.tenant') }}
                <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.tenant_id"
                class="form-input"
                :disabled="isEdit || tenantsLoading"
                @change="onTenantChange"
              >
                <option value="">
                  {{ tenantsLoading ? $t('common.loading') : $t('contracts.selectTenant') }}
                </option>

                <option v-for="tenant in tenants" :key="tenant.id" :value="tenant.id">
                  {{ tenant.name }}
                </option>
              </select>

              <p v-if="errors.tenant_id" class="form-error">
                {{ errors.tenant_id }}
              </p>
            </div>

            <!-- Property -->
            <div>
              <label class="form-label">
                {{ $t('contracts.property') }}
                <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.property_id"
                class="form-input"
                :disabled="propertiesLoading"
                @change="onPropertyChange"
              >
                <option value="">
                  {{ propertiesLoading ? $t('common.loading') : $t('contracts.selectProperty') }}
                </option>

                <option v-for="property in properties" :key="property.id" :value="property.id">
                  {{ property.name }}
                </option>
              </select>

              <p v-if="errors.property_id" class="form-error">
                {{ errors.property_id }}
              </p>
            </div>

            <!-- Floor -->
            <div>
              <label class="form-label">
                {{ $t('contracts.floor') }}
                <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.floor_id"
                class="form-input"
                :disabled="!form.property_id || floorsLoading"
                @change="onFloorChange"
              >
                <option value="">
                  {{ floorsLoading ? $t('common.loading') : $t('contracts.selectFloor') }}
                </option>

                <option v-for="floor in floors" :key="floor.id" :value="floor.id">
                  {{ floor.name || `Floor ${floor.floor_number}` }}
                </option>
              </select>

              <p v-if="errors.floor_id" class="form-error">
                {{ errors.floor_id }}
              </p>
            </div>

            <!-- Unit -->
            <div>
              <label class="form-label">
                {{ $t('contracts.unit') }}
                <span class="text-red-500">*</span>
              </label>

              <select
                v-model="form.unit_id"
                class="form-input"
                :disabled="!form.floor_id || unitsLoading"
                @change="onUnitChange"
              >
                <option value="">
                  {{ unitsLoading ? $t('common.loading') : $t('contracts.selectUnit') }}
                </option>

                <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">
                  {{ unit.name }}
                </option>
              </select>

              <p v-if="errors.unit_id" class="form-error">
                {{ errors.unit_id }}
              </p>
            </div>
          </div>
        </div>

        <!-- Contract Period -->
        <div>
          <h3 class="mb-4 text-base font-semibold text-gray-900">
            {{ $t('contracts.contractPeriod') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Start Date -->
            <div>
              <label class="form-label">
                {{ $t('contracts.startDate') }}
                <span class="text-red-500">*</span>
              </label>

              <input
                v-model="form.start_date"
                type="date"
                class="form-input"
                :min="today"
                @change="clearError('start_date')"
              />

              <p v-if="errors.start_date" class="form-error">
                {{ errors.start_date }}
              </p>
            </div>

            <!-- End Date -->
            <div>
              <label class="form-label">
                {{ $t('contracts.endDate') }}
                <span class="text-red-500">*</span>
              </label>

              <input
                v-model="form.end_date"
                type="date"
                class="form-input"
                :min="form.start_date || today"
                @change="clearError('end_date')"
              />

              <p v-if="errors.end_date" class="form-error">
                {{ errors.end_date }}
              </p>
            </div>
          </div>
        </div>

        <!-- Financial Details -->
        <div>
          <h3 class="mb-4 text-base font-semibold text-gray-900">
            {{ $t('contracts.financialDetails') }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Rent -->
            <div>
              <label class="form-label">
                {{ $t('contracts.rentAmount') }}
                <span class="text-red-500">*</span>
              </label>

              <input
                v-model="form.rent_amount"
                type="number"
                min="0"
                step="0.01"
                class="form-input"
                placeholder="0.00"
                @input="clearError('rent_amount')"
              />

              <p v-if="errors.rent_amount" class="form-error">
                {{ errors.rent_amount }}
              </p>
            </div>

            <!-- Frequency -->
            <div>
              <label class="form-label">
                {{ $t('contracts.paymentFrequency') }}
                <span class="text-red-500">*</span>
              </label>

              <select v-model="form.payment_frequency" class="form-input">
                <option value="monthly">
                  {{ $t('contracts.frequency.monthly') }}
                </option>

                <option value="quarterly">
                  {{ $t('contracts.frequency.quarterly') }}
                </option>

                <option value="semi_annual">
                  {{ $t('contracts.frequency.semiAnnual') }}
                </option>

                <option value="annual">
                  {{ $t('contracts.frequency.annual') }}
                </option>
              </select>
            </div>

            <!-- Security Deposit -->
            <div>
              <label class="form-label">
                {{ $t('contracts.securityDeposit') }}
              </label>

              <input
                v-model="form.security_deposit"
                type="number"
                min="0"
                step="0.01"
                class="form-input"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <!-- Status -->
        <div v-if="isEdit">
          <label class="form-label">
            {{ $t('common.status') }}
          </label>

          <select v-model="form.status" class="form-input max-w-md">
            <option value="active">
              {{ $t('contracts.active') }}
            </option>

            <option value="expired">
              {{ $t('contracts.expired') }}
            </option>

            <option value="terminated">
              {{ $t('contracts.terminated') }}
            </option>
          </select>
        </div>

        <!-- Notes -->
        <div>
          <label class="form-label">
            {{ $t('contracts.notes') }}
          </label>

          <textarea
            v-model="form.notes"
            rows="4"
            class="form-input resize-none"
            :placeholder="$t('contracts.notesPlaceholder')"
          ></textarea>
        </div>

        <!-- Form Error -->
        <div
          v-if="formError"
          class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {{ formError }}
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="closeModal"
            class="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            :disabled="saving"
          >
            {{ $t('common.cancel') }}
          </button>

          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
          >
            <font-awesome-icon v-if="saving" :icon="['fas', 'spinner']" spin />

            <font-awesome-icon v-else :icon="['fas', 'save']" />

            {{ saving ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

export default {
  name: 'ContractFormModal',

  components: {
    LoadingSpinner,
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },

    contract: {
      type: Object,
      default: null,
    },

    tenantId: {
      type: [Number, String],
      default: null,
    },

    unitId: {
      type: [Number, String],
      default: null,
    },
  },

  data() {
    return {
      initialLoading: false,
      saving: false,
      formError: null,

      errors: {},

      form: {
        tenant_id: '',
        property_id: '',
        floor_id: '',
        unit_id: '',

        start_date: '',
        end_date: '',

        rent_amount: '',
        payment_frequency: 'monthly',
        security_deposit: '',

        status: 'active',
        notes: '',
      },
    }
  },

  computed: {
    ...mapGetters('tenants', {
      tenants: 'tenants',
      tenantsLoading: 'isLoading',
    }),

    ...mapGetters('properties', {
      properties: 'properties',
      propertiesLoading: 'isLoading',
    }),

    ...mapGetters('floors', {
      floors: 'floors',
      floorsLoading: 'isLoading',
    }),

    ...mapGetters('units', {
      units: 'units',
      unitsLoading: 'isLoading',
    }),

    isEdit() {
      return !!this.contract?.id
    },

    availableUnits() {
      return this.units || []
    },

    today() {
      const date = new Date()

      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
  },

  watch: {
    show: {
      immediate: true,

      async handler(value) {
        if (!value) return

        await this.initializeForm()
      },
    },
  },

  methods: {
    ...mapActions('tenants', ['fetchActiveTenants', 'clearTenants']),

    ...mapActions('properties', ['fetchActiveProperties']),

    ...mapActions('floors', ['fetchFloorsByProperty']),

    ...mapActions('units', ['fetchUnitsByFloor']),

    ...mapActions('contracts', ['createContract', 'updateContract']),

    async initializeForm() {
      this.initialLoading = true
      this.formError = null
      this.errors = {}

      this.resetForm()

      try {
        await Promise.all([this.fetchActiveTenants(), this.fetchActiveProperties()])

        if (this.isEdit) {
          await this.loadEditData()
        } else {
          this.applyCreateDefaults()
        }
      } catch (error) {
        this.handleError(error)
      } finally {
        this.initialLoading = false
      }
    },

    resetForm() {
      this.form = {
        tenant_id: this.tenantId || '',
        property_id: '',
        floor_id: '',
        unit_id: this.unitId || '',

        start_date: '',
        end_date: '',

        rent_amount: '',
        payment_frequency: 'monthly',
        security_deposit: '',

        status: 'active',
        notes: '',
      }
    },

    applyCreateDefaults() {
      if (this.tenantId) {
        this.form.tenant_id = String(this.tenantId)
      }

      if (this.unitId) {
        this.form.unit_id = String(this.unitId)
      }
    },

    async loadEditData() {
      const contract = this.contract

      this.form.tenant_id = contract.tenant_id ? String(contract.tenant_id) : ''

      this.form.unit_id = contract.unit_id ? String(contract.unit_id) : ''

      this.form.start_date = this.formatDate(contract.start_date)
      this.form.end_date = this.formatDate(contract.end_date)

      this.form.rent_amount = contract.rent_amount ?? ''
      this.form.payment_frequency = contract.payment_frequency || 'monthly'

      this.form.security_deposit = contract.security_deposit ?? ''

      this.form.status = contract.status || 'active'

      this.form.notes = contract.notes || ''

      /*
       * Contract response contains:
       *
       * unit.floor.property
       *
       * Therefore we can determine the selected
       * property and floor without another API call.
       */

      const propertyId =
        contract.unit?.floor?.property?.id || contract.unit?.floor?.property_id || null

      const floorId = contract.unit?.floor?.id || contract.unit?.floor_id || null

      if (propertyId) {
        this.form.property_id = String(propertyId)

        await this.fetchFloorsByProperty(propertyId)
      }

      if (floorId) {
        this.form.floor_id = String(floorId)

        await this.fetchUnitsByFloor(floorId)
      }
    },

    async onTenantChange() {
      this.clearError('tenant_id')
    },

    async onPropertyChange() {
      this.form.floor_id = ''
      this.form.unit_id = ''

      this.clearError('property_id')
      this.clearError('floor_id')
      this.clearError('unit_id')

      if (!this.form.property_id) {
        return
      }

      try {
        await this.fetchFloorsByProperty(this.form.property_id)
      } catch (error) {
        this.handleError(error)
      }
    },

    async onFloorChange() {
      this.form.unit_id = ''

      this.clearError('floor_id')
      this.clearError('unit_id')

      if (!this.form.floor_id) {
        return
      }

      try {
        await this.fetchUnitsByFloor(this.form.floor_id)
      } catch (error) {
        this.handleError(error)
      }
    },

    onUnitChange() {
      this.clearError('unit_id')
    },

    validate() {
      this.errors = {}

      if (!this.form.tenant_id) {
        this.errors.tenant_id = this.$t('validation.required')
      }

      if (!this.form.property_id) {
        this.errors.property_id = this.$t('validation.required')
      }

      if (!this.form.floor_id) {
        this.errors.floor_id = this.$t('validation.required')
      }

      if (!this.form.unit_id) {
        this.errors.unit_id = this.$t('validation.required')
      }

      if (!this.form.start_date) {
        this.errors.start_date = this.$t('validation.required')
      }

      if (!this.form.end_date) {
        this.errors.end_date = this.$t('validation.required')
      }

      if (
        this.form.start_date &&
        this.form.end_date &&
        this.form.end_date <= this.form.start_date
      ) {
        this.errors.end_date = this.$t('contracts.endDateAfterStart')
      }

      if (
        this.form.rent_amount === '' ||
        this.form.rent_amount === null ||
        Number(this.form.rent_amount) < 0
      ) {
        this.errors.rent_amount = this.$t('validation.required')
      }

      return Object.keys(this.errors).length === 0
    },

    async submit() {
      this.formError = null

      if (!this.validate()) {
        return
      }

      this.saving = true

      try {
        const payload = {
          tenant_id: Number(this.form.tenant_id),
          unit_id: Number(this.form.unit_id),

          start_date: this.form.start_date,
          end_date: this.form.end_date,

          rent_amount: Number(this.form.rent_amount),

          payment_frequency: this.form.payment_frequency,

          security_deposit:
            this.form.security_deposit === '' ? null : Number(this.form.security_deposit),

          notes: this.form.notes || null,
        }

        if (this.isEdit) {
          payload.status = this.form.status

          await this.updateContract({
            id: this.contract.id,
            payload,
          })
        } else {
          await this.createContract(payload)
        }

        this.$swal.fire({
          icon: 'success',
          title: this.isEdit
            ? this.$t('messages.updateSuccess')
            : this.$t('messages.createSuccess'),
          timer: 1500,
          showConfirmButton: false,
        })

        this.$emit('saved')
      } catch (error) {
        this.handleError(error)
      } finally {
        this.saving = false
      }
    },

    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }

      this.formError = null
    },

    formatDate(value) {
      if (!value) return ''

      if (typeof value === 'string') {
        return value.substring(0, 10)
      }

      return ''
    },

    handleError(error) {
      const response = error?.response

      if (response?.status === 422 && response?.data?.errors) {
        const backendErrors = response.data.errors

        Object.keys(backendErrors).forEach((field) => {
          this.errors[field] = Array.isArray(backendErrors[field])
            ? backendErrors[field][0]
            : backendErrors[field]
        })

        this.formError = response.data.message || this.$t('common.error')

        return
      }

      this.formError = response?.data?.message || error?.message || this.$t('common.error')
    },

    closeModal() {
      if (this.saving) return

      this.$emit('update:show', false)
    },
  },
}
</script>

<style scoped>
.form-label {
  @apply block mb-1.5 text-sm font-medium text-gray-700;
}

.form-input {
  @apply w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed;
}

.form-error {
  @apply mt-1.5 text-xs text-red-600;
}
</style>
