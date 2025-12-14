import { createStore } from 'vuex'
<<<<<<< Updated upstream
import auth from './modules/auth'
import clients from './modules/clients'
import invoices from './modules/invoices'
import report from './modules/report'

export default createStore({
  modules: {
    auth,
    clients,
    invoices,
    report,
  }
})



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
