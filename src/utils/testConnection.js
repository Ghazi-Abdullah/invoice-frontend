import api from '../api/axios'

export const testApiConnection = async () => {
  try {
    const response = await api.get('/sanctum/csrf-cookie')
    console.log('✅ CSRF Cookie successful')

    // جرب GET request أولاً
    const testResponse = await api.get('/user')
    console.log('✅ API Connection successful:', testResponse.data)
    return true
  } catch (error) {
    console.log('❌ API Connection failed:', error.message)

    if (error.response) {
      console.log('Status:', error.response.status)
      console.log('Data:', error.response.data)
    }

    return false
  }
}

// استدعِ الدالة في main.js أو في mounted
