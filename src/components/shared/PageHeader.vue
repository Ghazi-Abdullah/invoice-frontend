<template>
  <div :class="headerClasses" class="page-header">
    <div class="header-content">
      <div class="header-left">
        <h1 class="page-title">{{ title }}</h1>
        <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>

        <!-- Breadcrumbs -->
        <nav v-if="breadcrumbs && breadcrumbs.length > 0" class="breadcrumbs">
          <ol class="breadcrumb-list">
            <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
              <router-link v-if="crumb.to" :to="crumb.to" class="breadcrumb-link">
                {{ crumb.text }}
              </router-link>
              <span v-else class="breadcrumb-text">
                {{ crumb.text }}
              </span>
              <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator"> / </span>
            </li>
          </ol>
        </nav>
      </div>

      <div v-if="$slots.actions || actions.length > 0" class="header-actions">
        <slot name="actions">
          <div class="actions-container">
            <BaseButton
              v-for="(action, index) in actions"
              :key="index"
              :type="action.type || 'primary'"
              :size="action.size || 'md'"
              :icon="action.icon"
              :loading="action.loading"
              :disabled="action.disabled"
              @click="action.onClick"
            >
              {{ action.text }}
            </BaseButton>
          </div>
        </slot>
      </div>
    </div>

    <!-- Stats Row -->
    <div v-if="stats && stats.length > 0" class="header-stats">
      <div class="stats-grid">
        <div v-for="(stat, index) in stats" :key="index" class="stat-card">
          <div class="stat-icon" :style="{ backgroundColor: stat.color + '20' }">
            <font-awesome-icon :icon="stat.icon" :style="{ color: stat.color }" />
          </div>
          <div class="stat-content">
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
            <p v-if="stat.change" :class="['stat-change', stat.change.type]">
              {{ stat.change.value }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue'

export default {
  name: 'PageHeader',
  components: {
    BaseButton,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    breadcrumbs: {
      type: Array,
      default: () => [],
    },
    actions: {
      type: Array,
      default: () => [],
    },
    stats: {
      type: Array,
      default: () => [],
    },
    showBorder: {
      type: Boolean,
      default: true,
    },
    showBackground: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    headerClasses() {
      return [
        'page-header',
        { 'with-border': this.showBorder },
        { 'with-background': this.showBackground },
      ]
    },
  },
}
</script>

<style scoped>
.page-header {
  @apply mb-8;
}

.with-border {
  @apply pb-6 border-b border-gray-200;
}

.with-background {
  @apply bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl shadow-sm;
}

.header-content {
  @apply flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6;
}

.header-left {
  @apply flex-1;
}

.page-title {
  @apply text-2xl md:text-3xl font-bold text-gray-900 mb-2;
}

.page-subtitle {
  @apply text-gray-600 text-sm md:text-base;
}

.breadcrumbs {
  @apply mt-4;
}

.breadcrumb-list {
  @apply flex items-center flex-wrap gap-2;
}

.breadcrumb-item {
  @apply flex items-center;
}

.breadcrumb-link {
  @apply text-sm text-gray-500 hover:text-gray-700 transition-colors;
}

.breadcrumb-text {
  @apply text-sm text-gray-900 font-medium;
}

.breadcrumb-separator {
  @apply text-gray-400 mx-2;
}

.header-actions {
  @apply flex flex-wrap gap-2;
}

.actions-container {
  @apply flex flex-wrap gap-2;
}

.header-stats {
  @apply mt-6;
}

.stats-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
}

.stat-card {
  @apply bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm hover:shadow transition-shadow;
}

.stat-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center;
}

.stat-content {
  @apply flex-1;
}

.stat-label {
  @apply text-sm text-gray-500 mb-1;
}

.stat-value {
  @apply text-2xl font-bold text-gray-900;
}

.stat-change {
  @apply text-xs font-medium mt-1;
}

.stat-change.positive {
  @apply text-green-600;
}

.stat-change.negative {
  @apply text-red-600;
}

.rtl .stat-card {
  @apply flex-row-reverse;
}
</style>
