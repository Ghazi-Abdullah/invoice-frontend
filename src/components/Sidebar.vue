<template>
  <aside
    class="flex h-full w-64 flex-col bg-gray-900 text-gray-100 shadow-xl"
    :class="isRTL ? 'text-right' : 'text-left'"
  >
    <!-- Logo -->
    <div class="flex h-16 items-center px-6 border-b border-gray-800">
      <div class="flex items-center gap-2 font-bold text-xl tracking-tight text-blue-400">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-md"
        >
          <i class="fas fa-file-invoice text-base"></i>
        </div>
        <span>InvoiceAdmin</span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 overflow-y-auto py-6">
      <nav class="space-y-2 px-3">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200"
          :class="
            isActive(item.to)
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
          "
        >
          <i :class="[item.icon, 'text-sm']" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <!-- User + Actions -->
    <div class="border-t border-gray-800 p-4 space-y-3">
      <!-- User Info -->
      <div class="flex items-center gap-3 mb-2 px-2">
        <div
          class="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-md"
        >
          {{ userInitial }}
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold">{{ user?.name }}</span>
          <span class="text-xs font-medium text-blue-400 capitalize">
            {{ user?.roles?.[0]?.name || 'User' }}
          </span>
        </div>
      </div>

      <!-- زر تغيير اللغة -->
      <button
        @click="toggleLanguage"
        class="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-200"
      >
        <i class="fas fa-language text-sm"></i>
        <span>{{ isRTL ? 'English' : 'العربية' }}</span>
      </button>

      <!-- زر تسجيل الخروج -->
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md"
      >
        <i class="fas fa-sign-out-alt text-sm"></i>
        <span>تسجيل الخروج</span>
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',

  data() {
    return {
      navItems: [
        { label: 'Dashboard', to: '/dashboard', icon: 'fas fa-home' },
        { label: 'Invoices', to: '/invoices', icon: 'fas fa-file-invoice' },
        { label: 'Clients', to: '/clients', icon: 'fas fa-users' },
        { label: 'Staff', to: '/users', icon: 'fas fa-briefcase' },
        { label: 'Reports', to: '/reports', icon: 'fas fa-chart-bar' },
        { label: 'Permissions', to: '/permissions', icon: 'fas fa-shield-alt' },
      ],
    }
  },

  computed: {
    user() {
      return this.$store.state.auth.user
    },
    isRTL() {
      return this.$i18n.locale === 'ar'
    },
    userInitial() {
      if (!this.user || !this.user.name) return 'U'
      return this.user.name.charAt(0).toUpperCase()
    },
  },

  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },

    async handleLogout() {
      try {
        await this.$store.dispatch('auth/logout')
        this.$router.push('/login')
      } catch (e) {
        console.error('Logout error:', e)
      }
    },

    toggleLanguage() {
      const newLang = this.isRTL ? 'en' : 'ar'
      this.$i18n.locale = newLang
      localStorage.setItem('currentLang', newLang)
    },
  },
}
</script>
