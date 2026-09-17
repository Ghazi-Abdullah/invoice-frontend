import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    tenants: [],
    isLoading: false,
    error: null,
  },

  getters: {
    tenants: state => state.tenants,
    isLoading: state => state.isLoading,
    error: state => state.error,
  },

  mutations: {
    SET_TENANTS(state, tenants) {
      state.tenants = tenants
    },

    CLEAR_TENANTS(state) {
      state.tenants = []
    },

    ADD_TENANT(state, tenant) {
      state.tenants.push(tenant)
    },

    UPDATE_TENANT_IN_LIST(state, updated) {
      const index = state.tenants.findIndex(t => t.id == updated.id)

      if (index !== -1) {
        state.tenants.splice(index, 1, updated)
      }
    },

    REMOVE_TENANT_FROM_LIST(state, id) {
      state.tenants = state.tenants.filter(t => t.id != id)
    },

    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },

    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    async fetchActiveTenants({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await axios.get('/admin/tenants/active')

        if (response.data.status) {
          commit('SET_TENANTS', response.data.data)

          return response.data.data
        }

        throw new Error(
          response.data.message || 'فشل في جلب المستأجرين'
        )
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message

        commit('SET_ERROR', message)

        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    clearTenants({ commit }) {
      commit('CLEAR_TENANTS')
    },
  },
}
