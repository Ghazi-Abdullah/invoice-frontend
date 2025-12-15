<template>
  <div id="app">
    <DefaultLayout v-if="$store.state.auth.token && $store.state.auth.user" />
    <router-view v-else />
  </div>
</template>

<script>
import DefaultLayout from '@/layouts/DefaultLayout.vue'

export default {
  name: 'App',
  components: {
    DefaultLayout,
  },
  mounted() {
    // التحقق من التوثيق عند تحميل التطبيق
    if (this.$store.state.auth.token) {
      this.$store.dispatch('auth/checkAuth')
    }
  },
}
</script>
