<template>
  <BaseModal
    :show="show"
    :title="isEdit ? $t('properties.editFloor') : $t('properties.addFloor')"
    @close="onClose"
  >
    <form @submit.prevent="submit" class="space-y-4">
      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700"
          >{{ $t('properties.name') }} *</label
        >
        <input v-model="form.name" type="text" required class="form-input" />
      </div>

      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
          $t('properties.nameEn')
        }}</label>
        <input v-model="form.name_en" type="text" class="form-input" />
      </div>

      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
          $t('properties.floorNumber')
        }}</label>
        <input v-model.number="form.floor_number" type="number" class="form-input" />
      </div>

      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
          $t('common.description')
        }}</label>
        <textarea v-model="form.description" rows="3" class="form-input"></textarea>
      </div>

      <label class="flex items-center gap-2 text-sm text-gray-700">
        <input v-model="form.is_active" type="checkbox" class="rounded border-gray-300" />
        {{ $t('common.active') }}
      </label>

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
  name: 'FloorFormModal',
  components: { BaseModal, BaseButton },

  props: {
    show: { type: Boolean, default: false },
    floor: { type: Object, default: null },
    propertyId: { type: [Number, String], required: true },
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
      return !!this.floor?.id
    },
  },

  watch: {
    show(val) {
      if (val) {
        this.form = this.floor ? { ...this.emptyForm(), ...this.floor } : this.emptyForm()
        this.errorMessage = null
      }
    },
  },

  methods: {
    ...mapActions('floors', ['createFloor', 'updateFloor']),

    emptyForm() {
      return {
        property_id: this.propertyId,
        name: '',
        name_en: '',
        floor_number: null,
        description: '',
        is_active: true,
      }
    },

    onClose() {
      this.$emit('update:show', false)
    },

    async submit() {
      this.saving = true
      this.errorMessage = null
      try {
        const payload = { ...this.form, property_id: this.propertyId }
        if (this.isEdit) {
          await this.updateFloor({ id: this.floor.id, payload })
        } else {
          await this.createFloor(payload)
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
