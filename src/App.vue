<template>
  <div id="app">
<<<<<<< Updated upstream
    <ToastContainer />
    <main class="main-content">
      <Navbar v-if="showNavbar" />
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
import { useRoute } from 'vue-router'
import { useStore } from 'vuex' // ⬅️ استبدل useAuthStore بـ useStore
import Navbar from './components/shared/Navbar.vue'
import ToastContainer from './components/shared/ToastContainer.vue'
import { useI18n } from 'vue-i18n'
=======
import DefaultLayout from '@/layouts/DefaultLayout.vue'
>>>>>>> Stashed changes

export default {
  name: 'App',
  components: {
<<<<<<< Updated upstream
    Navbar,
    ToastContainer,
  },
  setup() {
    const route = useRoute()
    const store = useStore() // ⬅️ استخدام Vuex store بدلاً من Pinia

    const { locale, t } = useI18n()

    console.log('App mounted - Current locale:', locale.value)
    console.log('App mounted - Translation test:', t('app.name'))

    const showNavbar = computed(() => {
      // ⬅️ التصحيح هنا - استخدام Vuex getters بدلاً من Pinia
      const isAuthenticated = store.getters['auth/isAuthenticated']
      return isAuthenticated && route.name !== 'Login' && route.name !== 'Register'
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
