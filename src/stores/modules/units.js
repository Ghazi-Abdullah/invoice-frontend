import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    units: [],
    isLoading: false,
    error: null,
  },

  getters: {
    units: state => state.units,
    isLoading: state => state.isLoading,
    error: state => state.error,
  },

  mutations: {
    SET_UNITS(state, units) {
      state.units = units
    },
    CLEAR_UNITS(state) {
      state.units = []
    },
    ADD_UNIT(state, unit) {
      state.units.push(unit)
    },
    UPDATE_UNIT_IN_LIST(state, updated) {
      const index = state.units.findIndex(u => u.id == updated.id)
      if (index !== -1) state.units.splice(index, 1, updated)
    },
    REMOVE_UNIT_FROM_LIST(state, id) {
      state.units = state.units.filter(u => u.id != id)
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    async fetchUnitsByFloor({ commit }, floorId) {
      if (!floorId) {
        commit('CLEAR_UNITS')
        return []
      }
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      try {
        const response = await axios.get('/admin/units', { params: { floor_id: floorId } })
        if (response.data.status) {
          commit('SET_UNITS', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في جلب الوحدات')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createUnit({ commit }, payload) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.post('/admin/units', payload)
        if (response.data.status) {
          commit('ADD_UNIT', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في إنشاء الوحدة')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },

    async updateUnit({ commit }, { id, payload }) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.put(`/admin/units/${id}`, payload)
        if (response.data.status) {
          commit('UPDATE_UNIT_IN_LIST', response.data.data)
          return response.data.data
        }
        throw new Error(response.data.message || 'فشل في تحديث الوحدة')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },

    async deleteUnit({ commit }, id) {
      commit('SET_ERROR', null)
      try {
        const response = await axios.delete(`/admin/units/${id}`)
        if (response.data.status) {
          commit('REMOVE_UNIT_FROM_LIST', id)
          return true
        }
        throw new Error(response.data.message || 'فشل في حذف الوحدة')
      } catch (error) {
        const message = error.response?.data?.message || error.message
        commit('SET_ERROR', message)
        throw error
      }
    },
  },
}
