<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- 背景遮罩 -->
        <div
          class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          @click="$emit('close')"
        ></div>

        <!-- 对话框内容 -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="translate-y-4 opacity-0 scale-95"
          enter-to-class="translate-y-0 opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="translate-y-0 opacity-100 scale-100"
          leave-to-class="translate-y-4 opacity-0 scale-95"
        >
          <div
            class="relative bg-gray-800 rounded-xl p-6 w-full max-w-lg m-4 shadow-xl shadow-black/20 border border-gray-700/50"
          >
            <!-- 标题栏 -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full bg-blue-400"></div>
                <h3 class="text-xl font-semibold text-white">{{ title }}</h3>
              </div>

              <button
                @click="$emit('close')"
                class="rounded-lg p-2 hover:bg-gray-700/50 transition-colors duration-200 group"
              >
                <i
                  class="ri-close-line text-gray-400 group-hover:text-white transition-colors duration-200"
                ></i>
              </button>
            </div>

            <!-- 内容区域 -->
            <div class="mt-4">
              <slot></slot>
            </div>

            <!-- 底部操作栏 -->
            <div class="mt-6">
              <slot name="footer">
                <div class="flex justify-end space-x-4">
                  <slot name="actions"></slot>
                </div>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount, defineEmits } from "vue";

const emit = defineEmits(["close"]);

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: "lg",
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
});

// ESC 键关闭
const handleEscKey = (e) => {
  if (props.closeOnEsc && e.key === "Escape") {
    emit("close");
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleEscKey);
  document.body.style.overflow = "hidden";
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleEscKey);
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* 可选: 添加滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
