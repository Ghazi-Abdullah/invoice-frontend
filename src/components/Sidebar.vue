<template>
  <aside class="fixed right-0 top-0 h-full w-64 bg-gray-800 text-white shadow-lg overflow-y-auto">
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
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

export default {
  name: 'Sidebar',

  setup() {
    const store = useStore()
    const router = useRouter()

    const user = computed(() => store.state.auth.user)
    const isAdmin = computed(() => {
      return user.value?.roles?.some((role) => role.name === 'admin') || false
    })

    const logout = async () => {
      try {
        await store.dispatch('auth/logout')
        router.push('/login')
        toast.success('تم تسجيل الخروج بنجاح')
      } catch (error) {
        toast.error('فشل تسجيل الخروج')
      }
    }

    return {
      user,
      isAdmin,
      logout,
    }
  },
}
</script>

<style scoped>
.router-link-active {
  @apply bg-gray-700;
}
</style>
