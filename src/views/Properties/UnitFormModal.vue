<template>
  <BaseModal
    :show="show"
    :title="isEdit ? $t('properties.editUnit') : $t('properties.addUnit')"
    @close="onClose"
  >
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700"
          >{{ $t('properties.name') }} *</label
        >
        <input v-model="form.name" type="text" required class="form-input" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
            $t('properties.unitNumber')
          }}</label>
          <input v-model="form.unit_number" type="text" class="form-input" />
        </div>
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
            $t('properties.type')
          }}</label>
          <select v-model="form.type" class="form-input">
            <option value="commercial">{{ $t('properties.commercial') }}</option>
            <option value="residential">{{ $t('properties.residential') }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
          $t('properties.area')
        }}</label>
        <input v-model.number="form.area" type="number" step="0.01" min="0" class="form-input" />
      </div>

      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
          $t('common.notes')
        }}</label>
        <textarea v-model="form.notes" rows="3" class="form-input"></textarea>
      </div>

      <div class="flex gap-6">
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input v-model="form.is_occupied" type="checkbox" class="rounded border-gray-300" />
          {{ $t('properties.occupied') }}
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input v-model="form.is_active" type="checkbox" class="rounded border-gray-300" />
          {{ $t('common.active') }}
        </label>
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>
    </form>

    <template #footer>
      <BaseButton variant="outline" @click="onClose">{{ $t('common.cancel') }}</BaseButton>
      <BaseButton variant="primary" :disabled="saving" @click="submit">
        {{ saving ? $t('common.saving') : $t('common.save') }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script>
import { mapActions } from 'vuex'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'

export default {
  name: 'UnitFormModal',
  components: { BaseModal, BaseButton },

  props: {
    show: { type: Boolean, default: false },
    unit: { type: Object, default: null },
    floorId: { type: [Number, String], required: true },
  },

  emits: ['update:show', 'saved'],

  data() {
    return {
      form: this.emptyForm(),
      saving: false,
      errorMessage: null,
    }
  },

  computed: {
    isEdit() {
      return !!this.unit?.id
    },
  },

  watch: {
    show(val) {
      if (val) {
        this.form = this.unit ? { ...this.emptyForm(), ...this.unit } : this.emptyForm()
        this.errorMessage = null
      }
    },
  },

  methods: {
    ...mapActions('units', ['createUnit', 'updateUnit']),

    emptyForm() {
      return {
        floor_id: this.floorId,
        name: '',
        unit_number: '',
        type: 'commercial',
        area: null,
        is_occupied: false,
        is_active: true,
        notes: '',
      }
    },

    onClose() {
      this.$emit('update:show', false)
    },

    async submit() {
      this.saving = true
      this.errorMessage = null
      try {
        const payload = { ...this.form, floor_id: this.floorId }
        if (this.isEdit) {
          await this.updateUnit({ id: this.unit.id, payload })
        } else {
          await this.createUnit(payload)
        }
        this.$emit('saved')
        this.onClose()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message
      } finally {
        this.saving = false
      }
    },
  },
}
</script>

<style scoped>
.form-input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}
</style>
