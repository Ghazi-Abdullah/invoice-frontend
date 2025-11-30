<template>
  <div class="login-container">
    <div class="login-card">
      <h2>تسجيل الدخول</h2>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="email">البريد الإلكتروني</label>
          <input
            type="email"
            id="email"
            v-model="credentials.email"
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
            v-model="credentials.password"
            required
            class="form-input"
            placeholder="ادخل كلمة المرور"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary login-btn">
          {{ loading ? 'جاري التسجيل...' : 'تسجيل الدخول' }}
        </button>
      </form>

      <p class="register-link">
        ليس لديك حساب؟
        <router-link to="/register">سجل الآن</router-link>
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

        // تأكد من أن البيانات محفوظة في localStorage
        console.log('📦 LocalStorage userInfo:', localStorage.getItem('userInfo'))

        // تأكد من أن الحالة محدثة في store
        console.log('🛍️ AuthStore state:', {
          user: this.$store.state.auth.user,
          token: this.$store.state.auth.token,
          isAuthenticated: this.$store.getters['auth/isAuthenticated'],
        })

        // توجيه إلى Dashboard بعد نجاح التسجيل
        setTimeout(() => {
          this.$router.push('/dashboard')
        }, 100)
      } catch (error) {
        console.error('❌ Login failed:', error)
        console.log('🔍 Error details:', error.response?.data)
        alert('فشل في تسجيل الدخول: ' + (error.response?.data?.message || error.message))
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
