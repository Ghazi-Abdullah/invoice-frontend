<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        @click="removeToast(toast.id)"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <svg
              v-if="toast.type === 'success'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <svg
              v-else-if="toast.type === 'error'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
            <svg
              v-else-if="toast.type === 'warning'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L4.194 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <div class="toast-message">
            <p class="toast-title">{{ toast.title }}</p>
            <p class="toast-text">{{ toast.message }}</p>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  name: 'ToastContainer',
  data() {
    return {
      toasts: [],
      nextId: 0,
    }
  },
  methods: {
    showToast(type, title, message, duration = 5000) {
      const id = this.nextId++
      const toast = { id, type, title, message }

      this.toasts.push(toast)

      if (duration > 0) {
        setTimeout(() => {
          this.removeToast(id)
        }, duration)
      }
    },

    removeToast(id) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    },

    success(title, message, duration) {
      this.showToast('success', title, message, duration)
    },

    error(title, message, duration) {
      this.showToast('error', title, message, duration)
    },

    warning(title, message, duration) {
      this.showToast('warning', title, message, duration)
    },

    info(title, message, duration) {
      this.showToast('info', title, message, duration)
    },
  },
  mounted() {
    // جعل الدوال متاحة على مستوى التطبيق
    this.$app.config.globalProperties.$toast = {
      success: this.success,
      error: this.error,
      warning: this.warning,
      info: this.info,
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
  max-width: 400px;
}

.toast {
  margin-bottom: 10px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

.toast:hover {
  transform: translateX(-5px);
}

.toast-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.toast-error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.toast-warning {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.toast-info {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.toast-content {
  display: flex;
  align-items: flex-start;
}

.toast-icon {
  margin-right: 12px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
}

.toast-text {
  font-size: 13px;
  opacity: 0.9;
  line-height: 1.4;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* RTL Support */
[dir='rtl'] .toast-container {
  right: auto;
  left: 20px;
}

[dir='rtl'] .toast:hover {
  transform: translateX(5px);
}

[dir='rtl'] .toast-icon {
  margin-right: 0;
  margin-left: 12px;
}

[dir='rtl'] .toast-enter-from,
[dir='rtl'] .toast-leave-to {
  transform: translateX(-100%);
}

[dir='rtl'] @keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
