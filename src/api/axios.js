import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000 // 10 ثواني
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request URL:', config.method?.toUpperCase(), config.baseURL + config.url)
    console.log('📝 Request Headers:', config.headers)
    console.log('📦 Request Data:', config.data)

    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo)
        const token = parsed.token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
          console.log('🔐 Token added to headers:', token.substring(0, 20) + '...')
        } else {
          console.warn('⚠️ No token found in userInfo')
        }
      } catch (error) {
        console.error('❌ Error parsing userInfo:', error)
      }
    } else {
      console.warn('⚠️ No userInfo found in localStorage')
    }

    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    })

    // Log the full error for debugging
    console.error('🔍 Full error object:', error)

    if (error.response?.status === 401) {
      console.log('🚪 Unauthorized (401) - clearing localStorage')
      localStorage.removeItem('userInfo')

      // إرسال حدث لتحديث حالة المصادقة
      window.dispatchEvent(new CustomEvent('auth-changed', {
        detail: { isAuthenticated: false }
      }))

      // توجيه إلى صفحة تسجيل الدخول
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    if (error.response?.status === 404) {
      console.error('🔍 Endpoint not found (404):', error.config?.url)
    }

    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout')
    }

    if (!error.response) {
      console.error('🌐 Network error - check CORS or server connection')
    }

    const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ في الاتصال بالخادم'

    // استخدام Vue Toast إذا كان متاحاً
    if (window.vueApp && window.vueApp.$toast) {
      window.vueApp.$toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      })
    } else {
      // استخدام CustomEvent كبديل
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: {
          type: 'error',
          message: errorMessage
        }
      }))
    }

    return Promise.reject(error)
  }
)

// دالة مساعدة لاختبار الاتصال
api.testConnection = async () => {
  try {
    console.log('🔍 Testing API connection...')
    const response = await api.get('/test', { timeout: 5000 })
    console.log('✅ API Connection Test Successful:', response.data)
    return { success: true, data: response.data }
  } catch (error) {
    console.error('❌ API Connection Test Failed:', error.message)
    return { success: false, error: error.message }
  }
}

export default api
