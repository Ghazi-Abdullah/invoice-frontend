import axios from '../../api/axios'
import NProgress from 'nprogress'

export default {
  state: {
    permissions: [],
    menusWithPermissions: [],
    isLoading: false
  },
  getters: {
    permissions: (state) => state.permissions,
    menusWithPermissions: (state) => state.menusWithPermissions,
    isLoading: (state) => state.isLoading
  },
  mutations: {
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions
    },
    SET_MENUS_WITH_PERMISSIONS(state, menus) {
      state.menusWithPermissions = menus
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    }
  },
  actions: {
    async getPermissions({ commit }) {
      commit('SET_LOADING', true)
      await axios.get('permissions').then(
        (res) => {
          if (res.data.status) {
            commit('SET_PERMISSIONS', res.data.data)
          }
          commit('SET_LOADING', false)
        },
        (error) => {
          commit('SET_LOADING', false)
          console.error(error)
        }
      )
    },

    async getMenusWithPermissions({ commit }) {
      commit('SET_LOADING', true)
      await axios.get('permissions/menus').then(
        (res) => {
          if (res.data.status) {
            commit('SET_MENUS_WITH_PERMISSIONS', res.data.data)
          }
          commit('SET_LOADING', false)
        },
        (error) => {
          commit('SET_LOADING', false)
          console.error(error)
        }
      )
    }
  }
}
