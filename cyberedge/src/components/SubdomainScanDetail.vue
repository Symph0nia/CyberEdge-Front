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
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
import api from '../api/axiosInstance'

export default {
  name: 'SubdomainScanDetail',
  components: {
    HeaderPage,
    FooterPage
  },
  setup() {
    const route = useRoute();
    const scanResult = ref(null);
    const errorMessage = ref('');
    const selectedSubdomains = ref([]);
    const selectAll = ref(false);

    const fetchScanResult = async (id) => {
      try {
        const response = await api.get(`/results/${id}`);
        scanResult.value = response.data;
      } catch (error) {
        console.error('获取扫描结果详情失败:', error);
        errorMessage.value = '获取扫描结果详情失败';
      }
    };

    const subdomains = computed(() => {
      if (!scanResult.value || !scanResult.value.Data) return [];
      const subdomainGroup = scanResult.value.Data.find(group => group.Key === "subdomains");
      if (!subdomainGroup || !Array.isArray(subdomainGroup.Value)) return [];

      return subdomainGroup.Value.map(subdomainData => {
        const idItem = subdomainData.find(item => item.Key === "_id");
        const domainItem = subdomainData.find(item => item.Key === "domain");
        const isReadItem = subdomainData.find(item => item.Key === "is_read");

        return {
          id: idItem ? idItem.Value : '',
          domain: domainItem ? domainItem.Value : '',
          is_read: isReadItem ? isReadItem.Value : false
        };
      });
    });

    const toggleSelectAll = () => {
      if (selectAll.value) {
        selectedSubdomains.value = subdomains.value.map(s => s.id);
      } else {
        selectedSubdomains.value = [];
      }
    };

    const toggleReadStatus = async (subdomain) => {
      try {
        await api.put(`/results/${route.params.id}/entries/${subdomain.id}/read`, { isRead: !subdomain.is_read });
        await fetchScanResult(route.params.id);
      } catch (error) {
        console.error('更新子域名已读状态失败:', error);
        errorMessage.value = '更新子域名已读状态失败';
      }
    };

    onMounted(() => {
      const id = route.params.id;
      fetchScanResult(id);
    });

    return {
      scanResult,
      errorMessage,
      subdomains,
      selectedSubdomains,
      selectAll,
      toggleSelectAll,
      toggleReadStatus
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
