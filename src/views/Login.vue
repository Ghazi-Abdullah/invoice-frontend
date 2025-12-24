<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-center mb-6">تسجيل الدخول</h2>

      <form @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">البريد الإلكتروني</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="admin@invoice.com"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">كلمة المرور</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="password123"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>خطأ:</strong> {{ error }}
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="mb-4 text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
          ></div>
          <p class="mt-2 text-gray-600">جاري تسجيل الدخول...</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}
        </button>

        <!-- Debug Info -->
        <div v-if="debugInfo" class="mt-4 p-3 bg-gray-100 rounded">
          <details>
            <summary class="cursor-pointer text-sm text-gray-600">معلومات التصحيح</summary>
            <pre class="mt-2 text-xs overflow-auto">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
          </details>
        </div>
      </form>

      <!-- Debug Buttons -->
      <div class="mt-6 space-y-2">
        <button
          @click="testDirectLogin"
          class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 text-sm"
        >
          اختبار تسجيل الدخول المباشر
        </button>

        <button
          @click="checkAuthState"
          class="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-yellow-700 text-sm"
        >
          فحص حالة المصادقة
        </button>

        <button
          @click="clearLocalStorage"
          class="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 text-sm"
        >
          تنظيف التخزين المحلي
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Login',

  data() {
    return {
      form: {
        email: 'admin@invoice.com',
        password: 'password123',
      },
      error: '',
      debugInfo: null,
    }
  },

  computed: {
    ...mapState('auth', ['isLoading', 'loginError']),
    loading() {
      return this.isLoading
    },
  },

  created() {
    // تنظيف أي أخطاء سابقة
    this.$store.commit('auth/CLEAR_ERROR')

    // إذا كان المستخدم مصادقاً بالفعل، توجيهه إلى Dashboard
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$router.push('/dashboard')
    }
  },

  methods: {
    async handleLogin() {
      this.error = ''
      this.debugInfo = null

      try {
        console.log('🚀 بدء تسجيل الدخول...')

        // استدعاء action تسجيل الدخول من Vuex
        const result = await this.$store.dispatch('auth/login', this.form)

        console.log('✅ نتيجة تسجيل الدخول:', result)

        if (result.success) {
          // عرض رسالة نجاح
          this.$toast.success('تم تسجيل الدخول بنجاح!')

          // الانتقال إلى Dashboard بعد تأخير بسيط
          setTimeout(() => {
            console.log('📍 التوجيه إلى /dashboard')
            this.$router.push('/dashboard')
          }, 1000)
        } else {
          this.error = result.message || 'فشل تسجيل الدخول'
          this.debugInfo = { error: result }
        }
      } catch (err) {
        console.error('❌ خطأ غير متوقع:', err)
        this.error = 'حدث خطأ غير متوقع أثناء تسجيل الدخول'
        this.debugInfo = {
          message: err.message,
          stack: err.stack,
        }
      }
    },

    async testDirectLogin() {
      try {
        console.log('🧪 اختبار تسجيل الدخول المباشر...')

        // استخدام بيانات افتراضية
        const testData = {
          email: 'admin@invoice.com',
          password: 'password123',
        }

        const result = await this.$store.dispatch('auth/login', testData)

        if (result.success) {
          this.$toast.success('✅ اختبار تسجيل الدخول ناجح!')
          this.debugInfo = {
            testResult: result,
            storedToken: localStorage.getItem('token'),
            storedUser: localStorage.getItem('user'),
            vuexState: this.$store.state.auth,
          }
        } else {
          this.$toast.error('❌ اختبار تسجيل الدخول فاشل')
          this.debugInfo = { testError: result }
        }
      } catch (error) {
        console.error('❌ خطأ في الاختبار:', error)
        this.$toast.error('خطأ في الاختبار')
      }
    },

    checkAuthState() {
      console.log('🔍 فحص حالة المصادقة:')

      const authState = this.$store.state.auth
      const localStorageState = {
        token: localStorage.getItem('token'),
        user: localStorage.getItem('user'),
      }

      this.debugInfo = {
        vuexAuthState: {
          user: authState.user,
          token: authState.token ? '*** موجود ***' : 'غير موجود',
          isAuthenticated: this.$store.getters['auth/isAuthenticated'],
          is_admin: authState.is_admin,
          permissions: authState.permissions,
        },
        localStorage: {
          token: localStorageState.token ? '*** موجود ***' : 'غير موجود',
          user: localStorageState.user ? JSON.parse(localStorageState.user) : 'غير موجود',
        },
        axiosHeaders: {
          authorization: axios.defaults.headers.common['Authorization'] || 'غير معين',
        },
      }

      console.log('📊 حالة المصادقة:', this.debugInfo)
      this.$toast.info('تم فحص حالة المصادقة، انظر الـ console')
    },

    clearLocalStorage() {
      console.log('🧹 تنظيف localStorage...')

      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // تنظيف حالة Vuex
      this.$store.commit('auth/CLEAR_AUTH')

      // إعادة تعيين axios headers
      delete axios.defaults.headers.common['Authorization']

      this.$toast.success('تم تنظيف التخزين المحلي')
      this.debugInfo = { message: 'تم تنظيف جميع بيانات المصادقة' }
    },
  },
}
</script>
