import branchApi from '@/api/branch'

const state = () => ({
  branches: [],
  selectedBranchId: localStorage.getItem('selectedBranchId') || null,
  defaultBranchId: null,
  isSuperAdmin: false,
  loading: false,
})

const getters = {
  selectedBranch: (state) => state.branches.find((b) => b.id == state.selectedBranchId) || null,
}

const mutations = {
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
  SET_IS_SUPER_ADMIN(state, value) {
    state.isSuperAdmin = value
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
}

const actions = {
  // يُستدعى عند تحميل BranchSelector - يجلب فروع المستخدم الحالي
  async fetchMyBranches({ commit, state }) {
    commit('SET_LOADING', true)
    try {
      const { data } = await branchApi.getMyBranches()
      const payload = data?.data || {}
      const branches = payload.branches || []
      commit('SET_BRANCHES', branches)
      commit('SET_DEFAULT_BRANCH', payload.default_branch || null)
      commit('SET_IS_SUPER_ADMIN', !!payload.is_super_admin)

      // إذا لم يوجد فرع مختار مسبقاً (أول تسجيل دخول)، اختر الافتراضي أو أول فرع متاح
      const stillValid = branches.some((b) => b.id == state.selectedBranchId)
      if (!stillValid && branches.length) {
        commit('SET_SELECTED_BRANCH', payload.default_branch || branches[0].id)
      }
    } finally {
      commit('SET_LOADING', false)
    }
  },

  selectBranch({ commit }, branchId) {
    commit('SET_SELECTED_BRANCH', branchId)
  },

  // لصفحة إدارة الفروع (Admin > الفروع)
  async fetchAllBranches(_, params = {}) {
    const { data } = await branchApi.getAll(params)
    return data?.data
  },

  async createBranch(_, payload) {
    const { data } = await branchApi.create(payload)
    return data?.data
  },

  async updateBranch(_, { id, payload }) {
    const { data } = await branchApi.update(id, payload)
    return data?.data
  },

  async deleteBranch(_, id) {
    await branchApi.delete(id)
  },

  async assignBranches(_, payload) {
    await branchApi.assignBranches(payload)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}