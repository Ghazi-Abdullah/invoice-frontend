<template>
  <div class="min-h-screen bg-gray-100">
    <Sidebar v-if="showSidebar" />

    <main :class="showSidebar ? 'mr-64' : ''" class="min-h-screen transition-all duration-300">
      <router-view />
    </main>
  </div>
</template>

<script>
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
import Navbar from '@/components/shared/Navbar.vue'

export default {
  name: 'App',
  components: {
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
    }
  },
}
</script>

<style>
/* يمكنك إضافة styles عامة هنا إذا لزم الأمر */
</style>-->
