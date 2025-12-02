<template>
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
    async login() {
      this.loading = true

      try {
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
