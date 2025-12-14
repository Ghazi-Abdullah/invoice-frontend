<template>
<<<<<<< HEAD
  <div id="app">
<<<<<<< Updated upstream
    <ToastContainer />
    <main class="main-content">
      <Navbar v-if="showNavbar" />
=======
  <div class="min-h-screen bg-gray-100">
    <Sidebar v-if="showSidebar" />

    <main :class="showSidebar ? 'mr-64' : ''" class="min-h-screen transition-all duration-300">
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
      <router-view />
    </main>
=======
    <DefaultLayout v-if="$store.state.auth.token && $store.state.auth.user" />
    <router-view v-else />
>>>>>>> Stashed changes
  </div>
</template>

<script>
<<<<<<< Updated upstream
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'App',

  components: {
    Sidebar,
  },

  setup() {
    const router = useRouter()

    const showSidebar = computed(() => {
      const hideOnRoutes = ['/login', '/register']
      return !hideOnRoutes.includes(router.currentRoute.value.path)
    })

    return {
      showSidebar,
    }
  },
}
</script>

<!--<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <router-view />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
<<<<<<< HEAD
import { useStore } from 'vuex' // ⬅️ استبدل useAuthStore بـ useStore
import Navbar from './components/shared/Navbar.vue'
import ToastContainer from './components/shared/ToastContainer.vue'
import { useI18n } from 'vue-i18n'
=======
import DefaultLayout from '@/layouts/DefaultLayout.vue'
>>>>>>> Stashed changes
=======
import Navbar from '@/components/shared/Navbar.vue'
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73

export default {
  name: 'App',
  components: {
<<<<<<< Updated upstream
    Navbar,
  },
  setup() {
    const route = useRoute()

    const showNavbar = computed(() => {
      const hideOnRoutes = ['/login', '/register']
      return !hideOnRoutes.includes(route.path)
    })

    return {
      showNavbar,
=======
    DefaultLayout,
  },
  mounted() {
    // التحقق من التوثيق عند تحميل التطبيق
    if (this.$store.state.auth.token) {
      this.$store.dispatch('auth/checkAuth')
>>>>>>> Stashed changes
    }
  },
}
</script>
<<<<<<< Updated upstream

<style>
<<<<<<< HEAD
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

#app {
  min-height: 100vh;
}

.main-content {
  min-height: calc(100vh - 80px);
  padding: 20px;
}

/* تنسيقات عامة */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: background 0.3s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}
</style>
=======
>>>>>>> Stashed changes
=======
/* يمكنك إضافة styles عامة هنا إذا لزم الأمر */
</style>-->
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
