<template>
  <div class="language-switcher">
    <button
      @click="toggleLanguage"
      class="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
      :class="isRTL ? 'space-x-reverse' : ''"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span class="text-sm font-medium">
        {{ currentLanguage === 'ar' ? 'English' : 'العربية' }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      languages: [
        { code: 'ar', name: 'العربية', dir: 'rtl' },
        { code: 'en', name: 'English', dir: 'ltr' },
      ],
    }
  },
  computed: {
    currentLanguage() {
      return this.$i18n.locale
    },
    isRTL() {
      return this.currentLanguage === 'ar'
    },
  },
  methods: {
    toggleLanguage() {
      const newLang = this.currentLanguage === 'ar' ? 'en' : 'ar'
      this.$i18n.locale = newLang
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = newLang

      // حفظ اللغة في localStorage
      localStorage.setItem('language', newLang)

      // إعادة تحميل الصفحة لتطبيق التغييرات
      window.location.reload()
    },
  },
  mounted() {
    // استعادة اللغة من localStorage
    const savedLang = localStorage.getItem('language')
    if (savedLang && this.languages.some(lang => lang.code === savedLang)) {
      this.$i18n.locale = savedLang
      document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = savedLang
    }
  },
}
</script>
