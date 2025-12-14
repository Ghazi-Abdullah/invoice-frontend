<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('clients.create') }}</h1>
          <p class="text-gray-600 mt-2">{{ $t('clients.createDescription') }}</p>
        </div>
        <div class="mt-4 md:mt-0">
          <router-link
            to="/clients"
            class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            {{ $t('common.back') }}
          </router-link>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Form Header -->
        <div class="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div class="flex items-center">
            <div class="p-3 bg-white/20 rounded-lg mr-4">
              <i class="fas fa-user-plus text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ $t('clients.newClient') }}</h2>
              <p class="text-blue-100 text-sm mt-1">{{ $t('clients.fillInfo') }}</p>
            </div>
          </div>
        </div>

        <!-- Client Form -->
        <form @submit.prevent="handleSubmit" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.name') }} *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.namePlaceholder')"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('auth.email') }}
              </label>
              <input
                v-model="form.email"
                type="email"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.emailPlaceholder')"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.phone') }}
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.phonePlaceholder')"
              />
            </div>

            <!-- Company Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.company') }}
              </label>
              <input
                v-model="form.company_name"
                type="text"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.companyPlaceholder')"
              />
            </div>

            <!-- Tax Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.taxNumber') }}
              </label>
              <input
                v-model="form.tax_number"
                type="text"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
                :placeholder="$t('clients.taxNumberPlaceholder')"
              />
            </div>

            <!-- Address -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.address') }}
              </label>
              <textarea
                v-model="form.address"
                rows="3"
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none"
                :placeholder="$t('clients.addressPlaceholder')"
              ></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 mt-8">
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
                <i class="fas fa-spinner fa-spin mr-2"></i>
                {{ $t('common.saving') }}
              </span>
              <span v-else class="flex items-center">
                <i class="fas fa-check mr-2"></i>
                {{ $t('common.save') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateClient',
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
  methods: {
    async handleSubmit() {
      this.loading = true
      try {
        await this.$store.dispatch('clients/createClient', this.form)
        this.$toast.success(this.$t('clients.createSuccess'))
        this.$router.push('/clients')
      } catch (error) {
        this.$toast.error(error.message || this.$t('clients.createError'))
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
