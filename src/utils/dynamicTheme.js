// ============================================================
// نظام الثيم الديناميكي — تبديل تلقائي للون العلامة التجارية
// ============================================================
// يقوم هذا الملف بتدوير لون "primary" (الذي تُبنى منه كل عناصر
// الواجهة: الأزرار، السايدبار، الروابط النشطة...) على فترات
// زمنية منتظمة، مع انتقال سلس بفضل transition الموجودة أصلاً
// على العناصر (btn / transition-all / transition-colors).
//
// الألوان الدلالية (success / danger / warning) لا تتغير أبداً
// حفاظاً على وضوح المعنى (نجاح/خطر/تحذير).
// ============================================================

const PALETTES = [
  {
    name: 'blue',
    shades: {
      50: '239 246 255', 100: '219 234 254', 200: '191 219 254', 300: '147 197 253',
      400: '96 165 250', 500: '59 130 246', 600: '37 99 235', 700: '29 78 216',
      800: '30 64 175', 900: '30 58 138',
    },
  },
  {
    name: 'indigo',
    shades: {
      50: '238 242 255', 100: '224 231 255', 200: '199 210 254', 300: '165 180 252',
      400: '129 140 248', 500: '99 102 241', 600: '79 70 229', 700: '67 56 202',
      800: '55 48 163', 900: '49 46 129',
    },
  },
  {
    name: 'teal',
    shades: {
      50: '240 253 250', 100: '204 251 241', 200: '153 246 228', 300: '94 234 212',
      400: '45 212 191', 500: '20 184 166', 600: '13 148 136', 700: '15 118 110',
      800: '17 94 89', 900: '19 78 74',
    },
  },
  {
    name: 'violet',
    shades: {
      50: '245 243 255', 100: '237 233 254', 200: '221 214 254', 300: '196 181 253',
      400: '167 139 250', 500: '139 92 246', 600: '124 58 237', 700: '109 40 217',
      800: '91 33 182', 900: '76 29 149',
    },
  },
  {
    name: 'rose',
    shades: {
      50: '255 241 242', 100: '255 228 230', 200: '254 205 211', 300: '253 164 175',
      400: '251 113 133', 500: '244 63 94', 600: '225 29 72', 700: '190 18 60',
      800: '159 18 57', 900: '136 19 55',
    },
  },
]

const KEY_ENABLED = 'dynamicThemeEnabled'
const KEY_INDEX = 'dynamicThemeIndex'
const DEFAULT_INTERVAL_MS = 60000 // 1 دقيقة

let currentIndex = 0
let timerId = null

function applyPalette(index) {
  const palette = PALETTES[index]
  if (!palette) return
  const root = document.documentElement
  Object.entries(palette.shades).forEach(([shade, rgb]) => {
    root.style.setProperty(`--color-primary-${shade}`, rgb)
  })
  root.setAttribute('data-brand-theme', palette.name)
}

export function isDynamicThemeEnabled() {
  const saved = localStorage.getItem(KEY_ENABLED)
  return saved === null ? true : saved === 'true'
}

export function setDynamicThemeEnabled(enabled) {
  localStorage.setItem(KEY_ENABLED, String(enabled))
  if (enabled) {
    startDynamicTheme()
  } else {
    stopDynamicTheme()
  }
}

export function startDynamicTheme(intervalMs = DEFAULT_INTERVAL_MS) {
  stopDynamicTheme()
  if (!isDynamicThemeEnabled()) return

  const saved = parseInt(localStorage.getItem(KEY_INDEX), 10)
  currentIndex = Number.isInteger(saved) ? saved % PALETTES.length : 0
  applyPalette(currentIndex)

  timerId = setInterval(() => {
    currentIndex = (currentIndex + 1) % PALETTES.length
    applyPalette(currentIndex)
    localStorage.setItem(KEY_INDEX, String(currentIndex))
  }, intervalMs)
}

export function stopDynamicTheme() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

export function nextPaletteNow() {
  currentIndex = (currentIndex + 1) % PALETTES.length
  applyPalette(currentIndex)
  localStorage.setItem(KEY_INDEX, String(currentIndex))
}

export function getPaletteNames() {
  return PALETTES.map((p) => p.name)
}
