import axios from '../../api/axios'

export default {
  namespaced: true,

  state: {
    users: [],
    user: null,
    groups: [],
    isLoading: false,
    error: null
  },

  getters: {
    users: (state) => state.users,
    user: (state) => state.user,
    groups: (state) => state.groups,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error
  },

  mutations: {
    SET_USERS(state, users) {
      state.users = users
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_GROUPS(state, groups) {
      state.groups = groups
    },
    SET_LOADING(state, isLoading) {
      state.isLoading = isLoading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    }
  },

  actions: {
    async getUsers({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/users')

        if (response.data.status) {
          const users = response.data.data
          commit('SET_USERS', users)
          return users
        } else {
          throw new Error(response.data.message || 'Failed to fetch users')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getUserGroups({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/groups/simple-list')

        if (response.data.status) {
          const groups = response.data.data
          commit('SET_GROUPS', groups)
          return groups
        } else {
          throw new Error(response.data.message || 'Failed to fetch groups')
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message
        commit('SET_ERROR', errorMsg)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async createUser({ dispatch }, userData) {
      try {
        // التحقق الأساسي من كلمة المرور
        if (userData.password && userData.password.length < 8) {
          throw new Error('Password must be at least 8 characters')
        }

        if (userData.password && userData.password !== userData.password_confirmation) {
          throw new Error('Password confirmation does not match')
        }

        const response = await axios.post('/admin/users', userData)

        if (response.data.status) {
          await dispatch('getUsers')
          return response.data.data
        } else {
          // عرض رسالة الخطأ من الخادم مباشرة
          throw new Error(response.data.message || 'Failed to create user')
        }
      } catch (error) {
        // معالجة جميع أنواع الأخطاء
        if (error.response) {
          // خطأ 422 من Laravel
          if (error.response.status === 422) {
            const serverMessage = error.response.data?.message
            if (serverMessage) {
              throw new Error(serverMessage)
            }
            // إذا كانت هناك أخطاء متعددة
            if (error.response.data?.errors) {
              const errors = error.response.data.errors
              const errorMessages = Object.values(errors).flat().join(', ')
              throw new Error(errorMessages)
            }
          }
          throw new Error(error.response.data?.message || error.message)
        }
        throw error
      }
    },

    async updateUser({ dispatch }, { id, data }) {
      try {
        // إذا تم إرسال كلمة مرور جديدة، تأكد من صحتها
        if (data.password) {
          if (data.password.length < 8) {
            throw new Error('Password must be at least 8 characters')
          }

          if (data.password !== data.password_confirmation) {
            throw new Error('Password confirmation does not match')
          }
        }

        const response = await axios.put(`/admin/users/${id}`, data)

        if (response.data.status) {
          await dispatch('getUsers')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update user')
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            const serverMessage = error.response.data?.message
            if (serverMessage) {
              throw new Error(serverMessage)
            }
          }
          throw new Error(error.response.data?.message || error.message)
        }
        throw error
      }
    },

    async deleteUser({ dispatch }, id) {
      try {
        const response = await axios.delete(`/admin/users/${id}`)

        if (response.data.status) {
          await dispatch('getUsers')
          return true
        } else {
          throw new Error(response.data.message || 'Failed to delete user')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    },

    async updateUserStatus({ dispatch }, { id, is_active }) {
      try {
        const response = await axios.put(`/admin/users/${id}/status`, { is_active })

        if (response.data.status) {
          await dispatch('getUsers')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update user status')
        }
      } catch (error) {
        throw error.response?.data?.message || error.message
      }
    }
  }
}
