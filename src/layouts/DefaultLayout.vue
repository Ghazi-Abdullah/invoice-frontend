<template>
  <div class="flex min-h-screen bg-gray-100" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Overlay للموبايل عند فتح السايدبار -->
    <div
      v-if="sidebarOpen && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-40"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl overflow-y-auto transition-all duration-300 z-50',
        isMobile
          ? sidebarOpen
            ? 'fixed top-0 bottom-0 w-64'
            : 'fixed top-0 bottom-0 w-0 overflow-hidden'
          : sidebarOpen
            ? 'relative w-64'
            : 'relative w-20',
        $i18n.locale === 'ar' ? 'right-0' : 'left-0',
      ]"
    >
      <div class="p-4 h-full flex flex-col min-h-screen">
        <!-- User Info -->
        <div v-if="sidebarOpen && user" class="mb-6 p-3 bg-gray-800/50 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10 flex-shrink-0">
              <img
                v-if="user.img_url"
                :src="user.img_url"
                class="w-full h-full rounded-full object-cover border-2 border-blue-500 shadow-lg"
                :alt="user.name"
              />
              <div
                v-else
                class="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg"
              >
                {{ getInitials(user.name) }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ user.name }}</p>
              <p class="text-xs text-gray-300 truncate">{{ user.email }}</p>
              <div class="mt-1">
                <span class="inline-block px-2 py-0.5 text-xs bg-blue-600/80 rounded-lg">
                  {{ user.group?.title_ar || $t('auth.user') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-1 flex-1">
          <!-- Profile -->
          <div v-if="user">
            <router-link
              to="/profile"
              @click="closeSidebarOnMobile"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition group"
              :class="{
                'bg-gradient-to-r from-green-600/20 to-green-600/10 border-r-2 border-green-500':
                  $route.path === '/profile',
              }"
            >
              <i
                class="fas fa-user w-5 text-center text-gray-300 group-hover:text-green-400 transition"
              ></i>
              <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-green-400 transition">
                {{ $t('nav.profile') }}
              </span>
            </router-link>
          </div>

          <div v-if="sidebarOpen" class="pt-4 mt-4 border-t border-gray-700"></div>

          <!-- Dashboard -->
          <router-link
            v-if="hasPermission('dashboard')"
            to="/dashboard"
            @click="closeSidebarOnMobile"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition group"
            :class="{
              'bg-gradient-to-r from-blue-600/20 to-blue-600/10 border-r-2 border-blue-500':
                $route.path === '/dashboard',
            }"
          >
            <i
              class="fas fa-home w-5 text-center text-gray-300 group-hover:text-white transition"
            ></i>
            <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-white transition">
              {{ $t('nav.dashboard') }}
            </span>
          </router-link>

          <!-- Clients -->
          <router-link
            v-if="hasPermission('view_clients')"
            to="/clients"
            @click="closeSidebarOnMobile"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition group"
            :class="{
              'bg-gradient-to-r from-blue-600/20 to-blue-600/10 border-r-2 border-blue-500':
                $route.path === '/clients',
            }"
          >
            <i
              class="fas fa-users w-5 text-center text-gray-300 group-hover:text-white transition"
            ></i>
            <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-white transition">
              {{ $t('nav.clients') }}
            </span>
          </router-link>

          <!-- Invoices -->
          <router-link
            v-if="hasPermission('view_invoices')"
            to="/invoices"
            @click="closeSidebarOnMobile"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition group"
            :class="{
              'bg-gradient-to-r from-blue-600/20 to-blue-600/10 border-r-2 border-blue-500':
                $route.path.includes('/invoices'),
            }"
          >
            <i
              class="fas fa-file-invoice w-5 text-center text-gray-300 group-hover:text-white transition"
            ></i>
            <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-white transition">
              {{ $t('nav.invoices') }}
            </span>
          </router-link>

          <!-- Reports -->
          <router-link
            v-if="hasPermission('view_sales_report')"
            to="/reports"
            @click="closeSidebarOnMobile"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition group"
            :class="{
              'bg-gradient-to-r from-blue-600/20 to-blue-600/10 border-r-2 border-blue-500':
                $route.path === '/reports',
            }"
          >
            <i
              class="fas fa-chart-bar w-5 text-center text-gray-300 group-hover:text-white transition"
            ></i>
            <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-white transition">
              {{ $t('nav.reports') }}
            </span>
          </router-link>

          <!-- Admin Section -->
          <template v-if="isAdmin">
            <div v-if="sidebarOpen" class="pt-4 mt-4 border-t border-gray-700"></div>

            <!-- Users -->
            <router-link
              v-if="hasPermission('administration')"
              to="/admin/users"
              @click="closeSidebarOnMobile"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/users'),
              }"
            >
              <i
                class="fas fa-user-cog w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.users') }}
              </span>
            </router-link>

            <!-- Groups -->
            <router-link
              v-if="hasPermission('administration')"
              to="/admin/groups"
              @click="closeSidebarOnMobile"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/groups'),
              }"
            >
              <i
                class="fas fa-users-cog w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.groups') }}
              </span>
            </router-link>

            <!-- Permissions -->
            <router-link
              v-if="hasPermission('administration')"
              to="/admin/permissions"
              @click="closeSidebarOnMobile"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/permissions'),
              }"
            >
              <i
                class="fas fa-shield-alt w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.permissions') }}
              </span>
            </router-link>

            <!-- Assign Permissions -->
            <router-link
              v-if="hasPermission('administration')"
              to="/admin/assign-permissions"
              @click="closeSidebarOnMobile"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/assign-permissions'),
              }"
            >
              <i
                class="fas fa-key w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.assign_permissions') }}
              </span>
            </router-link>

            <div v-if="sidebarOpen" class="pt-4 mt-4 border-t border-gray-700"></div>

            <!-- Activity Log -->
            <router-link
              v-if="hasPermission('administration')"
              to="/activitylog"
              @click="closeSidebarOnMobile"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-orange-600/20 to-orange-600/10 border-r-2 border-orange-500':
                  $route.path === '/activitylog',
              }"
            >
              <i
                class="fas fa-history w-5 text-center text-gray-300 group-hover:text-orange-400 transition"
              ></i>
              <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-orange-400 transition">
                {{ $t('nav.activitylog') }}
              </span>
            </router-link>
          </template>
        </nav>

        <!-- Bottom Section -->
        <div class="pt-4 border-t border-gray-700 space-y-1">
          <!-- Language Toggle -->
          <button
            @click="toggleLanguage"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition w-full group"
          >
            <i
              class="fas fa-language w-5 text-center text-gray-300 group-hover:text-blue-400 transition"
            ></i>
            <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-blue-400 transition">
              {{ $t('nav.toggle_language') }}
            </span>
          </button>

          <!-- Logout -->
          <button
            @click="logout"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600/10 transition w-full group"
          >
            <i
              class="fas fa-sign-out-alt w-5 text-center text-gray-300 group-hover:text-red-400 transition"
            ></i>
            <span v-if="sidebarOpen" class="text-gray-300 group-hover:text-red-400 transition">
              {{ $t('auth.logout') }}
            </span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen overflow-hidden">
      <!-- Navbar -->
      <nav class="bg-white shadow-lg sticky top-0 z-30">
        <div class="px-4 py-3 flex items-center justify-between">
          <!-- يسار: زر البرغر + Breadcrumb -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-100"
            >
              <i class="fas fa-bars text-lg"></i>
            </button>

            <!-- Breadcrumb (desktop) -->
            <div class="hidden md:flex items-center text-sm text-gray-600">
              <router-link to="/dashboard" class="hover:text-blue-600 transition">
                {{ $t('nav.dashboard') }}
              </router-link>
              <template v-if="$route.path !== '/dashboard'">
                <i class="fas fa-chevron-left mx-2 text-gray-400 text-xs"></i>
                <span class="text-gray-800 font-medium">{{ getPageTitle() }}</span>
              </template>
            </div>
          </div>

          <!-- وسط: عنوان الصفحة (موبايل) -->
          <div class="md:hidden">
            <h1 class="text-blue-600 font-bold text-sm">{{ getPageTitle() }}</h1>
          </div>

          <!-- يمين: جرس الإشعارات + اللغة + المستخدم -->
          <div class="flex items-center gap-3">
            <!-- جرس الإشعارات -->
            <InvoiceNotificationBell />

            <!-- Language Switcher (desktop) -->
            <button
              @click="toggleLanguage"
              class="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition"
            >
              <i class="fas fa-language"></i>
              <span>{{ $i18n.locale === 'ar' ? 'English' : 'العربية' }}</span>
            </button>

            <!-- User Dropdown -->
            <div class="relative">
              <button
                @click="userDropdownOpen = !userDropdownOpen"
                class="flex items-center gap-2 focus:outline-none"
              >
                <div class="relative h-8 w-8 flex-shrink-0">
                  <img
                    v-if="user?.img_url"
                    :src="user.img_url"
                    class="w-full h-full rounded-full object-cover border-2 border-blue-500 shadow"
                    :alt="user.name"
                  />
                  <div
                    v-else
                    class="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow"
                  >
                    {{ getInitials(user?.name) }}
                  </div>
                </div>
                <div class="hidden md:block text-right">
                  <p class="text-sm font-medium text-gray-700">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500">
                    {{ user?.group?.title_ar || $t('auth.user') }}
                  </p>
                </div>
                <i class="fas fa-chevron-down text-gray-400 text-xs hidden md:block"></i>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="userDropdownOpen"
                class="absolute mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                :class="$i18n.locale === 'ar' ? 'right-0' : 'left-0'"
                v-click-outside="() => (userDropdownOpen = false)"
              >
                <div class="p-3 border-b border-gray-100 flex items-center gap-3">
                  <div class="relative h-10 w-10 flex-shrink-0">
                    <img
                      v-if="user?.img_url"
                      :src="user.img_url"
                      class="w-full h-full rounded-full object-cover border-2 border-blue-500"
                      :alt="user.name"
                    />
                    <div
                      v-else
                      class="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm"
                    >
                      {{ getInitials(user?.name) }}
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">{{ user?.name }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                  </div>
                </div>
                <div class="py-1">
                  <router-link
                    to="/profile"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    @click="userDropdownOpen = false"
                  >
                    <i class="fas fa-user-circle text-gray-400 w-4"></i>
                    <span>{{ $t('nav.profile') }}</span>
                  </router-link>
                  <button
                    @click="logout"
                    class="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <i class="fas fa-sign-out-alt text-gray-400 w-4"></i>
                    <span>{{ $t('auth.logout') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <main class="flex-1 p-4 md:p-6 bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import InvoiceNotificationBell from '@/components/shared/InvoiceNotificationBell.vue'

export default {
  name: 'DefaultLayout',

  components: {
    InvoiceNotificationBell,
  },

  directives: {
    'click-outside': {
      mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.addEventListener('click', el.clickOutsideEvent)
      },
      unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
      },
    },
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const { locale } = useI18n()

    const sidebarOpen = ref(true)
    const userDropdownOpen = ref(false)
    const isMobile = ref(false)

    const user = computed(() => store.state.auth.user)
    const permissions = computed(() => store.state.auth.permissions || [])
    const isAdmin = computed(() => store.state.auth.is_admin || false)

    const getInitials = (name) => {
      if (!name) return 'U'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    }

    const hasPermission = (permission) => {
      if (isAdmin.value) return true
      return permissions.value.includes(permission)
    }

    const getPageTitle = () => {
      const path = router.currentRoute.value.path
      const titles = {
        '/dashboard': 'لوحة التحكم',
        '/clients': 'العملاء',
        '/invoices': 'الفواتير',
        '/reports': 'التقارير',
        '/admin/users': 'المستخدمون',
        '/admin/groups': 'المجموعات',
        '/admin/permissions': 'الصلاحيات',
        '/admin/assign-permissions': 'تعيين الصلاحيات',
        '/profile': 'الملف الشخصي',
        '/activitylog': 'سجل النشاطات',
      }
      return titles[path] || 'نظام الفواتير'
    }

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    // ← يغلق السايدبار تلقائياً عند الضغط على رابط في الموبايل
    const closeSidebarOnMobile = () => {
      if (isMobile.value) {
        sidebarOpen.value = false
      }
    }

    const toggleLanguage = () => {
      const newLang = locale.value === 'ar' ? 'en' : 'ar'
      locale.value = newLang
      localStorage.setItem('userLanguage', newLang)
      window.location.reload()
    }

    const logout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/login')
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }

    // ← دالة مستقلة حتى نتمكن من إزالتها في onUnmounted
    const checkMobile = () => {
      isMobile.value = window.innerWidth < 768
      if (isMobile.value) {
        sidebarOpen.value = false
      }
    }

    onMounted(async () => {
      if (!user.value) {
        await store.dispatch('auth/checkAuth')
      }
      store.dispatch('invoiceNotifications/startListening') // ← هل هذا موجود؟
      checkMobile()
      window.addEventListener('resize', checkMobile)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile)
      store.dispatch('invoiceNotifications/stopListening')
    })

    return {
      sidebarOpen,
      userDropdownOpen,
      isMobile,
      user,
      permissions,
      isAdmin,
      getInitials,
      hasPermission,
      getPageTitle,
      toggleSidebar,
      closeSidebarOnMobile,
      toggleLanguage,
      logout,
    }
  },
}
</script>

<style scoped>
/* تخصيص scrollbar السايدبار */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
aside::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
aside::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* الخط الجانبي للرابط النشط */
.router-link-active {
  position: relative;
}

[dir='ltr'] .router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
  border-radius: 0 3px 3px 0;
}

[dir='rtl'] .router-link-active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #3b82f6, #1d4ed8);
  border-radius: 3px 0 0 3px;
}
</style>
