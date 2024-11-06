<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">路径扫描详情 🔍</h2>

        <!-- 扫描ID和目标地址 -->
        <p><strong>扫描ID:</strong> {{ scanResult?.id }}</p>
        <p><strong>目标地址:</strong> {{ scanResult?.Target }}</p>
        <p><strong>时间戳:</strong> {{ scanResult ? new Date(scanResult.Timestamp).toLocaleString() : '' }}</p>

        <!-- 解析选中的路径 IP 和批量发送到端口扫描按钮，水平排列 -->
        <div class="mb-4 mt-4 flex space-x-4">
          <button
              @click="resolveSelectedPaths"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
              :disabled="selectedPaths.length === 0 || isResolving"
          >
            {{ isResolving ? '正在解析...' : '解析选中的路径 IP' }}
          </button>

          <button
              @click="sendSelectedToPortScan"
              class="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300 shadow-md"
              :disabled="selectedPaths.length === 0"
          >
            批量发送到端口扫描
          </button>
        </div>

        <!-- 路径信息表格 -->
        <h3 class="text-xl font-bold mt-6">路径列表</h3>
        <table v-if="paths.length" class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden mt-4">
          <thead class="bg-gray-700">
          <tr>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">
              <input type="checkbox" @change="toggleSelectAll" v-model="selectAll">
            </th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">路径ID</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">路径</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">状态</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">已读状态</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="path in paths" :key="path.id" class="hover:bg-gray-700 transition duration-300">
            <td class="py-5 px-6 border-b border-gray-600">
              <input type="checkbox" v-model="selectedPaths" :value="path.id">
            </td>
            <td class="py-5 px-6 border-b border-gray-600">{{ path.id }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ path.Path }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ path.Status }}</td>
            <td class="py-5 px-6 border-b border-gray-600">
              {{ path.IsRead ? '✅ 已读' : '📖 未读' }}
            </td>
            <td class="py-5 px-6 border-b border-gray-600">
              <div class="flex space-x-4">
                <button @click="toggleReadStatus(path)"
                        class="bg-green-500 text-white px-[8px] py-[4px] rounded-md hover:bg-green-600 transition duration-300 shadow-md">
                  {{ path.IsRead ? '标记为未读' : '标记为已读' }}
                </button>
                <button
                    @click="sendToPortScan(path)"
                    class="bg-yellow-500 text-white px-[8px] py-[4px] rounded-md hover:bg-yellow-600 transition duration-300 shadow-md"
                >
                  发送到端口扫描
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="text-red-500 mt-[20px]">
          {{ errorMessage }}
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <FooterPage />

    <!-- 弹窗通知 -->
    <PopupNotification
        v-if="showNotification"
        :message="notificationMessage"
        :emoji="notificationEmoji"
        :type="notificationType"
        @close="showNotification = false"
    />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'
import PopupNotification from '../Utils/PopupNotification.vue'
import { useNotification } from '../../composables/useNotification'
import { usePathScan } from '../../composables/usePathScan'

export default {
  name: 'PathScanDetail',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification
  },
  setup() {
    const route = useRoute();

    const {
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showNotificationMessage
    } = useNotification();

    const {
      scanResult,
      errorMessage,
      paths,
      selectedPaths,
      selectAll,
      isResolving,
      fetchScanResult,
      toggleSelectAll,
      toggleReadStatus,
      resolveIP,
      resolveSelectedIPs,
      sendToPortScan,
      sendSelectedToPortScan
    } = usePathScan();

    onMounted(() => {
      const id = route.params.id;
      fetchScanResult(id);
    });

    return {
      scanResult,
      errorMessage,
      paths,
      selectedPaths,
      selectAll,
      toggleSelectAll,
      toggleReadStatus,
      resolveIP,
      resolveSelectedIPs: () => resolveSelectedIPs(showNotificationMessage),
      sendToPortScan: (path) => sendToPortScan(path, showNotificationMessage),
      sendSelectedToPortScan: () => sendSelectedToPortScan(showNotificationMessage),
      isResolving,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType
    };
  }
}
</script>

<style scoped>
.container { padding: 20px; }
.text-red-500 { color: #ef4444; }
table { width: 100%; }
thead th { padding-bottom: 12px; }
tbody tr:nth-child(even) { background-color: #1f2937; }
tbody tr:hover { background-color: #374151; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
