<template>
  <div class="info-item">
    <div class="info-icon">
      <component :is="icon" />
    </div>
    <div class="info-content">
      <p class="info-label">{{ label }}</p>
      <p class="info-value">
        {{ value || (fallback ? $t(fallback) : '-') }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoItem',
  props: {
    icon: {
      type: Object,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    fallback: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.info-item {
  @apply flex items-center space-x-3;
}

.info-icon {
  @apply p-2 bg-gray-50 rounded-lg;
}

.info-content {
  @apply min-w-0 flex-1;
}

.info-label {
  @apply text-sm text-gray-500;
}

.info-value {
  @apply text-gray-900 font-medium truncate;
}
</style>
