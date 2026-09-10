// src/stores/modules/branch.js
import axios from '@/api/axios'

export default {
  namespaced: true,

  state: {
    branches: [],
    selectedBranchId: localStorage.getItem('selectedBranchId') || null,
    defaultBranchId: null,
    isLoading: false,
    error: null,
  },

  getters: {
    branches: state => state.branches,
    selectedBranchId: state => state.selectedBranchId,
    selectedBranch: state => state.branches.find(b => b.id == state.selectedBranchId),
    defaultBranchId: state => state.defaultBranchId,
    hasMultipleBranches: state => state.branches.length > 1,
    isLoading: state => state.isLoading,
    error: state => state.error,
  },

  mutations: {
    SET_BRANCHES(state, branches) {
      state.branches = branches
    },
    ADD_BRANCH(state, branch) {
      state.branches.push(branch)
    },
    UPDATE_BRANCH_IN_LIST(state, updatedBranch) {
      const index = state.branches.findIndex(b => b.id == updatedBranch.id)
      if (index !== -1) {
        state.branches.splice(index, 1, updatedBranch)
      }
    },
    REMOVE_BRANCH_FROM_LIST(state, branchId) {
      state.branches = state.branches.filter(b => b.id != branchId)
    },
    SET_SELECTED_BRANCH(state, branchId) {
      state.selectedBranchId = branchId
      if (branchId) {
        localStorage.setItem('selectedBranchId', branchId)
      } else {
        localStorage.removeItem('selectedBranchId')
      }
    },
    SET_DEFAULT_BRANCH(state, branchId) {
      state.defaultBranchId = branchId
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_BRANCH(state) {
      state.selectedBranchId = null
      state.branches = []
      state.defaultBranchId = null
      localStorage.removeItem('selectedBranchId')
    },
  },

  actions: {
    // جلب الفروع المتاحة للمستخدم (تُستخدم في BranchSelector)
    async fetchMyBranches({ commit, dispatch }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await axios.get('/admin/branches/my-branches')

        if (response.data.status && response.data.data) {
          const { branches, default_branch } = response.data.data
          commit('SET_BRANCHES', branches)
          commit('SET_DEFAULT_BRANCH', default_branch)

          const savedBranchId = localStorage.getItem('selectedBranchId')
          const hasSavedBranch = savedBranchId && branches.some(b => b.id == savedBranchId)

          if (!hasSavedBranch && default_branch) {
            commit('SET_SELECTED_BRANCH', default_branch)
          } else if (!hasSavedBranch && branches.length > 0) {
            commit('SET_SELECTED_BRANCH', branches[0].id)
          }

          dispatch('updateAxiosHeader')

          return { success: true, branches }
        } else {
          const message = response.data.message || 'فشل في جلب الفروع'
          commit('SET_ERROR', message)
          return { success: false, message }
        }
      } catch (error) {
        const message = error.response?.data?.message || 'خطأ في جلب الفروع'
        commit('SET_ERROR', message)
        return { success: false, message }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // جلب كل الفروع بدون تقييد بالمستخدم (تُستخدم في BranchesManagement - صفحة الإدارة)
    async fetchAllBranches({ commit }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await axios.get('/admin/branches')

        if (response.data.status) {
          const branches = response.data.data
          commit('SET_BRANCHES', branches)
          return branches
        } else {
          const message = response.data.message || 'فشل في جلب الفروع'
          commit('SET_ERROR', message)
          throw new Error(message)
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'خطأ في جلب الفروع'
        commit('SET_ERROR', message)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    // إنشاء فرع جديد
    async createBranch({ commit }, payload) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.post('/admin/branches', payload)

        if (response.data.status) {
          const branch = response.data.data
          commit('ADD_BRANCH', branch)
          return branch
        } else {
          const message = response.data.message || 'فشل في إنشاء الفرع'
          commit('SET_ERROR', message)
          throw new Error(message)
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'خطأ في إنشاء الفرع'
        commit('SET_ERROR', message)
        throw error
      }
    },

    // تحديث فرع موجود
    async updateBranch({ commit }, { id, payload }) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.put(`/admin/branches/${id}`, payload)

        if (response.data.status) {
          const branch = response.data.data
          commit('UPDATE_BRANCH_IN_LIST', branch)
          return branch
        } else {
          const message = response.data.message || 'فشل في تحديث الفرع'
          commit('SET_ERROR', message)
          throw new Error(message)
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'خطأ في تحديث الفرع'
        commit('SET_ERROR', message)
        throw error
      }
    },

    // حذف فرع
    async deleteBranch({ commit }, id) {
      commit('SET_ERROR', null)

      try {
        const response = await axios.delete(`/admin/branches/${id}`)

        if (response.data.status) {
          commit('REMOVE_BRANCH_FROM_LIST', id)
          return true
        } else {
          const message = response.data.message || 'فشل في حذف الفرع'
          commit('SET_ERROR', message)
          throw new Error(message)
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'خطأ في حذف الفرع'
        commit('SET_ERROR', message)
        throw error
      }
    },

    // تغيير الفرع المختار
    async selectBranch({ commit, dispatch }, branchId) {
      commit('SET_SELECTED_BRANCH', branchId)
      dispatch('updateAxiosHeader')
      return { success: true }
    },

    // تحديث Header Axios بـ X-Branch-Id
    updateAxiosHeader({ state }) {
      if (state.selectedBranchId) {
        axios.defaults.headers.common['X-Branch-Id'] = state.selectedBranchId
      } else {
        delete axios.defaults.headers.common['X-Branch-Id']
      }
    },

    // مسح بيانات الفروع (عند تسجيل الخروج)
    clearBranch({ commit }) {
      commit('CLEAR_BRANCH')
      delete axios.defaults.headers.common['X-Branch-Id']
    },
  },
}
