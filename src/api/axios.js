// src/api/axios.js
import axios from 'axios'

const instance = axios.create({
  // تأكد من أن baseURL لا ينتهي بـ /api
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// إضافة interceptor لطباعة logs للمساعدة في debugging
instance.interceptors.request.use(
  (config) => {
    console.log(`🚀 ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '')
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

export default instance
