<template>
  <div class="flex min-h-screen bg-gray-100" :class="isRTL ? 'flex-row-reverse' : ''">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 text-white shadow-lg overflow-y-auto">
      <div class="p-6">
        <!-- Logo -->
        <div class="flex items-center space-x-3 space-x-reverse mb-8">
          <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <i class="fas fa-file-invoice text-xl"></i>
          </div>
          <h1 class="text-xl font-bold">نظام الفواتير</h1>
        </div>

        <!-- User Info -->
        <div v-if="user" class="mb-8">
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <i class="fas fa-user text-lg"></i>
            </div>
            <div>
              <p class="font-medium">{{ user.name }}</p>
              <p class="text-sm text-gray-400">{{ user.email }}</p>
              <div v-if="user.roles" class="mt-1">
                <span class="inline-block px-2 py-1 text-xs bg-blue-600 rounded">
                  {{ user.roles[0]?.name || 'مستخدم' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <router-link
            to="/dashboard"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
            :class="{ 'bg-gray-700': $route.path === '/dashboard' }"
          >
            <i class="fas fa-home"></i>
            <span>لوحة التحكم</span>
          </router-link>

          <router-link
            to="/invoices"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
            :class="{ 'bg-gray-700': $route.path.includes('/invoices') }"
          >
            <i class="fas fa-file-invoice"></i>
            <span>الفواتير</span>
          </router-link>

          <router-link
            to="/clients"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
            :class="{ 'bg-gray-700': $route.path === '/clients' }"
          >
            <i class="fas fa-users"></i>
            <span>العملاء</span>
          </router-link>

          <router-link
            to="/reports"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
            :class="{ 'bg-gray-700': $route.path === '/reports' }"
          >
            <i class="fas fa-chart-bar"></i>
            <span>التقارير</span>
          </router-link>

          <!-- Admin Links -->
          <div v-if="isAdmin">
            <div class="pt-4 mt-4 border-t border-gray-700">
              <p class="text-xs text-gray-400 mb-2 px-3">إدارة النظام</p>

              <router-link
                to="/permissions"
                class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
                :class="{ 'bg-gray-700': $route.path === '/permissions' }"
              >
                <i class="fas fa-shield-alt"></i>
                <span>إدارة الصلاحيات</span>
              </router-link>

              <router-link
                to="/users"
                class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
                :class="{ 'bg-gray-700': $route.path === '/users' }"
              >
                <i class="fas fa-user-cog"></i>
                <span>إدارة المستخدمين</span>
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Logout -->
        <div class="pt-8 mt-8 border-t border-gray-700">
          <button
            @click="logout"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-600 transition w-full text-right"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <nav class="bg-white shadow-lg">
        <div class="px-4 py-4 flex justify-between items-center">
          <span class="text-blue-600 font-bold text-lg">{{ $t('app.name') }}</span>

          <!-- User Dropdown -->
          <div class="relative group">
            <button class="flex items-center space-x-2">
              <div
                class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
              >
                {{ userInitials }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
              <svg class="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <div
              class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
            >
              <div class="py-1">
                <div class="px-4 py-2 text-sm text-gray-700 border-b">
                  <div class="font-medium">{{ user.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ user.group ? user.group.title_en : $t('common.noGroup') }}
                  </div>
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {{ $t('common.profile') }}
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {{ $t('auth.logout') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Router View -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'DefaultLayout',
  setup() {
    const store = useStore()
    const router = useRouter()

    const user = computed(() => store.state.auth.user)
    const isAdmin = computed(
      () => user.value?.roles?.some((role) => role.name === 'admin') || false,
    )
    const userInitials = computed(() => {
      if (!user.value || !user.value.name) return 'U'
      return user.value.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    })
    const menus = computed(() => store.state.auth.menus || [])
    const isRTL = computed(() => true) // دعم RTL دائمًا

    const logout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    return { user, isAdmin, userInitials, menus, isRTL, logout }
  },
}
</script>

<style scoped>
/* لضمان ظهور الروابط النشطة */
.router-link-active {
  @apply bg-gray-700;
}
</style>
