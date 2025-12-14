import { createStore } from 'vuex'
import auth from './modules/auth'
import invoices from './modules/invoices'
import clients from './modules/clients'
import report from './modules/report'
import permissions from './modules/permissions'

const store = createStore({
  modules: {
    auth,
    invoices,
    clients,
    report,
    permissions
  },

  state: {
    loading: false,
    error: null
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error)
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR')
    }
  },

  getters: {
    loading: state => state.loading,
    error: state => state.error
  }
})

export default store
