<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4"
  >
    <!-- Main Container -->
    <div class="w-full max-w-md">
      <!-- Header with Logo -->
      <div class="text-center mb-12">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6"
        >
          <div
            class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center"
          >
            <font-awesome-icon :icon="['fas', 'file-invoice-dollar']" class="text-white text-2xl" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-3">{{ $t('auth.welcomeBack') }}</h1>
        <p class="text-gray-600">{{ $t('auth.loginSubtitle') }}</p>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('auth.email') }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="['fas', 'envelope']" class="text-gray-400" />
              </div>
              <input
                v-model="form.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700">
                {{ $t('auth.password') }}
              </label>
              <router-link to="/forgot-password" class="text-sm text-blue-600 hover:text-blue-800">
                {{ $t('auth.forgot_password') }}
              </router-link>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="['fas', 'lock']" class="text-gray-400" />
              </div>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <font-awesome-icon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              {{ $t('auth.remember_me') }}
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div class="flex">
              <div class="flex-shrink-0">
                <font-awesome-icon :icon="['fas', 'exclamation-circle']" class="text-red-500" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-700">{{ error }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div class="flex items-center justify-center">
              <span v-if="loading">
                <font-awesome-icon :icon="['fas', 'spinner']" class="animate-spin mr-2" />
                {{ $t('auth.loggingIn') }}
              </span>
              <span v-else>
                <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="mr-2" />
                {{ $t('auth.login') }}
              </span>
            </div>
          </button>
        </form>

        <!-- Divider -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <p class="text-gray-600">
            {{ $t('auth.noAccount') }}
            <router-link to="/register" class="text-blue-600 hover:text-blue-800 font-medium">
              {{ $t('auth.register') }}
            </router-link>
          </p>
        </div>
      </div>

      <!-- Demo Credentials -->
      <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="h-5 w-5 text-blue-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">{{ $t('auth.demoCredentials') }}</h3>
            <div class="mt-2 text-sm text-blue-700">
              <p class="font-mono">admin@invoice.com</p>
              <p class="font-mono">password123</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">© 2024 InvoiceApp. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      error: '',
      showPassword: false,
      rememberMe: false,
      form: {
        email: 'admin@invoice.com',
        password: 'password123',
      },
      errors: {},
    }
  },
  mounted() {
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.errors = {}

      if (!this.form.email.trim()) {
        this.errors.email = this.$t('validation.required', { field: this.$t('auth.email') })
        return
      }

      if (!this.isValidEmail(this.form.email)) {
        this.errors.email = this.$t('validation.email')
        return
      }

      if (!this.form.password) {
        this.errors.password = this.$t('validation.required', { field: this.$t('auth.password') })
        return
      }

      this.loading = true

      try {
        const result = await this.$store.dispatch('auth/login', {
          ...this.form,
          remember: this.rememberMe,
        })

        if (result.success) {
          this.$toast.success(this.$t('auth.loginSuccess'))
          setTimeout(() => {
            this.$router.push('/dashboard')
          }, 1000)
        } else {
          this.error = result.message || this.$t('auth.loginFailed')
          if (result.errors) {
            this.errors = result.errors
          }
        }
      } catch (err) {
        console.error('Login error:', err)
        this.error = this.$t('auth.loginErrorGeneral')
      } finally {
        this.loading = false
      }
    },

    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
  },
}
</script>

<style scoped>
/* Simple transitions */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
