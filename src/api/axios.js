// src/api/axios.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 ثانية
})

// دالة لإضافة التوكن
const attachToken = (config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    console.log(`🚀 [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`, config.data || '')
    return attachToken(config)
  },
  (error) => Promise.reject(error)
)

// دالة لمعالجة الأخطاء
const handleError = (error) => {
  if (error.response) {
    const { status, data, config } = error.response
    console.error(`❌ ${status} Error: ${config.url}`, data)

    if (status === 401) {
      localStorage.removeItem('token')
      delete instance.defaults.headers.common['Authorization']
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  } else if (error.request) {
    console.error('❌ No response received:', error.request)
  } else {
    console.error('❌ Request error:', error.message)
  }

  return Promise.reject(error)
}

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  handleError
)

export default instance
