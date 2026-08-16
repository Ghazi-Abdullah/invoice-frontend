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
    // جلب الفروع المتاحة للمستخدم
    async fetchMyBranches({ commit, dispatch }) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const response = await axios.get('/admin/branches/my-branches')

        if (response.data.status && response.data.data) {
          const { branches, default_branch } = response.data.data
          commit('SET_BRANCHES', branches)
          commit('SET_DEFAULT_BRANCH', default_branch)

          // إذا لم يكن هناك فرع مختار مسبقاً، نختار الفرع الافتراضي
          const savedBranchId = localStorage.getItem('selectedBranchId')
          const hasSavedBranch = savedBranchId && branches.some(b => b.id == savedBranchId)

          if (!hasSavedBranch && default_branch) {
            commit('SET_SELECTED_BRANCH', default_branch)
          } else if (!hasSavedBranch && branches.length > 0) {
            commit('SET_SELECTED_BRANCH', branches[0].id)
          }

          // ✅ تحديث header Axios تلقائياً
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

    // تغيير الفرع المختار
    async selectBranch({ commit, dispatch }, branchId) {
      commit('SET_SELECTED_BRANCH', branchId)
      dispatch('updateAxiosHeader')

      // إعادة تحميل البيانات الأساسية بعد تغيير الفرع
      // يمكنك إضافة dispatch لأي store آخر يحتاج لإعادة تحميل
      // مثلاً:
      // dispatch('invoices/fetchInvoices', { page: 1 }, { root: true })
      // dispatch('clients/fetchClients', { page: 1 }, { root: true })

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
