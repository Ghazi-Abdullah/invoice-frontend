// api.js
import axios from 'axios'
import { toast } from 'vue3-toastify'

// ✅ إنشاء axios instance مع الإعدادات الأساسية
const api = axios.create({
  // الـ baseURL ينتهي بـ /api لأن جميع المسارات في Laravel تبدأ بـ /api
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 10000,
  withCredentials: true
})

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const token = JSON.parse(userInfo).token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        console.log('🔐 Token added to request headers')
      }
    }

    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data || '')
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)

    if (response.data?.message && response.config.method !== 'get') {
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 3000,
        rtl: true
      })
    }

    return response
  },
  (error) => {
    console.error(`❌ ${error.response?.status || 'Network'} Error: ${error.config?.url}`)

    let errorMessage = 'حدث خطأ في الاتصال'

    if (error.response) {
      const status = error.response.status

      switch (status) {
        case 401:
          errorMessage = 'غير مصرح لك بالوصول'
          localStorage.removeItem('userInfo')
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          errorMessage = 'ليس لديك صلاحية للوصول'
          break
        case 404:
          errorMessage = 'الصفحة غير موجودة'
          break
        case 422:
          errorMessage = 'بيانات غير صحيحة'
          if (error.response.data?.errors) {
            const errors = error.response.data.errors
            errorMessage = Object.values(errors).flat().join(', ')
          }
          break
        case 500:
          errorMessage = 'حدث خطأ في الخادم'
          break
        default:
          errorMessage = error.response.data?.message || 'حدث خطأ غير متوقع'
      }

      console.log('📡 Server error response:', error.response.data)
    } else if (error.request) {
      errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت'
      console.log('🌐 No response from server')
    } else {
      errorMessage = error.message || 'حدث خطأ غير متوقع'
      console.log('⚠️ Request setup error:', error.message)
    }

    toast.error(errorMessage, {
      position: 'top-right',
      autoClose: 5000,
      rtl: true
    })

    return Promise.reject(error)
  }
)

export default api
