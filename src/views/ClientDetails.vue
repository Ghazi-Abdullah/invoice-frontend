<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <PageHeader
        :title="$t('clients.clientDetails')"
        :subtitle="$t('clients.clientDetailsDescription')"
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
        title="حدث خطأ"
        :message="error"
        :actions="errorActions"
        class="mb-6"
      />

      <!-- Client Details -->
      <div v-else-if="client" class="space-y-6">
        <!-- Client Info Card -->
        <BaseCard class="client-info-card">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Client Avatar and Basic Info -->
            <div class="info-section">
              <div class="flex items-center space-x-4">
                <div class="client-avatar">
                  {{ getInitials(client.name) }}
                </div>
                <div>
                  <h2 class="client-name">{{ client.name }}</h2>
                  <p class="client-email">{{ client.email || $t('common.notAvailable') }}</p>
                </div>
              </div>
              <div class="mt-4">
                <StatusBadge :status="client.status === 'active' ? 'paid' : 'overdue'" />
              </div>
            </div>

            <!-- Contact Info -->
            <div class="info-section">
              <h3 class="section-title">{{ $t('clients.contactInfo') }}</h3>
              <div class="space-y-3">
                <div class="contact-item">
                  <font-awesome-icon :icon="['fas', 'phone']" />
                  <span>{{ client.phone || $t('common.notAvailable') }}</span>
                </div>
                <div class="contact-item">
                  <font-awesome-icon :icon="['fas', 'map-marker-alt']" />
                  <span>{{ client.address || $t('common.notAvailable') }}</span>
                </div>
                <div class="contact-item">
                  <font-awesome-icon :icon="['fas', 'building']" />
                  <span>{{ client.company_name || $t('common.notAvailable') }}</span>
                </div>
                <div class="contact-item" v-if="client.tax_number">
                  <font-awesome-icon :icon="['fas', 'receipt']" />
                  <span>{{ $t('clients.taxNumber') }}: {{ client.tax_number }}</span>
                </div>
              </div>
            </div>

            <!-- Stats Info -->
            <div class="info-section">
              <h3 class="section-title">{{ $t('clients.stats') }}</h3>
              <div class="space-y-2">
                <div class="stat-item">
                  <span>{{ $t('clients.stats.totalInvoices') }}:</span>
                  <span class="font-semibold">{{ stats.totalInvoices }}</span>
                </div>
                <div class="stat-item">
                  <span>{{ $t('clients.stats.paidInvoices') }}:</span>
                  <span class="font-semibold text-green-600">{{ stats.paidInvoices }}</span>
                </div>
                <div class="stat-item">
                  <span>{{ $t('clients.stats.overdueInvoices') }}:</span>
                  <span class="font-semibold text-red-600">{{ stats.overdueInvoices }}</span>
                </div>
                <div class="stat-item">
                  <span>{{ $t('clients.stats.totalAmount') }}:</span>
                  <span class="font-semibold text-blue-600">{{ stats.totalAmount }}</span>
                </div>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Client Invoices -->
        <BaseCard :title="$t('clients.clientInvoices')" class="invoices-card">
          <div v-if="clientInvoices.length === 0" class="text-center py-8">
            <font-awesome-icon
              :icon="['fas', 'file-invoice']"
              class="text-gray-300 text-4xl mb-3"
            />
            <p class="text-gray-500">{{ $t('clients.noInvoicesForClient') }}</p>
          </div>

          <BaseTable
            v-else
            :columns="invoiceColumns"
            :data="clientInvoices"
            bordered
            striped
            class="mt-4"
          >
            <template #cell-invoice_number="{ row }">
              <div class="font-medium text-gray-900">{{ row.invoice_number }}</div>
              <div class="text-sm text-gray-500">#{{ row.id }}</div>
            </template>

            <template #cell-issue_date="{ row }">
              {{ formatDate(row.issue_date) }}
            </template>

            <template #cell-due_date="{ row }">
              <span :class="getDaysRemainingClass(row.due_date)">
                {{ getDaysRemaining(row.due_date) }}
              </span>
            </template>

            <template #cell-total_amount="{ row }">
              <span class="font-semibold">{{ formatCurrency(row.total_amount) }}</span>
            </template>

            <template #cell-status="{ row }">
              <StatusBadge :status="row.status" />
            </template>

            <template #actions="{ row }">
              <BaseButton
                @click="$router.push(`/invoices/${row.id}`)"
                type="ghost"
                size="sm"
                :icon="['fas', 'eye']"
                title="عرض"
              />
            </template>
          </BaseTable>
        </BaseCard>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BaseCard :title="$t('common.actions')">
            <div class="space-y-3">
              <BaseButton
                v-if="hasPermission('edit_client')"
                @click="editClient"
                type="primary"
                :icon="['fas', 'edit']"
                block
              >
                {{ $t('common.edit') }}
              </BaseButton>

              <BaseButton
                @click="$router.push(`/invoices/create?client_id=${client.id}`)"
                type="success"
                :icon="['fas', 'plus']"
                block
              >
                {{ $t('invoices.createForClient') }}
              </BaseButton>

              <BaseButton @click="sendEmail" type="outline" :icon="['fas', 'envelope']" block>
                {{ $t('clients.sendEmail') }}
              </BaseButton>

              <BaseButton
                v-if="hasPermission('delete_client')"
                @click="confirmDelete"
                type="danger"
                :icon="['fas', 'trash']"
                block
              >
                {{ $t('common.delete') }}
              </BaseButton>
            </div>
          </BaseCard>

          <BaseCard v-if="client.notes" :title="$t('common.notes')">
            <p class="text-gray-700 whitespace-pre-line">{{ client.notes }}</p>
          </BaseCard>
        </div>
      </div>

      <!-- No Client Found -->
      <BaseAlert
        v-else
        type="warning"
        :title="$t('clients.notFound')"
        :message="`لم يتم العثور على عميل بالرقم: ${$route.params.id}`"
        :actions="noClientActions"
        class="mt-8"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientDetails',
  data() {
    return {
      loading: true,
      error: null,
      client: null,
      clientInvoices: [],
      stats: {
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        totalAmount: 0,
      },
      invoiceColumns: [
        { key: 'invoice_number', label: 'رقم الفاتورة', align: 'right' },
        { key: 'issue_date', label: 'تاريخ الإصدار', align: 'center' },
        { key: 'due_date', label: 'تاريخ الاستحقاق', align: 'center' },
        { key: 'total_amount', label: 'المبلغ', align: 'right' },
        { key: 'status', label: 'الحالة', align: 'center' },
      ],
    }
  },
  computed: {
    breadcrumbs() {
      return [
        { text: this.$t('clients.title'), to: '/clients' },
        { text: this.client?.name || 'تفاصيل العميل' },
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
        {
          text: this.$t('common.edit'),
          type: 'primary',
          icon: ['fas', 'edit'],
          onClick: () => this.editClient(),
          disabled: !this.hasPermission('edit_client') || !this.client,
        },
      ]
    },
    errorActions() {
      return [
        {
          text: 'إعادة المحاولة',
          onClick: this.loadClientDetails,
          type: 'danger',
        },
      ]
    },
    noClientActions() {
      return [
        {
          text: this.$t('common.back'),
          onClick: () => this.$router.push('/clients'),
          type: 'primary',
        },
      ]
    },
  },
  mounted() {
    this.loadClientDetails()
  },
  methods: {
    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },
    getInitials(name) {
      if (!name) return '?'
      return name.substring(0, 2).toUpperCase()
    },
    formatDate(dateString) {
      if (!dateString) return this.$t('common.notAvailable')
      try {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }
        return new Date(dateString).toLocaleDateString(
          this.$i18n.locale === 'ar' ? 'ar-SA' : 'en-US',
          options,
        )
      } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
      }
    },
    formatCurrency(amount) {
      if (!amount && amount !== 0) return this.$t('common.notAvailable')
      try {
        const formatter = new Intl.NumberFormat(this.$i18n.locale === 'ar' ? 'ar-SA' : 'en-US', {
          style: 'currency',
          currency: this.$i18n.locale === 'ar' ? 'SAR' : 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        return formatter.format(amount)
      } catch (error) {
        console.error('Error formatting currency:', error)
        return amount
      }
    },
    getDaysRemaining(dueDate) {
      if (!dueDate) return this.$t('common.notAvailable')
      try {
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return this.$t('invoices.expired')
        if (diffDays === 0) return this.$t('invoices.today')
        if (diffDays === 1) return this.$t('invoices.tomorrow')
        return this.$t('invoices.days', { days: diffDays })
      } catch (error) {
        console.error('Error calculating days remaining:', error)
        return this.$t('common.notAvailable')
      }
    },
    getDaysRemainingClass(dueDate) {
      if (!dueDate) return 'text-gray-600'
      try {
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays < 0) return 'text-red-600 font-semibold'
        if (diffDays <= 3) return 'text-yellow-600 font-semibold'
        return 'text-green-600 font-semibold'
      } catch (error) {
        console.error('Error getting days remaining class:', error)
        return 'text-gray-600'
      }
    },
    async loadClientDetails() {
      this.error = null
      this.loading = true

      const clientId = this.$route.params.id

      if (!clientId) {
        this.error = 'معرف العميل غير صالح'
        this.loading = false
        return
      }

      try {
        this.client = await this.$store.dispatch('clients/fetchClient', clientId)

        // Load client invoices
        await this.loadClientInvoices()
        this.calculateStats()
      } catch (error) {
        console.error('❌ خطأ في تحميل بيانات العميل:', error)
        this.error = error.message || this.$t('errors.loadClientsError')
      } finally {
        this.loading = false
      }
    },
    async loadClientInvoices() {
      try {
        await this.$store.dispatch('invoices/fetchInvoices', {
          client_id: this.client.id,
        })

        const invoices = this.$store.getters['invoices/invoices'] || []
        this.clientInvoices = invoices.filter(invoice => invoice.client_id == this.client.id)
      } catch (error) {
        console.error('Error loading client invoices:', error)
      }
    },
    calculateStats() {
      this.stats.totalInvoices = this.clientInvoices.length
      this.stats.paidInvoices = this.clientInvoices.filter(i => i.status === 'paid').length
      this.stats.overdueInvoices = this.clientInvoices.filter(i => i.status === 'overdue').length
      this.stats.totalAmount = this.clientInvoices.reduce((sum, invoice) => {
        return sum + (parseFloat(invoice.total_amount) || 0)
      }, 0)
    },
    editClient() {
      if (this.client) {
        this.$router.push(`/clients/${this.client.id}/edit`)
      }
    },
    sendEmail() {
      if (this.client?.email) {
        window.location.href = `mailto:${this.client.email}`
      } else {
        this.$toast.warning('لا يوجد بريد إلكتروني لهذا العميل')
      }
    },
    confirmDelete() {
      this.$toast.confirm(
        `هل أنت متأكد من حذف العميل "${this.client.name}"؟`,
        async () => {
          await this.deleteClient()
        }
      )
    },
    async deleteClient() {
      try {
        await this.$store.dispatch('clients/deleteClient', this.client.id)
        this.$toast.success(this.$t('messages.deleteSuccess'))
        this.$router.push('/clients')
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.deleteError'))
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadClientDetails()
        }
      },
    },
  },
}
</script>

<style scoped>
.client-info-card {
  @apply border-primary-100;
}

.info-section {
  @apply p-4;
}

.section-title {
  @apply text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200;
}

.client-avatar {
  @apply w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xl;
}

.client-name {
  @apply text-xl font-bold text-gray-900;
}

.client-email {
  @apply text-gray-600;
}

.contact-item {
  @apply flex items-center gap-3 text-gray-700;
}

.stat-item {
  @apply flex justify-between items-center py-2 border-b border-gray-100 last:border-0;
}

.invoices-card {
  @apply border-gray-200;
}
</style>
