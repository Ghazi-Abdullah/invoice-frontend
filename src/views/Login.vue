<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">تسجيل الدخول</h2>

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">كلمة المرور</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <router-link to="/register" class="text-blue-600 hover:underline">
          إنشاء حساب جديد
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
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
    async handleLogin() {
      this.error = ''
      this.loading = true

      try {
        const response = await this.$store.dispatch('auth/login', this.form)

        if (response?.status) {
          this.$router.push('/dashboard')
        } else {
          this.error = response?.message || 'فشل تسجيل الدخول'
        }
      } catch (err) {
        console.error(err)
        this.error = 'حدث خطأ أثناء تسجيل الدخول'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
