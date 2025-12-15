<!-- src/views/Register.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">إنشاء حساب جديد</h2>

      <form @submit.prevent="handleRegister">
        <!-- Name -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">الاسم</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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

        <!-- Confirm Password -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">تأكيد كلمة المرور</label>
          <input
            v-model="form.password_confirmation"
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
          class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {{ loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب' }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <router-link to="/login" class="text-blue-600 hover:underline">
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
      this.error = ''

      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'كلمتا المرور غير متطابقتين'
        return
      }

      this.loading = true

      try {
        const response = await this.$store.dispatch('auth/register', this.form)

        if (response?.status) {
          this.$router.push('/dashboard')
        } else {
          this.error = response?.message || 'فشل إنشاء الحساب'
        }
      } catch (err) {
        console.error(err)
        this.error = 'حدث خطأ أثناء إنشاء الحساب'
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
