<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

      <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
        الدخول برمز التحقق
      </h2>
      <p class="text-center text-gray-500 text-sm mb-8">
        سيصلك رمز مكوّن من 6 أرقام على بريدك الإلكتروني
      </p>

      <!-- خطأ عام -->
      <div v-if="error" class="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4 text-center">
        {{ error }}
      </div>

      <!-- المرحلة 1: إدخال الإيميل -->
      <form v-if="step === 1" @submit.prevent="handleSendOtp">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="example@company.com"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق' }}
        </button>

        <p class="text-center mt-4 text-sm text-gray-500">
          أو
          <router-link to="/login" class="text-blue-600 hover:underline">
            الدخول بكلمة المرور
          </router-link>
        </p>
      </form>

      <!-- المرحلة 2: إدخال الرمز -->
      <form v-if="step === 2" @submit.prevent="handleVerifyOtp">
        <p class="text-center text-sm text-gray-600 mb-4">
          تم إرسال الرمز إلى
          <span class="font-semibold text-gray-800">{{ email }}</span>
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            رمز التحقق
          </label>
          <input
            v-model="otp"
            type="text"
            placeholder="000000"
            maxlength="6"
            class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="loading"
        >
          {{ loading ? 'جاري التحقق...' : 'تأكيد الرمز' }}
        </button>

        <!-- إعادة الإرسال -->
        <p class="text-center mt-4 text-sm text-gray-500">
          لم يصلك الرمز؟
          <button
            type="button"
            class="text-blue-600 hover:underline disabled:opacity-50"
            :disabled="cooldown > 0 || loading"
            @click="handleResend"
          >
            {{ cooldown > 0 ? `إعادة الإرسال بعد ${cooldown}s` : 'إعادة الإرسال' }}
          </button>
        </p>

        <p class="text-center mt-2 text-sm text-gray-500">
          <button
            type="button"
            class="text-gray-400 hover:underline"
            @click="step = 1"
          >
            تغيير البريد الإلكتروني
          </button>
        </p>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store  = useStore()
const router = useRouter()

const step    = ref(1)
const email   = ref('')
const otp     = ref('')
const userId  = ref(null)
const cooldown = ref(0)
let cooldownTimer = null

const loading = computed(() => store.getters['auth/isLoading'])
const error   = computed(() => store.getters['auth/loginError'])

// إرسال OTP
async function handleSendOtp() {
  const result = await store.dispatch('auth/sendOtp', email.value)

  if (result.success) {
    userId.value = result.user_id
    step.value = 2
    startCooldown()
  }
}

// التحقق من OTP
async function handleVerifyOtp() {
  const result = await store.dispatch('auth/verifyOtp', {
    user_id: userId.value,
    otp: otp.value
  })

  if (result.success) {
    router.push('/dashboard')
  }
}

// إعادة الإرسال
async function handleResend() {
  otp.value = ''
  const result = await store.dispatch('auth/sendOtp', email.value)
  if (result.success) {
    startCooldown()
  }
}

// عداد الانتظار (120 ثانية = دقيقتان)
function startCooldown() {
  cooldown.value = 120
  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0) {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>
