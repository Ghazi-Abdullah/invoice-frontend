// src/plugins/i18n.js
import { createI18n } from 'vue-i18n'
import ar from './locales/ar.json'
import en from './locales/en.json'

// دالة لاستعادة اللغة المحفوظة
const getSavedLanguage = () => {
  try {
    return localStorage.getItem('userLanguage') || 'ar'
  } catch {
    return 'ar'
  }
}

// إنشاء نسخة i18n
const i18n = createI18n({
  legacy: false,
  locale: getSavedLanguage(),
  fallbackLocale: 'en',
  messages: {
    ar,
    en
  },
  missing: (locale, key) => {
    console.warn(`[i18n] Missing translation for key "${key}" in locale "${locale}"`)
    return key
  }
})

// تطبيق الإعدادات الأولية
const savedLocale = getSavedLanguage()
document.documentElement.lang = savedLocale
document.documentElement.dir = savedLocale === 'ar' ? 'rtl' : 'ltr'

// دالة لتغيير اللغة
export const changeLanguage = (locale) => {
  if (i18n.global.availableLocales.includes(locale)) {
    i18n.global.locale.value = locale
    localStorage.setItem('userLanguage', locale)
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'

    console.log(`✅ Language changed to: ${locale}`)
    return true
  }
  console.error(`❌ Language "${locale}" is not available`)
  return false
}

export default i18n
