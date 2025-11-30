import { createStore } from 'vuex'
import auth from './modules/auth'
import clients from './modules/clients'
import invoices from './modules/invoices'

export default createStore({
  modules: {
    auth,
    clients,
    invoices
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
