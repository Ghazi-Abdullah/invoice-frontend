<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    :type="htmlType"
    class="base-button"
  >
    <span v-if="loading" class="button-loader">
      <font-awesome-icon :icon="['fas', 'spinner']" class="animate-spin" />
    </span>
    <span v-else-if="icon" class="button-icon">
      <font-awesome-icon :icon="icon" />
    </span>
    <span class="button-content">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (value) =>
        ['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost'].includes(
          value,
        ),
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
    },
    icon: {
      type: [String, Array],
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    htmlType: {
      type: String,
      default: 'button',
    },
  },
  computed: {
    buttonClasses() {
      const classes = [
        'base-button',
        `button-${this.type}`,
        `button-${this.size}`,
        { 'button-block': this.block },
        { 'button-rounded': this.rounded },
        { 'button-loading': this.loading },
        { 'button-disabled': this.disabled },
      ]
      return classes
    },
  },
  methods: {
    handleClick(event) {
      if (!this.loading && !this.disabled) {
        this.$emit('click', event)
      }
    },
  },
}
</script>

<style scoped>
.base-button {
  @apply inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.button-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow;
}

.button-secondary {
  @apply bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm hover:shadow;
}

.button-success {
  @apply bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-sm hover:shadow;
}

.button-danger {
  @apply bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm hover:shadow;
}

.button-warning {
  @apply bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-sm hover:shadow;
}

.button-outline {
  @apply border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 bg-transparent;
}

.button-ghost {
  @apply bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border-transparent;
}

.button-sm {
  @apply px-3 py-1.5 text-xs gap-1.5;
}

.button-md {
  @apply px-4 py-2 text-sm gap-2;
}

.button-lg {
  @apply px-6 py-3 text-base gap-2.5;
}

.button-xl {
  @apply px-8 py-4 text-lg gap-3;
}

.button-block {
  @apply w-full;
}

.button-rounded {
  @apply rounded-lg;
}

.button-loading {
  @apply cursor-wait;
}

.button-icon {
  @apply flex items-center justify-center;
}

.button-loader {
  @apply animate-spin;
}

.button-content {
  @apply whitespace-nowrap;
}
</style>
