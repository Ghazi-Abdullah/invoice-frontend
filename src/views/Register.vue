<template>
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

      try {
        await this.$store.dispatch('auth/register', this.userData)
        this.$router.push('/dashboard')
      } catch (error) {
        console.error('Registration failed:', error)
        alert('فشل في إنشاء الحساب: ' + (error.response?.data?.message || error.message))
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
