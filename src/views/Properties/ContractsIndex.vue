<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            {{ $t('contracts.title') }}
          </h1>

          <p class="text-gray-600 text-sm mt-1">
            {{ $t('contracts.description') }}
          </p>
        </div>

        <!-- Add Contract -->
        <button
          v-if="hasPermission('create_contract')"
          type="button"
          @click="openCreate"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />

          {{ $t('contracts.add') }}
        </button>
      </div>

      <!-- Contracts Table -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>

        <!-- Table -->
        <BaseTable
          v-else
          :columns="columns"
          :data="contracts"
          :show-actions="true"
          bordered
          striped
        >
          <!-- Contract Number -->
          <template #cell-contract_number="{ row }">
            <span class="font-medium text-gray-900">
              {{ row?.contract_number || '-' }}
            </span>
          </template>

          <!-- Tenant -->
          <template #cell-tenant="{ row }">
            <span>
              {{ row?.tenant?.name || '-' }}
            </span>
          </template>

          <!-- Unit -->
          <template #cell-unit="{ row }">
            <div>
              <div class="font-medium text-gray-900">
                {{ row?.unit?.name || '-' }}
              </div>

              <span class="text-gray-400 text-xs">
                {{ row?.unit?.floor?.property?.name || '-' }}
              </span>
            </div>
          </template>

          <!-- Rent Amount -->
          <template #cell-rent_amount="{ row }">
            {{ formatCurrency(row?.rent_amount) }}
          </template>

          <!-- End Date -->
          <template #cell-end_date="{ row }">
            <span :class="isExpiringSoon(row?.end_date) ? 'text-amber-600 font-semibold' : ''">
              {{ row?.end_date || '-' }}
            </span>
          </template>

          <!-- Status -->
          <template #cell-status="{ row }">
            <StatusBadge :status="statusToBadge(row?.status)">
              {{ $t(`contracts.${row?.status || 'active'}`) }}
            </StatusBadge>
          </template>

          <!-- Actions -->
          <template #actions="{ row }">
            <div v-if="row?.id" class="flex items-center gap-1">
              <!-- View Contract -->
              <button
                v-if="hasPermission('view_contracts')"
                type="button"
                @click="viewContract(row)"
                class="icon-btn text-blue-600 hover:bg-blue-50"
                :title="$t('common.view')"
              >
                <font-awesome-icon :icon="['fas', 'eye']" />
              </button>

              <!-- Generate Rent Invoice -->
              <button
                v-if="hasPermission('create_rent_invoice')"
                type="button"
                @click="generateInvoice(row)"
                class="icon-btn text-green-600 hover:bg-green-50"
                :title="$t('contracts.generateInvoiceNow')"
              >
                <font-awesome-icon :icon="['fas', 'file-invoice']" />
              </button>

              <!-- Edit Contract -->
              <button
                v-if="hasPermission('edit_contract')"
                type="button"
                @click="openEdit(row)"
                class="icon-btn"
                :title="$t('common.edit')"
              >
                <font-awesome-icon :icon="['fas', 'pen']" />
              </button>

              <!-- Delete Contract -->
              <button
                v-if="hasPermission('delete_contract')"
                type="button"
                @click="confirmDelete(row)"
                class="icon-btn text-red-600 hover:bg-red-50"
                :title="$t('common.delete')"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
          </template>
        </BaseTable>
      </div>
    </div>

    <!-- Contract Form Modal -->
    <ContractFormModal
      v-if="showModal"
      :show="showModal"
      :contract="editingContract"
      @update:show="handleModalVisibility"
      @saved="onSaved"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import BaseTable from '@/components/shared/BaseTable.vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'
import ContractFormModal from './ContractFormModal.vue'

