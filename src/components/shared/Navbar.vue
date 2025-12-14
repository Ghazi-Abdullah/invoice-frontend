<template>
  <nav class="bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-100/80 sticky top-0 z-50">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <!-- الشعار -->
        <div class="flex items-center group">
          <router-link
            to="/dashboard"
            class="flex items-center space-x-3 transition-all duration-300 hover:scale-105"
            :class="isRTL ? 'space-x-reverse' : ''"
          >
            <div
              class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300"
            >
              <span class="text-white font-bold text-lg">IS</span>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-bold text-gray-900">
                نظام الفواتير
              </span>
              <span class="text-xs text-gray-500 font-medium mt-[-2px]">
                Invoice System
              </span>
            </div>
          </router-link>
        </div>

        <!-- روابط التنقل -->
        <div
          class="hidden lg:flex items-center space-x-1 bg-gray-50/80 rounded-2xl p-1.5 backdrop-blur-sm border border-gray-200/60"
          :class="isRTL ? 'space-x-reverse' : ''"
        >
          <router-link
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group"
            :class="{
              'text-blue-700 bg-white shadow-lg shadow-blue-500/10 border border-blue-200/50':
                $route.path === item.to,
              'text-gray-600 hover:text-gray-900 hover:bg-white/50': $route.path !== item.to,
            }"
          >
            <span
              class="relative z-10 flex items-center space-x-2"
              :class="isRTL ? 'space-x-reverse' : ''"
            >
              <component
                :is="item.icon"
                class="w-4 h-4 transition-colors duration-300"
                :class="
                  $route.path === item.to
                    ? 'text-blue-600'
                    : 'text-gray-400 group-hover:text-gray-600'
                "
              />
              <span>{{ item.text }}</span>
            </span>
          </router-link>

          <!-- رابط إدارة المستخدمين (يظهر فقط للمسؤولين) -->
          <router-link
            v-if="hasPermission('manage_users') || hasPermission('manage_permissions')"
            to="/users"
            class="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group"
            :class="{
              'text-blue-700 bg-white shadow-lg shadow-blue-500/10 border border-blue-200/50':
                $route.path === '/users',
              'text-gray-600 hover:text-gray-900 hover:bg-white/50': $route.path !== '/users',
            }"
          >
            <span
              class="relative z-10 flex items-center space-x-2"
              :class="isRTL ? 'space-x-reverse' : ''"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-1.907a10 10 0 01-2.172 3.238" />
              </svg>
              <span>المستخدمين</span>
            </span>
          </router-link>

          <!-- رابط إدارة الصلاحيات (يظهر فقط للمسؤولين) -->
          <router-link
            v-if="hasPermission('manage_permissions')"
            to="/permissions"
            class="relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group"
            :class="{
              'text-blue-700 bg-white shadow-lg shadow-blue-500/10 border border-blue-200/50':
                $route.path === '/permissions',
              'text-gray-600 hover:text-gray-900 hover:bg-white/50': $route.path !== '/permissions',
            }"
          >
            <span
              class="relative z-10 flex items-center space-x-2"
              :class="isRTL ? 'space-x-reverse' : ''"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>الصلاحيات</span>
            </span>
          </router-link>
        </div>

        <!-- الجزء الأيمن -->
        <div class="flex items-center space-x-6" :class="isRTL ? 'space-x-reverse' : ''">
          <!-- معلومات المستخدم -->
          <div
            v-if="isAuthenticated"
            class="flex items-center space-x-4 bg-gray-50/80 rounded-2xl px-4 py-2.5 backdrop-blur-sm border border-gray-200/60"
          >
            <!-- صورة المستخدم -->
            <div
              class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25"
            >
              <span class="text-white font-semibold text-sm">
                {{ getUserInitials(user?.name) }}
              </span>
            </div>

            <div class="flex flex-col">
              <span class="text-sm font-semibold text-gray-900 leading-none">
                {{ user?.name }}
              </span>
              <span class="text-xs text-gray-500 mt-1">
                {{ user?.roles?.[0]?.name || 'مستخدم' }}
              </span>
            </div>

            <!-- زر تسجيل الخروج -->
            <button
              @click="logout"
              class="flex items-center space-x-2 text-gray-500 hover:text-red-600 text-sm font-medium transition-all duration-300 hover:bg-red-50 p-2 rounded-lg group ml-2"
              :class="isRTL ? 'space-x-reverse' : ''"
            >
              <svg
                class="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span class="hidden sm:block">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

const DashboardIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
}
const InvoiceIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
}
const ClientIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
}
const ReportIcon = {
  template:
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
}

export default {
  name: 'Navbar',
  data() {
    return {
      navItems: [
        { to: '/dashboard', text: 'لوحة التحكم', icon: DashboardIcon },
        { to: '/invoices', text: 'الفواتير', icon: InvoiceIcon },
        { to: '/clients', text: 'العملاء', icon: ClientIcon },
        { to: '/reports', text: 'التقارير', icon: ReportIcon },
      ],
      isRTL: true
    }
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapGetters('permissions', ['hasPermission']),
  },
  methods: {
    ...mapActions('auth', ['logout']),

    getUserInitials(name) {
      if (!name) return 'U'
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    handleLogout() {
      this.logout()
      this.$router.push('/login')
    },
  },
  mounted() {
    console.log('User roles:', this.user?.roles)
    console.log('Has manage_permissions:', this.hasPermission('manage_permissions'))
  }
}
</script>
