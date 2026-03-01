<template>
  <div class="flex min-h-screen bg-gray-100" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl overflow-y-auto transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 md:w-20',
      ]"
    >
      <div class="p-4 h-full flex flex-col">
        <!-- Logo and Toggle -->
        <div class="flex items-center justify-between mb-6">
          <div v-if="sidebarOpen" class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-file-invoice text-xl"></i>
            </div>
            <h1 class="text-lg font-bold text-white">{{ $t('app.name') }}</h1>
          </div>
          <button @click="toggleSidebar" class="text-white hover:text-blue-300 transition p-2">
            <i :class="sidebarOpen ? 'fas fa-chevron-right' : 'fas fa-bars'"></i>
          </button>
        </div>

        <!-- User Info -->
        <div v-if="sidebarOpen && user" class="mb-6 p-3 bg-gray-800/50 rounded-xl">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <span class="text-sm font-bold text-white">{{ getInitials(user.name) }}</span>
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

          <!-- Admin Section -->
          <div v-if="isAdmin && sidebarOpen" class="pt-4 mt-4 border-t border-gray-700">
            <div class="px-3 mb-2">
              <!-- <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {{ $t('admin.title') }}
              </p>-->
            </div>
          </div>

          <!-- Dashboard -->
          <router-link
            v-if="hasPermission('dashboard')"
            to="/dashboard"
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
          <div v-if="hasPermission('view_clients')">
            <router-link
              to="/clients"
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
          </div>

          <!-- Invoices -->
          <div v-if="hasPermission('view_invoices')">
            <router-link
              to="/invoices"
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
          </div>

          <!-- Reports -->
          <router-link
            v-if="hasPermission('view_sales_report')"
            to="/reports"
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
          <div v-if="isAdmin && sidebarOpen" class="pt-4 mt-4 border-t border-gray-700">
            <div class="px-3 mb-2">
              <!-- <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {{ $t('admin.title') }}
              </p>-->
            </div>

            <router-link
              v-if="hasPermission('administration')"
              to="/admin/users"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/users'),
              }"
            >
              <i
                class="fas fa-user-cog w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.users') }}
              </span>
            </router-link>

            <router-link
              v-if="hasPermission('administration')"
              to="/admin/groups"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/groups'),
              }"
            >
              <i
                class="fas fa-users-cog w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.groups') }}
              </span>
            </router-link>

            <router-link
              v-if="hasPermission('administration')"
              to="/admin/permissions"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/permissions'),
              }"
            >
              <i
                class="fas fa-shield-alt w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.permissions') }}
              </span>
            </router-link>

            <!-- ✅ تم إضافة قسم "تعيين الصلاحيات" هنا -->
            <router-link
              v-if="hasPermission('administration')"
              to="/admin/assign-permissions"
              class="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600/10 transition group"
              :class="{
                'bg-gradient-to-r from-purple-600/20 to-purple-600/10 border-r-2 border-purple-500':
                  $route.path.includes('/admin/assign-permissions'),
              }"
            >
              <i
                class="fas fa-key w-5 text-center text-gray-300 group-hover:text-purple-400 transition"
              ></i>
              <span class="text-gray-300 group-hover:text-purple-400 transition">
                {{ $t('nav.assign_permissions') }}
              </span>
            </router-link>

            <div v-if="isAdmin && sidebarOpen" class="pt-4 mt-4 border-t border-gray-700">
              <div class="px-3 mb-2">
                <!-- <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {{ $t('admin.title') }}
              </p>-->
              </div>
            </div>

            <!-- Activity log -->
            <div v-if="hasPermission('administration')">
              <router-link
                to="/activitylog"
                class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition group"
                :class="{
                  'bg-gradient-to-r from-orange-600/20 to-orange-600/10 border-r-2 border-orange-500':
                    $route.path === '/activitylog',
                }"
              >
                <i
                  class="fas fa-user w-5 text-center text-gray-300 group-hover:text-orange-400 transition"
                ></i>
                <span
                  v-if="sidebarOpen"
                  class="text-gray-300 group-hover:text-orange-400 transition"
                >
                  {{ $t('nav.activitylog') }}
                </span>
              </router-link>
            </div>

            <!-- Admin Section -->
            <div v-if="isAdmin && sidebarOpen" class="pt-4 mt-4 border-t border-gray-700">
              <div class="px-3 mb-2">
                <!-- <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {{ $t('admin.title') }}
              </p>-->
              </div>
            </div>
          </div>
        </nav>

        <!-- Bottom Section -->
        <div class="pt-4 border-t border-gray-700">
          <!-- Language Toggle -->
          <button
            @click="toggleLanguage"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700/50 transition w-full group"
            :title="sidebarOpen ? '' : $t('nav.toggle_language')"
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
            :title="sidebarOpen ? '' : $t('auth.logout')"
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

    <!-- Overlay for mobile -->
    <div
      v-if="!sidebarOpen && isMobile"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Navbar -->
      <nav class="bg-white shadow-lg sticky top-0 z-30">
        <div class="px-4 py-3 flex items-center justify-between">
          <!-- Left: Sidebar Toggle -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="text-gray-600 hover:text-blue-600 transition p-2 rounded-lg hover:bg-gray-100"
            >
              <i class="fas fa-bars text-lg"></i>
            </button>

            <!-- Breadcrumb -->
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

          <!-- Center: Page Title (Mobile) -->
          <div class="md:hidden">
            <h1 class="text-blue-600 font-bold text-sm">
              {{ getPageTitle() }}
            </h1>
          </div>

          <!-- Right: User Menu and Language -->
          <div class="flex items-center gap-3">
            <!-- Language Switcher -->
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
                <div
                  class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow"
                >
                  {{ getInitials(user?.name || '') }}
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
                class="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                v-click-outside="() => (userDropdownOpen = false)"
              >
                <div class="p-3 border-b border-gray-100">
                  <p class="font-medium text-gray-900">{{ user?.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                </div>
                <div class="py-1">
                  <router-link
                    to="/profile"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    @click="userDropdownOpen = false"
                  >
                    <i class="fas fa-user-circle text-gray-400"></i>
                    <span>{{ $t('nav.profile') }}</span>
                  </router-link>
                  <button
                    @click="logout"
                    class="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                  >
                    <i class="fas fa-sign-out-alt text-gray-400"></i>
                    <span>{{ $t('auth.logout') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
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

export default {
  name: 'DefaultLayout',

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

    // Computed properties
    const user = computed(() => store.state.auth.user)
    const permissions = computed(() => store.state.auth.permissions || [])
    const isAdmin = computed(() => store.state.auth.is_admin || false)

    // Methods
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
      const route = router.currentRoute.value
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
      }
      return titles[route.path] || 'نظام الفواتير'
    }

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    // ✅ دالة تغيير اللغة مع إعادة تحميل الصفحة
    const toggleLanguage = () => {
      const newLang = locale.value === 'ar' ? 'en' : 'ar'
      locale.value = newLang
      localStorage.setItem('userLanguage', newLang)
      // إعادة تحميل الصفحة لتطبيق اللغة
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

    // Check auth on mount
    onMounted(async () => {
      if (!user.value) {
        await store.dispatch('auth/checkAuth')
      }

      // Check screen size
      const checkMobile = () => {
        isMobile.value = window.innerWidth < 768
      }

      checkMobile()
      window.addEventListener('resize', checkMobile)

      // Close sidebar on mobile by default
      if (isMobile.value) {
        sidebarOpen.value = false
      }

      onUnmounted(() => {
        window.removeEventListener('resize', checkMobile)
      })
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
      toggleLanguage,
      logout,
    }
  },
}
</script>

<style scoped>
/* تحسينات التصميم */
.router-link-active {
  position: relative;
}

.router-link-active::after {
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
  left: auto;
  right: 0;
}

/* تخصيص scrollbar */
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

/* تحسينات للأجهزة المحمولة */
@media (max-width: 768px) {
  aside {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    z-index: 50;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
  }

  .w-64 {
    width: 16rem;
  }

  .w-0 {
    width: 0;
    overflow: hidden;
    padding: 0;
  }
}

/* تأثيرات انتقالية */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
