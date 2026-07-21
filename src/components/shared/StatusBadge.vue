<template>
  <span :class="badgeClasses" class="status-badge">
    <span class="badge-dot"></span>
    {{ statusText }}
  </span>
</template>

<script>
export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => ['draft', 'sent', 'paid', 'overdue'].includes(value),
    },
  },
  computed: {
    badgeClasses() {
      return `status-${this.status}`
    },
    statusText() {
      const texts = {
        draft: 'مسودة',
        sent: 'مرسلة',
        paid: 'مدفوعة',
        overdue: 'متأخرة',
      }
      return texts[this.status] || this.status
    },
  },
}
</script>

<style scoped>
.status-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold gap-2;
}

.badge-dot {
  @apply w-2 h-2 rounded-full;
}

.status-draft {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400;
}

.status-draft .badge-dot {
  @apply bg-yellow-500;
}

.status-sent {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400;
}

.status-sent .badge-dot {
  @apply bg-blue-500;
}

.status-paid {
  @apply bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400;
}

.status-paid .badge-dot {
  @apply bg-green-500;
}

.status-overdue {
  @apply bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400;
}

.status-overdue .badge-dot {
  @apply bg-red-500;
}
</style>
