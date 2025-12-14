<<<<<<< Updated upstream
// api.js
=======
>>>>>>> Stashed changes
import axios from 'axios'
import { toast } from 'vue3-toastify'

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
})

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // إضافة التوكن من localStorage إذا موجود
=======
  timeout: 30000 // 30 ثانية
})

// إضافة interceptor للطلبات
instance.interceptors.request.use(
  (config) => {
>>>>>>> Stashed changes
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Token added to request headers')
    }

    // تسجيل الطلب للتصحيح
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`, config.data || '')
    return config
  },
  (error) => {
    console.error('❌ Request error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)

    // عرض رسائل النجاح إذا كانت موجودة
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
      // Server responded with error
      const status = error.response.status

      switch (status) {
        case 401:
          errorMessage = 'غير مصرح لك بالوصول'
          // مسح بيانات المصادقة
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          // توجيه إلى صفحة تسجيل الدخول
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
      // No response received
      errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من اتصالك بالإنترنت'
      console.log('🌐 No response from server')
    } else {
      // Something else happened
      errorMessage = error.message || 'حدث خطأ غير متوقع'
      console.log('⚠️ Request setup error:', error.message)
    }

    // عرض رسالة الخطأ باستخدام toast
    toast.error(errorMessage, {
      position: 'top-right',
      autoClose: 5000,
      rtl: true
    })

    return Promise.reject(error)
  }
)

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
