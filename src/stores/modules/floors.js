import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    floors: [],
    isLoading: false,
    error: null,
  },

  getters: {
    floors: state => state.floors,
    isLoading: state => state.isLoading,
    error: state => state.error,
  },

  mutations: {
    SET_FLOORS(state, floors) {
      state.floors = floors
    },
    CLEAR_FLOORS(state) {
      state.floors = []
    },
    ADD_FLOOR(state, floor) {
      state.floors.push(floor)
    },
    UPDATE_FLOOR_IN_LIST(state, updated) {
      const index = state.floors.findIndex(f => f.id == updated.id)
      if (index !== -1) state.floors.splice(index, 1, updated)
    },
    REMOVE_FLOOR_FROM_LIST(state, id) {
      state.floors = state.floors.filter(f => f.id != id)
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    async fetchFloorsByProperty({ commit }, propertyId) {
      if (!propertyId) {
        commit('CLEAR_FLOORS')
        return []
      }
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await axios.get('/admin/floors', { params: { property_id: propertyId } })
        if (response.data.status) {
          commit('SET_FLOORS', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في جلب الطوابق')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createFloor({ commit }, payload) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.post('/admin/floors', payload)
        if (response.data.status) {
          commit('ADD_FLOOR', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في إنشاء الطابق')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },

    async updateFloor({ commit }, { id, payload }) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.put(`/admin/floors/${id}`, payload)
        if (response.data.status) {
          commit('UPDATE_FLOOR_IN_LIST', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في تحديث الطابق')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },

    async deleteFloor({ commit }, id) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.delete(`/admin/floors/${id}`)
        if (response.data.status) {
          commit('REMOVE_FLOOR_FROM_LIST', id)
          return true
        }
        throw new Error(response.data.message || 'فشل في حذف الطابق')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },
  },
}
