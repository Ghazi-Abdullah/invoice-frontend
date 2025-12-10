<template>
  <div class="login-container">
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">كلمة المرور</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <span v-if="loading">جاري تسجيل الدخول...</span>
          <span v-else>تسجيل الدخول</span>
        </button>
      </form>

      <div class="mt-4 text-center">
        <router-link to="/register" class="text-blue-600 hover:text-blue-800">
          إنشاء حساب جديد
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      error: '',
    }
  },
  methods: {
    ...mapActions({
      login: 'auth/login',
    }),

    async handleLogin() {
      this.loading = true
      this.error = ''

      try {
        const result = await this.login({
          email: this.form.email,
          password: this.form.password,
        })

        if (result.success) {
          this.$router.push('/dashboard')
        } else {
          this.error = result.error || 'فشل تسجيل الدخول'
        }
      } catch (error) {
        this.error = 'حدث خطأ. حاول مرة أخرى'
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
