<template>
  <div class="flex min-h-screen bg-gray-100" :class="isRTL ? 'flex-row-reverse' : ''">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-gray-800 text-white shadow-lg overflow-y-auto transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-0 md:w-16',
      ]"
    >
      <div class="p-6 h-full">
        <!-- Logo and Toggle -->
        <div class="flex items-center justify-between mb-8">
          <div v-if="sidebarOpen" class="flex items-center space-x-3 space-x-reverse">
            <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-file-invoice text-xl"></i>
            </div>
            <h1 class="text-xl font-bold">نظام الفواتير</h1>
          </div>
          <button @click="toggleSidebar" class="text-white hover:text-gray-300">
            <i class="fas fa-bars"></i>
          </button>
        </div>

        <!-- User Info -->
        <div v-if="sidebarOpen && user" class="mb-8">
          <div class="flex items-center space-x-3 space-x-reverse">
            <div class="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
              <span class="text-lg font-bold">{{ getInitials(user.name) }}</span>
            </div>
            <div>
              <p class="font-medium">{{ user.name }}</p>
              <p class="text-sm text-gray-400">{{ user.email }}</p>
              <div class="mt-1">
                <span class="inline-block px-2 py-1 text-xs bg-blue-600 rounded">
                  {{ user.group?.title_ar || 'مستخدم' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="space-y-2">
          <!-- Dashboard -->
          <router-link
            v-if="hasPermission('dashboard')"
            to="/dashboard"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
            :class="{ 'bg-gray-700': $route.path === '/dashboard' }"
            :title="sidebarOpen ? '' : 'لوحة التحكم'"
          >
            <i class="fas fa-home w-5 text-center"></i>
            <span v-if="sidebarOpen">لوحة التحكم</span>
          </router-link>

          <!-- Clients -->
          <div v-if="hasPermission('view_clients')">
            <router-link
              to="/clients"
              class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
              :class="{ 'bg-gray-700': $route.path === '/clients' }"
              :title="sidebarOpen ? '' : 'العملاء'"
            >
              <i class="fas fa-users w-5 text-center"></i>
              <span v-if="sidebarOpen">العملاء</span>
            </router-link>

            <div v-if="sidebarOpen" class="mr-6">
              <router-link
                v-if="hasPermission('create_client')"
                to="/clients/create"
                class="flex items-center space-x-3 space-x-reverse p-2 rounded-lg hover:bg-gray-700 transition text-sm"
                :class="{ 'bg-gray-700': $route.path === '/clients/create' }"
              >
                <i class="fas fa-plus w-5 text-center"></i>
                <span>إضافة عميل</span>
              </router-link>
            </div>
          </div>

          <!-- Invoices -->
          <div v-if="hasPermission('view_invoices')">
            <router-link
              to="/invoices"
              class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
              :class="{ 'bg-gray-700': $route.path.includes('/invoices') }"
              :title="sidebarOpen ? '' : 'الفواتير'"
            >
              <i class="fas fa-file-invoice w-5 text-center"></i>
              <span v-if="sidebarOpen">الفواتير</span>
            </router-link>

            <div v-if="sidebarOpen" class="mr-6">
              <router-link
                v-if="hasPermission('create_invoice')"
                to="/invoices/create"
                class="flex items-center space-x-3 space-x-reverse p-2 rounded-lg hover:bg-gray-700 transition text-sm"
                :class="{ 'bg-gray-700': $route.path === '/invoices/create' }"
              >
                <i class="fas fa-plus w-5 text-center"></i>
                <span>إنشاء فاتورة</span>
              </router-link>
            </div>
          </div>

          <!-- Reports -->
          <router-link
            v-if="hasPermission('view_sales_report')"
            to="/reports"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
            :class="{ 'bg-gray-700': $route.path === '/reports' }"
            :title="sidebarOpen ? '' : 'التقارير'"
          >
            <i class="fas fa-chart-bar w-5 text-center"></i>
            <span v-if="sidebarOpen">التقارير</span>
          </router-link>

          <!-- Admin Links -->
          <div v-if="isAdmin">
            <div class="pt-4 mt-4 border-t border-gray-700" v-if="sidebarOpen">
              <p class="text-xs text-gray-400 mb-2 px-3">إدارة النظام</p>
            </div>

            <!-- في قسم Admin Links -->
            <router-link
              v-if="hasPermission('administration')"
              to="/admin/users"
              class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
              :class="{ 'bg-gray-700': $route.path.includes('/admin/users') }"
              :title="sidebarOpen ? '' : 'المستخدمون'"
            >
              <i class="fas fa-user-cog w-5 text-center"></i>
              <span v-if="sidebarOpen">المستخدمون</span>
            </router-link>

            <router-link
              v-if="hasPermission('administration')"
              to="/admin/groups"
              class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
              :class="{ 'bg-gray-700': $route.path.includes('/admin/groups') }"
              :title="sidebarOpen ? '' : 'المجموعات'"
            >
              <i class="fas fa-users-cog w-5 text-center"></i>
              <span v-if="sidebarOpen">المجموعات</span>
            </router-link>

            <router-link
              v-if="hasPermission('administration')"
              to="/admin/permissions"
              class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-gray-700 transition"
              :class="{ 'bg-gray-700': $route.path.includes('/admin/permissions') }"
              :title="sidebarOpen ? '' : 'الصلاحيات'"
            >
              <i class="fas fa-shield-alt w-5 text-center"></i>
              <span v-if="sidebarOpen">الصلاحيات</span>
            </router-link>

            <router-link
              to="/admin/assign-permissions"
              class="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <i class="fas fa-shield-alt ml-3"></i>
              <span>تعيين الصلاحيات</span>
            </router-link>
          </div>
        </nav>

        <!-- Logout Button -->
        <!--<div class="pt-8 mt-8 border-t border-gray-700 absolute bottom-6 left-6 right-6">
          <button
            @click="logout"
            class="flex items-center space-x-3 space-x-reverse p-3 rounded-lg hover:bg-red-600 transition w-full text-right"
            :title="sidebarOpen ? '' : 'تسجيل الخروج'"
          >
            <i class="fas fa-sign-out-alt w-5 text-center"></i>
            <span v-if="sidebarOpen">تسجيل الخروج</span>
          </button>
        </div>-->
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Navbar -->
      <nav class="bg-white shadow-lg">
        <div class="px-4 py-4 flex justify-between items-center">
          <!-- Sidebar Toggle Button -->
          <button @click="toggleSidebar" class="text-gray-600 hover:text-gray-800">
            <i class="fas fa-bars text-xl"></i>
          </button>

          <!-- Page Title -->
          <div class="flex-1 text-center">
            <span class="text-blue-600 font-bold text-lg">
              {{ getPageTitle() }}
            </span>
          </div>

          <!-- User Dropdown -->
          <div class="relative group">
            <button class="flex items-center space-x-2 focus:outline-none">
              <div
                class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white"
              >
                {{ getInitials(user?.name || '') }}
              </div>
              <span class="text-sm font-medium text-gray-700">{{ user?.name }}</span>
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
                  <div class="font-medium">{{ user?.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ user?.group?.title_ar || 'مستخدم' }}
                  </div>
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  الملف الشخصي
                </router-link>
                <button
                  @click="logout"
                  class="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Router View -->
      <main class="flex-1 p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

export default {
  name: 'DefaultLayout',
  setup() {
    const store = useStore()
    const router = useRouter()

    const sidebarOpen = ref(true)

    // البيانات المحسوبة
    const user = computed(() => store.state.auth.user)
    const permissions = computed(() => store.state.auth.permissions || [])
    const isAdmin = computed(() => store.state.auth.is_admin || false)
    const isRTL = computed(() => true) // دعم RTL دائمًا

    // الطرق
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
        '/clients/create': 'إضافة عميل',
        '/invoices': 'الفواتير',
        '/invoices/create': 'إنشاء فاتورة',
        '/reports': 'التقارير',
        '/admin/users': 'إدارة المستخدمين',
        '/admin/groups': 'إدارة المجموعات',
        '/admin/permissions': 'إدارة الصلاحيات',
        '/profile': 'الملف الشخصي',
      }
      return titles[route.path] || 'نظام الفواتير'
    }

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const logout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/login')
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }

    // عند التحميل، تحقق من حالة المستخدم
    onMounted(async () => {
      if (!user.value) {
        await store.dispatch('auth/checkAuth')
      }
    })

    return {
      sidebarOpen,
      user,
      permissions,
      isAdmin,
      isRTL,
      getInitials,
      hasPermission,
      getPageTitle,
      toggleSidebar,
      logout,
    }
  },
}
</script>

<style scoped>
.router-link-active {
  @apply bg-gray-700;
}

/* تخصيص scrollbar للسايدبار */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: #2d3748;
}

aside::-webkit-scrollbar-thumb {
  background: #4a5568;
  border-radius: 3px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* تحسينات للأجهزة الصغيرة */
@media (max-width: 768px) {
  aside {
    position: fixed;
    z-index: 50;
    height: 100vh;
  }

  .w-64 {
    width: 16rem;
  }

  .w-0 {
    width: 0;
    overflow: hidden;
    padding: 0;
  }

  .md\\:w-16 {
    width: 4rem;
  }
}
</style>
