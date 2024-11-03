<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <!-- 端口扫描结果 -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">端口扫描结果 🔍</h2>

        <!-- 刷新按钮 -->
        <button @click="handleRefreshTasks"
                class="bg-blue-500 text-white w-full text-left px-[12px] py-[12px] rounded-md hover:bg-blue-600 transform hover:scale-[1.02] transition duration-300 shadow-md mb-4">
          刷新端口扫描结果 🔄
        </button>

        <!-- 使用 PortScanTable 子组件展示表格 -->
        <PortScanTable
            :portScanResults="portScanResults"
            @view-details="viewDetails"
            @delete-result="deleteResult"
            @delete-selected="deleteSelectedResults"
            @toggle-read-status="toggleReadStatus"
            @mark-selected-read="markSelectedAsRead"
        />

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
import { ref, onMounted } from 'vue'
import PopupNotification from './PopupNotification.vue'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
import PortScanTable from './PortScanTable.vue'
import api from '../api/axiosInstance'
import { useRouter } from 'vue-router'
import { useNotification } from '../composables/useNotification.js' // 引入封装的 useNotification 逻辑

export default {
  name: 'PortScanResults',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    PortScanTable
  },
  setup() {
    const router = useRouter(); // 使用 Vue Router

    // 使用封装的通知逻辑
    const {
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showNotificationMessage
    } = useNotification();

    const portScanResults = ref([]);
    const errorMessage = ref('');

    // 获取所有 Type 为 Port 的扫描结果
    const fetchPortScanResults = async () => {
      try {
        const response = await api.get('/results/type/Port');
        portScanResults.value = response.data;
        errorMessage.value = '';
        showNotificationMessage("成功刷新端口扫描结果", "🔄", "success");
      } catch (error) {
        errorMessage.value = '获取端口扫描结果失败';
        showNotificationMessage("获取端口扫描结果失败", "❌", "error");
      }
    };

    // 查看详情逻辑
    const viewDetails = (id) => {
      router.push({ name: 'PortScanDetail', params: { id } });
    };

    // 删除逻辑
    const deleteResult = async (id) => {
      try {
        await api.delete(`/results/${id}`);
        fetchPortScanResults();
        showNotificationMessage(`成功删除任务 ${id}`, "🗑️", "success");
      } catch (error) {
        showNotificationMessage(`删除任务失败 (ID: ${id})`, "❌", "error");
      }
    };

    // 切换已读状态
    const toggleReadStatus = async (id, isRead) => {
      try {
        await api.put(`/results/${id}/read`, { isRead });
        fetchPortScanResults();
        showNotificationMessage(`成功更新已读状态`, "✅", "success");
      } catch (error) {
        showNotificationMessage("更新已读状态失败", "❌", "error");
      }
    };

    // 批量标记为已读
    const markSelectedAsRead = async (selectedIds) => {
      try {
        await Promise.all(selectedIds.map(id => api.put(`/results/${id}/read`, { isRead: true })));
        fetchPortScanResults();
        showNotificationMessage("成功标记选中的任务为已读", "✅", "success");
      } catch (error) {
        showNotificationMessage("批量标记为已读失败", "❌", "error");
      }
    };

    const deleteSelectedResults = async (selectedIds) => {
      try {
        await Promise.all(selectedIds.map(id => api.delete(`/results/${id}`)));
        fetchPortScanResults();
        showNotificationMessage("成功删除选中的任务", "🗑️", "success");
      } catch (error) {
        showNotificationMessage("批量删除任务失败", "❌", "error");
      }
    };

    onMounted(() => {
      fetchPortScanResults();
    });

    return {
      portScanResults,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      errorMessage,
      fetchPortScanResults,
      viewDetails,
      deleteResult,
      deleteSelectedResults,
      toggleReadStatus,
      markSelectedAsRead
    };
  }
};
</script>

<style scoped>
.container { padding: 20px; }

.text-red-500 { color: #ef4444; }
</style>
