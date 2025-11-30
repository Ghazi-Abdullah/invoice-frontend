<template>
  <div class="language-switcher">
    <button
      @click="toggleLanguage"
      class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      :class="{ 'bg-blue-50 border-blue-200': true }"
    >
      <span class="text-sm font-medium">
        {{ currentLanguage === 'ar' ? 'EN' : 'العربية' }}
      </span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
      </svg>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { changeLanguage } from '../../plugins/i18n'

export default {
  name: 'LanguageSwitcher',
  setup() {
    const { locale } = useI18n()

    const currentLanguage = computed(() => locale.value)

    const toggleLanguage = () => {
      const newLocale = currentLanguage.value === 'ar' ? 'en' : 'ar'
      changeLanguage(newLocale)
    }

    return {
      currentLanguage,
      toggleLanguage,
    }
  },
}
</script>
