<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <!-- 路径扫描结果 -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">路径扫描结果 🔍</h2>

        <!-- 刷新按钮 -->
        <button @click="handleRefreshTasks"
                class="bg-blue-500 text-white w-full text-left px-[12px] py-[12px] rounded-md hover:bg-blue-600 transform hover:scale-[1.02] transition duration-300 shadow-md mb-4">
          刷新路径扫描结果 🔄
        </button>

        <!-- 使用 PathScanTable.vue 子组件展示表格 -->
        <PathScanTable
            :pathScanResults="pathScanResults"
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
import PopupNotification from '../Utils/PopupNotification.vue'
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'
import PathScanTable from './PathScanTable.vue'
import api from '../../api/axiosInstance'
import { useRouter } from 'vue-router'
import { useNotification } from '../../composables/useNotification.js'

export default {
  name: 'PathScanResults',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    PathScanTable
  },
  setup() {
    const router = useRouter();
    const { showNotification, notificationMessage, notificationEmoji, notificationType, showNotificationMessage } = useNotification();

    const pathScanResults = ref([]);
    const errorMessage = ref('');

    // 获取所有 Type 为 Path 的扫描结果
    const fetchPathScanResults = async () => {
      try {
        const response = await api.get('/results/type/Path');
        pathScanResults.value = response.data;
        errorMessage.value = '';
        showNotificationMessage("成功刷新路径扫描结果", "🔄", "success");
      } catch (error) {
        console.error('获取路径扫描结果失败:', error);
        errorMessage.value = '获取路径扫描结果失败';
        showNotificationMessage("获取路径扫描结果失败", "❌", "error");
      }
    };

    // 查看详情逻辑
    const viewDetails = (id) => {
      router.push({ name: 'PathScanDetail', params: { id } });
    };

    // 删除逻辑
    const deleteResult = async (id) => {
      try {
        await api.delete(`/results/${id}`);
        fetchPathScanResults();
        showNotificationMessage(`成功删除任务 ${id}`, "🗑️", "success");
      } catch (error) {
        showNotificationMessage(`删除任务失败 (ID: ${id})`, "❌", "error");
      }
    };

    // 切换已读状态
    const toggleReadStatus = async (id, isRead) => {
      try {
        await api.put(`/results/${id}/read`, { isRead });
        fetchPathScanResults();
        showNotificationMessage(`成功更新已读状态`, "✅", "success");
      } catch (error) {
        showNotificationMessage("更新已读状态失败", "❌", "error");
      }
    };

    // 批量标记为已读
    const markSelectedAsRead = async (selectedIds) => {
      try {
        await Promise.all(selectedIds.map(id => api.put(`/results/${id}/read`, { isRead: true })));
        fetchPathScanResults();
        showNotificationMessage("成功标记选中的任务为已读", "✅", "success");
      } catch (error) {
        showNotificationMessage("批量标记为已读失败", "❌", "error");
      }
    };

    // 批量删除
    const deleteSelectedResults = async (selectedIds) => {
      try {
        await Promise.all(selectedIds.map(id => api.delete(`/results/${id}`)));
        fetchPathScanResults();
        showNotificationMessage("成功删除选中的任务", "🗑️", "success");
      } catch (error) {
        showNotificationMessage("批量删除任务失败", "❌", "error");
      }
    };

    onMounted(() => {
      fetchPathScanResults();
    });

    return {
      pathScanResults,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      errorMessage,
      fetchPathScanResults,
      handleRefreshTasks: fetchPathScanResults,
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
