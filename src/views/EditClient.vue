<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('clients.editClient') }}</h1>
          <p class="text-gray-600 mt-2">{{ $t('clients.editClientDescription') }}</p>
        </div>
        <div class="mt-4 md:mt-0">
          <router-link
            :to="`/clients/${clientId}`"
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
        <div class="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div class="flex items-center">
            <div class="p-3 bg-white/20 rounded-lg mr-4">
              <i class="fas fa-user-edit text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-bold">{{ $t('clients.editClientTitle') }}</h2>
              <p class="text-green-100 text-sm mt-1">{{ $t('clients.updateInfo') }}</p>
            </div>
          </div>
        </div>

        <!-- Client Form -->
        <form @submit.prevent="handleSubmit" class="p-6">
          <div v-if="loading" class="text-center py-8">
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"
            ></div>
            <p class="mt-4 text-gray-600">{{ $t('common.loading') }}</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ $t('clients.name') }} *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
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
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
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
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
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
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
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
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
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
                class="w-full px-4 py-3 bg-gray-50/80 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 resize-none"
                :placeholder="$t('clients.addressPlaceholder')"
              ></textarea>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 mt-8">
            <router-link
              :to="`/clients/${clientId}`"
              class="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            >
              {{ $t('common.cancel') }}
            </router-link>
            <button
              type="submit"
              :disabled="submitting || loading"
              class="px-6 py-3 bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span v-if="submitting" class="flex items-center">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                {{ $t('common.saving') }}
              </span>
              <span v-else class="flex items-center">
                <i class="fas fa-check mr-2"></i>
                {{ $t('common.update') }}
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
  name: 'EditClient',
  data() {
    return {
      loading: true,
      submitting: false,
      clientId: null,
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
  mounted() {
    this.clientId = this.$route.params.id
    this.loadClient()
  },
  methods: {
    async loadClient() {
      this.loading = true
      try {
        const client = await this.$store.dispatch('clients/fetchClient', this.clientId)
        this.form = { ...client }
      } catch (error) {
        this.$toast.error(this.$t('common.loadError'))
        this.$router.push('/clients')
      } finally {
        this.loading = false
      }
    },

    async handleSubmit() {
      this.submitting = true
      try {
        await this.$store.dispatch('clients/updateClient', {
          id: this.clientId,
          data: this.form,
        })
        this.$toast.success(this.$t('clients.updateSuccess'))
        this.$router.push(`/clients/${this.clientId}`)
      } catch (error) {
        this.$toast.error(error.message || this.$t('clients.updateError'))
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>
