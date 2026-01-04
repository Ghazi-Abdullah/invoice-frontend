// src/plugins/i18n.js
import { createI18n } from 'vue-i18n'
import ar from './locales/ar.json'
import en from './locales/en.json'

const messages = {
  ar,
  en
}

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
  fallbackLocale: 'ar',
  messages,
  silentTranslationWarn: true,
  missingWarn: false,
  fallbackWarn: false
})

// تطبيق الإعدادات الأولية
const applyLanguageSettings = (locale) => {
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'

  // إضافة كلاس للغة
  document.body.classList.remove('lang-ar', 'lang-en')
  document.body.classList.add(`lang-${locale}`)
}

// تطبيق الإعدادات الأولية
applyLanguageSettings(getSavedLanguage())

// دالة لتغيير اللغة
export const changeLanguage = (locale) => {
  if (i18n.global.availableLocales.includes(locale)) {
    i18n.global.locale.value = locale
    localStorage.setItem('userLanguage', locale)
    applyLanguageSettings(locale)
    console.log(`✅ Language changed to: ${locale}`)
    return true
  }
  console.error(`❌ Language "${locale}" is not available`)
  return false
}

// دالة للحصول على اللغة الحالية
export const getCurrentLanguage = () => i18n.global.locale.value

// دالة لمعرفة إذا كانت اللغة العربية
export const isRTL = () => getCurrentLanguage() === 'ar'

export default i18n
