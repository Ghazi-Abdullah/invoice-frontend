<template>
  <BaseModal
    :show="show"
    :title="isEdit ? $t('properties.editProperty') : $t('properties.addProperty')"
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

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
            $t('properties.code')
          }}</label>
          <input v-model="form.code" type="text" class="form-input" />
        </div>
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
            $t('properties.totalFloors')
          }}</label>
          <input v-model.number="form.total_floors" type="number" min="0" class="form-input" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
            $t('properties.city')
          }}</label>
          <input v-model="form.city" type="text" class="form-input" />
        </div>
        <div>
          <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
            $t('properties.address')
          }}</label>
          <input v-model="form.address" type="text" class="form-input" />
        </div>
      </div>

      <div>
        <label class="block mb-1.5 text-sm font-medium text-gray-700">{{
          $t('common.notes')
        }}</label>
        <textarea v-model="form.notes" rows="3" class="form-input"></textarea>
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
  name: 'PropertyFormModal',
  components: { BaseModal, BaseButton },

  props: {
    show: { type: Boolean, default: false },
    property: { type: Object, default: null },
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
      return !!this.property?.id
    },
  },

  watch: {
    show(val) {
      if (val) {
        this.form = this.property ? { ...this.emptyForm(), ...this.property } : this.emptyForm()
        this.errorMessage = null
      }
    },
  },

  methods: {
    ...mapActions('properties', ['createProperty', 'updateProperty']),

    emptyForm() {
      return {
        name: '',
        name_en: '',
        code: '',
        address: '',
        city: '',
        total_floors: null,
        notes: '',
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
        if (this.isEdit) {
          await this.updateProperty({ id: this.property.id, payload: this.form })
        } else {
          await this.createProperty(this.form)
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
