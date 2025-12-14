<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-blue-600">404</h1>
      <h2 class="text-3xl font-bold text-gray-900 mt-4">{{ $t('notFound.title') }}</h2>
      <p class="text-gray-600 mt-2">{{ $t('notFound.message') }}</p>
      <div class="mt-6">
        <router-link
          to="/"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <i class="fas fa-home mr-2"></i>
          {{ $t('notFound.backHome') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>
