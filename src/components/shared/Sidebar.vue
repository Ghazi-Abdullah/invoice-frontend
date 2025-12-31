<template>
  <aside
    class="fixed lg:static h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-40 transition-all duration-300"
    :class="{
      '-translate-x-full lg:translate-x-0': !isMobileOpen,
      'w-20': isCollapsed,
      open: isMobileOpen,
    }"
    ref="sidebarEl"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-4 border-b border-gray-700">
      <router-link
        to="/dashboard"
        class="flex items-center space-x-3 hover:opacity-80 transition-opacity"
        :class="{ 'justify-center w-full': isCollapsed }"
      >
        <div
          class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center"
        >
          <i class="fas fa-file-invoice text-white text-lg"></i>
        </div>
        <div v-if="!isCollapsed" class="flex flex-col">
          <span class="font-bold text-lg">{{ $t('app.name') }}</span>
          <span class="text-xs text-blue-300">v2.0</span>
        </div>
      </router-link>
    </div>

    <!-- User Profile -->
    <div v-if="!isCollapsed && user" class="px-4 py-6 border-b border-gray-700">
      <div class="flex items-center space-x-3">
        <div
          class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
        >
          {{ getUserInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-semibold truncate">{{ user.name }}</p>
          <p class="text-sm text-gray-300 truncate">{{ user.email }}</p>
          <p class="text-xs text-blue-300 mt-1">
            {{ userRole }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <div class="px-4 mb-4" v-if="!isCollapsed">
        <h3 class="text-xs uppercase text-gray-500 font-semibold tracking-wider">
          {{ $t('common.navigation') }}
        </h3>
      </div>

      <ul class="space-y-1 px-2">
        <!-- Dashboard -->
        <li v-if="hasPermission('view_dashboard')">
          <router-link
            to="/dashboard"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
            :class="
              isActive('/dashboard') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            "
            :title="isCollapsed ? $t('nav.dashboard') : ''"
            @click="closeMobileSidebar"
          >
            <i class="fas fa-tachometer-alt w-5 text-center"></i>
            <span v-if="!isCollapsed" class="flex-1">{{ $t('nav.dashboard') }}</span>
          </router-link>
        </li>

        <!-- Invoices -->
        <li v-if="hasPermission('view_invoices')">
          <router-link
            to="/invoices"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
            :class="
              isActive('/invoices') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            "
            :title="isCollapsed ? $t('nav.invoices') : ''"
            @click="closeMobileSidebar"
          >
            <i class="fas fa-file-invoice-dollar w-5 text-center"></i>
            <span v-if="!isCollapsed" class="flex-1">{{ $t('nav.invoices') }}</span>
            <span
              v-if="!isCollapsed && pendingInvoices > 0"
              class="px-2 py-1 text-xs bg-yellow-500 text-white rounded-full"
            >
              {{ pendingInvoices }}
            </span>
          </router-link>
        </li>

        <!-- Clients -->
        <li v-if="hasPermission('view_clients')">
          <router-link
            to="/clients"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
            :class="
              isActive('/clients') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            "
            :title="isCollapsed ? $t('nav.clients') : ''"
            @click="closeMobileSidebar"
          >
            <i class="fas fa-users w-5 text-center"></i>
            <span v-if="!isCollapsed" class="flex-1">{{ $t('nav.clients') }}</span>
          </router-link>
        </li>

        <!-- Reports -->
        <li v-if="hasPermission('view_reports')">
          <router-link
            to="/reports"
            class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
            :class="
              isActive('/reports') ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
            "
            :title="isCollapsed ? $t('nav.reports') : ''"
            @click="closeMobileSidebar"
          >
            <i class="fas fa-chart-line w-5 text-center"></i>
            <span v-if="!isCollapsed" class="flex-1">{{ $t('nav.reports') }}</span>
          </router-link>
        </li>

        <!-- Admin Section -->
        <template v-if="isAdmin && !isCollapsed">
          <div class="px-4 pt-6 pb-2">
            <h3 class="text-xs uppercase text-gray-500 font-semibold tracking-wider">
              {{ $t('admin.section_title') }}
            </h3>
          </div>

          <!-- Users -->
          <li>
            <router-link
              to="/users"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
              :class="
                isActive('/users') ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              "
              @click="closeMobileSidebar"
            >
              <i class="fas fa-user-shield w-5 text-center"></i>
              <span class="flex-1">{{ $t('nav.users') }}</span>
            </router-link>
          </li>

          <!-- Groups -->
          <li>
            <router-link
              to="/admin/groups"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
              :class="
                isActive('/admin/groups')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              "
              @click="closeMobileSidebar"
            >
              <i class="fas fa-users-cog w-5 text-center"></i>
              <span class="flex-1">{{ $t('adminGroups.title') }}</span>
            </router-link>
          </li>

          <!-- Permissions -->
          <li>
            <router-link
              to="/permissions"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
              :class="
                isActive('/permissions')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              "
              @click="closeMobileSidebar"
            >
              <i class="fas fa-shield-alt w-5 text-center"></i>
              <span class="flex-1">{{ $t('nav.permissions') }}</span>
            </router-link>
          </li>

          <!-- Assign Permissions -->
          <li>
            <router-link
              to="/admin/assign-permissions"
              class="flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors"
              :class="
                isActive('/admin/assign-permissions')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              "
              @click="closeMobileSidebar"
            >
              <i class="fas fa-key w-5 text-center"></i>
              <span class="flex-1">تعيين الصلاحيات</span>
            </router-link>
          </li>
        </template>
      </ul>
    </nav>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-gray-700">
      <!-- Language Toggle -->
      <button
        @click="toggleLanguage"
        class="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        :title="isCollapsed ? $t('buttons.toggle_language') : ''"
      >
        <i class="fas fa-language w-5 text-center"></i>
        <span v-if="!isCollapsed" class="flex-1">
          {{ isRTL ? 'English' : 'العربية' }}
        </span>
      </button>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-red-300 hover:bg-red-600/10 transition-colors mt-2"
        :title="isCollapsed ? $t('auth.logout') : ''"
      >
        <i class="fas fa-sign-out-alt w-5 text-center"></i>
        <span v-if="!isCollapsed" class="flex-1">{{ $t('auth.logout') }}</span>
      </button>

      <!-- Collapse Toggle -->
      <button
        v-if="!isCollapsed"
        @click="toggleCollapse"
        class="hidden lg:flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors mt-2"
      >
        <i class="fas fa-chevron-left w-5 text-center"></i>
        <span class="flex-1 text-left">{{ $t('buttons.collapse') }}</span>
      </button>

      <!-- Version Info -->
      <div v-if="!isCollapsed" class="pt-4 mt-4 border-t border-gray-700">
        <p class="text-xs text-gray-500 text-center">{{ $t('app.name') }} v2.0.0</p>
        <p class="text-[10px] text-gray-600 text-center mt-1">
          &copy; {{ new Date().getFullYear() }}
        </p>
      </div>
    </div>
  </aside>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'Sidebar',

  props: {
    isMobileOpen: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isCollapsed: false,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('dashboard', ['stats']),
    ...mapGetters('auth', ['isAdmin', 'hasPermission']),

    isRTL() {
      return this.$i18n.locale === 'ar'
    },

    pendingInvoices() {
      return this.stats?.pendingInvoices || 0
    },
  },

  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },

    getUserInitials() {
      if (!this.user?.name) return 'U'
      return this.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    userRole() {
      if (this.isAdmin) return this.$t('auth.admin')
      return this.user?.roles?.[0]?.name || this.$t('auth.user')
    },

    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
      localStorage.setItem('sidebarCollapsed', this.isCollapsed)
      this.$emit('toggle-collapse', this.isCollapsed)
    },

    closeMobileSidebar() {
      if (window.innerWidth < 1024) {
        this.$emit('close-mobile')
      }
    },

    toggleLanguage() {
      const newLang = this.isRTL ? 'en' : 'ar'
      this.$i18n.locale = newLang
      localStorage.setItem('userLanguage', newLang)
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = newLang

      // إشعار بتغيير اللغة
      this.$toast.info(
        this.$t('language.changed', {
          lang: newLang === 'ar' ? 'العربية' : 'English',
        }),
      )
    },

    async handleLogout() {
      try {
        await this.$store.dispatch('auth/logout')
        this.$toast.success(this.$t('auth.logout_success'))
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        this.$toast.error(this.$t('auth.logout_error'))
      }
    },
  },

  mounted() {
    // Load sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      this.isCollapsed = savedState === 'true'
    }

    // Load stats if not loaded
    if (!this.stats) {
      this.$store.dispatch('dashboard/fetchDashboardData')
    }
  },
}
</script>

<style scoped>
aside {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

.router-link-active {
  position: relative;
}

.router-link-active::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
  border-radius: 0 3px 3px 0;
}

[dir='rtl'] .router-link-active::before {
  right: auto;
  left: 0;
}
</style>
