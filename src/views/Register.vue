<!-- src/views/Register.vue -->
<template>
  <div class="register-container">
    <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">إنشاء حساب جديد</h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">الاسم</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="أدخل اسمك"
          />
        </div>

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

        <div class="mb-4">
          <label class="block text-gray-700 mb-2">كلمة المرور</label>
          <input
            v-model="form.password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">تأكيد كلمة المرور</label>
          <input
            v-model="form.password_confirmation"
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
          class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
        >
          <span v-if="loading">جاري إنشاء الحساب...</span>
          <span v-else>إنشاء حساب</span>
        </button>
      </form>

      <div class="mt-4 text-center">
        <router-link to="/login" class="text-blue-600 hover:text-blue-800">
          لديك حساب بالفعل؟ سجل الدخول
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      loading: false,
      error: '',
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = ''

      try {
        // استخدم Vuex بدلاً من Pinia
        const result = await this.$store.dispatch('auth/register', this.form)

        if (result.success) {
          this.$router.push('/dashboard')
        } else {
          this.error = result.error || 'فشل التسجيل'
        }
      } catch (error) {
        this.error = 'حدث خطأ. حاول مرة أخرى'
        console.error('Register error:', error)
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
