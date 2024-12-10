<template>
  <Transition name="notification">
    <div
      v-if="show"
      class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div
        :class="[
          'px-6 py-4 rounded-2xl shadow-2xl',
          'backdrop-blur-xl border',
          'flex items-center space-x-4',
          type === 'success'
            ? 'bg-gray-800/80 border-gray-700/30'
            : 'bg-gray-800/80 border-gray-700/30',
        ]"
      >
        <!-- 状态图标 -->
        <div class="text-lg">
          <span v-if="type === 'success'" class="text-green-400">✓</span>
          <span v-else class="text-red-400">⚠</span>
        </div>

        <!-- 消息文本 -->
        <div class="text-sm font-medium text-gray-200">
          {{ message }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "PopupNotification",
  props: {
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
    emoji: {
      type: String,
      default: "✓",
    },
    type: {
      type: String,
      default: "success",
      validator: (value) => ["success", "error"].includes(value),
    },
  },
  setup(props, { emit }) {
    const show = ref(false);
    let timer;

    onMounted(() => {
      show.value = true;
      timer = setTimeout(() => {
        show.value = false;
        emit("close");
      }, props.duration);
    });

    onUnmounted(() => {
      clearTimeout(timer);
    });

    return { show };
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* 为了确保动画平滑，添加硬件加速 */
.fixed {
  will-change: transform;
  -webkit-font-smoothing: antialiased;
}
</style>
