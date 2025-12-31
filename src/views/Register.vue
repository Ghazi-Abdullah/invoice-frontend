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
        <h1 class="text-3xl font-bold text-gray-900">أنشئ حساباً جديداً</h1>
        <p class="text-gray-600 mt-2">انضم إلى نظام إدارة الفواتير</p>
      </div>

      <!-- Register Form -->
      <BaseCard class="shadow-xl border-0">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Name -->
          <BaseInput
            v-model="form.name"
            label="الاسم الكامل"
            required
            placeholder="أدخل اسمك الكامل"
            :prefix-icon="['fas', 'user']"
            :error="errors.name"
          />

          <!-- Email -->
          <BaseInput
            v-model="form.email"
            type="email"
            label="البريد الإلكتروني"
            required
            placeholder="أدخل بريدك الإلكتروني"
            :prefix-icon="['fas', 'envelope']"
            :error="errors.email"
          />

          <!-- Password -->
          <BaseInput
            v-model="form.password"
            type="password"
            label="كلمة المرور"
            required
            placeholder="أدخل كلمة المرور"
            :prefix-icon="['fas', 'lock']"
            :error="errors.password"
          />

          <!-- Confirm Password -->
          <BaseInput
            v-model="form.password_confirmation"
            type="password"
            label="تأكيد كلمة المرور"
            required
            placeholder="أكد كلمة المرور"
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
              أوافق على
              <a href="#" class="text-primary-600 hover:text-primary-500">الشروط والأحكام</a>
              و
              <a href="#" class="text-primary-600 hover:text-primary-500">سياسة الخصوصية</a>
            </label>
          </div>
          <div v-if="errors.agree_terms" class="text-sm text-red-600">
            {{ errors.agree_terms }}
          </div>

          <!-- Error Message -->
          <BaseAlert
            v-if="error"
            type="error"
            :title="'خطأ في التسجيل'"
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
              جاري إنشاء الحساب...
            </template>
            <template v-else>
              <font-awesome-icon :icon="['fas', 'user-plus']" class="ml-2" />
              إنشاء حساب
            </template>
          </BaseButton>
        </form>

        <!-- Login Link -->
        <div class="mt-8 pt-6 border-t border-gray-200 text-center">
          <p class="text-gray-600">
            لديك حساب بالفعل؟
            <router-link to="/login" class="text-primary-600 hover:text-primary-800 font-medium">
              سجل الدخول
            </router-link>
          </p>
        </div>

        <!-- Security Note -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div class="flex items-start">
            <font-awesome-icon :icon="['fas', 'shield-alt']" class="text-blue-600 mt-0.5 ml-3" />
            <div>
              <h4 class="text-sm font-medium text-blue-800 mb-1">معلومات أمنية</h4>
              <p class="text-xs text-blue-700">
                نستخدم أحدث تقنيات التشفير لحماية بياناتك. كلمة المرور يجب أن تكون 8 أحرف على الأقل
                وتحتوي على أحرف وأرقام.
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
    // إذا كان المستخدم مصادقاً بالفعل، توجيهه إلى Dashboard
    if (this.$store.getters['auth/isAuthenticated']) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    async handleRegister() {
      this.error = ''
      this.errors = {}

      // التحقق من صحة البيانات
      if (!this.form.name.trim()) {
        this.errors.name = 'الرجاء إدخال الاسم'
        return
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'الرجاء إدخال البريد الإلكتروني'
        return
      }

      if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'البريد الإلكتروني غير صالح'
        return
      }

      if (!this.form.password) {
        this.errors.password = 'الرجاء إدخال كلمة المرور'
        return
      }

      if (this.form.password.length < 8) {
        this.errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
        return
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.errors.password_confirmation = 'كلمتا المرور غير متطابقتين'
        return
      }

      if (!this.form.agree_terms) {
        this.errors.agree_terms = 'يجب الموافقة على الشروط والأحكام'
        return
      }

      this.loading = true

      try {
        const response = await this.$store.dispatch('auth/register', this.form)

        if (response?.success) {
          this.$toast.success('تم إنشاء الحساب بنجاح!')

          // الانتقال إلى الصفحة الرئيسية بعد تأخير بسيط
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        } else {
          this.error = response?.message || 'فشل إنشاء الحساب'

          if (response?.errors) {
            this.errors = response.errors
          }
        }
      } catch (err) {
        console.error('❌ خطأ في إنشاء الحساب:', err)
        this.error = 'حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.'
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
