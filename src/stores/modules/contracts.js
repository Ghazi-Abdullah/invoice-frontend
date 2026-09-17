import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    contracts: [],
    pagination: null,
    currentContract: null,
    isLoading: false,
    error: null,
  },

  getters: {
    contracts: state => state.contracts,
    pagination: state => state.pagination,
    currentContract: state => state.currentContract,
    isLoading: state => state.isLoading,
    error: state => state.error,
  },

  mutations: {
    SET_CONTRACTS(state, { data, pagination }) {
      state.contracts = data || []
      state.pagination = pagination
    },

    SET_CURRENT_CONTRACT(state, contract) {
      state.currentContract = contract
    },

    CLEAR_CURRENT_CONTRACT(state) {
      state.currentContract = null
    },

    ADD_CONTRACT(state, contract) {
      state.contracts.unshift(contract)
    },

    UPDATE_CONTRACT_IN_LIST(state, updatedContract) {
      const index = state.contracts.findIndex(
        contract => Number(contract.id) === Number(updatedContract.id),
      )

      if (index !== -1) {
        state.contracts.splice(index, 1, updatedContract)
      }
    },

    REMOVE_CONTRACT_FROM_LIST(state, contractId) {
      state.contracts = state.contracts.filter(
        contract => Number(contract.id) !== Number(contractId),
      )
    },

    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },

    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    /**
     * Get contracts
     */
    async fetchContracts({ commit }, filters = {}) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await axios.get('/admin/contracts', {
          params: filters,
        })

        if (!response.data.status) {
          throw new Error(
            response.data.message || 'فشل في جلب العقود',
          )
        }

        const paginated = response.data.data

        commit('SET_CONTRACTS', {
          data: paginated?.data || [],
          pagination: {
            currentPage: paginated?.current_page || 1,
            lastPage: paginated?.last_page || 1,
            total: paginated?.total || 0,
            perPage: paginated?.per_page || 20,
          },
        })

        return paginated
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'حدث خطأ أثناء جلب العقود'

        commit('SET_ERROR', message)

        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * Get contracts by unit
     */
    async fetchContractsByUnit({ commit }, unitId) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.get(
          `/admin/contracts/unit/${unitId}`,
        )

        if (!response.data.status) {
          throw new Error(
            response.data.message || 'فشل في جلب عقود الوحدة',
          )
        }

        return response.data.data
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'حدث خطأ أثناء جلب عقود الوحدة'

        commit('SET_ERROR', message)

        throw error
      }
    },

    /**
     * Get single contract
     */
    async fetchContract({ commit }, id) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await axios.get(
          `/admin/contracts/${id}`,
        )

        if (!response.data.status) {
          throw new Error(
            response.data.message || 'فشل في جلب العقد',
          )
        }

        commit(
          'SET_CURRENT_CONTRACT',
          response.data.data,
        )

        return response.data.data
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'حدث خطأ أثناء جلب العقد'

        commit('SET_ERROR', message)

        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    /**
     * Create contract
     */
    async createContract({ commit }, payload) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.post(
          '/admin/contracts',
          payload,
        )

        if (!response.data.status) {
          throw new Error(
            response.data.message || 'فشل في إنشاء العقد',
          )
        }

        const contract = response.data.data

        commit('ADD_CONTRACT', contract)

        return contract
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'حدث خطأ أثناء إنشاء العقد'

        commit('SET_ERROR', message)

        throw error
      }
    },

    /**
     * Update contract
     */
    async updateContract({ commit }, { id, payload }) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.put(
          `/admin/contracts/${id}`,
          payload,
        )

        if (!response.data.status) {
          throw new Error(
            response.data.message || 'فشل في تحديث العقد',
          )
        }

        const contract = response.data.data

        commit(
          'UPDATE_CONTRACT_IN_LIST',
          contract,
        )

        commit(
          'SET_CURRENT_CONTRACT',
          contract,
        )

        return contract
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'حدث خطأ أثناء تحديث العقد'

        commit('SET_ERROR', message)

        throw error
      }
    },

    /**
     * Delete contract
     */
    async deleteContract({ commit }, id) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.delete(
          `/admin/contracts/${id}`,
        )

        if (!response.data.status) {
          throw new Error(
            response.data.message || 'فشل في حذف العقد',
          )
        }

        commit(
          'REMOVE_CONTRACT_FROM_LIST',
          id,
        )

        commit('CLEAR_CURRENT_CONTRACT')

        return true
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'حدث خطأ أثناء حذف العقد'

        commit('SET_ERROR', message)

        throw error
      }
    },

    /**
     * Generate invoice for contract
     */
    async generateInvoiceNow({ commit }, id) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.post(
          `/admin/contracts/${id}/generate-invoice`,
        )

        if (!response.data.status) {
          throw new Error(
            response.data.message ||
              'فشل في توليد الفاتورة',
          )
        }

        return response.data.data
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'حدث خطأ أثناء توليد الفاتورة'

        commit('SET_ERROR', message)

        throw error
      }
    },
  },
}
