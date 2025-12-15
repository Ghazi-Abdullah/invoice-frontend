export default {
  namespaced: true,
  state: {
    isOpen: true,
    isMobile: false,
    menus: []
  },
  mutations: {
    TOGGLE_SIDEBAR(state) {
      state.isOpen = !state.isOpen
    },
    SET_SIDEBAR(state, value) {
      state.isOpen = value
    },
    SET_MOBILE(state, value) {
      state.isMobile = value
    },
    SET_MENUS(state, menus) {
      state.menus = menus
    }
  },
  actions: {
    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    setSidebar({ commit }, value) {
      commit('SET_SIDEBAR', value)
    },
    checkMobile({ commit }) {
      const isMobile = window.innerWidth < 768
      commit('SET_MOBILE', isMobile)
      if (isMobile) {
        commit('SET_SIDEBAR', false)
      }
    },
    loadMenus({ commit, rootState }) {
      // يمكن تحميل القوائم من API هنا
      const menus = [
        {
          id: 1,
          title: 'لوحة التحكم',
          icon: 'home',
          route: '/dashboard',
          permission: 'dashboard'
        },
        {
          id: 2,
          title: 'العملاء',
          icon: 'users',
          route: '/clients',
          permission: 'view_clients',
          children: [
            {
              id: 21,
              title: 'جميع العملاء',
              route: '/clients',
              permission: 'view_clients'
            },
            {
              id: 22,
              title: 'إضافة عميل',
              route: '/clients/create',
              permission: 'create_client'
            }
          ]
        },
        {
          id: 3,
          title: 'الفواتير',
          icon: 'file-invoice',
          route: '/invoices',
          permission: 'view_invoices',
          children: [
            {
              id: 31,
              title: 'جميع الفواتير',
              route: '/invoices',
              permission: 'view_invoices'
            },
            {
              id: 32,
              title: 'إنشاء فاتورة',
              route: '/invoices/create',
              permission: 'create_invoice'
            }
          ]
        },
        {
          id: 4,
          title: 'التقارير',
          icon: 'chart-bar',
          route: '/reports',
          permission: 'view_sales_report'
        }
      ]

      // إضافة قوائم الإدارة للمسؤولين
      if (rootState.auth.is_admin) {
        menus.push({
          id: 5,
          title: 'الإدارة',
          icon: 'cog',
          children: [
            {
              id: 51,
              title: 'المستخدمون',
              route: '/admin/users',
              permission: 'administration'
            },
            {
              id: 52,
              title: 'المجموعات',
              route: '/admin/groups',
              permission: 'administration'
            },
            {
              id: 53,
              title: 'الصلاحيات',
              route: '/admin/permissions',
              permission: 'administration'
            }
          ]
        })
      }

      commit('SET_MENUS', menus)
    }
  },
  getters: {
    isSidebarOpen: (state) => state.isOpen,
    isMobile: (state) => state.isMobile,
    filteredMenus: (state, getters, rootState) => {
      const permissions = rootState.auth.permissions || []
      const isAdmin = rootState.auth.is_admin

      return state.menus.filter(menu => {
        // إذا كان المستخدم مديراً، يعرض جميع القوائم
        if (isAdmin) return true

        // التحقق من صلاحية القائمة الرئيسية
        if (menu.permission && !permissions.includes(menu.permission)) {
          return false
        }

        // تصفية القوائم الفرعية
        if (menu.children) {
          menu.children = menu.children.filter(child => {
            if (child.permission) {
              return permissions.includes(child.permission)
            }
            return true
          })

          // إخفاء القائمة إذا لم يكن بها قوائم فرعية
          return menu.children.length > 0
        }

        return true
      })
    }
  }
}
