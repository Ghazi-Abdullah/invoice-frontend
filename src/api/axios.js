import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const isDev = import.meta.env.DEV // ✅ فقط في التطوير

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000
})

const attachToken = (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// ✅ قائمة الحقول التي لا يجب طباعتها أبداً
const SENSITIVE_FIELDS = ['password', 'password_confirmation', 'otp', 'token', 'current_password', 'new_password']

const redactSensitive = (data) => {
  if (!data || typeof data !== 'object') return data
  const clone = { ...data }
  Object.keys(clone).forEach((key) => {
    if (SENSITIVE_FIELDS.includes(key)) {
      clone[key] = '***REDACTED***'
    }
  })
  return clone
}

instance.interceptors.request.use(
  (config) => {
    if (isDev) {
      console.log(`🚀 [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`, redactSensitive(config.data) || '')
    }
    return attachToken(config)
  },
  (error) => Promise.reject(error)
)

const handleError = (error) => {
  if (error.response) {
    const { status, data, config } = error.response
    if (isDev) {
      console.error(`❌ ${status} Error: ${config.url}`, data)
    }

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete instance.defaults.headers.common['Authorization']
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  } else if (error.request) {
    if (isDev) console.error('❌ No response received:', error.request)
  } else {
    if (isDev) console.error('❌ Request error:', error.message)
  }

  return Promise.reject(error)
}

instance.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(`✅ ${response.status} ${response.config.url}`)
    }
    return response
  },
  handleError
)

export default instance
