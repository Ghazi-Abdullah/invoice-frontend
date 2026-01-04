import axios from '../../api/axios'

export default {
  namespaced: true,

  state: {
    adminGroups: [],
    adminGroup: null,
    availablePermissions: [],
    isLoading: false,
    error: null
  },

  getters: {
    adminGroups: (state) => state.adminGroups,
    adminGroup: (state) => state.adminGroup,
    availablePermissions: (state) => state.availablePermissions,
    isLoading: (state) => state.isLoading,
    error: (state) => state.error
  },

  mutations: {
    SET_ADMIN_GROUPS(state, groups) {
      state.adminGroups = groups
    },
    SET_ADMIN_GROUP(state, group) {
      state.adminGroup = group
    },
    SET_AVAILABLE_PERMISSIONS(state, permissions) {
      state.availablePermissions = permissions
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
    async getAdminGroups({ commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get('/admin/groups')

        if (response.data.status) {
          const groups = Array.isArray(response.data.data) ? response.data.data : response.data.data?.data || []
          commit('SET_ADMIN_GROUPS', groups)
          return groups
        } else {
          throw new Error(response.data.message || 'Failed to fetch groups')
        }
      } catch (error) {
        let errorMsg = 'فشل في تحميل المجموعات'
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message
        } else if (error.message) {
          errorMsg = error.message
        }
        commit('SET_ERROR', errorMsg)
        throw new Error(errorMsg)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getAdminGroup({ commit }, id) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get(`/admin/groups/${id}`)

        if (response.data.status) {
          const group = response.data.data
          commit('SET_ADMIN_GROUP', group)
          return group
        } else {
          throw new Error(response.data.message || 'Failed to fetch group')
        }
      } catch (error) {
        let errorMsg = 'فشل في تحميل المجموعة'
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message
        } else if (error.message) {
          errorMsg = error.message
        }
        commit('SET_ERROR', errorMsg)
        throw new Error(errorMsg)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async getAvailablePermissions({ commit }, groupId) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')

      try {
        const response = await axios.get(`/admin/groups/${groupId}/available-permissions`)

        if (response.data.status) {
          const data = response.data.data
          const permissions = data.permissions || []
          const selectedPermissions = data.selected_permissions || []

          commit('SET_AVAILABLE_PERMISSIONS', permissions)
          return { permissions, selectedPermissions }
        } else {
          throw new Error(response.data.message || 'Failed to fetch permissions')
        }
      } catch (error) {
        let errorMsg = 'فشل في تحميل الصلاحيات'
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message
        } else if (error.message) {
          errorMsg = error.message
        }
        commit('SET_ERROR', errorMsg)
        throw new Error(errorMsg)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateGroupPermissions({ dispatch }, { id, permissions }) {
      try {
        const response = await axios.put(`/admin/groups/${id}/permissions`, { permissions })

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'Failed to update permissions')
        }
      } catch (error) {
        let errorMsg = 'فشل في تحديث الصلاحيات'
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message
        } else if (error.message) {
          errorMsg = error.message
        }
        throw new Error(errorMsg)
      }
    },

    async createAdminGroup({ dispatch }, data) {
      try {
        // تحضير البيانات بشكل صحيح
        const groupData = {
          title_en: data.title_en?.trim() || '',
          title_ar: data.title_ar?.trim() || '',
          description: data.description?.trim() || null,
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
        }

        // التحقق من البيانات
        if (!groupData.title_en) {
          throw new Error('اسم المجموعة بالإنجليزية مطلوب')
        }

        if (!groupData.title_ar) {
          throw new Error('اسم المجموعة بالعربية مطلوب')
        }

        console.log('🚀 إرسال بيانات المجموعة:', groupData)

        const response = await axios.post('/admin/groups', groupData)

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'فشل في إنشاء المجموعة')
        }
      } catch (error) {
        console.error('❌ خطأ في إنشاء المجموعة:', error)

        let errorMessage = 'فشل في إنشاء المجموعة'

        if (error.response) {
          if (error.response.status === 422 && error.response.data.errors) {
            // أخطاء التحقق من Laravel
            const errors = error.response.data.errors
            const messages = Object.values(errors).flat().join(', ')
            errorMessage = messages
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        throw new Error(errorMessage)
      }
    },

    async updateAdminGroup({ dispatch }, { id, data }) {
      try {
        const groupData = {
          title_en: data.title_en?.trim() || '',
          title_ar: data.title_ar?.trim() || '',
          description: data.description?.trim() || null,
          is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
        }

        // التحقق من البيانات
        if (!groupData.title_en) {
          throw new Error('اسم المجموعة بالإنجليزية مطلوب')
        }

        if (!groupData.title_ar) {
          throw new Error('اسم المجموعة بالعربية مطلوب')
        }

        const response = await axios.put(`/admin/groups/${id}`, groupData)

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return response.data.data
        } else {
          throw new Error(response.data.message || 'فشل في تحديث المجموعة')
        }
      } catch (error) {
        let errorMessage = 'فشل في تحديث المجموعة'

        if (error.response) {
          if (error.response.status === 422 && error.response.data.errors) {
            const errors = error.response.data.errors
            const messages = Object.values(errors).flat().join(', ')
            errorMessage = messages
          } else if (error.response.data?.message) {
            errorMessage = error.response.data.message
          }
        } else if (error.message) {
          errorMessage = error.message
        }

        throw new Error(errorMessage)
      }
    },

    async deleteAdminGroup({ dispatch }, id) {
      try {
        const response = await axios.delete(`/admin/groups/${id}`)

        if (response.data.status) {
          await dispatch('getAdminGroups')
          return true
        } else {
          throw new Error(response.data.message || 'فشل في حذف المجموعة')
        }
      } catch (error) {
        let errorMessage = 'فشل في حذف المجموعة'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        throw new Error(errorMessage)
      }
    }
  }
}
