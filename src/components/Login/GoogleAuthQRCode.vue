<template>
  <div class="bg-gray-900 flex items-center justify-center min-h-screen">
    <div
      class="bg-gray-800/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700/30 transform transition-all duration-500 opacity-0 translate-x-full animate-fade-in-right"
    >
      <div class="space-y-6">
        <!-- 标题 -->
        <h2
          class="text-xl font-medium tracking-wide text-gray-200 flex items-center gap-2"
        >
          <i class="ri-shield-keyhole-line"></i>
          设置双重认证
        </h2>

        <div v-if="interfaceClosed" class="space-y-2">
          <p class="text-red-400/90 text-sm">注册通道已关闭</p>
          <p class="text-gray-400 text-sm">请稍后重试</p>
        </div>

        <div v-else class="space-y-6">
          <!-- 二维码显示区域 -->
          <div v-if="qrCodeUrl" class="space-y-4">
            <div
              class="bg-gray-900/50 p-6 rounded-2xl border border-gray-700/30"
            >
              <img
                :src="qrCodeUrl"
                alt="认证二维码"
                class="mx-auto w-48 h-48"
              />
            </div>

            <!-- 账户信息区域 -->
            <div class="bg-gray-900/30 p-4 rounded-xl space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-400">账户名称</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-200">{{ accountName }}</span>
                  <button
                    @click="copyAccountName"
                    class="p-1.5 hover:bg-gray-700/50 rounded-lg transition-colors"
                    :title="copied ? '已复制' : '复制账户名'"
                  >
                    <i
                      class="ri-file-copy-line text-gray-400 hover:text-gray-200"
                    ></i>
                  </button>
                </div>
              </div>
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <i class="ri-information-line"></i>
                <span>请妥善保管账户名称</span>
              </div>
            </div>
          </div>

          <p v-else-if="loading" class="text-sm text-gray-400">
            <i class="ri-loader-4-line animate-spin mr-2"></i>
            正在生成二维码...
          </p>

          <!-- 说明文字 -->
          <div
            class="flex items-start gap-2 text-sm text-gray-400 leading-relaxed"
          >
            <i class="ri-google-line mt-1"></i>
            <p>请使用 Google Authenticator 扫描二维码以启用双重认证</p>
          </div>

          <!-- 按钮区域 -->
          <div class="space-y-3 pt-4">
            <button
              @click="fetchQRCode"
              :disabled="loading"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 text-sm font-medium text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <i class="ri-refresh-line"></i>
              {{ qrCodeUrl ? "刷新二维码" : "生成二维码" }}
            </button>

            <button
              @click="goToLogin"
              class="w-full px-4 py-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 text-sm font-medium text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 flex items-center justify-center gap-2"
            >
              <i class="ri-arrow-left-line"></i>
              返回登录
            </button>
          </div>
        </div>
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
import { useNotification } from "../../composables/useNotification";
import api from "../../api/axiosInstance";
import PopupNotification from "../Utils/PopupNotification.vue";

export default {
  name: "GoogleAuthQRCode",
  components: {
    PopupNotification,
  },
  setup() {
    const router = useRouter();
    const qrCodeUrl = ref("");
    const loading = ref(false);
    const interfaceClosed = ref(false);
    const accountName = ref("");
    const copied = ref(false);

    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError,
    } = useNotification();

    const copyAccountName = async () => {
      try {
        await navigator.clipboard.writeText(accountName.value);
        copied.value = true;
        showSuccess("账户名已复制");
        setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch (err) {
        showError("复制失败");
      }
    };

    const fetchQRCode = async () => {
      loading.value = true;
      try {
        const response = await api.get("/auth/qrcode");
        const { qrcode, account } = response.data;
        qrCodeUrl.value = `data:image/png;base64,${qrcode}`;
        accountName.value = account;
        interfaceClosed.value = false;
        showSuccess("二维码已生成");
      } catch (error) {
        console.error("获取二维码失败:", error);
        interfaceClosed.value = true;

        if (error.response?.data?.error === "二维码接口已关闭") {
          showError("接口暂时关闭");
        } else {
          showError("生成失败");
        }
      } finally {
        loading.value = false;
      }
    };

    const goToLogin = () => {
      router.push("/login");
    };

    return {
      qrCodeUrl,
      loading,
      interfaceClosed,
      accountName,
      copied,
      fetchQRCode,
      copyAccountName,
      showNotification,
      notificationMessage,
      notificationType,
      goToLogin,
    };
  },
};
</script>

<style scoped>
/* 保留原有的右侧滑入动画 */
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
