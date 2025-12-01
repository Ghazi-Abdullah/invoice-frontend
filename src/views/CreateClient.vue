<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('clients.addClient') }}</h1>
          <p class="text-gray-600 mt-2">{{ $t('clients.addClientDescription') }}</p>
        </div>
        <div class="mt-4 md:mt-0">
          <router-link
            to="/clients"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {{ $t('common.backToClients') }}
          </router-link>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Form Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div class="flex items-center">
            <div class="p-3 bg-white/20 rounded-lg mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ $t('clients.addNewClient') }}</h2>
              <p class="text-blue-100 text-sm mt-1">{{ $t('clients.fillBasicInfo') }}</p>
            </div>
          </div>
        </div>

        <!-- Client Form -->
        <form @submit.prevent="handleSubmit" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- الاسم -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.form.name') }} *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.form.namePlaceholder')"
              />
              <p class="text-gray-500 text-xs mt-1">{{ $t('clients.form.nameRequired') }}</p>
            </div>

            <!-- البريد الإلكتروني -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.form.email') }}
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.form.emailPlaceholder')"
              />
            </div>

            <!-- الهاتف -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.form.phone') }}
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.form.phonePlaceholder')"
              />
            </div>

            <!-- اسم الشركة -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.form.companyName') }}
              </label>
              <input
                v-model="form.company_name"
                type="text"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.form.companyNamePlaceholder')"
              />
            </div>

            <!-- الرقم الضريبي -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.form.taxNumber') }}
              </label>
              <input
                v-model="form.tax_number"
                type="text"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.form.taxNumberPlaceholder')"
              />
            </div>

            <!-- العنوان -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.form.address') }}
              </label>
              <textarea
                v-model="form.address"
                rows="3"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                :placeholder="$t('clients.form.addressPlaceholder')"
              ></textarea>
            </div>
          </div>

          <!-- أزرار -->
          <div
            class="flex items-center justify-end space-x-3 mt-8"
            :class="currentLanguage === 'ar' ? 'space-x-reverse' : ''"
          >
            <router-link
              to="/clients"
              class="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              {{ $t('common.cancel') }}
            </router-link>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="loading" class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ $t('common.saving') }}
              </span>
              <span v-else class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ $t('common.save') }}
              </span>
            </button>
          </div>
        </form>
      </div>

      <!-- Quick Tips -->
      <div class="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 class="text-sm font-semibold text-blue-900 mb-2">{{ $t('clients.quickTips') }}</h3>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>{{ $t('clients.tip1') }}</li>
              <li>{{ $t('clients.tip2') }}</li>
              <li>{{ $t('clients.tip3') }}</li>
              <li>{{ $t('clients.tip4') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientCreate',
  data() {
    return {
      loading: false,
      form: {
        name: '',
        email: '',
        phone: '',
        address: '',
        company_name: '',
        tax_number: '',
      },
    }
  },
  computed: {
    currentLanguage() {
      return this.$i18n.locale
    },
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      try {
        await this.$store.dispatch('clients/createClient', this.form)

        // عرض رسالة نجاح باستخدام event
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              type: 'success',
              message: this.$t('clients.createSuccess'),
            },
          }),
        )

        // الانتقال إلى صفحة العملاء بعد ثانية واحدة
        setTimeout(() => {
          this.$router.push('/clients')
        }, 1000)
      } catch (error) {
        console.error('❌ Failed to create client:', error)
        const errorMessage = error.response?.data?.message || this.$t('clients.createError')

        // عرض رسالة خطأ
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: {
              type: 'error',
              message: errorMessage,
            },
          }),
        )
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
