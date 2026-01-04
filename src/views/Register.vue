<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mb-6">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25"
          >
            <font-awesome-icon :icon="['fas', 'user-plus']" class="text-white text-2xl" />
          </div>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">{{ $t('auth.register') }}</h1>
        <p class="text-gray-600 mt-2">{{ $t('auth.registerSubtitle') }}</p>
      </div>

      <!-- Register Form -->
      <BaseCard class="shadow-xl border-0">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name -->
          <BaseInput
            v-model="form.name"
            :label="$t('users.name')"
            required
            :placeholder="$t('users.namePlaceholder')"
            :prefix-icon="['fas', 'user']"
            :error="errors.name"
          />

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
          <BaseInput
            v-model="form.password"
            type="password"
            :label="$t('auth.password')"
            required
            :placeholder="$t('auth.passwordPlaceholder')"
            :prefix-icon="['fas', 'lock']"
            :error="errors.password"
          />

          <!-- Confirm Password -->
          <BaseInput
            v-model="form.password_confirmation"
            type="password"
            :label="$t('auth.confirm_password')"
            required
            :placeholder="$t('auth.confirm_passwordPlaceholder')"
            :prefix-icon="['fas', 'lock']"
            :error="errors.password_confirmation"
          />

          <!-- Terms Agreement -->
          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.agree_terms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="terms" class="mr-3 block text-sm text-gray-900">
              {{ $t('auth.agreeTo') }}
              <a href="#" class="text-primary-600 hover:text-primary-500">{{ $t('auth.terms') }}</a>
              {{ $t('auth.and') }}
              <a href="#" class="text-primary-600 hover:text-primary-500">{{ $t('auth.privacyPolicy') }}</a>
            </label>
          </div>
          <div v-if="errors.agree_terms" class="text-sm text-red-600">
            {{ errors.agree_terms }}
          </div>

          <!-- Error Message -->
          <BaseAlert
            v-if="error"
            type="error"
            :title="$t('auth.registerError')"
            :message="error"
            dismissible
            @dismiss="error = ''"
            class="mt-4"
          />

          <!-- Submit Button -->
          <BaseButton
            type="primary"
            :loading="loading"
            :disabled="loading"
            html-type="submit"
            block
            size="lg"
            class="mt-6 shadow-md"
          >
            <template v-if="loading">
              <font-awesome-icon :icon="['fas', 'spinner']" class="animate-spin ml-2" />
              {{ $t('auth.creatingAccount') }}
            </template>
            <template v-else>
              <font-awesome-icon :icon="['fas', 'user-plus']" class="ml-2" />
              {{ $t('auth.register') }}
            </template>
          </BaseButton>
        </form>

        <!-- Login Link -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <p class="text-gray-600">
            {{ $t('auth.alreadyHaveAccount') }}
            <router-link to="/login" class="text-primary-600 hover:text-primary-800 font-medium">
              {{ $t('auth.login') }}
            </router-link>
          </p>
        </div>

        <!-- Security Note -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div class="flex items-start">
            <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-blue-600 mt-0.5 ml-3" />
            <div>
              <h4 class="text-sm font-medium text-blue-800 mb-1">{{ $t('auth.securityInfo') }}</h4>
              <p class="text-xs text-blue-700">
                {{ $t('auth.securityDescription') }}
              </p>
            </div>
          </div>
        </div>
      </BaseCard>
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
        console.error('❌ ' + this.$t('errors.createFailed') + ':', err)
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
