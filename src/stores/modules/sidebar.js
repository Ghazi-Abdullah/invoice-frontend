import i18n from '@/plugins/i18n'

// القوائم الأساسية (مرة واحدة فقط)
const BASE_MENUS = [
  {
    id: 1,
    title: 'nav.dashboard',
    icon: 'tachometer-alt',
    route: '/dashboard',
    permission: 'view_dashboard'
  },
  {
    id: 2,
    title: 'nav.invoices',
    icon: 'file-invoice-dollar',
    route: '/invoices',
    permission: 'view_invoices',
    children: [
      { id: 21, title: 'nav.all_invoices', route: '/invoices', permission: 'view_invoices' },
      { id: 22, title: 'nav.create_invoice', route: '/invoices/create', permission: 'create_invoice' }
    ]
  },
  {
    id: 3,
    title: 'nav.clients',
    icon: 'users',
    route: '/clients',
    permission: 'view_clients',
    children: [
      { id: 31, title: 'nav.all_clients', route: '/clients', permission: 'view_clients' },
      { id: 32, title: 'nav.add_client', route: '/clients/create', permission: 'create_client' }
    ]
  },
  {
    id: 4,
    title: 'nav.reports',
    icon: 'chart-line',
    route: '/reports',
    permission: 'view_reports'
  }
]

// القوائم الإدارية (تضاف للمسؤول فقط)
const ADMIN_MENUS = {
  id: 5,
  title: 'nav.admin',
  icon: 'cog',
  children: [
    { id: 51, title: 'nav.users', route: '/users', permission: 'administration' },
    { id: 52, title: 'adminGroups.title', route: '/admin/groups', permission: 'administration' },
    { id: 53, title: 'nav.permissions', route: '/permissions', permission: 'administration' }
  ]
}

const state = {
  isOpen: true,
  isMobile: false,
  menus: [],
  loading: false,
  error: null,
  loaded: false // منع التحميل المتكرر
}

const getters = {
  isSidebarOpen: state => state.isOpen,
  isMobile: state => state.isMobile,
  isLoading: state => state.loading,
  error: state => state.error,
  filteredMenus: (state, getters, rootState) => {
    const permissions = rootState.auth?.permissions || []
    const isAdmin = rootState.auth?.is_admin || false

    if (isAdmin) return state.menus

    return state.menus
      .map(menu => {
        const filtered = { ...menu }
        if (menu.permission && !permissions.includes(menu.permission)) return null
        if (menu.children) {
          const children = menu.children.filter(child =>
            child.permission ? permissions.includes(child.permission) : true
          )
          if (children.length === 0) return null
          filtered.children = children
        }
        return filtered
      })
      .filter(Boolean)
  }
}

const mutations = {
  TOGGLE_SIDEBAR(state) { state.isOpen = !state.isOpen },
  SET_SIDEBAR(state, value) { state.isOpen = value },
  SET_MOBILE(state, value) { state.isMobile = value },
  SET_MENUS(state, menus) {
    state.menus = menus
    state.loaded = true
  },
  SET_LOADING(state, loading) { state.loading = loading },
  SET_ERROR(state, error) { state.error = error },
  CLEAR_ERROR(state) { state.error = null },
  RESET(state) {
    state.isOpen = true
    state.isMobile = false
    state.menus = []
    state.loading = false
    state.error = null
    state.loaded = false
  }
}

const actions = {
  toggleSidebar({ commit }) { commit('TOGGLE_SIDEBAR') },
  setSidebar({ commit }, value) { commit('SET_SIDEBAR', value) },
  checkMobile({ commit }) {
    const isMobile = window.innerWidth < 768
    commit('SET_MOBILE', isMobile)
    if (isMobile) commit('SET_SIDEBAR', false)
  },
  loadMenus({ commit, rootState, state }) {
    if (state.loaded) return
    commit('SET_LOADING', true)
    commit('CLEAR_ERROR')
    try {
      let menus = JSON.parse(JSON.stringify(BASE_MENUS))
      if (rootState.auth?.is_admin) {
        menus.push(JSON.parse(JSON.stringify(ADMIN_MENUS)))
      }
      const translate = (items) =>
        items.map(item => ({
          ...item,
          title: i18n.global.t(item.title),
          children: item.children ? translate(item.children) : undefined
        }))
      const translated = translate(menus)
      commit('SET_MENUS', translated)
    } catch (error) {
      commit('SET_ERROR', error.message || i18n.global.t('sidebar.load_error'))
    } finally {
      commit('SET_LOADING', false)
    }
  },
  reloadMenus({ commit, dispatch }) {
    commit('RESET')
    dispatch('loadMenus')
  },
  clearError({ commit }) { commit('CLEAR_ERROR') },
  reset({ commit }) { commit('RESET') }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
