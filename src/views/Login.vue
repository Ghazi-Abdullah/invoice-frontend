<template>
<<<<<<< Updated upstream
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

<<<<<<< HEAD
      <p class="register-link">
        {{ $t('auth.no_account') }}
        <router-link to="/register">{{ $t('auth.register_here') }}</router-link>
      </p>
=======
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ $t('auth.login') }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ $t('auth.loginDescription') }}
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">{{ $t('auth.email') }}</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              :placeholder="$t('auth.passwordPlaceholder')"
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
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ loading ? $t('auth.loggingIn') : $t('auth.login') }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/register" class="font-medium text-blue-600 hover:text-blue-500">
            {{ $t('auth.noAccount') }}
          </router-link>
        </div>
      </form>
>>>>>>> Stashed changes
=======
      <div class="mt-4 text-center">
        <router-link to="/register" class="text-blue-600 hover:text-blue-800">
          إنشاء حساب جديد
        </router-link>
      </div>
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
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
<<<<<<< HEAD
<<<<<<< Updated upstream
    async login() {
=======
    async handleLogin() {
>>>>>>> Stashed changes
=======
    ...mapActions({
      login: 'auth/login',
    }),

    async handleLogin() {
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
      this.loading = true
      this.error = ''

      try {
<<<<<<< HEAD
<<<<<<< Updated upstream
        const response = await this.$store.dispatch('auth/login', this.credentials)
        console.log('✅ Login successful:', response.data)
=======
        const result = await this.login({
          email: this.form.email,
          password: this.form.password,
        })
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73

        if (result.success) {
          this.$router.push('/dashboard')
        } else {
          this.error = result.error || 'فشل تسجيل الدخول'
        }
      } catch (error) {
<<<<<<< HEAD
        console.error('❌ Login failed:', error)
        const errorMsg = error.response?.data?.message || error.message
        this.$toast.error(this.$t('auth.login_failed') + ': ' + errorMsg, {
          position: 'top-right',
          autoClose: 3000,
        })
=======
        const response = await this.$store.dispatch('auth/login', this.form)

        if (response.status) {
          this.$toast.success(this.$t('auth.loginSuccess'))
          this.$router.push('/')
        } else {
          this.error = response.message || this.$t('auth.loginFailed')
        }
      } catch (error) {
        this.error = error.message || this.$t('auth.loginFailed')
>>>>>>> Stashed changes
=======
        this.error = 'حدث خطأ. حاول مرة أخرى'
        console.error('Login error:', error)
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
