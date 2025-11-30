<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- رأس النموذج -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">
            {{ client ? $t('clients.editClient') : $t('clients.addClient') }}
          </h3>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- محتوى النموذج -->
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
          <button
            type="button"
            @click="handleClose"
            class="px-6 py-3 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span v-if="loading">{{ $t('common.saving') }}</span>
            <span v-else>{{ client ? $t('common.update') : $t('common.save') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientForm',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    client: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'saved'],
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
  watch: {
    client: {
      handler(newClient) {
        if (newClient) {
          this.form = { ...newClient }
        } else {
          this.resetForm()
        }
      },
      immediate: true,
      deep: true,
    },
    show(newVal) {
      if (newVal && !this.client) {
        this.resetForm()
      }
    },
  },
  methods: {
    resetForm() {
      this.form = {
        name: '',
        email: '',
        phone: '',
        address: '',
        company_name: '',
        tax_number: '',
      }
    },

    handleClose() {
      this.$emit('close')
    },

    async handleSubmit() {
      this.loading = true
      try {
        if (this.client) {
          await this.$store.dispatch('clients/updateClient', {
            id: this.client.id,
            clientData: this.form,
          })
        } else {
          await this.$store.dispatch('clients/createClient', this.form)
        }
        this.$emit('saved')
        this.resetForm()
      } catch (error) {
        console.error('❌ Failed to save client:', error)
        // يمكنك إضافة رسالة toast للخطأ هنا
        this.$toast.error(this.$t('errors.saveClientFailed') || 'فشل في حفظ العميل')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
