export default {
  namespaced: true,

  state: () => ({
    toasts: []
  }),

  mutations: {
    ADD_TOAST(state, toast) {
      state.toasts.push(toast)
    },
    REMOVE_TOAST(state, id) {
      state.toasts = state.toasts.filter(toast => toast.id !== id)
    }
  },

  actions: {
    success({ commit }, message) {
      this._vm.$toast.success(message)
    },

    error({ commit }, message) {
      this._vm.$toast.error(message)
    },

    info({ commit }, message) {
      this._vm.$toast.info(message)
    },

    warning({ commit }, message) {
      this._vm.$toast.warning(message)
    }
  }
}