export default {
  name: 'ContractsIndex',

  components: {
    BaseTable,
    StatusBadge,
    LoadingSpinner,
    ContractFormModal,
  },

  data() {
    return {
      showModal: false,

      editingContract: null,

      columns: [
        {
          key: 'contract_number',
          label: this.$t('contracts.contractNumber'),
        },
        {
          key: 'tenant',
          label: this.$t('contracts.tenant'),
        },
        {
          key: 'unit',
          label: this.$t('contracts.unit'),
        },
        {
          key: 'rent_amount',
          label: this.$t('contracts.rentAmount'),
        },
        {
          key: 'end_date',
          label: this.$t('contracts.endDate'),
        },
        {
          key: 'status',
          label: this.$t('common.status'),
        },
      ],
    }
  },

  computed: {
    ...mapGetters('contracts', {
      contracts: 'contracts',
      isLoading: 'isLoading',
    }),
  },

  async mounted() {
    await this.loadContracts()
  },

  methods: {
    ...mapActions('contracts', ['fetchContracts', 'deleteContract', 'generateInvoiceNow']),

    /**
     * Check permission — admins (is_admin flag from the login/session state)
     * always pass; everyone else needs the specific permission string.
     */
    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) {
        return true
      }

      const permissions = this.$store.state.auth.permissions || []

      return permissions.includes(permission)
    },

    /**
     * Load contracts
     */
    async loadContracts() {
      try {
        await this.fetchContracts()
      } catch (error) {
        this.showError(error)
      }
    },

    /**
     * Format currency
     */
    formatCurrency(amount) {
      if (amount === null || amount === undefined || amount === '') {
        return '-'
      }

      return this.$formatCurrency ? this.$formatCurrency(amount) : amount
    },

    /**
     * Check if contract expires within 30 days
     */
    isExpiringSoon(endDate) {
      if (!endDate) {
        return false
      }

      const end = new Date(endDate)
      const now = new Date()

      const diff = (end - now) / (1000 * 60 * 60 * 24)

      return diff >= 0 && diff <= 30
    },

    /**
     * Convert contract status to StatusBadge status
     */
    statusToBadge(status) {
      const statuses = {
        active: 'paid',
        expired: 'overdue',
        terminated: 'draft',
      }

      return statuses[status] || 'draft'
    },

    /**
     * Escape a value before interpolating it into $swal's html option,
     * since tenant/unit/notes text is admin-entered free text.
     */
    escapeHtml(value) {
      if (value === null || value === undefined) {
        return '-'
      }

      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
    },

    /**
     * View contract details (read-only) — uses the data already loaded in
     * the table row (tenant, unit.floor.property), no extra request needed.
     */
    viewContract(contract) {
      if (!contract?.id) {
        return
      }

      const isRtl = this.$i18n.locale === 'ar'
      const property = contract.unit?.floor?.property?.name
      const floor = contract.unit?.floor?.name

      const rows = [
        [this.$t('contracts.tenant'), this.escapeHtml(contract.tenant?.name)],
        [this.$t('contracts.unit'), this.escapeHtml(contract.unit?.name)],
        [this.$t('contracts.property'), this.escapeHtml(property)],
        [this.$t('contracts.floor'), this.escapeHtml(floor)],
        [this.$t('contracts.rentAmount'), this.formatCurrency(contract.rent_amount)],
        [
          this.$t('contracts.paymentFrequency'),
          this.$t(`contracts.${contract.payment_frequency || 'monthly'}`),
        ],
        [this.$t('contracts.securityDeposit'), this.formatCurrency(contract.security_deposit)],
        [this.$t('contracts.startDate'), this.escapeHtml(contract.start_date)],
        [this.$t('contracts.endDate'), this.escapeHtml(contract.end_date)],
        [this.$t('common.status'), this.$t(`contracts.${contract.status || 'active'}`)],
      ]

      if (contract.notes) {
        rows.push([this.$t('common.notes'), this.escapeHtml(contract.notes)])
      }

      const html = `
        <div style="text-align:${isRtl ? 'right' : 'left'}; line-height:1.9">
          ${rows
            .map(
              ([label, value]) => `<p style="margin:2px 0"><strong>${label}:</strong> ${value}</p>`,
            )
            .join('')}
        </div>
      `

      this.$swal.fire({
        icon: 'info',
        title: contract.contract_number,
        html,
        confirmButtonText: this.$t('common.close'),
      })
    },

    /**
     * Open create modal
     */
    openCreate() {
      this.editingContract = null
      this.showModal = true
    },

    /**
     * Open edit modal
     */
    openEdit(contract) {
      if (!contract?.id) {
        return
      }

      this.editingContract = {
        ...contract,
      }

      this.showModal = true
    },

    /**
     * Handle modal visibility
     */
    handleModalVisibility(value) {
      this.showModal = value

      if (!value) {
        this.editingContract = null
      }
    },

    /**
     * Handle saved contract
     */
    async onSaved() {
      this.showModal = false
      this.editingContract = null

      await this.loadContracts()
    },

    /**
     * Generate rent invoice
     */
    async generateInvoice(contract) {
      if (!contract?.id) {
        return
      }

      const result = await this.$swal.fire({
        icon: 'question',

        title: this.$t('common.confirm'),

        text: this.$t('contracts.generateInvoiceConfirm', {
          number: contract.contract_number,
        }),

        showCancelButton: true,

        confirmButtonText: this.$t('common.confirm'),

        cancelButtonText: this.$t('common.cancel'),
      })

      if (!result.isConfirmed) {
        return
      }

      try {
        await this.generateInvoiceNow(contract.id)

        await this.$swal.fire({
          icon: 'success',

          title: this.$t('contracts.invoiceGenerated'),

          timer: 1500,

          showConfirmButton: false,
        })
      } catch (error) {
        this.showError(error)
      }
    },

    /**
     * Confirm contract deletion
     */
    async confirmDelete(contract) {
      if (!contract?.id) {
        return
      }

      const result = await this.$swal.fire({
        icon: 'warning',

        title: this.$t('common.confirm'),

        text: this.$t('contracts.deleteConfirm', {
          number: contract.contract_number,
        }),

        showCancelButton: true,

        confirmButtonText: this.$t('common.delete'),

        cancelButtonText: this.$t('common.cancel'),

        confirmButtonColor: '#dc2626',
      })

      if (!result.isConfirmed) {
        return
      }

      try {
        await this.deleteContract(contract.id)

        await this.$swal.fire({
          icon: 'success',

          title: this.$t('messages.deleteSuccess'),

          timer: 1500,

          showConfirmButton: false,
        })

        await this.loadContracts()
      } catch (error) {
        this.showError(error)
      }
    },

    /**
     * Common error handler
     */
    showError(error) {
      let message = error?.response?.data?.message || error?.message || this.$t('common.error')

      /*
       * Laravel validation errors
       */
      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        const errors = error.response.data.errors

        message = Object.values(errors).flat().join('\n')
      }

      this.$swal.fire({
        icon: 'error',

        title: this.$t('common.error'),

        text: message,
      })
    },
  },
}
</script>

<style scoped>
.icon-btn {
  @apply w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors;
}
</style>
