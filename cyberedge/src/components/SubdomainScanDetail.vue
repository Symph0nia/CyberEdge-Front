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
        <table v-if="filteredSubdomains.length" class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden mt-4">
          <thead class="bg-gray-700">
          <tr>
            <th class="py-4 px-6 border-b-2 border-gray-600 text-left">子域名</th>
          </tr>
          </thead>
          <tbody>
          <!-- 遍历每个子域名 -->
          <tr v-for="(subdomain, index) in filteredSubdomains" :key="index" class="hover:bg-gray-700 transition duration-300">
            <td class="py-5 px-6 border-b border-gray-600">{{ subdomain }}</td>
          </tr>
          </tbody>
        </table>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="text-red500 mt-[20px]">
          {{ errorMessage }}
        </div>

      </div>
    </div>

    <!-- 页脚 -->
    <FooterPage />
  </div>
</template>

<script>
// 引入子组件
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router' // 引入 useRoute 钩子
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
    const route = useRoute(); // 使用 useRoute 钩子获取路由参数
    const scanResult = ref(null); // 存储扫描结果
    const errorMessage = ref(''); // 错误信息

    // 获取扫描结果的详细信息
    const fetchScanResult = async (id) => {
      try {
        const response = await api.get(`/results/${id}`);
        scanResult.value = response.data;
      } catch (error) {
        console.error('获取扫描结果详情失败:', error);
        errorMessage.value = '获取扫描结果详情失败';
      }
    };

    // 使用 computed 属性来过滤出 subdomains 数据
    const filteredSubdomains = computed(() => {
      if (!scanResult.value || !scanResult.value.Data) return [];
      const subdomainGroup = scanResult.value.Data.find(group => group.Key === 'subdomains');
      return subdomainGroup ? subdomainGroup.Value : [];
    });

    // 页面加载时获取数据
    onMounted(() => {
      const id = route.params.id; // 从路由参数中获取ID
      fetchScanResult(id);
    });

    return {
      scanResult,
      errorMessage,
      filteredSubdomains // 返回 filteredSubdomains 用于表格渲染
    };
  }
}
</script>

<style scoped>
.container { padding: 20px; }

.text-red500 { color: #ef4444; /* 错误提示的红色 */ }

table {
  width: 100%;
}

thead th {
  padding-bottom: 12px;
}

tbody tr:nth-child(even) {
  background-color: #1f2937; /* 偶数行背景色 */
}

tbody tr:hover {
  background-color: #374151; /* 悬停时的背景色 */
}
</style>
