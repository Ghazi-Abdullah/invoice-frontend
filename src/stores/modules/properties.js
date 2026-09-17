import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    properties: [],
    isLoading: false,
    error: null,
  },

  getters: {
    properties: state => state.properties,
    isLoading: state => state.isLoading,
    error: state => state.error,
  },

  mutations: {
    SET_PROPERTIES(state, properties) {
      state.properties = properties
    },
    ADD_PROPERTY(state, property) {
      state.properties.push(property)
    },
    UPDATE_PROPERTY_IN_LIST(state, updated) {
      const index = state.properties.findIndex(p => p.id == updated.id)
      if (index !== -1) state.properties.splice(index, 1, updated)
    },
    REMOVE_PROPERTY_FROM_LIST(state, id) {
      state.properties = state.properties.filter(p => p.id != id)
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    async fetchActiveProperties({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await axios.get('/admin/properties/active')
        if (response.data.status) {
          commit('SET_PROPERTIES', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في جلب العقارات')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createProperty({ commit }, payload) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.post('/admin/properties', payload)
        if (response.data.status) {
          commit('ADD_PROPERTY', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في إنشاء العقار')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },

    async updateProperty({ commit }, { id, payload }) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.put(`/admin/properties/${id}`, payload)
        if (response.data.status) {
          commit('UPDATE_PROPERTY_IN_LIST', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في تحديث العقار')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },

    async deleteProperty({ commit }, id) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.delete(`/admin/properties/${id}`)
        if (response.data.status) {
          commit('REMOVE_PROPERTY_FROM_LIST', id)
          return true
        }
        throw new Error(response.data.message || 'فشل في حذف العقار')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },
  },
}
