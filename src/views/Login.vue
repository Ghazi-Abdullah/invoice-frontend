<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="mb-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 animate-float"
          >
            <font-awesome-icon :icon="['fas', 'file-invoice-dollar']" class="text-white text-2xl" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('auth.welcomeBack') }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('auth.loginSubtitle') }}</p>
      </div>

      <!-- Login Form -->
      <BaseCard class="shadow-xl border-0">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <BaseInput
            v-model="form.email"
            type="email"
            :label="$t('auth.email')"
            required
            :placeholder="$t('users.emailPlaceholder')"
            :prefix-icon="['fas', 'envelope']"
            :error="errors.email"
          />

          <!-- Password -->
          <div class="relative">
            <BaseInput
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              :label="$t('auth.password')"
              required
              :placeholder="$t('auth.passwordPlaceholder')"
              :prefix-icon="['fas', 'lock']"
              :error="errors.password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute left-3 top-9 text-gray-400 hover:text-gray-600"
              :title="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
            >
              <font-awesome-icon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
            </button>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="mr-2 block text-sm text-gray-900">
                {{ $t('auth.remember_me') }}
              </label>
            </div>

            <router-link
              to="/forgot-password"
              class="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              {{ $t('auth.forgot_password') }}
            </router-link>
          </div>

          <!-- Error Message -->
          <BaseAlert
            v-if="error"
            type="error"
            :title="$t('auth.loginError')"
            :message="error"
            dismissible
            @dismiss="error = ''"
            class="mt-4 animate-fade-in"
          />

          <!-- Submit Button -->
          <BaseButton
            type="primary"
            :loading="loading"
            :disabled="loading"
            html-type="submit"
            block
            size="lg"
            class="mt-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <template v-if="loading">
              <font-awesome-icon :icon="['fas', 'spinner']" class="animate-spin ml-2" />
              {{ $t('auth.loggingIn') }}
            </template>
            <template v-else>
              <font-awesome-icon :icon="['fas', 'sign-in-alt']" class="ml-2" />
              {{ $t('auth.login') }}
            </template>
          </BaseButton>
        </form>

        <!-- Divider -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">{{ $t('common.or') }}</span>
            </div>
          </div>
        </div>

        <!-- Register Link -->
        <div class="mt-8 text-center">
          <p class="text-gray-600">
            {{ $t('auth.noAccount') }}
            <router-link to="/register" class="text-primary-600 hover:text-primary-800 font-medium">
              {{ $t('auth.register') }}
            </router-link>
          </p>
        </div>

        <!-- Demo Credentials -->
        <div class="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div class="flex items-start">
            <font-awesome-icon :icon="['fas', 'info-circle']" class="text-blue-600 mt-0.5 ml-3" />
            <div>
              <h4 class="text-sm font-medium text-blue-800 mb-2">
                {{ $t('auth.demoCredentials') }}:
              </h4>
              <div class="text-xs text-blue-700 space-y-2">
                <div class="flex items-center">
                  <font-awesome-icon :icon="['fas', 'user']" class="ml-2" />
                  <code class="bg-blue-100 px-2 py-1 rounded">admin@invoice.com</code>
                </div>
                <div class="flex items-center">
                  <font-awesome-icon :icon="['fas', 'key']" class="ml-2" />
                  <code class="bg-blue-100 px-2 py-1 rounded">password123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- Security Note -->
      <div class="mt-8 text-center">
        <p class="text-xs text-gray-500">
          © 2024 {{ $t('app.name') }}. {{ $t('auth.allRightsReserved') }}
          <br />
          <a href="#" class="text-gray-600 hover:text-gray-800">{{ $t('auth.privacyPolicy') }}</a> •
          <a href="#" class="text-gray-600 hover:text-gray-800">{{ $t('auth.terms') }}</a>
        </p>
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
          this.$toast.success(this.$t('auth.loginSuccess'), {
            position: 'top-center',
            timeout: 2000,
          })

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
        console.error('❌ ' + this.$t('errors.loadFailed') + ':', err)
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
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
</style>
