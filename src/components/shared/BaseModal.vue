<template>
  <div v-if="show" class="modal-overlay" @click.self="closeOnOverlayClick">
    <div class="modal-container" :class="sizeClass">
      <div class="modal-header">
        <h3 v-if="title" class="modal-title">{{ title }}</h3>
        <button v-if="showClose" @click="close" class="modal-close">
          <font-awesome-icon :icon="['fas', 'times']" />
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnOverlay: {
      type: Boolean,
      default: true,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:show', 'close', 'confirm'],
  computed: {
    sizeClass() {
      return `modal-${this.size}`
    },
  },
  methods: {
    close() {
      if (!this.persistent) {
        this.$emit('update:show', false)
        this.$emit('close')
      }
    },
    closeOnOverlayClick() {
      if (this.closeOnOverlay && !this.persistent) {
        this.close()
      }
    },
    handleKeydown(event) {
      if (event.key === 'Escape' && !this.persistent) {
        this.close()
      }
    },
  },
  watch: {
    show(newVal) {
      if (newVal) {
        document.addEventListener('keydown', this.handleKeydown)
        document.body.style.overflow = 'hidden'
      } else {
        document.removeEventListener('keydown', this.handleKeydown)
        document.body.style.overflow = ''
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.handleKeydown)
    document.body.style.overflow = ''
  },
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in;
}

.modal-container {
  @apply bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300;
  animation: slideDown 0.3s ease-out;
}

.modal-sm {
  @apply max-w-md w-full;
}

.modal-md {
  @apply max-w-lg w-full;
}

.modal-lg {
  @apply max-w-2xl w-full;
}

.modal-xl {
  @apply max-w-4xl w-full;
}

.modal-header {
  @apply px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50;
}

.modal-title {
  @apply text-lg font-semibold text-gray-900;
}

.modal-close {
  @apply w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors;
}

.modal-body {
  @apply px-6 py-4 overflow-y-auto flex-1;
}

.modal-footer {
  @apply px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap justify-end gap-3;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
