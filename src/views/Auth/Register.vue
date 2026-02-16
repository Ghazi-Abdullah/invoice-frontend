<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6">
          <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <font-awesome-icon :icon="['fas', 'user-plus']" class="text-white text-2xl" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-800 mb-3">{{ $t('auth.register') }}</h1>
        <p class="text-gray-600">{{ $t('auth.registerSubtitle') }}</p>
      </div>

      <!-- Register Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div>
            <form @submit.prevent="handleRegister" class="space-y-6">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('users.name') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <font-awesome-icon :icon="['fas', 'user']" class="text-gray-400" />
                  </div>
                  <input
                    v-model="form.name"
                    required
                    :placeholder="$t('users.namePlaceholder')"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
              </div>

              <!-- Email -->
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
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('auth.password') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <font-awesome-icon :icon="['fas', 'lock']" class="text-gray-400" />
                  </div>
                  <input
                    v-model="form.password"
                    type="password"
                    required
                    placeholder="••••••••"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
              </div>

              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ $t('auth.confirm_password') }}
                </label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <font-awesome-icon :icon="['fas', 'lock']" class="text-gray-400" />
                  </div>
                  <input
                    v-model="form.password_confirmation"
                    type="password"
                    required
                    :placeholder="$t('auth.confirm_passwordPlaceholder')"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-600">
                  {{ errors.password_confirmation }}
                </p>
              </div>

              <!-- Terms -->
              <div class="pt-4">
                <div class="flex items-start">
                  <input
                    id="terms"
                    v-model="form.agree_terms"
                    type="checkbox"
                    required
                    class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
                  />
                  <label for="terms" class="ml-3 text-sm text-gray-700">
                    {{ $t('auth.agreeTo') }}
                    <a href="#" class="text-green-600 hover:text-green-800 font-medium">
                      {{ $t('auth.terms') }}
                    </a>
                    {{ $t('auth.and') }}
                    <a href="#" class="text-green-600 hover:text-green-800 font-medium">
                      {{ $t('auth.privacyPolicy') }}
                    </a>
                  </label>
                </div>
                <p v-if="errors.agree_terms" class="mt-2 text-sm text-red-600">
                  {{ errors.agree_terms }}
                </p>
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
                class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div class="flex items-center justify-center">
                  <span v-if="loading">
                    <font-awesome-icon :icon="['fas', 'spinner']" class="animate-spin mr-2" />
                    {{ $t('auth.creatingAccount') }}
                  </span>
                  <span v-else>
                    <font-awesome-icon :icon="['fas', 'user-plus']" class="mr-2" />
                    {{ $t('auth.register') }}
                  </span>
                </div>
              </button>
            </form>

            <!-- Login Link -->
            <div class="mt-8 pt-6 border-t border-gray-200 text-center">
              <p class="text-gray-600">
                {{ $t('auth.alreadyHaveAccount') }}
                <router-link to="/login" class="text-green-600 hover:text-green-800 font-medium">
                  {{ $t('auth.login') }}
                </router-link>
              </p>
            </div>
          </div>

          <!-- Right Column - Features -->
          <div class="md:pl-8 md:border-l border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Benefits of Registration</h3>

            <div class="space-y-6">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'bolt']" class="text-green-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="font-medium text-gray-800 mb-1">Quick Invoice Creation</h4>
                  <p class="text-sm text-gray-600">Create and manage invoices in minutes</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'chart-line']" class="text-blue-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="font-medium text-gray-800 mb-1">Analytics Dashboard</h4>
                  <p class="text-sm text-gray-600">Track your business performance</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-purple-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="font-medium text-gray-800 mb-1">Secure Data Storage</h4>
                  <p class="text-sm text-gray-600">Your data is protected with encryption</p>
                </div>
              </div>

              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <font-awesome-icon :icon="['fas', 'mobile-alt']" class="text-orange-600" />
                  </div>
                </div>
                <div class="ml-4">
                  <h4 class="font-medium text-gray-800 mb-1">Mobile Friendly</h4>
                  <p class="text-sm text-gray-600">Access from any device, anywhere</p>
                </div>
              </div>
            </div>

            <!-- Security Info -->
            <div class="mt-8 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <font-awesome-icon :icon="['fas', 'shield-check']" class="text-gray-400 mr-3" />
                <div>
                  <p class="text-sm font-medium text-gray-700">Secure Registration</p>
                  <p class="text-xs text-gray-500">Your information is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      loading: false,
      error: '',
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        agree_terms: false,
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
    async handleRegister() {
      this.error = ''
      this.errors = {}

      if (!this.form.name.trim()) {
        this.errors.name = this.$t('validation.required', { field: this.$t('users.name') })
        return
      }

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

      if (this.form.password.length < 8) {
        this.errors.password = this.$t('validation.minLength', {
          field: this.$t('auth.password'),
          min: 8,
        })
        return
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.errors.password_confirmation = this.$t('validation.passwordMatch')
        return
      }

      if (!this.form.agree_terms) {
        this.errors.agree_terms = this.$t('auth.mustAgreeTerms')
        return
      }

      this.loading = true

      try {
        const response = await this.$store.dispatch('auth/register', this.form)

        if (response?.success) {
          this.$toast.success(this.$t('auth.registerSuccess'))
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        } else {
          this.error = response?.message || this.$t('auth.registerFailed')
          if (response?.errors) {
            this.errors = response.errors
          }
        }
      } catch (err) {
        console.error('Register error:', err)
        this.error = this.$t('auth.registerErrorGeneral')
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
