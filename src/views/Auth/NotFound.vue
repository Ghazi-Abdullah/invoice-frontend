<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-4">
    <div class="max-w-lg mx-auto text-center">
      <!-- 404 Number -->
      <div class="relative mb-12">
        <div class="text-[120px] md:text-[180px] font-black text-gray-800 opacity-10">
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-8xl md:text-9xl font-black text-gray-800">
            404
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {{ $t('errors.notFoundTitle') }}
        </h1>
        <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
          {{ $t('errors.notFoundMessage') }}
        </p>
        <div class="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
          <font-awesome-icon :icon="['fas', 'info-circle']" class="text-gray-500 mr-2" />
          <span class="text-gray-700 text-sm">{{ $t('errors.notFoundReason') }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
        <button
          @click="$router.go(-1)"
          class="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <font-awesome-icon :icon="['fas', 'arrow-left']" class="mr-2" />
          {{ $t('common.back') }}
        </button>
        <button
          @click="$router.push('/')"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <font-awesome-icon :icon="['fas', 'home']" class="mr-2" />
          {{ $t('nav.dashboard') }}
        </button>
      </div>

      <!-- Quick Links -->
      <div class="bg-white rounded-xl shadow p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-800 mb-6 flex items-center justify-center">
          <font-awesome-icon :icon="['fas', 'compass']" class="mr-2 text-gray-500" />
          {{ $t('errors.maybeLookingFor') }}
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <router-link
            to="/dashboard"
            class="p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
          >
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors">
                <font-awesome-icon :icon="['fas', 'tachometer-alt']" class="text-blue-600" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ $t('nav.dashboard') }}</span>
            </div>
          </router-link>

          <router-link
            to="/invoices"
            class="p-3 bg-gray-50 hover:bg-green-50 rounded-lg transition-colors group"
          >
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors">
                <font-awesome-icon :icon="['fas', 'file-invoice']" class="text-green-600" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ $t('nav.invoices') }}</span>
            </div>
          </router-link>

          <router-link
            to="/clients"
            class="p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors group"
          >
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors">
                <font-awesome-icon :icon="['fas', 'users']" class="text-purple-600" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ $t('nav.clients') }}</span>
            </div>
          </router-link>

          <router-link
            to="/reports"
            class="p-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition-colors group"
          >
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors">
                <font-awesome-icon :icon="['fas', 'chart-bar']" class="text-orange-600" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ $t('nav.reports') }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Support -->
      <div class="text-gray-500">
        <p class="mb-2">{{ $t('errors.stillHavingProblem') }}</p>
        <a
          href="mailto:support@invoiceapp.com"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <font-awesome-icon :icon="['fas', 'headset']" class="mr-2" />
          {{ $t('errors.contactSupport') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>
