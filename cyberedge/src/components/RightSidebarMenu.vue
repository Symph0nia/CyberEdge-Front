<template>
  <div
      v-if="localVisible || isExiting"
      class="fixed top-0 right-0 h-full w-96 bg-transparent transition-all duration-300 ease-out"
      :class="{
        'animate-slide-in': localVisible,
        'animate-slide-out': isExiting
      }"
  >
    <!-- 半透明背景遮罩 -->
    <div class="absolute inset-0 bg-gray-900/20 backdrop-blur-2xl"></div>

    <!-- 内容容器 -->
    <div class="relative h-full">
      <!-- 工具内容区域 -->
      <div class="h-[70%] p-8 mx-auto my-24">
        <div class="bg-gray-800/40 backdrop-blur-md rounded-3xl h-full shadow-2xl border border-gray-700/30">
          <HttpRequestTool />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HttpRequestTool from './Tools/HttpRequestTool.vue';

export default {
  name: 'RightSidebarMenu',
  components: {
    HttpRequestTool
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localVisible: this.isVisible,
      isExiting: false
    };
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        this.localVisible = true;
        this.isExiting = false;
      } else {
        this.isExiting = true;
        setTimeout(() => {
          this.localVisible = false;
        }, 300);
      }
    }
  },
  mounted() {
    this.localVisible = this.isVisible;
  }
};
</script>

<style scoped>
.fixed {
  z-index: 1000;
}

/* 优化后的动画效果 */
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-out {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(20px);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.animate-slide-out {
  animation: slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 确保内容区域可以滚动 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}
</style>
