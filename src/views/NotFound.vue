<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4"
  >
    <div class="text-center max-w-lg">
      <!-- Animated 404 -->
      <div class="relative mb-8">
        <div class="text-9xl font-bold text-gray-200 opacity-60">404</div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-9xl font-bold text-primary-600 animate-pulse">404</div>
        </div>
      </div>

      <!-- Message -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">عذراً! هذه الصفحة غير موجودة</h1>
        <p class="text-xl text-gray-600 mb-2">
          يبدو أنك حاولت الوصول إلى صفحة غير موجودة في نظامنا.
        </p>
        <p class="text-gray-500">يمكن أن يكون السبب خطأ في الرابط أو أن الصفحة قد تم نقلها.</p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <BaseButton
          @click="$router.go(-1)"
          type="outline"
          size="lg"
          icon="arrow-right"
          class="shadow-lg"
        >
          العودة للخلف
        </BaseButton>

        <BaseButton
          @click="$router.push('/')"
          type="primary"
          size="lg"
          icon="home"
          class="shadow-lg"
        >
          الذهاب للرئيسية
        </BaseButton>
      </div>

      <!-- Help Links -->
      <div class="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">ربما كنت تبحث عن:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <router-link
            to="/dashboard"
            class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="text-gray-600 ml-3" />
            <span class="text-gray-700">لوحة التحكم</span>
          </router-link>

          <router-link
            to="/invoices"
            class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'file-invoice']" class="text-gray-600 ml-3" />
            <span class="text-gray-700">الفواتير</span>
          </router-link>

          <router-link
            to="/clients"
            class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'users']" class="text-gray-600 ml-3" />
            <span class="text-gray-700">العملاء</span>
          </router-link>

          <router-link
            to="/reports"
            class="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <font-awesome-icon :icon="['fas', 'chart-bar']" class="text-gray-600 ml-3" />
            <span class="text-gray-700">التقارير</span>
          </router-link>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="mt-8">
        <p class="text-gray-500 mb-2">لا زلت تواجه مشكلة؟</p>
        <a
          href="mailto:support@invoiceapp.com"
          class="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
        >
          <font-awesome-icon :icon="['fas', 'life-ring']" class="ml-2" />
          اتصل بالدعم الفني
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  mounted() {
    // إرسال حدث تحليلي في حالة حقيقية
    console.log('🔍 404 Error - Page not found:', this.$route.path)
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
  animation: fadeIn 0.6s ease-out forwards;
}
</style>
