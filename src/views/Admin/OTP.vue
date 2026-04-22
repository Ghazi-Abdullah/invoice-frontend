<template>
  <div class="min-h-screen py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div class="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">رموز OTP</h1>
            <p class="text-gray-600 text-sm mt-1">إدارة ومعاينة رموز التحقق المرسلة</p>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="stats-card bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div class="stats-icon bg-yellow-100">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">إجمالي الرموز</p>
            <p class="stats-value">{{ otpList.length }}</p>
          </div>
        </div>
        <div class="stats-card bg-gradient-to-br from-green-50 to-green-100">
          <div class="stats-icon bg-green-100">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">تم التحقق</p>
            <p class="stats-value">{{ verifiedCount }}</p>
          </div>
        </div>
        <div class="stats-card bg-gradient-to-br from-red-50 to-red-100">
          <div class="stats-icon bg-red-100">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label">منتهي الصلاحية</p>
            <p class="stats-value">{{ expiredCount }}</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-2xl shadow p-12 text-center">
        <div class="relative inline-block">
          <div class="w-16 h-16 border-4 border-yellow-100 rounded-full"></div>
          <div
            class="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
          ></div>
        </div>
        <p class="text-gray-600 mt-4 font-medium">جاري التحميل...</p>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white">
          <h3 class="text-lg font-bold text-gray-900">قائمة رموز OTP</h3>
        </div>

        <!-- Empty State -->
        <div v-if="otpList.length === 0" class="text-center py-16">
          <div
            class="w-20 h-20 bg-yellow-50 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <svg
              class="w-10 h-10 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">لا توجد رموز OTP</h3>
          <p class="text-gray-500">لم يتم إرسال أي رموز بعد</p>
        </div>

        <!-- Table Content -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="table-header text-right">#</th>
                <th class="table-header text-right">المستخدم</th>
                <th class="table-header text-right">البريد الإلكتروني</th>
                <th class="table-header text-center">رمز OTP</th>
                <th class="table-header text-center">الحالة</th>
                <th class="table-header text-center">تاريخ الإرسال</th>
                <th class="table-header text-center">انتهاء الصلاحية</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(otp, index) in otpList"
                :key="otp.id"
                class="hover:bg-yellow-50/30 transition-colors"
              >
                <td class="table-cell text-gray-500 text-sm">{{ index + 1 }}</td>
                <td class="table-cell font-semibold text-gray-900">{{ otp.user?.name || '-' }}</td>
                <td class="table-cell text-gray-600 text-sm">{{ otp.user?.email || '-' }}</td>
                <td class="table-cell text-center">
                  <span
                    class="font-mono font-bold text-lg text-yellow-700 bg-yellow-100 px-3 py-1 rounded-lg"
                  >
                    {{ otp.otp }}
                  </span>
                </td>
                <td class="table-cell text-center">
                  <span
                    :class="getStatusClass(otp)"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span :class="getStatusDot(otp)" class="w-2 h-2 rounded-full"></span>
                    {{ getStatusLabel(otp) }}
                  </span>
                </td>
                <td class="table-cell text-center text-sm text-gray-600">
                  {{ formatDate(otp.created_at) }}
                </td>
                <td class="table-cell text-center text-sm text-gray-600">
                  {{ formatDate(otp.expires_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'OTPPage',
  data() {
    return {
      otpList: [],
      loading: false,
    }
  },
  computed: {
    verifiedCount() {
      return this.otpList.filter((o) => o.is_verified).length
    },
    expiredCount() {
      return this.otpList.filter((o) => !o.is_verified && new Date(o.expires_at) < new Date())
        .length
    },
  },
  methods: {
    async loadOtpList() {
      this.loading = true
      try {
        const response = await axios.get('/api/admin/otp')
        this.otpList = response.data.data || []
      } catch (error) {
        console.error('Error loading OTP list:', error)
        this.$toast?.error('فشل تحميل رموز OTP')
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
    getStatusLabel(otp) {
      if (otp.is_verified) return 'تم التحقق'
      if (new Date(otp.expires_at) < new Date()) return 'منتهي'
      return 'نشط'
    },
    getStatusClass(otp) {
      if (otp.is_verified) return 'bg-green-100 text-green-800'
      if (new Date(otp.expires_at) < new Date()) return 'bg-red-100 text-red-800'
      return 'bg-yellow-100 text-yellow-800'
    },
    getStatusDot(otp) {
      if (otp.is_verified) return 'bg-green-500'
      if (new Date(otp.expires_at) < new Date()) return 'bg-red-500'
      return 'bg-yellow-500'
    },
  },
  mounted() {
    this.loadOtpList()
  },
}
</script>

<style scoped>
.stats-card {
  @apply rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300;
}
.stats-icon {
  @apply p-3 rounded-lg w-fit mb-3;
}
.stats-label {
  @apply text-sm font-medium text-gray-500 mb-1;
}
.stats-value {
  @apply text-2xl font-bold text-gray-900;
}
.table-header {
  @apply px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4;
}
</style>
