<template>
  <div v-if="address" class="address-section">
    <div class="address-header">
      <LocationIcon />
      <span class="address-label">{{ $t('clients.address') }}</span>
    </div>
    <p class="address-text">{{ address }}</p>
  </div>
</template>

<script>
import LocationIcon from './icons/LocationIcon.vue'

export default {
  name: 'AddressSection',
  components: {
    LocationIcon,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.address-section {
  @apply mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50;
}

.address-header {
  @apply flex items-center space-x-2 mb-2;
}

.address-label {
  @apply text-sm font-medium text-gray-700;
}

.address-text {
  @apply text-sm text-gray-700 leading-relaxed;
}
</style>
