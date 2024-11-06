<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">子域名扫描详情 🌐</h2>

        <!-- 扫描ID和目标地址 -->
        <p><strong>扫描ID:</strong> {{ scanResult?.id }}</p>
        <p><strong>目标地址:</strong> {{ scanResult?.Target }}</p>
        <p><strong>时间戳:</strong> {{ scanResult ? new Date(scanResult.Timestamp).toLocaleString() : '' }}</p>

        <div class="mb-4 mt-4">
          <button
              @click="resolveSelectedIPs"
              class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 shadow-md"
              :disabled="selectedSubdomains.length === 0 || isResolving"
          >
            {{ isResolving ? '正在解析...' : '解析选中的子域名 IP' }}
          </button>
        </div>

        <!-- 子域名信息表格 -->
        <h3 class="text-xl font-bold mt-6">子域名列表</h3>
        <table v-if="subdomains.length" class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden mt-4">
          <thead class="bg-gray-700">
          <tr>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">
              <input type="checkbox" @change="toggleSelectAll" v-model="selectAll">
            </th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">子域名ID</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">子域名</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">解析IP</th> <!-- 新增IP列 -->
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">已读状态</th>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">操作</th>
          </tr>
          </thead>
          <tbody>
          <!-- 遍历每个子域名 -->
          <tr v-for="subdomain in subdomains" :key="subdomain.id" class="hover:bg-gray-700 transition duration-300">
            <td class="py-5 px-6 border-b border-gray-600">
              <input type="checkbox" v-model="selectedSubdomains" :value="subdomain.id">
            </td>
            <td class="py-5 px-6 border-b border-gray-600">{{ subdomain.id }}</td>
            <td class="py-5 px-6 border-b border-gray-600">{{ subdomain.domain }}</td>
            <!-- 显示IP，如果IP为空则显示解析按钮 -->
            <td class="py-5 px-6 border-b border-gray-600">
              <span v-if="subdomain.ip">{{ subdomain.ip }}</span>
              <button v-else @click="resolveIP(subdomain)" class="bg-blue-500 text-white px-[8px] py-[4px] rounded-md hover:bg-blue-600 transition duration-300 shadow-md">
                解析IP
              </button>
            </td>
            <td class="py-5 px-6 border-b border-gray-600">
              {{ subdomain.is_read ? '✅ 已读' : '📖 未读' }}
            </td>
            <td class="py-5 px-6 border-b border-gray-600">
              <button @click="toggleReadStatus(subdomain)"
                      class="bg-green-500 text-white px-[8px] py-[4px] rounded-md hover:bg-green-600 transition duration-300 shadow-md">
                {{ subdomain.is_read ? '标记为未读' : '标记为已读' }}
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
import { onMounted } from 'vue' // 导入 onMounted
import { useRoute } from 'vue-router' // 导入 useRoute
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'
import PopupNotification from '../Utils/PopupNotification.vue'
import { useNotification } from '../../composables/useNotification'
import { useSubdomainScan } from '../../composables/useSubdomainScan' // 引入封装逻辑

export default {
  name: 'SubdomainScanDetail',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification
  },
  setup() {
    // 使用 useRoute 逻辑
    const route = useRoute(); // 定义 route

    // 使用 useNotification 逻辑
    const {
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showNotificationMessage
    } = useNotification();

    // 使用 useSubdomainScan 逻辑
    const {
      scanResult,
      errorMessage,
      subdomains,
      selectedSubdomains,
      selectAll,
      isResolving,
      fetchScanResult,
      toggleSelectAll,
      toggleReadStatus,
      resolveIP,
      resolveSelectedIPs
    } = useSubdomainScan();

    onMounted(() => {
      const id = route.params.id; // 使用 route 参数获取扫描结果
      fetchScanResult(id);
    });

    return {
      scanResult,
      errorMessage,
      subdomains,
      selectedSubdomains,
      selectAll,
      toggleSelectAll,
      toggleReadStatus,
      resolveIP,
      resolveSelectedIPs: () => resolveSelectedIPs(showNotificationMessage), // 传递通知逻辑
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
