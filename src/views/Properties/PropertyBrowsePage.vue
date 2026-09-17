<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <font-awesome-icon :icon="['fas', 'building']" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('properties.browseTitle') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('properties.browseDescription') }}</p>
              </div>
            </div>
          </div>

          <BaseButton
            v-if="hasPermission('create_property')"
            @click="openPropertyModal(null)"
            variant="primary"
            icon="plus"
          >
            {{ $t('properties.addProperty') }}
          </BaseButton>
        </div>
      </div>

      <!-- Selectors Card -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-100 rounded-lg">
              <font-awesome-icon :icon="['fas', 'filter']" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800">
                {{ $t('properties.selectLocation') }}
              </h2>
            </div>
          </div>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Property Select + Edit/Delete -->
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-700">{{
                $t('properties.property')
              }}</label>
              <div class="flex gap-2">
                <select
                  v-model="selectedPropertyId"
                  @change="onPropertyChange"
                  class="form-input flex-1"
                >
                  <option :value="null">{{ $t('properties.selectProperty') }}</option>
                  <option v-for="p in properties" :key="p.id" :value="p.id">{{ p.name }}</option>
                </select>
                <button
                  v-if="selectedPropertyId && hasPermission('edit_property')"
                  @click="openPropertyModal(selectedProperty)"
                  class="icon-btn"
                  :title="$t('common.edit')"
                >
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button
                  v-if="selectedPropertyId && hasPermission('delete_property')"
                  @click="confirmDeleteProperty"
                  class="icon-btn text-red-600 hover:bg-red-50"
                  :title="$t('common.delete')"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </div>

            <!-- Floor Select + Add/Edit/Delete -->
            <div v-if="selectedPropertyId">
              <label class="block mb-2 text-sm font-medium text-gray-700">{{
                $t('properties.floor')
              }}</label>
              <div class="flex gap-2">
                <select v-model="selectedFloorId" @change="onFloorChange" class="form-input flex-1">
                  <option :value="null">{{ $t('properties.selectFloor') }}</option>
                  <option v-for="f in floors" :key="f.id" :value="f.id">{{ f.name }}</option>
                </select>
                <button
                  v-if="hasPermission('create_floor')"
                  @click="openFloorModal(null)"
                  class="icon-btn text-blue-600 hover:bg-blue-50"
                  :title="$t('properties.addFloor')"
                >
                  <font-awesome-icon :icon="['fas', 'plus']" />
                </button>
                <button
                  v-if="selectedFloorId && hasPermission('edit_floor')"
                  @click="openFloorModal(selectedFloor)"
                  class="icon-btn"
                  :title="$t('common.edit')"
                >
                  <font-awesome-icon :icon="['fas', 'pen']" />
                </button>
                <button
                  v-if="selectedFloorId && hasPermission('delete_floor')"
                  @click="confirmDeleteFloor"
                  class="icon-btn text-red-600 hover:bg-red-50"
                  :title="$t('common.delete')"
                >
                  <font-awesome-icon :icon="['fas', 'trash']" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="text-gray-600 text-lg mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- Units Grid -->
      <div v-else-if="selectedFloorId">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">{{ $t('properties.units') }}</h2>
          <BaseButton
            v-if="hasPermission('create_unit')"
            @click="openUnitModal(null)"
            variant="primary"
            size="sm"
            icon="plus"
          >
            {{ $t('properties.addUnit') }}
          </BaseButton>
        </div>

        <div v-if="units.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="unit in units"
            :key="unit.id"
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              class="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center"
            >
              <h3 class="font-semibold text-gray-800">{{ unit.name }}</h3>
              <StatusBadge :status="unit.is_occupied ? 'paid' : 'draft'">
                {{ unit.is_occupied ? $t('properties.occupied') : $t('properties.vacant') }}
              </StatusBadge>
            </div>

            <div class="p-5 space-y-2">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <font-awesome-icon :icon="['fas', 'hashtag']" class="w-3.5 text-gray-400" />
                <span>{{ unit.unit_number || $t('common.notAvailable') }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <font-awesome-icon :icon="['fas', 'layer-group']" class="w-3.5 text-gray-400" />
                <span>{{
                  unit.type === 'residential'
                    ? $t('properties.residential')
                    : $t('properties.commercial')
                }}</span>
              </div>
              <div v-if="unit.area" class="flex items-center gap-2 text-sm text-gray-600">
                <font-awesome-icon :icon="['fas', 'ruler-combined']" class="w-3.5 text-gray-400" />
                <span>{{ unit.area }} {{ $t('properties.sqm') }}</span>
              </div>
            </div>

            <div class="px-5 pb-3 pt-3 border-t border-gray-100">
              <p class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                {{ $t('properties.tenant') }}
              </p>
              <div v-if="unit.tenants && unit.tenants.length">
                <div
                  v-for="tenant in unit.tenants"
                  :key="tenant.id"
                  class="flex items-center gap-2 text-sm text-gray-800"
                >
                  <font-awesome-icon :icon="['fas', 'user']" class="w-3.5 text-blue-500" />
                  <span>{{ tenant.name }}</span>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400">{{ $t('properties.noTenant') }}</p>
            </div>

            <div class="px-5 py-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                v-if="hasPermission('edit_unit')"
                @click="openUnitModal(unit)"
                class="icon-btn"
                :title="$t('common.edit')"
              >
                <font-awesome-icon :icon="['fas', 'pen']" />
              </button>
              <button
                v-if="hasPermission('delete_unit')"
                @click="confirmDeleteUnit(unit)"
                class="icon-btn text-red-600 hover:bg-red-50"
                :title="$t('common.delete')"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
          </div>
        </div>

        <BaseAlert
          v-else
          type="info"
          :title="$t('properties.noUnitsTitle')"
          :message="$t('properties.noUnitsMessage')"
        />
      </div>

      <BaseAlert
        v-else-if="selectedPropertyId"
        type="info"
        :title="$t('properties.selectFloorPrompt')"
        :message="$t('properties.selectFloorPromptMessage')"
      />
    </div>

    <!-- Modals -->
    <PropertyFormModal
      :show="showPropertyModal"
      :property="editingProperty"
      @update:show="showPropertyModal = $event"
      @saved="onPropertySaved"
    />

    <FloorFormModal
      v-if="selectedPropertyId"
      :show="showFloorModal"
      :floor="editingFloor"
      :property-id="selectedPropertyId"
      @update:show="showFloorModal = $event"
      @saved="onFloorSaved"
    />

    <UnitFormModal
      v-if="selectedFloorId"
      :show="showUnitModal"
      :unit="editingUnit"
      :floor-id="selectedFloorId"
      @update:show="showUnitModal = $event"
      @saved="onUnitSaved"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BaseButton from '@/components/shared/BaseButton.vue'
import BaseAlert from '@/components/shared/BaseAlert.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import PropertyFormModal from './PropertyFormModal.vue'
import FloorFormModal from './FloorFormModal.vue'
import UnitFormModal from './UnitFormModal.vue'

export default {
  name: 'PropertyBrowsePage',
  components: {
    BaseButton,
    BaseAlert,
    StatusBadge,
    LoadingSpinner,
    PropertyFormModal,
    FloorFormModal,
    UnitFormModal,
  },

  data() {
    return {
      selectedPropertyId: null,
      selectedFloorId: null,

      showPropertyModal: false,
      editingProperty: null,

      showFloorModal: false,
      editingFloor: null,

      showUnitModal: false,
      editingUnit: null,
    }
  },

  computed: {
    ...mapGetters('properties', { properties: 'properties' }),
    ...mapGetters('floors', { floors: 'floors' }),
    ...mapGetters('units', { units: 'units' }),
    isLoading() {
      return this.$store.getters['floors/isLoading'] || this.$store.getters['units/isLoading']
    },
    selectedProperty() {
      return this.properties.find((p) => p.id == this.selectedPropertyId) || null
    },
    selectedFloor() {
      return this.floors.find((f) => f.id == this.selectedFloorId) || null
    },
  },

  async mounted() {
    await this.fetchActiveProperties()
  },

  methods: {
    ...mapActions('properties', ['fetchActiveProperties', 'deleteProperty']),
    ...mapActions('floors', ['fetchFloorsByProperty', 'deleteFloor']),
    ...mapActions('units', ['fetchUnitsByFloor', 'deleteUnit']),

    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },

    async onPropertyChange() {
      this.selectedFloorId = null
      this.$store.commit('units/CLEAR_UNITS')
      await this.fetchFloorsByProperty(this.selectedPropertyId)
    },

    async onFloorChange() {
      await this.fetchUnitsByFloor(this.selectedFloorId)
    },

    // Property CRUD
    openPropertyModal(property) {
      this.editingProperty = property
      this.showPropertyModal = true
    },
    async onPropertySaved() {
      this.$toast?.success(this.$t('messages.saveSuccess'))
    },
    // Property delete
    async confirmDeleteProperty() {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: this.$t('common.confirm'),
        text: this.$t('properties.deletePropertyConfirm', { name: this.selectedProperty?.name }),
        showCancelButton: true,
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonColor: '#dc2626',
      })

      if (!result.isConfirmed) return

      try {
        await this.deleteProperty(this.selectedPropertyId)
        this.selectedPropertyId = null
        this.selectedFloorId = null
        this.$store.commit('floors/CLEAR_FLOORS')
        this.$store.commit('units/CLEAR_UNITS')
        this.$swal?.fire({
          icon: 'success',
          title: this.$t('messages.deleteSuccess'),
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error('Error deleting property:', error)
        this.$swal?.fire({
          icon: 'error',
          title: this.$t('common.error'),
          text: error.message,
        })
      }
    },

    // Floor CRUD
    openFloorModal(floor) {
      this.editingFloor = floor
      this.showFloorModal = true
    },
    async onFloorSaved() {
      await this.fetchFloorsByProperty(this.selectedPropertyId)
    },
    // Floor delete
    async confirmDeleteFloor() {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: this.$t('common.confirm'),
        text: this.$t('properties.deleteFloorConfirm', { name: this.selectedFloor?.name }),
        showCancelButton: true,
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonColor: '#dc2626',
      })

      if (!result.isConfirmed) return

      try {
        await this.deleteFloor(this.selectedFloorId)
        this.selectedFloorId = null
        this.$store.commit('units/CLEAR_UNITS')
        this.$swal?.fire({
          icon: 'success',
          title: this.$t('messages.deleteSuccess'),
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error('Error deleting floor:', error)
        this.$swal?.fire({
          icon: 'error',
          title: this.$t('common.error'),
          text: error.message,
        })
      }
    },

    // Unit CRUD
    openUnitModal(unit) {
      this.editingUnit = unit
      this.showUnitModal = true
    },
    async onUnitSaved() {
      await this.fetchUnitsByFloor(this.selectedFloorId)
    },
    // Unit delete
    async confirmDeleteUnit(unit) {
      const result = await this.$swal.fire({
        icon: 'warning',
        title: this.$t('common.confirm'),
        text: this.$t('properties.deleteUnitConfirm', { name: unit.name }),
        showCancelButton: true,
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonColor: '#dc2626',
      })

      if (!result.isConfirmed) return

      try {
        await this.deleteUnit(unit.id)
        this.$swal?.fire({
          icon: 'success',
          title: this.$t('messages.deleteSuccess'),
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error('Error deleting unit:', error)
        this.$swal?.fire({
          icon: 'error',
          title: this.$t('common.error'),
          text: error.message,
        })
      }
    },
  },
}
</script>

<style scoped>
.form-input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}
.icon-btn {
  @apply w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0;
}
</style>
