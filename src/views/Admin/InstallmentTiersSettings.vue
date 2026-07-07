<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        {{ $t('installments.tiers_title') }}
      </h1>
      <p class="text-gray-600 mb-6">{{ $t('installments.tiers_subtitle') }}</p>

      <div class="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <form @submit.prevent="submit" class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('installments.number_of_installments') }}
            </label>
            <input
              type="number"
              v-model.number="form.number_of_installments"
              min="2"
              max="60"
              class="border border-gray-300 rounded-lg p-2 w-32"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              {{ $t('installments.interest_rate') }} (%)
            </label>
            <input
              type="number"
              v-model.number="form.interest_rate"
              min="0"
              max="100"
              step="0.5"
              class="border border-gray-300 rounded-lg p-2 w-32"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {{ submitting ? $t('common.loading') : $t('common.save') }}
          </button>
        </form>
      </div>

      <div class="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                {{ $t('installments.number_of_installments') }}
              </th>
              <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                {{ $t('installments.interest_rate') }}
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-700">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tier in tiers" :key="tier.id">
              <td class="px-4 py-2 text-sm">{{ tier.number_of_installments }}</td>
              <td class="px-4 py-2 text-sm">{{ tier.interest_rate }}%</td>
              <td class="px-4 py-2 text-center">
                <button
                  @click="remove(tier.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
                >
                  {{ $t('common.delete') }}
                </button>
              </td>
            </tr>
            <tr v-if="!tiers.length">
              <td colspan="3" class="text-center py-4 text-gray-400">
                {{ $t('installments.no_tiers') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      form: {
        number_of_installments: null,
        interest_rate: null,
      },
    };
  },
  computed: {
    ...mapGetters('installments', ['interestTiers', 'submitting']),
    tiers() {
      return this.interestTiers;
    },
  },
  created() {
    this.fetchTiers();
  },
  methods: {
    ...mapActions('installments', ['fetchTiers', 'saveTier', 'deleteTier']),
    async submit() {
      try {
        await this.saveTier(this.form);
        this.$toast?.success(this.$t('installments.tier_saved'));
        this.form = { number_of_installments: null, interest_rate: null };
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.tier_save_failed'));
      }
    },
    async remove(id) {
      if (!confirm(this.$t('installments.confirm_delete_tier_message'))) return;
      try {
        await this.deleteTier(id);
        this.$toast?.success(this.$t('installments.tier_deleted'));
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.tier_delete_failed'));
      }
    },
  },
};
</script>
