<template>
  <span :class="badgeClasses" class="base-badge">
    <span v-if="showDot" class="badge-dot"></span>
    <slot>{{ label }}</slot>
  </span>
</template>

<script>
export default {
  name: 'BaseBadge',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (value) =>
        ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value),
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value),
    },
    label: {
      type: String,
      default: '',
    },
    showDot: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    badgeClasses() {
      return [
        'base-badge',
        `badge-${this.type}`,
        `badge-${this.size}`,
        { 'badge-rounded': this.rounded },
        { 'badge-with-dot': this.showDot },
      ]
    },
  },
}
</script>

<style scoped>
.base-badge {
  @apply inline-flex items-center font-medium;
}

.badge-default {
  @apply bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-300;
}

.badge-primary {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400;
}

.badge-success {
  @apply bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400;
}

.badge-danger {
  @apply bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400;
}

.badge-info {
  @apply bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400;
}

.badge-sm {
  @apply px-2 py-0.5 text-xs gap-1;
}

.badge-md {
  @apply px-3 py-1 text-sm gap-1.5;
}

.badge-lg {
  @apply px-4 py-1.5 text-base gap-2;
}

.badge-rounded {
  @apply rounded-full;
}

.badge-dot {
  @apply w-2 h-2 rounded-full;
}

.badge-default .badge-dot {
  @apply bg-gray-500;
}

.badge-primary .badge-dot {
  @apply bg-blue-500;
}

.badge-success .badge-dot {
  @apply bg-green-500;
}

.badge-warning .badge-dot {
  @apply bg-yellow-500;
}

.badge-danger .badge-dot {
  @apply bg-red-500;
}

.badge-info .badge-dot {
  @apply bg-indigo-500;
}
</style>
