<template>
<<<<<<< Updated upstream
  <div class="login-container">
    <div class="login-card">
      <h2>{{ $t('auth.login') }}</h2>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">{{ $t('auth.email') }}</label>
          <input
            type="email"
            id="email"
            v-model="credentials.email"
            required
            class="form-input"
            :placeholder="$t('auth.email_placeholder')"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ $t('auth.password') }}</label>
          <input
            type="password"
            id="password"
            v-model="credentials.password"
            required
            class="form-input"
            :placeholder="$t('auth.password_placeholder')"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary login-btn">
          {{ loading ? $t('auth.logging_in') : $t('auth.login') }}
        </button>
      </form>

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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        email: '',
        password: '',
      },
      loading: false,
    }
  },
  methods: {
<<<<<<< Updated upstream
    async login() {
=======
    async handleLogin() {
>>>>>>> Stashed changes
      this.loading = true

      try {
<<<<<<< Updated upstream
        const response = await this.$store.dispatch('auth/login', this.credentials)
        console.log('✅ Login successful:', response.data)

        // الانتظار قليلاً لضمان تحديث الحالة
        await new Promise((resolve) => setTimeout(resolve, 100))

        // التحقق من حالة المصادقة
        const isAuthenticated = this.$store.getters['auth/isAuthenticated']
        console.log('✅ After login - isAuthenticated:', isAuthenticated)

        if (isAuthenticated) {
          this.$router.push('/dashboard')
        } else {
          throw new Error('Authentication failed after login')
        }
      } catch (error) {
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
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.login-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-link a {
  color: #667eea;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
