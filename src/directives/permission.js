import store from '@/stores'

export default {
  inserted(el, binding) {
    const { value } = binding
    const permissions = store.getters['auth/permissions']

    if (value && value instanceof Array && value.length > 0) {
      const hasPermission = value.some(permission => {
        return permissions.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else if (value && typeof value === 'string') {
      const hasPermission = permissions.includes(value)

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('Need permission! Like v-permission="[\'manage_users\']" or v-permission="\'manage_users\'"')
    }
  }
}
