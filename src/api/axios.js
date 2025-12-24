// src/api/axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000 // 30 ثانية
})

// Request interceptor لإضافة التوكن وطباعة الـ logs
instance.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '')
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor لطباعة الاستجابات والأخطاء
instance.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    if (error.response) {
      console.log(`❌ ${error.response.status} Error: ${error.config.url}`)
      console.log('📡 Server error response:', error.response.data)

      if (error.response.status === 401) {
        localStorage.removeItem('token')
        delete instance.defaults.headers.common['Authorization']
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    } else if (error.request) {
      console.log('❌ No response received:', error.request)
    } else {
      console.log('❌ Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default instance
