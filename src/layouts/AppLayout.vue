<template>
  <div>
    <main class="main-content">
      <router-view />
      <!--<Navbar />-->
    </main>
  </div>
</template>

<script>
//import Navbar from '@/components/shared/Navbar.vue'

export default {
  name: 'AppLayout',
  /*components: {
    Navbar,
  },*/
}
</script>

<style scoped>
.main-content {
  padding: 20px;
  min-height: calc(100vh - 80px);
}
</style>
