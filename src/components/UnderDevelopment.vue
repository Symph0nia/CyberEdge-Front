<template>
  <div
    class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6"
  >
    <!-- 主要内容卡片 -->
    <div
      class="bg-gray-800/40 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-700/30 max-w-2xl w-full"
    >
      <div class="space-y-8">
        <!-- 标题和图标 -->
        <div class="space-y-2 text-center">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-gray-700/50 rounded-2xl"
          >
            <span class="text-2xl">🚧</span>
          </div>
          <h1 class="text-xl font-medium tracking-wide text-gray-200">
            功能开发中
          </h1>
        </div>

        <!-- 说明文本 -->
        <p class="text-sm text-gray-400 leading-relaxed text-center">
          该功能正在开发中，我们正在努力完善这项功能。
          感谢您的耐心等待，敬请期待！
        </p>

        <!-- 开发进度指示器 -->
        <div class="space-y-2">
          <div class="w-full bg-gray-900/50 rounded-full h-1 overflow-hidden">
            <div
              class="bg-blue-500/50 h-1 rounded-full w-3/4 animate-progress transition-all duration-1000"
            ></div>
          </div>
          <p class="text-xs text-gray-500 text-center">开发进度</p>
        </div>

        <!-- 返回按钮 -->
        <div class="flex justify-center pt-4">
          <button
            @click="handleReturn"
            class="px-6 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
          >
            返回
          </button>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <p class="mt-8 text-xs text-gray-500">如有建议，请与我们联系</p>
  </div>

  <!-- 通知组件 -->
  <PopupNotification
    v-if="showNotification"
    :message="notificationMessage"
    :type="notificationType"
    @close="showNotification = false"
  />
</template>

<script>
import { useRouter } from "vue-router";
import { useNotification } from "../composables/useNotification";
import PopupNotification from "./Utils/PopupNotification.vue";

export default {
  name: "UnderDevelopment",
  components: {
    PopupNotification,
  },
  setup() {
    const router = useRouter();
    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
    } = useNotification();

    const handleReturn = () => {
      showSuccess("正在返回上一页");
      router.go(-1);
    };

    return {
      // 通知相关
      showNotification,
      notificationMessage,
      notificationType,
      // 方法
      handleReturn,
    };
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

@keyframes progress {
  0% {
    width: 0;
  }
  100% {
    width: 75%;
  }
}

.animate-progress {
  animation: progress 2s ease-out forwards;
}

/* 优化按钮点击效果 */
button:active {
  transform: scale(0.98);
}
</style>
