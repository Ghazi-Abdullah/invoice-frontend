<!-- src/views/Register.vue -->
<template>
<<<<<<< Updated upstream
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

<<<<<<< HEAD
      <p class="login-link">
        لديك حساب بالفعل؟
        <router-link to="/login">سجل الدخول</router-link>
      </p>
=======
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('auth.register') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.registerDescription') }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">{{ $t('common.name') }}</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.namePlaceholder')"
            />
          </div>
          <div>
            <label for="email" class="sr-only">{{ $t('auth.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.emailPlaceholder')"
            />
          </div>
          <div>
            <label for="password" class="sr-only">{{ $t('auth.password') }}</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.passwordPlaceholder')"
            />
          </div>
          <div>
            <label for="password_confirmation" class="sr-only">{{
              $t('auth.confirmPassword')
            }}</label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.confirmPasswordPlaceholder')"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <i class="fas fa-spinner fa-spin text-white"></i>
            </span>
            {{ loading ? $t('auth.registering') : $t('auth.register') }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            {{ $t('auth.haveAccount') }}
          </router-link>
        </div>
      </form>
>>>>>>> Stashed changes
=======
      <div class="mt-4 text-center">
        <router-link to="/login" class="text-blue-600 hover:text-blue-800">
          لديك حساب بالفعل؟ سجل الدخول
        </router-link>
      </div>
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
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

<<<<<<< Updated upstream
      try {
        // استخدم Vuex بدلاً من Pinia
        const result = await this.$store.dispatch('auth/register', this.form)

        if (result.success) {
          this.$router.push('/dashboard')
        } else {
          this.error = result.error || 'فشل التسجيل'
        }
      } catch (error) {
<<<<<<< HEAD
        console.error('Registration failed:', error)
        alert('فشل في إنشاء الحساب: ' + (error.response?.data?.message || error.message))
=======
      // Validate passwords match
      if (this.form.password !== this.form.password_confirmation) {
        this.error = this.$t('auth.passwordsDontMatch')
        this.loading = false
        return
      }

      try {
        const response = await this.$store.dispatch('auth/register', this.form)

        if (response.status) {
          this.$toast.success(this.$t('auth.registerSuccess'))
          this.$router.push('/')
        } else {
          this.error = response.message || this.$t('auth.registerFailed')
        }
      } catch (error) {
        this.error = error.message || this.$t('auth.registerFailed')
>>>>>>> Stashed changes
=======
        this.error = 'حدث خطأ. حاول مرة أخرى'
        console.error('Register error:', error)
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
