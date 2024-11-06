<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">端口扫描详情 🔍</h2>

        <!-- 扫描ID和目标地址 -->
        <p><strong>扫描ID:</strong> {{ scanResult?.id }}</p>
        <p><strong>目标地址:</strong> {{ scanResult?.Target }}</p>
        <p><strong>时间戳:</strong> {{ scanResult ? new Date(scanResult.Timestamp).toLocaleString() : '' }}</p>


        <div class="mb-4 mt-4 flex space-x-4"> <!-- 使用 flex 和 space-x-4 实现水平排列和间距 -->
          <button
              @click="sendSelectedToPathScan(showNotificationMessage)"
              class="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-300 shadow-md mr-4 mb-4"
              :disabled="selectedPorts.length === 0"
          >
            批量发送到路径扫描
          </button>
        </div>

        <!-- 端口信息表格 -->
        <h3 class="text-xl font-bold mt-6">端口信息</h3>
        <table v-if="filteredPorts.length" class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden mt-4">
          <thead class="bg-gray-700">
          <tr>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">
              <input type="checkbox" @change="toggleSelectAll" v-model="selectAll">
            </th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">端口ID</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">端口号</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">协议</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">服务</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">Banner</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">指纹</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">路径</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">已读状态</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">操作</th>
          </tr>
          </thead>
          <tbody>
          <!-- 遍历每个端口信息 -->
          <tr v-for="port in filteredPorts" :key="getPortValue(port, '_id')" class="hover:bg-gray-700 transition duration-300">
            <td class="py-5 px-6 border-b border-gray-600">
              <input type="checkbox" v-model="selectedPorts" :value="getPortValue(port, '_id')">
            </td>
            <td class="py-5 px-6 border-b border-gray-600">{{ getPortValue(port, '_id') }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ getPortValue(port, 'number') }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ getPortValue(port, 'protocol') }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ getPortValue(port, 'service') }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ getPortValue(port, 'banner') }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ getPortValue(port, 'fingerprints') || '-' }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ getPortValue(port, 'paths') || '-' }}</td>
            <td class="py-5 px-6 border-b border-gray-600">
              {{ getPortValue(port, 'is_read') ? '✅ 已读' : '📖 未读' }}
            </td>
            <td class="py-5 px-6 border-b border-gray-600">
              <button @click="toggleReadStatus(port)" class="bg-green-500 text-white px-[8px] py-[4px] rounded-md hover:bg-green-600 transition duration-300 shadow-md mr-2">
                {{ getPortValue(port, 'is_read') ? '标记为未读' : '标记为已读' }}
              </button>
              <!-- 添加发送到路径扫描的按钮 -->
              <button @click="sendToPathScan(port, showNotificationMessage)" class="bg-blue-500 text-white px-[8px] py-[4px] rounded-md hover:bg-blue-600 transition duration-300 shadow-md">
                发送到路径扫描
              </button>
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
import { usePortScanDetail } from '../../composables/usePortScanDetail'
import { useNotification } from '../../composables/useNotification'
import PopupNotification from '../Utils/PopupNotification.vue'
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'

export default {
  name: 'PortScanDetail',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification
  },
  setup() {
    const { ...rest } = usePortScanDetail()

    // 使用通知逻辑
    const {
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showNotificationMessage
    } = useNotification();

    return {
      ...rest,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showNotificationMessage
    }
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
button.bg-green-500 { background-color: #10b981; }
button.bg-green-600:hover { background-color: #059669; }
</style>
