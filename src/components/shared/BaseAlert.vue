<template>
  <div :class="alertClasses" role="alert">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <font-awesome-icon :icon="iconName" class="h-5 w-5" />
      </div>
      <div class="ml-3 flex-1">
        <h3 v-if="title" class="text-sm font-medium">{{ title }}</h3>
        <div class="mt-2 text-sm">
          <slot>{{ message }}</slot>
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <button
          type="button"
          @click="dismiss"
          class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <span class="sr-only">اغلاق</span>
          <font-awesome-icon :icon="['fas', 'times']" class="h-5 w-5" />
        </button>
      </div>
    </div>
    <div v-if="$slots.actions" class="mt-4">
      <div class="flex space-x-3 space-x-reverse">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseAlert',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
    },
    title: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    dismissible: {
      type: Boolean,
      default: false,
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['dismiss'],
  computed: {
    alertClasses() {
      const baseClasses = 'rounded-lg p-4'
      const typeClasses = {
        success: 'bg-green-50 border border-green-200 text-green-800',
        error: 'bg-red-50 border border-red-200 text-red-800',
        warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border border-blue-200 text-blue-800',
      }
      return `${baseClasses} ${typeClasses[this.type]}`
    },
    iconName() {
      const icons = {
        success: ['fas', 'check-circle'],
        error: ['fas', 'exclamation-circle'],
        warning: ['fas', 'exclamation-triangle'],
        info: ['fas', 'info-circle'],
      }
      return icons[this.type]
    },
  },
  methods: {
    dismiss() {
      this.$emit('dismiss')
    },
  },
}
</script>

<style scoped>
.rtl .ml-3 {
  margin-left: 0;
  margin-right: 0.75rem;
}

.rtl .ml-auto {
  margin-left: 0;
  margin-right: auto;
}

.rtl .pl-3 {
  padding-left: 0;
  padding-right: 0.75rem;
}
</style>
