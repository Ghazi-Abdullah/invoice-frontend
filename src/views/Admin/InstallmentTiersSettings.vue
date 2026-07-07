<template>
  <div class="min-h-screen bg-gray-50 py-6 md:py-8">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ $t('installments.tiers_title') }}</h1>
        <p class="text-gray-600 text-sm mt-1">{{ $t('installments.tiers_subtitle') }}</p>
      </div>

      <!-- Add/Edit Tier Form -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ $t('installments.add_tier') }}</h2>

        <form @submit.prevent="submitTier" class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ $t('installments.number_of_installments') }}
            </label>
            <input
              type="number"
              v-model.number="form.number_of_installments"
              min="2"
              max="60"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('installments.interest_rate') }} (%)</label>
            <input
              type="number"
              v-model.number="form.interest_rate"
              min="0"
              max="100"
              step="0.5"
              required
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50"
          >
            {{ $t('common.save') }}
          </button>
        </form>
      </div>

      <!-- Tiers Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div v-if="loading" class="text-center py-10 text-gray-500">{{ $t('common.loading') }}</div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="table-header">{{ $t('installments.number_of_installments') }}</th>
              <th class="table-header">{{ $t('installments.interest_rate') }}</th>
              <th class="table-header">{{ $t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tier in interestTiers" :key="tier.id">
              <td class="table-cell font-medium">{{ tier.number_of_installments }}</td>
              <td class="table-cell">{{ tier.interest_rate }}%</td>
              <td class="table-cell">
                <button
                  @click="removeTier(tier)"
                  class="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  {{ $t('common.delete') }}
                </button>
              </td>
            </tr>
            <tr v-if="interestTiers.length === 0">
              <td colspan="3" class="text-center py-8 text-gray-400">{{ $t('installments.no_tiers') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { THEME_COLORS } from '@/utils/theme-colors'

export default {
  name: 'InstallmentTiersSettings',

  data() {
    return {
      form: {
        number_of_installments: null,
        interest_rate: null,
      },
    }
  },

  computed: {
    ...mapGetters('installments', ['interestTiers', 'loading', 'submitting']),
  },

  created() {
    this.loadTiers()
  },

  methods: {
    ...mapActions('installments', ['fetchInterestTiers', 'saveInterestTier', 'deleteInterestTier']),

    async loadTiers() {
      try {
        await this.fetchInterestTiers()
      } catch (error) {
        this.$toast?.error(error.message || this.$t('installments.load_failed'))
      }
    },

    async submitTier() {
      try {
        await this.saveInterestTier({
          numberOfInstallments: this.form.number_of_installments,
          interestRate: this.form.interest_rate,
        })
        this.$toast?.success(this.$t('installments.tier_saved'))
        this.form = { number_of_installments: null, interest_rate: null }
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('installments.tier_save_failed'))
      }
    },

    async removeTier(tier) {
      const result = await this.$swal?.fire({
        title: this.$t('installments.confirm_delete_tier_title'),
        text: this.$t('installments.confirm_delete_tier_message', { count: tier.number_of_installments }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: THEME_COLORS.danger,
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
      })

      if (!result?.isConfirmed) return

      try {
        await this.deleteInterestTier(tier.id)
        this.$toast?.success(this.$t('installments.tier_deleted'))
      } catch (error) {
        this.$toast?.error(error.response?.data?.message || this.$t('installments.tier_delete_failed'))
      }
    },
  },
}
</script>

<style scoped>
.table-header {
  @apply px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4 text-sm text-gray-700;
}
</style>
