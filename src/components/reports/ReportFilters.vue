<template>
  <div class="filters-card bg-white rounded-lg shadow-md mb-6">
    <div class="card-header px-6 py-4 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800">فلاتر البحث</h2>
    </div>

    <div class="card-body px-6 py-4">
      <div class="filters-grid grid grid-cols-1 md:grid-cols-6 gap-4">
        <!-- من تاريخ -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-2"> من تاريخ </label>
          <input
            v-model="localFilters.start_date"
            type="date"
            class="filter-input"
            @change="onFilterChange"
          />
        </div>

        <!-- إلى تاريخ -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-2"> إلى تاريخ </label>
          <input
            v-model="localFilters.end_date"
            type="date"
            class="filter-input"
            @change="onFilterChange"
          />
        </div>

        <!-- حالة الفاتورة -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-2"> حالة الفاتورة </label>
          <select v-model="localFilters.status" class="filter-select" @change="onFilterChange">
            <option value="">الكل</option>
            <option value="draft">مسودة</option>
            <option value="sent">مرسلة</option>
            <option value="paid">مدفوعة</option>
            <option value="overdue">متأخرة</option>
          </select>
        </div>

        <!-- العميل -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-2"> العميل </label>
          <select v-model="localFilters.client_id" class="filter-select" @change="onFilterChange">
            <option value="">الكل</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>

        <!-- المستخدم -->
        <div class="filter-group">
          <label class="block text-sm font-medium text-gray-700 mb-2"> المستخدم </label>
          <select v-model="localFilters.user_id" class="filter-select" @change="onFilterChange">
            <option value="">الكل</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }}
            </option>
          </select>
        </div>

        <!-- أزرار التحكم -->
        <div class="filter-group flex items-end space-x-2 space-x-reverse">
          <button @click="onSearch" class="btn-primary flex-1" :disabled="loading">
            <i class="fas fa-search ml-2"></i>
            بحث
          </button>

          <button @click="onReset" class="btn-secondary" title="إعادة تعيين">
            <i class="fas fa-redo"></i>
          </button>

          <button @click="onExport" class="btn-success" title="تصدير">
            <i class="fas fa-file-export"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportFilters',

  props: {
    filters: {
      type: Object,
      required: true,
    },
    clients: {
      type: Array,
      default: () => [],
    },
    users: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      localFilters: { ...this.filters },
    }
  },

  watch: {
    filters: {
      immediate: true,
      handler(newFilters) {
        this.localFilters = { ...newFilters }
      },
    },
  },

  methods: {
    onFilterChange() {
      this.$emit('update-filters', this.localFilters)
    },

    onSearch() {
      this.$emit('search')
    },

    onReset() {
      this.$emit('reset')
    },

    onExport() {
      this.$emit('export')
    },
  },
}
</script>

<style scoped>
.filter-input,
.filter-select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

.btn-success {
  @apply px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2;
}
</style>
