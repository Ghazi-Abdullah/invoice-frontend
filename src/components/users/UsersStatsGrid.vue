<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div class="stats-card bg-gradient-to-br from-blue-50 to-blue-100">
      <div class="stats-icon bg-blue-100">
        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"
          />
        </svg>
      </div>
      <div>
        <p class="stats-label">{{ $t('users.total_users') }}</p>
        <p class="stats-value">{{ totalUsers }}</p>
      </div>
    </div>

    <div class="stats-card bg-gradient-to-br from-green-50 to-green-100">
      <div class="stats-icon bg-green-100">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p class="stats-label">{{ $t('users.active_users') }}</p>
        <p class="stats-value">{{ activeUsers }}</p>
      </div>
    </div>

    <div class="stats-card bg-gradient-to-br from-red-50 to-red-100">
      <div class="stats-icon bg-red-100">
        <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636"
          />
        </svg>
      </div>
      <div>
        <p class="stats-label">{{ $t('users.inactive_users') }}</p>
        <p class="stats-value">{{ inactiveUsers }}</p>
      </div>
    </div>

    <div class="stats-card bg-gradient-to-br from-purple-50 to-purple-100">
      <div class="stats-icon bg-purple-100">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <div>
        <p class="stats-label">{{ $t('users.total_groups') }}</p>
        <p class="stats-value">{{ totalGroups }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UsersStatsGrid',

  props: {
    totalUsers: {
      type: Number,
      default: 0,
    },
    activeUsers: {
      type: Number,
      default: 0,
    },
    inactiveUsers: {
      type: Number,
      default: 0,
    },
    totalGroups: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style scoped>
.stats-card {
  @apply rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300;
}
.stats-icon {
  @apply p-3 rounded-lg w-fit mb-3;
}
.stats-label {
  @apply text-sm font-medium text-gray-500 mb-1;
}
.stats-value {
  @apply text-2xl font-bold text-gray-900;
}
</style>
