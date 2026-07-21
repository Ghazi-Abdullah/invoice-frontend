<template>
  <div :class="cardClasses" class="base-card">
    <div v-if="showHeader" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <div v-if="showActions" class="card-actions">
          <slot name="actions"></slot>
        </div>
      </slot>
    </div>

    <div class="card-body">
      <slot></slot>
    </div>

    <div v-if="showFooter" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: {
      type: String,
      default: '',
    },
    shadow: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg', 'xl'].includes(value),
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String,
      default: 'md',
      validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value),
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    cardClasses() {
      return [
        'base-card',
        `card-shadow-${this.shadow}`,
        `card-padding-${this.padding}`,
        { 'card-bordered': this.bordered },
        { 'card-hoverable': this.hoverable },
      ]
    },
  },
}
</script>

<style scoped>
.base-card {
  @apply bg-white dark:bg-slate-800 transition-all duration-200;
}

.card-shadow-none {
  @apply shadow-none;
}
.card-shadow-sm {
  @apply shadow-sm;
}
.card-shadow-md {
  @apply shadow;
}
.card-shadow-lg {
  @apply shadow-lg;
}
.card-shadow-xl {
  @apply shadow-xl;
}

.card-padding-none {
  @apply p-0;
}
.card-padding-sm {
  @apply p-4;
}
.card-padding-md {
  @apply p-6;
}
.card-padding-lg {
  @apply p-8;
}

.card-bordered {
  @apply border border-gray-200 dark:border-slate-700;
}

.card-hoverable:hover {
  @apply shadow-lg transform -translate-y-0.5;
}

.card-header {
  @apply border-b border-gray-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between;
}

.card-title {
  @apply text-lg font-semibold text-gray-900 dark:text-gray-100;
}

.card-actions {
  @apply flex items-center gap-2;
}

.card-body {
  @apply transition-all duration-200;
}

.card-footer {
  @apply border-t border-gray-200 dark:border-slate-700 px-6 py-4;
}

.rtl .card-header {
  @apply flex-row-reverse;
}

.ltr .card-header {
  @apply flex-row;
}
</style>
