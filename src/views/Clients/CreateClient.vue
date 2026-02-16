<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('clients.create')"
        :subtitle="$t('clients.createDescription')"
        :breadcrumbs="breadcrumbs"
        :actions="headerActions"
      />

      <!-- Form Container -->
      <BaseCard>
        <template #header>
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg ml-4">
              <font-awesome-icon :icon="['fas', 'user-plus']" class="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ $t('clients.newClient') }}</h2>
              <p class="text-gray-600 text-sm">{{ $t('clients.fillInfo') }}</p>
            </div>
          </div>
        </template>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="form.name"
              :label="$t('clients.form.name')"
              :placeholder="$t('clients.form.namePlaceholder')"
              required
              :error="errors.name"
            />

            <BaseInput
              v-model="form.email"
              type="email"
              :label="$t('auth.email')"
              :placeholder="$t('clients.form.emailPlaceholder')"
              :error="errors.email"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="form.phone"
              :label="$t('clients.form.phone')"
              :placeholder="$t('clients.form.phonePlaceholder')"
              :error="errors.phone"
            />

            <BaseInput
              v-model="form.company_name"
              :label="$t('clients.form.companyName')"
              :placeholder="$t('clients.form.companyNamePlaceholder')"
              :error="errors.company_name"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseInput
              v-model="form.tax_number"
              :label="$t('clients.form.taxNumber')"
              :placeholder="$t('clients.form.taxNumberPlaceholder')"
              :error="errors.tax_number"
            />

            <div>
              <label class="form-label">{{ $t('common.status') }}</label>
              <select v-model="form.status" class="form-input">
                <option value="active">{{ $t('common.active') }}</option>
                <option value="inactive">{{ $t('common.inactive') }}</option>
              </select>
            </div>
          </div>

          <BaseInput
            v-model="form.address"
            :label="$t('clients.form.address')"
            :placeholder="$t('clients.form.addressPlaceholder')"
            type="textarea"
            rows="3"
            :error="errors.address"
          />

          <!-- Quick Tips -->
          <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 class="font-medium text-blue-800 mb-2">{{ $t('clients.quickTips') }}</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>{{ $t('clients.tip1') }}</li>
              <li>{{ $t('clients.tip2') }}</li>
              <li>{{ $t('clients.tip3') }}</li>
              <li>{{ $t('clients.tip4') }}</li>
            </ul>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <BaseButton type="outline" @click="$router.push('/clients')" :disabled="loading">
              {{ $t('common.cancel') }}
            </BaseButton>

            <BaseButton
              type="primary"
              :loading="loading"
              :disabled="loading"
              icon="save"
              html-type="submit"
            >
              {{ $t('buttons.save') }}
            </BaseButton>
          </div>
        </form>
      </BaseCard>
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
        company_name: '',
        tax_number: '',
        address: '',
        status: 'active',
      },
      errors: {},
    }
  },
  computed: {
    breadcrumbs() {
      return [
        { text: this.$t('clients.title'), to: '/clients' },
        { text: this.$t('clients.create') },
      ]
    },
    headerActions() {
      return [
        {
          text: this.$t('common.back'),
          type: 'outline',
          icon: ['fas', 'arrow-left'],
          onClick: () => this.$router.push('/clients'),
        },
      ]
    },
  },
  methods: {
    async handleSubmit() {
      this.errors = {}
      this.loading = true

      try {
        // التحقق من البيانات
        if (!this.form.name.trim()) {
          this.errors.name = 'الرجاء إدخال اسم العميل'
          return
        }

        if (this.form.email && !this.isValidEmail(this.form.email)) {
          this.errors.email = 'البريد الإلكتروني غير صالح'
          return
        }

        await this.$store.dispatch('clients/createClient', this.form)
        this.$toast.success(this.$t('clients.createSuccess'))
        this.$router.push('/clients')
      } catch (error) {
        console.error('❌ خطأ في إنشاء العميل:', error)

        // معالجة أخطاء API
        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error(error.message || this.$t('clients.createError'))
        }
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
