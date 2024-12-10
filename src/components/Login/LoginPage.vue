<template>
  <div class="bg-gray-900 flex items-center justify-center min-h-screen">
    <!-- 登录表单 -->
    <div
      class="bg-gray-800/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/30 transform transition-all duration-500 opacity-0 translate-x-full animate-fade-in-right"
    >
      <div class="space-y-8">
        <!-- 标题 -->
        <h2 class="text-xl font-medium tracking-wide text-gray-200 text-center">
          登录账户
        </h2>

        <!-- 表单 -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 账户输入 -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-300"
              for="account"
            >
              账户
            </label>
            <input
              v-model="account"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200"
              id="account"
              type="text"
              placeholder="输入账户名"
            />
          </div>

          <!-- 验证码输入 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-300" for="code">
              验证码
            </label>
            <input
              v-model="code"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200"
              id="code"
              type="text"
              placeholder="输入验证码"
            />
          </div>

          <!-- 按钮区域 -->
          <div class="space-y-3 pt-4">
            <button
              type="submit"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 text-sm font-medium text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
            >
              登录
            </button>

            <button
              @click="goToSetup2FA"
              type="button"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-sm font-medium text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
            >
              设置双重认证
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 通知组件 -->
    <PopupNotification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { useNotification } from "../../composables/useNotification"; // 导入新的通知钩子
import PopupNotification from "../Utils/PopupNotification.vue";

export default {
  name: "LoginPage",
  components: {
    PopupNotification,
  },
  setup() {
    const account = ref("");
    const code = ref("");
    const router = useRouter();
    const store = useStore();

    // 使用新的通知钩子
    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError,
    } = useNotification();

    const handleLogin = async () => {
      try {
        const success = await store.dispatch("login", {
          account: account.value,
          code: code.value,
        });
        if (success) {
          showSuccess("登录成功");
          setTimeout(() => {
            router.push({ name: "Home" });
          }, 1500);
        } else {
          throw new Error("登录失败");
        }
      } catch (error) {
        showError("登录失败，请检查输入");
      }
    };

    const goToSetup2FA = () => {
      router.push("/setup-2fa");
    };

    return {
      account,
      code,
      handleLogin,
      goToSetup2FA,
      // 返回通知相关的状态
      showNotification,
      notificationMessage,
      notificationType,
    };
  },
};
</script>

<style scoped>
@keyframes fade-in-right {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-right {
  animation: fade-in-right 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* 优化按钮点击效果 */
button:active {
  transform: scale(0.98);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
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
