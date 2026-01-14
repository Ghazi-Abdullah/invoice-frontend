<template>
  <!-- Mobile Overlay -->
  <div
    v-if="isMobileOpen"
    class="lg:hidden fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
    @click="$emit('close-mobile')"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed lg:static h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-40 transition-all duration-300 ease-in-out"
    :class="{
      '-translate-x-full lg:translate-x-0': !isMobileOpen,
      'w-20': isCollapsed,
      'w-64': !isCollapsed,
    }"
    ref="sidebarEl"
  >
    <!-- Header with Logo & Collapse Toggle -->
    <div class="flex items-center justify-between h-20 px-4 border-b border-gray-700/50">
      <router-link
        to="/dashboard"
        class="flex items-center space-x-3 transition-all duration-300 hover:opacity-90"
        :class="{ 'justify-center w-full': isCollapsed }"
        @click="closeMobileSidebar"
      >
        <div class="relative">
          <div
            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            <i class="fas fa-file-invoice text-white text-xl"></i>
          </div>
          <div
            class="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center"
          >
            <i class="fas fa-check text-white text-[8px]"></i>
          </div>
        </div>
        <transition name="slide-fade" mode="out-in">
          <div v-if="!isCollapsed" class="flex flex-col">
            <span
              class="font-bold text-xl bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent"
            >
              {{ $t('app.name') }}
            </span>
            <span class="text-xs text-gray-400 mt-1">Enterprise v2.0</span>
          </div>
        </transition>
      </router-link>

      <button
        v-if="!isCollapsed"
        @click="toggleCollapse"
        class="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200"
        :title="$t('buttons.collapse')"
      >
        <i class="fas fa-chevron-left text-sm"></i>
      </button>
    </div>

    <!-- User Profile Card -->
    <transition name="slide-fade" mode="out-in">
      <div v-if="!isCollapsed && user" class="px-5 py-4 border-b border-gray-700/50">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div
              class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
            >
              <div v-if="!user.avatar" class="text-white font-bold text-lg">
                {{ getUserInitials }}
              </div>
              <img v-else :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
            </div>
            <div
              class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center"
            >
              <i class="fas fa-check text-white text-[8px]"></i>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-base truncate">{{ user.name }}</p>
            <p class="text-sm text-gray-300 truncate mt-0.5">{{ user.email }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span
                class="px-2 py-0.5 text-xs font-medium rounded-full"
                :class="
                  isAdmin ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                "
              >
                {{ userRole }}
              </span>
              <span
                v-if="user.is_online"
                class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto py-4 scrollbar-thin">
      <transition name="slide-fade" mode="out-in">
        <div v-if="!isCollapsed" class="px-5 mb-4">
          <h3 class="text-xs uppercase text-gray-500 font-semibold tracking-wider">
            {{ $t('common.navigation') }}
          </h3>
        </div>
      </transition>

      <ul class="space-y-1 px-3">
        <!-- Dashboard -->
        <li v-if="hasPermission('view_dashboard')">
          <router-link
            to="/dashboard"
            class="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive('/dashboard')
                ? 'bg-gradient-to-r from-blue-600/30 to-blue-500/20 text-white border-r-4 border-blue-500'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            "
            :title="isCollapsed ? $t('nav.dashboard') : ''"
            @click="closeMobileSidebar"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              :class="
                isActive('/dashboard')
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400'
              "
            >
              <i class="fas fa-tachometer-alt text-base"></i>
            </div>
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isCollapsed" class="flex-1">
                <span class="font-medium">{{ $t('nav.dashboard') }}</span>
              </div>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <span
                v-if="!isCollapsed && isActive('/dashboard')"
                class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
              ></span>
            </transition>
          </router-link>
        </li>

        <!-- Invoices -->
        <li v-if="hasPermission('view_invoices')">
          <router-link
            to="/invoices"
            class="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive('/invoices')
                ? 'bg-gradient-to-r from-green-600/30 to-green-500/20 text-white border-r-4 border-green-500'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            "
            :title="isCollapsed ? $t('nav.invoices') : ''"
            @click="closeMobileSidebar"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 relative"
              :class="
                isActive('/invoices')
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800 text-gray-400 group-hover:bg-green-500/20 group-hover:text-green-400'
              "
            >
              <i class="fas fa-file-invoice-dollar text-base"></i>
              <transition name="bounce">
                <span
                  v-if="pendingInvoices > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-gray-900"
                >
                  {{ pendingInvoices > 9 ? '9+' : pendingInvoices }}
                </span>
              </transition>
            </div>
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isCollapsed" class="flex-1">
                <span class="font-medium">{{ $t('nav.invoices') }}</span>
                <p class="text-xs text-gray-400 mt-0.5">{{ $t('nav.invoices_desc') }}</p>
              </div>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <i
                v-if="!isCollapsed"
                class="fas fa-chevron-left text-xs text-gray-500 group-hover:text-gray-300 transition-colors"
              ></i>
            </transition>
          </router-link>
        </li>

        <!-- Clients -->
        <li v-if="hasPermission('view_clients')">
          <router-link
            to="/clients"
            class="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive('/clients')
                ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/20 text-white border-r-4 border-purple-500'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            "
            :title="isCollapsed ? $t('nav.clients') : ''"
            @click="closeMobileSidebar"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              :class="
                isActive('/clients')
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 group-hover:bg-purple-500/20 group-hover:text-purple-400'
              "
            >
              <i class="fas fa-users text-base"></i>
            </div>
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isCollapsed" class="flex-1">
                <span class="font-medium">{{ $t('nav.clients') }}</span>
                <p class="text-xs text-gray-400 mt-0.5">{{ $t('nav.clients_desc') }}</p>
              </div>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <i
                v-if="!isCollapsed"
                class="fas fa-chevron-left text-xs text-gray-500 group-hover:text-gray-300 transition-colors"
              ></i>
            </transition>
          </router-link>
        </li>

        <!-- Reports -->
        <li v-if="hasPermission('view_reports')">
          <router-link
            to="/reports"
            class="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive('/reports')
                ? 'bg-gradient-to-r from-orange-600/30 to-orange-500/20 text-white border-r-4 border-orange-500'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            "
            :title="isCollapsed ? $t('nav.reports') : ''"
            @click="closeMobileSidebar"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              :class="
                isActive('/reports')
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 group-hover:bg-orange-500/20 group-hover:text-orange-400'
              "
            >
              <i class="fas fa-chart-line text-base"></i>
            </div>
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isCollapsed" class="flex-1">
                <span class="font-medium">{{ $t('nav.reports') }}</span>
                <p class="text-xs text-gray-400 mt-0.5">{{ $t('nav.reports_desc') }}</p>
              </div>
            </transition>
            <transition name="slide-fade" mode="out-in">
              <i
                v-if="!isCollapsed"
                class="fas fa-chevron-left text-xs text-gray-500 group-hover:text-gray-300 transition-colors"
              ></i>
            </transition>
          </router-link>
        </li>

        <!-- Admin Section Header -->
        <transition name="slide-fade" mode="out-in">
          <div v-if="isAdmin && !isCollapsed" class="px-5 pt-8 pb-2">
            <div class="flex items-center gap-2">
              <div
                class="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
              ></div>
              <span
                class="text-xs uppercase text-gray-500 font-semibold tracking-wider whitespace-nowrap"
              >
                {{ $t('admin.section_title') }}
              </span>
              <div
                class="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"
              ></div>
            </div>
          </div>
        </transition>

        <!-- Users -->
        <li v-if="isAdmin">
          <router-link
            to="/users"
            class="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive('/users')
                ? 'bg-gradient-to-r from-indigo-600/30 to-indigo-500/20 text-white border-r-4 border-indigo-500'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            "
            :title="isCollapsed ? $t('nav.users') : ''"
            @click="closeMobileSidebar"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              :class="
                isActive('/users')
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-800 text-gray-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'
              "
            >
              <i class="fas fa-user-shield text-base"></i>
            </div>
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isCollapsed" class="flex-1">
                <span class="font-medium">{{ $t('nav.users') }}</span>
              </div>
            </transition>
          </router-link>
        </li>

        <!-- Groups -->
        <li v-if="isAdmin">
          <router-link
            to="/admin/groups"
            class="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive('/admin/groups')
                ? 'bg-gradient-to-r from-pink-600/30 to-pink-500/20 text-white border-r-4 border-pink-500'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            "
            :title="isCollapsed ? $t('adminGroups.title') : ''"
            @click="closeMobileSidebar"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              :class="
                isActive('/admin/groups')
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-800 text-gray-400 group-hover:bg-pink-500/20 group-hover:text-pink-400'
              "
            >
              <i class="fas fa-users-cog text-base"></i>
            </div>
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isCollapsed" class="flex-1">
                <span class="font-medium">{{ $t('adminGroups.title') }}</span>
              </div>
            </transition>
          </router-link>
        </li>

        <!-- Permissions -->
        <li v-if="isAdmin">
          <router-link
            to="/permissions"
            class="group flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200"
            :class="
              isActive('/permissions')
                ? 'bg-gradient-to-r from-teal-600/30 to-teal-500/20 text-white border-r-4 border-teal-500'
                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
            "
            :title="isCollapsed ? $t('nav.permissions') : ''"
            @click="closeMobileSidebar"
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              :class="
                isActive('/permissions')
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-800 text-gray-400 group-hover:bg-teal-500/20 group-hover:text-teal-400'
              "
            >
              <i class="fas fa-shield-alt text-base"></i>
            </div>
            <transition name="slide-fade" mode="out-in">
              <div v-if="!isCollapsed" class="flex-1">
                <span class="font-medium">{{ $t('nav.permissions') }}</span>
              </div>
            </transition>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Bottom Actions -->
    <div class="p-4 border-t border-gray-700/50 space-y-2">
      <!-- Language Toggle -->
      <button
        @click="toggleLanguage"
        class="group flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
        :title="isCollapsed ? $t('buttons.toggle_language') : ''"
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-all duration-200"
        >
          <i class="fas fa-language text-base"></i>
        </div>
        <transition name="slide-fade" mode="out-in">
          <div v-if="!isCollapsed" class="flex-1 text-right">
            <span class="font-medium block">
              {{ isRTL ? 'English' : 'العربية' }}
            </span>
            <span class="text-xs text-gray-400">{{ $t('buttons.toggle_language') }}</span>
          </div>
        </transition>
      </button>

      <!-- Expand/Collapse for Mobile -->
      <button
        v-if="isCollapsed && !isMobileOpen"
        @click="toggleCollapse"
        class="lg:hidden flex items-center justify-center w-full h-10 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-all duration-200"
        :title="$t('buttons.expand')"
      >
        <i class="fas fa-chevron-right text-sm"></i>
      </button>

      <!-- Logout -->
      <button
        @click="handleLogout"
        class="group flex items-center space-x-3 w-full px-3 py-3 rounded-xl text-gray-300 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200"
        :title="isCollapsed ? $t('auth.logout') : ''"
      >
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-200"
        >
          <i class="fas fa-sign-out-alt text-base"></i>
        </div>
        <transition name="slide-fade" mode="out-in">
          <div v-if="!isCollapsed" class="flex-1 text-right">
            <span class="font-medium block">{{ $t('auth.logout') }}</span>
            <span class="text-xs text-gray-400">{{ $t('auth.logout_desc') }}</span>
          </div>
        </transition>
      </button>

      <!-- Version & Status -->
      <transition name="slide-fade" mode="out-in">
        <div v-if="!isCollapsed" class="pt-4 mt-4 border-t border-gray-700/50">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-gray-500">{{ $t('app.version') }}</span>
            <span class="text-xs font-medium text-green-400">v2.0.0</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ $t('app.status') }}</span>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span class="text-xs text-green-400">{{ $t('app.online') }}</span>
            </div>
          </div>
          <p class="text-[10px] text-gray-600 text-center mt-4">
            &copy; {{ new Date().getFullYear() }} {{ $t('app.name') }}. {{ $t('app.rights') }}
          </p>
        </div>
      </transition>
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

      // إضافة تأثير صوتي خفيف
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3')
      audio.volume = 0.1
      audio.play().catch(() => {})
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

      // إشعار بتغيير اللغة مع تأثير مرئي
      this.$toast.info(
        this.$t('language.changed', {
          lang: newLang === 'ar' ? 'العربية' : 'English',
        }),
        {
          position: 'bottom-left',
          icon: 'fas fa-language',
          duration: 3000,
        },
      )
    },

    async handleLogout() {
      try {
        const confirmed = await this.$swal({
          title: this.$t('auth.logout_confirm'),
          text: this.$t('auth.logout_confirm_text'),
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280',
          confirmButtonText: this.$t('auth.logout'),
          cancelButtonText: this.$t('common.cancel'),
          reverseButtons: true,
          focusCancel: true,
          customClass: {
            popup: 'animated zoomIn',
          },
        })

        if (confirmed.isConfirmed) {
          await this.$store.dispatch('auth/logout')
          this.$toast.success(this.$t('auth.logout_success'), {
            position: 'bottom-left',
            icon: 'fas fa-check-circle',
          })
          this.$router.push('/login')
        }
      } catch (error) {
        console.error('Logout error:', error)
        this.$toast.error(this.$t('auth.logout_error'), {
          position: 'bottom-left',
          icon: 'fas fa-exclamation-circle',
        })
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

    // إضافة تأثيرات صوتية خفيفة للتأكيد على التفاعل
    this.$nextTick(() => {
      const links = this.$el.querySelectorAll('a')
      links.forEach((link) => {
        link.addEventListener('click', () => {
          const audio = new Audio(
            'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
          )
          audio.volume = 0.05
          audio.play().catch(() => {})
        })
      })
    })
  },
}
</script>

