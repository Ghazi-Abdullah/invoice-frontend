import axios from 'axios'

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
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
api.interceptors.response.use(
  (response) => {
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

    return Promise.reject(error)
  }
)

export default api
