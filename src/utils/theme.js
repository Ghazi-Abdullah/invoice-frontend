// ============================================================
// التحكم بالوضع الداكن / الفاتح
// ============================================================
const STORAGE_KEY = 'colorTheme' // 'light' | 'dark' | 'system'

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function resolveTheme(pref) {
  return pref === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : pref
}

export function applyTheme(pref) {
  const resolved = resolveTheme(pref)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function getThemePreference() {
  return localStorage.getItem(STORAGE_KEY) || 'system'
}

export function setThemePreference(pref) {
  localStorage.setItem(STORAGE_KEY, pref)
  applyTheme(pref)
}

export function toggleTheme() {
  const current = resolveTheme(getThemePreference())
  const next = current === 'dark' ? 'light' : 'dark'
  setThemePreference(next)
  return next
}

export function initTheme() {
  applyTheme(getThemePreference())
  // لو المستخدم مختار "حسب النظام"، تابع تغييرات نظام التشغيل لحظياً
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePreference() === 'system') applyTheme('system')
  })
}
