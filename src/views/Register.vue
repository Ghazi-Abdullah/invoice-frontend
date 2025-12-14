<template>
<<<<<<< Updated upstream
  <div class="register-container">
    <div class="register-card">
      <h2>إنشاء حساب جديد</h2>

      <form @submit.prevent="register" class="register-form">
        <div class="form-group">
          <label for="name">الاسم الكامل</label>
          <input
            type="text"
            id="name"
            v-model="userData.name"
            required
            class="form-input"
            placeholder="ادخل اسمك الكامل"
          />
        </div>

        <div class="form-group">
          <label for="email">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            v-model="userData.email"
            required
            class="form-input"
            placeholder="ادخل بريدك الإلكتروني"
          />
        </div>

        <div class="form-group">
          <label for="password">كلمة المرور</label>
          <input
            type="password"
            id="password"
            v-model="userData.password"
            required
            class="form-input"
            placeholder="ادخل كلمة المرور"
          />
        </div>

        <div class="form-group">
          <label for="password_confirmation">تأكيد كلمة المرور</label>
          <input
            type="password"
            id="password_confirmation"
            v-model="userData.password_confirmation"
            required
            class="form-input"
            placeholder="أعد إدخال كلمة المرور"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary register-btn">
          {{ loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب' }}
        </button>
      </form>

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
    </div>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      userData: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      },
      loading: false,
    }
  },
  methods: {
    async register() {
      this.loading = true

<<<<<<< Updated upstream
      try {
        await this.$store.dispatch('auth/register', this.userData)
        this.$router.push('/dashboard')
      } catch (error) {
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
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-card {
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

.register-form {
  margin-bottom: 20px;
}

.register-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
