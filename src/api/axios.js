<<<<<<< HEAD
<<<<<<< Updated upstream
// api.js
=======
>>>>>>> Stashed changes
=======
// src/api/axios.js
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
import axios from 'axios'

<<<<<<< HEAD
<<<<<<< Updated upstream
// إنشاء axios instance مع الإعدادات الأساسية
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
=======
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
>>>>>>> Stashed changes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
<<<<<<< Updated upstream
  timeout: 10000, // 10 ثانية timeout
  withCredentials: true // إذا كنت تستخدم cookies
=======
const instance = axios.create({
  // تأكد من أن baseURL لا ينتهي بـ /api
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
})

// إضافة interceptor لطباعة logs للمساعدة في debugging
instance.interceptors.request.use(
  (config) => {
<<<<<<< HEAD
    // إضافة التوكن من localStorage إذا موجود
=======
  timeout: 30000 // 30 ثانية
})

// إضافة interceptor للطلبات
instance.interceptors.request.use(
  (config) => {
>>>>>>> Stashed changes
=======
    console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '')
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// إضافة interceptor للردود
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response) {
      console.log(`❌ ${error.response.status} Error: ${error.config.url}`)
      console.log('📡 Server error response:', error.response.data)
    } else if (error.request) {
      console.log('❌ No response received:', error.request)
    } else {
      console.log('❌ Request error:', error.message)
    }
    return Promise.reject(error)
  }
)

<<<<<<< HEAD
export default axiosInstance

/*import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const token = JSON.parse(userInfo).token
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Adding auth token to request')
    }

    console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, {
      data: config.data,
      params: config.params
    })

    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => {
<<<<<<< Updated upstream
    console.log('✅ API Response:', response.config.url, response.status)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.config?.url)

    if (error.response?.status === 401) {
      console.log('🚪 Unauthorized - redirecting to login')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }

    const errorMessage = error.response?.data?.message || 'حدث خطأ'
    window.dispatchEvent(new CustomEvent('show-toast', {
      detail: {
        type: 'error',
        message: errorMessage
      }
    }))

=======
    console.log(`✅ ${response.status} ${response.config.url}`, {
      data: response.data
    })
    return response
  },
  (error) => {
    if (error.response) {
      // الطلب تم وأعيدت استجابة مع رمز حالة خطأ
      console.error(`❌ ${error.response.status} Error: ${error.config.url}`, {
        data: error.response.data,
        headers: error.response.headers
      })

      if (error.response.status === 401) {
        // إذا كان الخطأ 401 (غير مصرح)، قم بتسجيل الخروج
        console.log('🔒 Unauthorized access, clearing auth data...')
        localStorage.removeItem('token')
        delete instance.defaults.headers.common['Authorization']

        // إعادة توجيه إلى صفحة تسجيل الدخول إذا كنا في المتصفح
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      } else if (error.response.status === 500) {
        console.error('🔥 Server 500 Error:', error.response.data)
      }
    } else if (error.request) {
      // الطلب تم ولكن لم يتم استقبال أي رد
      console.error('❌ No response received:', {
        url: error.config.url,
        request: error.request
      })
    } else {
      // حدث خطأ أثناء إعداد الطلب
      console.error('❌ Request setup error:', error.message)
    }

>>>>>>> Stashed changes
    return Promise.reject(error)
  }
)

export default api
=======
export default instance
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
