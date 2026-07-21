<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <div
        v-if="$slots.prefix || prefixIcon"
        class="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none"
      >
        <slot name="prefix">
          <font-awesome-icon v-if="prefixIcon" :icon="prefixIcon" class="text-gray-400" />
        </slot>
      </div>

      <div
        v-if="$slots.suffix || suffixIcon"
        class="absolute inset-y-0 end-0 pe-3 flex items-center"
      >
        <slot name="suffix">
          <font-awesome-icon v-if="suffixIcon" :icon="suffixIcon" class="text-gray-400" />
        </slot>
      </div>
    </div>

    <div v-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </div>

    <div v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    prefixIcon: {
      type: [String, Array],
      default: null,
    },
    suffixIcon: {
      type: [String, Array],
      default: null,
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
  },
  emits: ['update:modelValue', 'input', 'change', 'blur', 'focus'],
  computed: {
    inputClasses() {
      const baseClasses =
        'form-input block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200'
      const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5',
        lg: 'px-4 py-3 text-lg',
      }
      const errorClass = this.error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
      const prefixClass = this.prefixIcon || this.$slots.prefix ? 'ps-10' : ''
      const suffixClass = this.suffixIcon || this.$slots.suffix ? 'pe-10' : ''

      return `${baseClasses} ${sizeClasses[this.size]} ${errorClass} ${prefixClass} ${suffixClass}`
    },
  },
  methods: {
    handleInput(event) {
      this.$emit('update:modelValue', event.target.value)
      this.$emit('input', event)
    },
    handleChange(event) {
      this.$emit('change', event)
    },
    handleBlur(event) {
      this.$emit('blur', event)
    },
    handleFocus(event) {
      this.$emit('focus', event)
    },
  },
}
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2;
}

.form-input {
  @apply w-full border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.form-input:disabled {
  @apply bg-gray-100 dark:bg-slate-900 cursor-not-allowed text-gray-400;
}

.form-input:read-only {
  @apply bg-gray-50 dark:bg-slate-900/50 cursor-not-allowed;
}

.rtl .pl-10 {
  padding-left: 0;
  padding-right: 2.5rem;
}

.rtl .pr-10 {
  padding-right: 0;
  padding-left: 2.5rem;
}

.rtl .left-0 {
  left: auto;
  right: 0;
}

.rtl .right-0 {
  right: auto;
  left: 0;
}
</style>
