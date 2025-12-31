<template>
  <footer class="bg-white border-t border-gray-200 py-4 px-6">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="text-sm text-gray-600 mb-2 md:mb-0">
        © {{ currentYear }} {{ $t('app.name') }}. {{ $t('footer.rights_reserved') }}
      </div>

      <div
        class="flex items-center space-x-4 text-sm text-gray-600"
        :class="{ 'space-x-reverse': isRTL }"
      >
        <router-link to="/privacy" class="hover:text-blue-600 transition-colors">
          {{ $t('footer.privacy') }}
        </router-link>

        <router-link to="/terms" class="hover:text-blue-600 transition-colors">
          {{ $t('footer.terms') }}
        </router-link>

        <a href="mailto:support@invoicesystem.com" class="hover:text-blue-600 transition-colors">
          {{ $t('footer.support') }}
        </a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',

  computed: {
    isRTL() {
      return this.$i18n.locale === 'ar'
    },

    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>
