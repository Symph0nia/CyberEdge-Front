<template>
  <Transition name="dialog">
    <div v-if="show"
         class="fixed inset-0 flex items-center justify-center z-50 px-4"
         @click="onCancel"
    >
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <!-- 对话框 -->
      <div class="bg-gray-800/90 backdrop-blur-xl relative
                  max-w-md w-full p-8 rounded-2xl shadow-2xl
                  border border-gray-700/30
                  transform transition-all duration-300"
           @click.stop
      >
        <!-- 标题 -->
        <h2 class="text-lg font-medium text-gray-200 mb-3">
          {{ title }}
        </h2>

        <!-- 消息内容 -->
        <p class="text-sm text-gray-300 leading-relaxed mb-6">
          {{ message }}
        </p>

        <!-- 按钮区域 -->
        <div class="flex space-x-3">
          <!-- 取消按钮 -->
          <button
              @click="onCancel"
              class="flex-1 px-4 py-2.5 rounded-xl
                   bg-gray-700/50 hover:bg-gray-600/50
                   text-sm font-medium text-gray-200
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-gray-600/50"
          >
            取消
          </button>

          <!-- 确认按钮 -->
          <button
              @click="onConfirm"
              :class="[
              'flex-1 px-4 py-2.5 rounded-xl text-sm font-medium',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2',
              type === 'danger'
                ? 'bg-red-500/50 hover:bg-red-600/50 focus:ring-red-500/50 text-red-100'
                : type === 'warning'
                  ? 'bg-yellow-500/50 hover:bg-yellow-600/50 focus:ring-yellow-500/50 text-yellow-100'
                  : 'bg-blue-500/50 hover:bg-blue-600/50 focus:ring-blue-500/50 text-blue-100'
            ]"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    show: Boolean,
    title: {
      type: String,
      default: '确认'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'warning', 'danger'].includes(value)
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const onConfirm = () => {
      emit('confirm');
    };

    const onCancel = () => {
      emit('cancel');
    };

    return {
      onConfirm,
      onCancel
    };
  }
}
</script>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-enter-active .bg-black\/30,
.dialog-leave-active .bg-black\/30 {
  transition: opacity 0.3s ease;
}

.dialog-enter-from .bg-black\/30,
.dialog-leave-to .bg-black\/30 {
  opacity: 0;
}

/* 优化按钮点击效果 */
button:active {
  transform: scale(0.98);
}

/* 确保模糊效果在所有浏览器中正常工作 */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
</style>
