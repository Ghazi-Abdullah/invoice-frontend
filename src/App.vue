<template>
  <div id="app">
    <ToastContainer />
    <main class="main-content">
      <!-- عرض الـ Layout المناسب -->
      <DefaultLayout v-if="$store.state.auth.token && $store.state.auth.user" />
      <router-view v-else />
    </main>
  </div>
</template>

<script>
import ToastContainer from '@/components/ToastContainer.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
  name: 'App',
  components: {
    ToastContainer,
    DefaultLayout,
  },
  setup() {
    const store = useStore()

    const isAuthenticated = computed(() => {
      return store.state.auth.token && store.state.auth.user
    })

    return {
      isAuthenticated,
    }
  },
}
</script>

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
  direction: rtl;
}

#app {
  min-height: 100vh;
}

.main-content {
  min-height: 100vh;
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
