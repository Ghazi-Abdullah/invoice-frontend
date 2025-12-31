<template>
  <div class="min-h-screen bg-gray-50/30">
    <!-- Page Header باستخدام المكون الأساسي -->
    <PageHeader
      :title="$t('clients.title')"
      :subtitle="$t('clients.subtitle')"
      :actions="headerActions"
    />

    <!-- Stats Cards باستخدام BaseCard -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <BaseCard
        v-for="(stat, index) in stats"
        :key="index"
        hoverable
        class="stat-card"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-lg mr-4" :style="{ backgroundColor: stat.color + '20' }">
            <font-awesome-icon :icon="stat.icon" :style="{ color: stat.color }" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Search Card باستخدام BaseCard -->
    <BaseCard class="mb-6" title="فلاتر البحث">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="form-label">{{ $t('common.status') }}</label>
          <select v-model="filters.status" @change="applyFilters" class="form-input">
            <option value="">{{ $t('common.all') }}</option>
            <option value="active">{{ $t('common.active') }}</option>
            <option value="inactive">{{ $t('common.inactive') }}</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="form-label">{{ $t('common.search') }}</label>
          <BaseInput
            v-model="searchQuery"
            :placeholder="$t('clients.searchPlaceholder')"
            :prefix-icon="['fas', 'search']"
            @input="onSearch"
          />
        </div>
        <div class="flex items-end">
          <BaseButton @click="applyFilters" type="primary" icon="filter" block>
            {{ $t('common.filter') }}
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" :text="$t('common.loading')" />
    </div>

    <!-- Error State -->
    <BaseAlert
      v-else-if="error"
      type="error"
      :title="$t('common.error')"
      :message="error"
      :actions="errorActions"
      class="mb-6"
    />

    <!-- No Clients State -->
    <BaseCard
      v-else-if="!loading && filteredClients.length === 0 && searchQuery === ''"
      class="text-center py-12"
    >
      <div class="empty-state">
        <font-awesome-icon :icon="['fas', 'users']" class="text-gray-300 text-4xl mb-3" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ $t('clients.no_clients') }}</h3>
        <p class="text-gray-500 mb-4">{{ $t('clients.emptyState') }}</p>
        <BaseButton
          v-if="hasPermission('create_client')"
          @click="$router.push('/clients/create')"
          type="primary"
          icon="plus"
        >
          {{ $t('clients.add_new') }}
        </BaseButton>
      </div>
    </BaseCard>

    <!-- Clients Table باستخدام BaseTable -->
    <BaseCard v-else>
      <template #actions>
        <div class="flex items-center space-x-2">
          <BaseInput
            v-model="searchQuery"
            :placeholder="$t('clients.searchPlaceholder')"
            :prefix-icon="['fas', 'search']"
            @input="onSearch"
            size="sm"
          />
          <BaseButton
            v-if="hasPermission('create_client')"
            @click="$router.push('/clients/create')"
            type="primary"
            icon="plus"
          >
            {{ $t('clients.add_new') }}
          </BaseButton>
        </div>
      </template>

      <BaseTable
        :columns="tableColumns"
        :data="filteredClients"
        :show-actions="true"
        :loading="loading"
        bordered
        striped
        hoverable
        empty-text="لا يوجد عملاء"
      >
        <template #cell-name="{ row }">
          <div class="flex items-center">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center ml-3">
              <span class="text-blue-600 text-xs font-semibold">
                {{ getInitials(row.name) }}
              </span>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ row.name }}
              </div>
              <div class="text-xs text-gray-500">
                {{ row.tax_number ? `${$t('clients.taxNumber')}: ${row.tax_number}` : '' }}
              </div>
            </div>
          </div>
        </template>

        <template #cell-status="{ row }">
          <StatusBadge :status="row.status === 'active' ? 'paid' : 'overdue'" />
        </template>

        <template #actions="{ row }">
          <div class="flex items-center space-x-2">
            <BaseButton
              @click="viewClient(row)"
              type="ghost"
              size="sm"
              icon="eye"
              :title="$t('buttons.view')"
            />
            <BaseButton
              v-if="hasPermission('edit_client')"
              @click="editClient(row)"
              type="ghost"
              size="sm"
              icon="edit"
              :title="$t('buttons.edit')"
            />
            <BaseButton
              v-if="hasPermission('delete_client')"
              @click="confirmDelete(row)"
              type="ghost"
              size="sm"
              icon="trash"
              :title="$t('buttons.delete')"
              class="text-red-600 hover:text-red-700"
            />
          </div>
        </template>
      </BaseTable>

      <!-- Pagination -->
      <div v-if="pagination && pagination.total > pagination.per_page" class="mt-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            عرض {{ pagination.from }} إلى {{ pagination.to }} من {{ pagination.total }} عميل
          </div>
          <div class="flex space-x-2">
            <BaseButton
              @click="previousPage"
              :disabled="pagination.current_page === 1"
              type="outline"
              size="sm"
              icon="chevron-right"
            />
            <span class="flex items-center px-3">
              صفحة {{ pagination.current_page }} من {{ pagination.last_page }}
            </span>
            <BaseButton
              @click="nextPage"
              :disabled="pagination.current_page === pagination.last_page"
              type="outline"
              size="sm"
              icon="chevron-left"
            />
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script>
export default {
  name: 'Clients',
  data() {
    return {
      loading: false,
      error: null,
      filters: {
        status: '',
      },
      searchQuery: '',
      searchTimeout: null,

      stats: [
        {
          label: this.$t('clients.stats.total'),
          value: 0,
          icon: ['fas', 'users'],
          color: '#3b82f6',
        },
        {
          label: this.$t('clients.stats.active'),
          value: 0,
          icon: ['fas', 'user-check'],
          color: '#10b981',
        },
        {
          label: this.$t('clients.stats.inactive'),
          value: 0,
          icon: ['fas', 'user-clock'],
          color: '#f59e0b',
        },
        {
          label: this.$t('clients.stats.newThisMonth'),
          value: 0,
          icon: ['fas', 'user-plus'],
          color: '#8b5cf6',
        },
      ],

      tableColumns: [
        { key: 'name', label: this.$t('clients.table.client'), align: 'right' },
        { key: 'email', label: this.$t('clients.table.email'), align: 'right' },
        { key: 'phone', label: this.$t('clients.table.phone'), align: 'right' },
        { key: 'company_name', label: this.$t('clients.table.company'), align: 'right' },
        { key: 'status', label: this.$t('clients.table.status'), align: 'center' },
      ],
    }
  },
  computed: {
    clients() {
      return this.$store.getters['clients/clients'] || []
    },
    filteredClients() {
      if (!this.searchQuery && !this.filters.status) {
        return this.clients
      }

      return this.clients.filter((client) => {
        const matchesSearch =
          !this.searchQuery ||
          client.name?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          client.email?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          client.phone?.includes(this.searchQuery)

        const matchesStatus = !this.filters.status || client.status === this.filters.status

        return matchesSearch && matchesStatus
      })
    },
    pagination() {
      return this.$store.getters['clients/pagination'] || null
    },
    headerActions() {
      return [
        {
          text: this.$t('clients.add_new'),
          type: 'primary',
          icon: 'plus',
          onClick: () => this.$router.push('/clients/create'),
          disabled: !this.hasPermission('create_client'),
        },
      ]
    },
    errorActions() {
      return [
        {
          text: this.$t('common.retry'),
          onClick: this.loadClients,
          type: 'danger',
        },
      ]
    },
  },
  mounted() {
    this.loadClients()
    this.calculateStats()
  },
  methods: {
    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },
    getInitials(name) {
      if (!name) return '?'
      return name.substring(0, 2).toUpperCase()
    },
    async loadClients() {
      this.loading = true
      try {
        await this.$store.dispatch('clients/fetchClients', {
          ...this.filters,
          search: this.searchQuery,
          page: this.pagination?.current_page || 1,
        })
        this.calculateStats()
      } catch (error) {
        this.error = error.message || this.$t('errors.loadClientsError')
        this.$toast.error(this.error)
      } finally {
        this.loading = false
      }
    },
    calculateStats() {
      const now = new Date()
      const thisMonth = now.getMonth()
      const thisYear = now.getFullYear()

      this.stats[0].value = this.clients.length
      this.stats[1].value = this.clients.filter((c) => c.status === 'active').length
      this.stats[2].value = this.clients.filter((c) => c.status === 'inactive').length
      this.stats[3].value = this.clients.filter((client) => {
        const created = new Date(client.created_at)
        return created.getMonth() === thisMonth && created.getFullYear() === thisYear
      }).length
    },
    applyFilters() {
      this.loadClients()
    },
    onSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.loadClients()
      }, 500)
    },
    viewClient(client) {
      this.$router.push(`/clients/${client.id}`)
    },
    editClient(client) {
      this.$router.push(`/clients/${client.id}/edit`)
    },
    confirmDelete(client) {
      this.$toast.confirm(
        `هل أنت متأكد من حذف العميل "${client.name}"؟`,
        async () => {
          await this.deleteClient(client.id)
        },
      )
    },
    async deleteClient(id) {
      try {
        await this.$store.dispatch('clients/deleteClient', id)
        this.$toast.success(this.$t('messages.deleteSuccess'))
        this.loadClients()
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.deleteError'))
      }
    },
    previousPage() {
      if (this.pagination && this.pagination.current_page > 1) {
        this.loadClientsWithPage(this.pagination.current_page - 1)
      }
    },
    nextPage() {
      if (this.pagination && this.pagination.current_page < this.pagination.last_page) {
        this.loadClientsWithPage(this.pagination.current_page + 1)
      }
    },
    async loadClientsWithPage(page) {
      try {
        await this.$store.dispatch('clients/fetchClients', {
          ...this.filters,
          search: this.searchQuery,
          page: page,
        })
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.loadClientsError'))
      }
    },
  },
}
</script>

<style scoped>
.stat-card {
  @apply transition-all duration-200 hover:shadow-lg;
}

.empty-state {
  @apply py-8 text-center;
}
</style>
