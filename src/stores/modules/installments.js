import axios from '@/api/axios'

const state = {
  currentPlan: null,
  interestTiers: [],
  loading: false,
  submitting: false,
  error: null,
}

const getters = {
  currentPlan: (state) => state.currentPlan,
  interestTiers: (state) => state.interestTiers,
  loading: (state) => state.loading,
  submitting: (state) => state.submitting,
  error: (state) => state.error,
  hasActivePlan: (state) => state.currentPlan && state.currentPlan.status === 'active',
}

const mutations = {
  SET_CURRENT_PLAN(state, plan) {
    state.currentPlan = plan
  },
  SET_INTEREST_TIERS(state, tiers) {
    state.interestTiers = tiers
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
  SET_SUBMITTING(state, value) {
    state.submitting = value
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  },
  UPDATE_INSTALLMENT_IN_PLAN(state, updatedInstallment) {
    if (!state.currentPlan || !state.currentPlan.installments) return

    const index = state.currentPlan.installments.findIndex((i) => i.id === updatedInstallment.id)
    if (index !== -1) {
      state.currentPlan.installments.splice(index, 1, updatedInstallment)
    }
  },
}

const actions = {
  async fetchInstallmentPlan({ commit }, invoiceId) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const response = await axios.get(`/admin/invoices/${invoiceId}/installment-plan`)
      commit('SET_CURRENT_PLAN', response.data.data)
      return response.data.data
    } catch (error) {
      if (error.response?.status === 404) {
        // طبيعي: الفاتورة ما عندها خطة أقساط بعد
        commit('SET_CURRENT_PLAN', null)
        return null
      }
      const message = error.response?.data?.message || 'فشل في جلب خطة الأقساط'
      commit('SET_ERROR', message)
      throw new Error(message)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createInstallmentPlan({ commit }, { invoiceId, data }) {
    commit('SET_SUBMITTING', true)
    commit('CLEAR_ERROR')

    try {
      const response = await axios.post(`/admin/invoices/${invoiceId}/installment-plan`, data)
      commit('SET_CURRENT_PLAN', response.data.data)
      return response.data.data
    } catch (error) {
      const message = error.response?.data?.message || 'فشل في إنشاء خطة الأقساط'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async payInstallment({ commit }, { installmentId, paymentMethod }) {
    commit('SET_SUBMITTING', true)
    commit('CLEAR_ERROR')

    try {
      const response = await axios.put(`/admin/installments/${installmentId}/pay`, {
        payment_method: paymentMethod,
      })
      commit('UPDATE_INSTALLMENT_IN_PLAN', response.data.data)
      return response.data.data
    } catch (error) {
      const message = error.response?.data?.message || 'فشل في تسجيل سداد القسط'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async cancelInstallmentPlan({ commit }, planId) {
    commit('SET_SUBMITTING', true)
    commit('CLEAR_ERROR')

    try {
      const response = await axios.delete(`/admin/installment-plans/${planId}`)
      commit('SET_CURRENT_PLAN', response.data.data)
      return response.data.data
    } catch (error) {
      const message = error.response?.data?.message || 'فشل في إلغاء خطة الأقساط'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async suggestInterestRate({ commit }, numberOfInstallments) {
    try {
      const response = await axios.get(`/admin/installment-interest-tiers/suggest/${numberOfInstallments}`)
      return response.data.data.interest_rate
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'فشل في جلب النسبة المقترحة')
      return 0
    }
  },

  async fetchInterestTiers({ commit }) {
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')

    try {
      const response = await axios.get('/admin/installment-interest-tiers')
      commit('SET_INTEREST_TIERS', response.data.data)
      return response.data.data
    } catch (error) {
      const message = error.response?.data?.message || 'فشل في جلب جدول نسب الفائدة'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async saveInterestTier({ commit, dispatch }, { numberOfInstallments, interestRate }) {
    commit('SET_SUBMITTING', true)
    commit('CLEAR_ERROR')

    try {
      await axios.post('/admin/installment-interest-tiers', {
        number_of_installments: numberOfInstallments,
        interest_rate: interestRate,
      })
      await dispatch('fetchInterestTiers')
    } catch (error) {
      const message = error.response?.data?.message || 'فشل في حفظ النسبة'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async deleteInterestTier({ commit, dispatch }, tierId) {
    commit('SET_SUBMITTING', true)
    commit('CLEAR_ERROR')

    try {
      await axios.delete(`/admin/installment-interest-tiers/${tierId}`)
      await dispatch('fetchInterestTiers')
    } catch (error) {
      const message = error.response?.data?.message || 'فشل في حذف النسبة'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  clearError({ commit }) {
    commit('CLEAR_ERROR')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
