<!-- src/components/shared/ToastContainer.vue -->
<template>
  <div class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
      @click="removeToast(toast.id)"
    >
      <div class="toast-content">
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" @click="removeToast(toast.id)">×</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'ToastContainer',
  setup() {
    const toasts = ref([])
    let toastId = 0

    const showToast = (event) => {
      const { type, message } = event.detail
      const id = toastId++

      toasts.value.push({
        id,
        type,
        message,
      })

      // Auto remove after 5 seconds
      setTimeout(() => {
        removeToast(id)
      }, 5000)
    }

    const removeToast = (id) => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }

    onMounted(() => {
      window.addEventListener('show-toast', showToast)
    })

    onUnmounted(() => {
      window.removeEventListener('show-toast', showToast)
    })

    return {
      toasts,
      removeToast,
    }
  },
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  min-width: 300px;
  margin-bottom: 10px;
  padding: 12px 16px;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.toast:hover {
  transform: translateX(-5px);
}

.toast-success {
  background-color: #10b981;
}

.toast-error {
  background-color: #ef4444;
}

.toast-warning {
  background-color: #f59e0b;
}

.toast-info {
  background-color: #3b82f6;
}

.toast-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
}
</style>
