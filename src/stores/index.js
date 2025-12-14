import { createStore } from 'vuex'
<<<<<<< Updated upstream
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

<<<<<<< HEAD


// src/store/index.js
/*import { createStore } from 'vuex'

import auth from './modules/auth'
import invoices from './modules/invoices'
import clients from './modules/clients'

export default createStore({
  modules: {
    auth,
    invoices,
    clients
  }
})*/

/*import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia*/
=======

import auth from './modules/auth'
import adminGroups from './modules/adminGroups'
import users from './modules/users'
import clients from './modules/clients'
import invoices from './modules/invoices'
import report from './modules/report'

export default createStore({
  modules: {
    auth,
    adminGroups,
    users,
    clients,
    invoices,
    report
  },
  state: {
    loader: false
  },
  getters: {
    loader: state => state.loader
  },
  mutations: {
    SET_LOADER_STATUS(state, status) {
      state.loader = status
    }
  },
  actions: {
    updateLoaderStatus({ commit }, status) {
      commit('SET_LOADER_STATUS', status)
    }
  }
})
>>>>>>> Stashed changes
=======
export default store
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
