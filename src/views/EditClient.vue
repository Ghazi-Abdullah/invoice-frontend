<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('clients.editClient')"
        :subtitle="$t('clients.editClientDescription')"
        :breadcrumbs="breadcrumbs"
        :actions="headerActions"
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="text-gray-600 text-lg mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <BaseAlert
        v-else-if="error"
        type="error"
        :title="$t('common.error')"
        :message="error"
        :actions="errorActions"
        class="mb-6"
      />

      <!-- Edit Form -->
      <BaseCard v-else class="edit-client-card">
        <template #header>
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg ml-4">
              <font-awesome-icon :icon="['fas', 'user-edit']" class="text-green-600 text-xl" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ $t('clients.editClientTitle') }}</h2>
              <p class="text-gray-600 text-sm">{{ $t('clients.updateInfo') }}</p>
            </div>
          </div>
        </template>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <BaseInput
              v-model="form.name"
              :label="$t('clients.form.name')"
              :placeholder="$t('clients.form.namePlaceholder')"
              required
              :error="errors.name"
              class="md:col-span-2"
            />

            <!-- Email -->
            <BaseInput
              v-model="form.email"
              type="email"
              :label="$t('auth.email')"
              :placeholder="$t('clients.form.emailPlaceholder')"
              :error="errors.email"
              required
            />

            <!-- Phone -->
            <BaseInput
              v-model="form.phone"
              :label="$t('clients.form.phone')"
              :placeholder="$t('clients.form.phonePlaceholder')"
              :error="errors.phone"
            />

            <!-- Company Name -->
            <BaseInput
              v-model="form.company_name"
              :label="$t('clients.form.companyName')"
              :placeholder="$t('clients.form.companyNamePlaceholder')"
              :error="errors.company_name"
            />

            <!-- Tax Number -->
            <BaseInput
              v-model="form.tax_number"
              :label="$t('clients.form.taxNumber')"
              :placeholder="$t('clients.form.taxNumberPlaceholder')"
              :error="errors.tax_number"
            />

            <!-- Payment Terms -->
            <div>
              <label class="form-label">{{ $t('clients.form.paymentTerms') }}</label>
              <select
                v-model="form.payment_terms"
                class="form-input"
                :class="{ 'border-red-500': errors.payment_terms }"
              >
                <option value="net_30">صافي 30 يوم</option>
                <option value="net_15">صافي 15 يوم</option>
                <option value="net_7">صافي 7 أيام</option>
                <option value="upon_receipt">عند الاستلام</option>
              </select>
              <div v-if="errors.payment_terms" class="mt-1 text-sm text-red-600">
                {{ errors.payment_terms }}
              </div>
            </div>

            <!-- Currency -->
            <div>
              <label class="form-label">{{ $t('clients.form.currency') }}</label>
              <select
                v-model="form.currency"
                class="form-input"
                :class="{ 'border-red-500': errors.currency }"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
                <option value="KWD">دينار كويتي (KWD)</option>
              </select>
              <div v-if="errors.currency" class="mt-1 text-sm text-red-600">
                {{ errors.currency }}
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="form-label">{{ $t('common.status') }}</label>
              <select
                v-model="form.status"
                class="form-input"
                :class="{ 'border-red-500': errors.status }"
              >
                <option value="active">{{ $t('common.active') }}</option>
                <option value="inactive">{{ $t('common.inactive') }}</option>
              </select>
              <div v-if="errors.status" class="mt-1 text-sm text-red-600">
                {{ errors.status }}
              </div>
            </div>
          </div>

          <!-- Address -->
          <BaseInput
            v-model="form.address"
            :label="$t('clients.form.address')"
            :placeholder="$t('clients.form.addressPlaceholder')"
            type="textarea"
            rows="3"
            :error="errors.address"
          />

          <!-- Notes -->
          <BaseInput
            v-model="form.notes"
            :label="$t('clients.form.notes')"
            :placeholder="$t('clients.form.notesPlaceholder')"
            type="textarea"
            rows="3"
            :error="errors.notes"
          />

          <!-- Quick Tips -->
          <div class="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 class="font-medium text-green-800 mb-2">{{ $t('clients.quickTips') }}</h4>
            <ul class="text-sm text-green-700 space-y-1">
              <li>{{ $t('clients.tip1') }}</li>
              <li>{{ $t('clients.tip2') }}</li>
              <li>{{ $t('clients.tip3') }}</li>
              <li>{{ $t('clients.tip4') }}</li>
            </ul>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <BaseButton
              type="outline"
              @click="$router.push(`/clients/${clientId}`)"
              :disabled="submitting"
            >
              {{ $t('common.cancel') }}
            </BaseButton>

            <BaseButton
              type="primary"
              :loading="submitting"
              :disabled="submitting"
              icon="save"
              html-type="submit"
            >
              {{ $t('common.update') }}
            </BaseButton>
          </div>
        </form>
      </BaseCard>
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
        payment_terms: 'net_30',
        currency: 'SAR',
        notes: '',
        status: 'active',
      },
      errors: {},
      error: null,
    }
  },
  computed: {
    breadcrumbs() {
      return [
        { text: this.$t('clients.title'), to: '/clients' },
        { text: this.form.name || 'تحميل...', to: `/clients/${this.clientId}` },
        { text: this.$t('common.edit') },
      ]
    },
    headerActions() {
      return [
        {
          text: this.$t('common.back'),
          type: 'outline',
          icon: ['fas', 'arrow-left'],
          onClick: () => this.$router.push(`/clients/${this.clientId}`),
        },
      ]
    },
    errorActions() {
      return [
        {
          text: this.$t('common.retry'),
          onClick: this.loadClient,
          type: 'danger',
        },
      ]
    },
  },
  mounted() {
    this.clientId = this.$route.params.id
    this.loadClient()
  },
  methods: {
    async loadClient() {
      this.loading = true
      this.error = null
      try {
        const client = await this.$store.dispatch('clients/fetchClient', this.clientId)
        console.log('📊 بيانات العميل المستلمة:', client)

        this.form = {
          name: client.name || '',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          company_name: client.company_name || '',
          tax_number: client.tax_number || '',
          payment_terms: client.payment_terms || 'net_30',
          currency: client.currency || 'SAR',
          notes: client.notes || '',
          status: client.is_active ? 'active' : 'inactive',
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل العميل:', error)
        this.error = error.message || this.$t('common.loadError')
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      this.errors = {}
      this.submitting = true

      try {
        // التحقق من البيانات
        if (!this.form.name.trim()) {
          this.errors.name = 'الرجاء إدخال اسم العميل'
          return
        }

        if (!this.form.email.trim()) {
          this.errors.email = 'البريد الإلكتروني مطلوب'
          return
        }

        if (this.form.email && !this.isValidEmail(this.form.email)) {
          this.errors.email = 'البريد الإلكتروني غير صالح'
          return
        }

        // إعداد البيانات للإرسال
        const dataToSend = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone || '',
          address: this.form.address || '',
          company_name: this.form.company_name || '',
          tax_number: this.form.tax_number || '',
          payment_terms: this.form.payment_terms,
          currency: this.form.currency,
          notes: this.form.notes || '',
          status: this.form.status, // سيتم تحويله إلى is_active في الـ Backend
        }

        // إزالة الحقول الفارغة (اختياري)
        Object.keys(dataToSend).forEach((key) => {
          if (dataToSend[key] === '' || dataToSend[key] === null) {
            delete dataToSend[key]
          }
        })

        await this.$store.dispatch('clients/updateClient', {
          id: this.clientId,
          data: dataToSend,
        })

        this.$toast.success(this.$t('clients.updateSuccess'))
        this.$router.push(`/clients/${this.clientId}`)
      } catch (error) {
        console.error('❌ خطأ في تحديث العميل:', error)

        if (error.response?.data) {
          console.error('📡 تفاصيل استجابة الخطأ:', error.response.data)

          if (error.response.data.message) {
            this.$toast.error(error.response.data.message)
          }

          if (error.response.data.errors) {
            this.errors = error.response.data.errors
          }
        } else if (error.message) {
          this.$toast.error(error.message)
        }
      } finally {
        this.submitting = false
      }
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
  },
}
</script>

<style scoped>
.edit-client-card {
  @apply border-green-100;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm;
}
</style>
