<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    :type="htmlType"
  >
    <span v-if="loading" class="button-loader">
      <i class="fas fa-spinner animate-spin"></i>
    </span>
    <span v-else-if="icon" class="button-icon">
      <i :class="icon"></i>
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
      type: String,
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
      const baseClasses =
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

      const typeClasses = {
        primary:
          'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-sm hover:shadow',
        secondary:
          'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500 shadow-sm hover:shadow',
        success:
          'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm hover:shadow',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:shadow',
        warning:
          'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 shadow-sm hover:shadow',
        outline:
          'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 bg-transparent',
        ghost:
          'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 border-transparent',
      }[this.type]

      const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2.5',
        xl: 'px-8 py-4 text-lg gap-3',
      }[this.size]

      const blockClass = this.block ? 'w-full' : ''
      const roundedClass = this.rounded ? 'rounded-lg' : ''
      const loadingClass = this.loading ? 'cursor-wait' : ''

      return `${baseClasses} ${typeClasses} ${sizeClasses} ${blockClass} ${roundedClass} ${loadingClass}`
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
