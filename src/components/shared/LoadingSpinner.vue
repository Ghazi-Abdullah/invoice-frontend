<template>
  <div :class="spinnerClasses" class="loading-spinner">
    <div class="spinner-circle"></div>
    <span v-if="showText" class="spinner-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'white', 'gray'].includes(value),
    },
    showText: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: 'جاري التحميل...',
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    spinnerClasses() {
      return [
        `spinner-size-${this.size}`,
        `spinner-color-${this.color}`,
        { 'spinner-center': this.center },
      ]
    },
  },
}
</script>

<style scoped>
.loading-spinner {
  @apply inline-flex flex-col items-center justify-center;
}

.spinner-center {
  @apply absolute inset-0 flex items-center justify-center;
}

.spinner-circle {
  @apply animate-spin rounded-full border-2 border-solid border-current border-t-transparent;
}

.spinner-size-sm {
  @apply w-4 h-4;
}

.spinner-size-md {
  @apply w-8 h-8;
}

.spinner-size-lg {
  @apply w-12 h-12;
}

.spinner-size-xl {
  @apply w-16 h-16;
}

.spinner-color-primary {
  @apply text-primary-600;
}

.spinner-color-white {
  @apply text-white;
}

.spinner-color-gray {
  @apply text-gray-400;
}

.spinner-text {
  @apply mt-2 text-sm text-gray-600;
}
</style>
