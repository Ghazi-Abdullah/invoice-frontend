<template>
  <div id="app" :class="appClasses" class="app-container">
    <!-- Toast Notifications -->
    <ToastContainer />

    <!-- Render Layout Based on Authentication -->
    <template v-if="isAuthenticated">
      <DefaultLayout />
    </template>
    <template v-else>
      <router-view />
    </template>

    <!-- Global Loading Overlay -->
    <div v-if="globalLoading" class="global-loading-overlay">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-white font-medium">{{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script>
import ToastContainer from '@/components/ToastContainer.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

export default {
  name: 'App',

  components: {
    ToastContainer,
    DefaultLayout,
    LoadingSpinner,
  },

  computed: {
    isAuthenticated() {
      const token = this.$store.state.auth.token
      const user = this.$store.state.auth.user
      return token && user
    },

    appClasses() {
      return {
        'lang-ar': this.$i18n.locale === 'ar',
        'lang-en': this.$i18n.locale === 'en',
        rtl: this.$i18n.locale === 'ar',
        ltr: this.$i18n.locale === 'en',
      }
    },

    globalLoading() {
      // يمكنك إضافة شروط للتحميل العام هنا
      return (
        this.$store.state.auth.loading ||
        this.$store.state.invoices.loading ||
        this.$store.state.clients.loading
      )
    },
  },

  created() {
    // تطبيق إعدادات اللغة عند بدء التطبيق
    const savedLang = localStorage.getItem('userLanguage') || 'ar'
    this.$i18n.locale = savedLang
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLang
    document.documentElement.setAttribute('class', `lang-${savedLang}`)

    // التحقق من المصادقة عند تحميل التطبيق
    const token = localStorage.getItem('token')
    if (token && !this.$store.state.auth.user) {
      this.$store.dispatch('auth/checkAuth')
    }
  },

  mounted() {
    // إضافة فئات للغة
    document.body.classList.add(`lang-${this.$i18n.locale}`)
    if (this.$i18n.locale === 'ar') {
      document.body.classList.add('rtl')
      document.body.classList.remove('ltr')
    } else {
      document.body.classList.add('ltr')
      document.body.classList.remove('rtl')
    }
  },
}
</script>

<style>
/* الأنماط العامة للتطبيق */
.app-container {
  font-family: theme('fontFamily.sans');
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: linear-gradient(135deg, #f6f8fa 0%, #f1f5f9 100%);
  color: var(--color-gray-900);
  transition: background-color 0.3s ease;
}

/* دعم RTL/LTR */
.rtl {
  direction: rtl;
  text-align: right;
}

.ltr {
  direction: ltr;
  text-align: left;
}

/* Global Loading Overlay */
.global-loading-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50;
}

/* تحسينات للأجهزة المحمولة */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}

/* تنسيقات عامة */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-gray-100);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-400);
}

/* Selection Color */
::selection {
  background-color: var(--color-primary-light);
  color: white;
}

/* Focus Styles */
*:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

/* Smooth Transitions */
.page-transition-enter-active,
.page-transition-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }

  body {
    background: white !important;
    color: black !important;
  }

  .print-break {
    page-break-before: always;
  }
}

/* Utility Classes */
.text-balance {
  text-wrap: balance;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Status Colors */
.status-draft {
  @apply bg-yellow-100 text-yellow-800;
}
.status-sent {
  @apply bg-blue-100 text-blue-800;
}
.status-paid {
  @apply bg-green-100 text-green-800;
}
.status-overdue {
  @apply bg-red-100 text-red-800;
}
</style>
