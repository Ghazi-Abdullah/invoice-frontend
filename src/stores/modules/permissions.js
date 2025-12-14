<<<<<<< HEAD
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
=======
import axios from '@/api/axios';

const state = {
  roles: [],
  permissions: [],
  userPermissions: [],
  loading: false
};

const mutations = {
  SET_ROLES(state, roles) {
    state.roles = roles;
  },
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions;
  },
  SET_USER_PERMISSIONS(state, permissions) {
    state.userPermissions = permissions;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  }
};

const actions = {
  async fetchRoles({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/permissions/roles');
      commit('SET_ROLES', response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchPermissions({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/permissions/permissions');
      commit('SET_PERMISSIONS', response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async fetchUserPermissions({ commit, rootState }) {
    if (!rootState.auth.user) return;

    try {
      const response = await axios.get(`/api/permissions/users/${rootState.auth.user.id}/roles`);
      const roles = response.data.roles || [];
      const permissions = roles.flatMap(role =>
        role.permissions.map(p => p.name)
      );
      commit('SET_USER_PERMISSIONS', permissions);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  }
};

const getters = {
  hasPermission: (state, getters, rootState) => (permissionName) => {
    const user = rootState.auth.user;

    if (!user) return false;

    // إذا كان المستخدم مسؤولاً، فلديه جميع الصلاحيات
    if (user.roles?.some(role => role.name === 'admin')) {
      return true;
    }

    return state.userPermissions.includes(permissionName);
  },

  hasAnyPermission: (state, getters) => (permissions) => {
    return permissions.some(permission => getters.hasPermission(permission));
  },

  roles: state => state.roles,
  permissions: state => state.permissions,
  userPermissions: state => state.userPermissions,
  loading: state => state.loading
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
>>>>>>> ed70c2fa7509b69723b93c2e81dab875d2a36a73
