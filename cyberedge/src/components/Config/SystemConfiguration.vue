<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 系统运行信息卡片 -->
      <div class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl
                  border border-gray-700/30">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-medium tracking-wide text-gray-200">系统状态</h2>
          <!-- 刷新按钮 -->
          <button
              @click="fetchSystemInfo"
              class="px-4 py-2.5 rounded-xl text-sm font-medium
                   bg-gray-700/50 hover:bg-gray-600/50 text-gray-200
                   transition-all duration-200
                   focus:outline-none focus:ring-2 focus:ring-gray-600/50"
          >
            刷新信息
          </button>
        </div>

        <!-- 信息卡片网格 -->
        <div v-if="systemInfo"
             class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard
              v-for="(info, key) in systemInfoCards"
              :key="key"
              :title="info.title"
              :value="systemInfo[info.key]"
              class="bg-gray-900/50 backdrop-blur-sm
                   border border-gray-700/30 rounded-xl p-6
                   transition-all duration-200 hover:bg-gray-900/70"
          />
        </div>

        <!-- 加载状态 -->
        <div v-else
             class="flex items-center justify-center py-12
                    text-sm text-gray-400">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
               xmlns="http://www.w3.org/2000/svg"
               fill="none"
               viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          加载中...
        </div>
      </div>
    </div>

    <FooterPage />

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
import { ref, onMounted } from 'vue'
import api from '../../api/axiosInstance'
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'
import PopupNotification from '../Utils/PopupNotification.vue'
import StatusCard from '../Utils/StatusCard.vue'
import { useNotification } from '../../composables/useNotification'

export default {
  name: 'SystemStatus',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    StatusCard
  },
  setup() {
    const systemInfo = ref(null)

    // 使用新的通知钩子
    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError
    } = useNotification()

    // 系统信息卡片配置
    const systemInfoCards = {
      currentDirectory: { title: '程序运行目录', key: 'currentDirectory' },
      localIP: { title: '本机 IP', key: 'localIP' },
      publicIP: { title: '外网 IP', key: 'publicIP' },
      kernelVersion: { title: '系统内核', key: 'kernelVersion' },
      osDistribution: { title: '系统版本', key: 'osDistribution' },
      privileges: { title: '运行权限', key: 'privileges' }
    }

    const fetchSystemInfo = async () => {
      try {
        const response = await api.get('/system/info')
        if (response.data?.data?.systemInfo) {
          systemInfo.value = response.data.data.systemInfo
          showSuccess('系统信息已更新')
        }
      } catch (error) {
        showError('获取系统信息失败')
      }
    }

    onMounted(fetchSystemInfo)

    return {
      systemInfo,
      systemInfoCards,
      fetchSystemInfo,
      showNotification,
      notificationMessage,
      notificationType
    }
  }
}
</script>

<style scoped>
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
