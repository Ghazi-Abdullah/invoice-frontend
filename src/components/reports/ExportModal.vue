<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ $t('reports.export_options') }}</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p class="text-gray-600 mb-6">
          {{ $t('reports.export_choose_method') }} {{ getReportName() }}
        </p>

        <div class="space-y-4">
          <button
            @click="$emit('export-direct')"
            :disabled="loading"
            class="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="loading"
              class="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {{ loading ? $t('reports.exporting') : $t('reports.export_direct') }}
          </button>

          <button
            @click="$emit('export-server')"
            :disabled="loading"
            class="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              v-if="loading"
              class="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l3 3m-3-3V4"
              />
            </svg>
            {{ loading ? $t('reports.exporting') : $t('reports.export_server') }}
          </button>

          <button
            @click="$emit('close')"
            :disabled="loading"
            class="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            {{ $t('common.cancel') }}
          </button>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            <strong class="text-gray-700">{{ $t('reports.export_direct') }}:</strong>
            {{ $t('reports.export_direct_desc') }}
          </p>
          <p class="text-sm text-gray-500 mt-2">
            <strong class="text-gray-700">{{ $t('reports.export_server') }}:</strong>
            {{ $t('reports.export_server_desc') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportModal',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    activeTab: {
      type: String,
      default: 'invoices',
    },
  },

  methods: {
    getReportName() {
      const names = {
        invoices: this.$t('reports.types.invoices'),
        clients: this.$t('reports.types.clients'),
        revenue: this.$t('reports.types.revenue'),
        overdue: this.$t('reports.types.overdue'),
      }
      return names[this.activeTab] || this.$t('reports.title')
    },
  },
}
</script>