<style scoped>
/* Custom Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Active Link Indicator */
.router-link-active {
  position: relative;
  overflow: hidden;
}

.router-link-active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
  pointer-events: none;
}

/* Gradient Border Effect */
.router-link-active {
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.3);
}

/* Hover Effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Glass Effect */
.bg-gradient-to-br {
  background-attachment: fixed;
}

/* Responsive Adjustments */
@media (max-width: 1024px) {
  aside {
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.3);
  }
}

/* RTL Support */
[dir='rtl'] .router-link-active {
  border-right: none;
  border-left: 4px solid;
}

[dir='rtl'] .slide-fade-enter-from,
[dir='rtl'] .slide-fade-leave-to {
  transform: translateX(10px);
}

/* Loading Animation */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(
    90deg,
    transparent 25%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

/* Icon Pulse Animation */
@keyframes icon-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.fa-tachometer-alt,
.fa-file-invoice-dollar,
.fa-users,
.fa-chart-line {
  transition: transform 0.3s ease;
}

.group:hover .fa-tachometer-alt,
.group:hover .fa-file-invoice-dollar,
.group:hover .fa-users,
.group:hover .fa-chart-line {
  animation: icon-pulse 0.5s ease;
}

/* Notification Badge Animation */
@keyframes badge-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);
  }
}

.bg-red-500 {
  animation: badge-pulse 2s infinite;
}

/* Smooth Transitions */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease,
    opacity 0.3s ease;
}

/* Focus States */
button:focus,
a:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Active State Enhancement */
.router-link-active {
  backdrop-filter: blur(10px);
}
</style>
