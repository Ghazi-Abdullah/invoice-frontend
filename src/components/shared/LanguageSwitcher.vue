<template>
  <div class="flex items-center space-x-2" :class="isAr ? 'space-x-reverse' : ''">
    <button @click="setLocale('ar')" :class="btnClass('ar')" aria-label="Arabic">ع</button>
    <button @click="setLocale('en')" :class="btnClass('en')" aria-label="English">EN</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { changeLanguage } from '@/plugins/i18n' // Adjust path as needed

const { locale } = useI18n()

const isAr = computed(() => locale.value === 'ar')

const setLocale = (newLocale) => {
  console.log(`🔄 Switching to: ${newLocale}`)

  if (changeLanguage(newLocale)) {
    // For immediate reactivity, you might need to force a small update
    // The changeLanguage function already updates i18n.global.locale.value
    console.log('✅ Language switch processed')
  }
}

const btnClass = (l) => {
  const isActive = locale.value === l
  return [
    'px-3 py-2 rounded-md transition-all duration-200 font-medium border min-w-[44px] text-sm',
    isActive
      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25'
      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md',
  ]
}
</script>
