<template>
  <div class="relative" ref="bellRef">
    <button
      @click="toggle"
      class="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
      :class="{ 'animate-wiggle': hasNew }"
    >
      <svg
        class="w-6 h-6 text-gray-600"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>

      <span v-if="totalCount > 0" class="absolute -top-1 -end-1 flex h-[18px] min-w-[18px]">
        <span
          v-if="hasNew"
          class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"
        />
        <span
          class="relative inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm"
        >
          {{ totalCount > 99 ? '99+' : totalCount }}
        </span>
      </span>
    </button>

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 scale-95 -translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute top-11 z-50 w-80 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 border border-gray-100 overflow-hidden"
        :class="isRtl ? 'right-0' : 'left-0'"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span class="text-sm font-semibold text-gray-800">
            {{ $t('notifications.title', 'Notifications') }}
          </span>
          <span
            v-if="totalCount > 0"
            class="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full"
          >
            {{ totalCount }}
          </span>
        </div>

        <!-- لا إشعارات -->
        <div v-if="totalCount === 0" class="flex items-center gap-3 px-4 py-5">
          <span
            class="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 text-gray-300 shrink-0"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span class="flex-1 min-w-0">
            <span class="block text-sm font-medium text-gray-600">
              {{ $t('notifications.all_good', 'All is well') }}
            </span>
            <span class="block text-xs text-gray-400 mt-0.5">
              {{ $t('notifications.no_invoices', 'No invoices need your attention') }}
            </span>
          </span>
        </div>

        <!-- الإشعارات -->
        <div v-else class="divide-y divide-gray-100">
          <!-- فواتير غير مدفوعة -->
          <button
            v-if="unpaidCount > 0"
            @click="goTo('invoices', { status: 'unpaid' })"
            class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <span class="flex items-center gap-3 min-w-0">
              <span
                class="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors shrink-0"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </span>
              <span class="text-sm font-medium text-gray-800 truncate">
                {{ $t('notifications.unpaid_invoices', 'Unpaid Invoices') }}
              </span>
            </span>
            <span
              class="shrink-0 flex items-center justify-center min-w-[24px] h-6 px-1 text-xs font-bold text-amber-700 bg-amber-100 rounded-full"
            >
              {{ unpaidCount }}
            </span>
          </button>

          <!-- فواتير متأخرة -->
          <button
            v-if="overdueCount > 0"
            @click="goTo('invoices', { status: 'overdue' })"
            class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <span class="flex items-center gap-3 min-w-0">
              <span
                class="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors shrink-0"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <span class="text-sm font-medium text-gray-800 truncate">
                {{ $t('notifications.overdue_invoices', 'Overdue Invoices') }}
              </span>
            </span>
            <span
              class="shrink-0 flex items-center justify-center min-w-[24px] h-6 px-1 text-xs font-bold text-red-700 bg-red-100 rounded-full"
            >
              {{ overdueCount }}
            </span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'InvoiceNotificationBell',
  data() {
    return { open: false }
  },
  computed: {
    ...mapGetters({
      unpaidCount: 'invoiceNotifications/unpaidCount',
      overdueCount: 'invoiceNotifications/overdueCount',
      totalCount: 'invoiceNotifications/totalCount',
      hasNew: 'invoiceNotifications/hasNew',
    }),
    isRtl() {
      return this.$i18n.locale === 'ar'
    },
  },
  methods: {
    toggle() {
      this.open = !this.open
      if (!this.open) this.$store.commit('invoiceNotifications/CLEAR_NEW')
    },
    goTo(routeName, query = {}) {
      this.open = false
      this.$router.push({ name: routeName, query })
    },
    handleClickOutside(e) {
      if (this.$refs.bellRef && !this.$refs.bellRef.contains(e.target)) this.open = false
    },
    handleEscape(e) {
      if (e.key === 'Escape') this.open = false
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    document.addEventListener('keydown', this.handleEscape)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('keydown', this.handleEscape)
  },
}
</script>

<style scoped>
@keyframes wiggle {
  0%,
  100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}
.animate-wiggle {
  animation: wiggle 0.5s ease-in-out 2;
}
@media (prefers-reduced-motion: reduce) {
  .animate-wiggle,
  .animate-ping {
    animation: none !important;
  }
}
</style>
