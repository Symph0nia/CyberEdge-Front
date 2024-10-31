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
                class="bg-blue500 text-white w-full text-left px-[12px] py-[12px] rounded-md hover:bg-blue600 transform hover:scale-[1.02] transition duration=300 shadow-md mb-4">
          刷新端口扫描结果 🔄
        </button>

        <!-- 使用 PortScanTable 子组件展示表格 -->
        <PortScanTable
            :portScanResults="portScanResults"
            @view-details="viewDetails"
            @delete-result="deleteResult"
        />

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="text-red500 mt-[20px]">
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

    <!-- 确认对话框 -->
    <ConfirmDialog
        :show="showConfirmDialog"
        :title="confirmDialogTitle"
        :message="confirmDialogMessage"
        type="danger"
        @confirm="handleConfirmDelete"
        @cancel="showConfirmDialog = false"
    />
  </div>
</template>

<script>
// 引入子组件
import { ref, onMounted } from 'vue'
import PopupNotification from './PopupNotification.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
import PortScanTable from './PortScanTable.vue' // 引入 PortScanTable 子组件
import api from '../api/axiosInstance'
import { useRouter } from 'vue-router'

export default {
  name: 'PortScanResults',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    ConfirmDialog,
    PortScanTable // 注册 PortScanTable 子组件
  },
  setup() {
    const router = useRouter(); // 使用 Vue Router

    const portScanResults = ref([]) // 存储端口扫描结果
    const showNotification = ref(false) // 控制通知的显示
    const notificationMessage = ref('') // 通知消息
    const notificationEmoji = ref('') // 通知表情
    const notificationType = ref('success') // 通知类型

    const showConfirmDialog = ref(false)
    const confirmDialogTitle = ref('')
    const confirmDialogMessage = ref('')

    const errorMessage = ref('') // 错误信息

    // 获取所有 Type 为 Port 的扫描结果
    const fetchPortScanResults = async () => {
      try {
        const response = await api.get('/results/type/Port'); // 调用后端API获取数据
        portScanResults.value = response.data; // 将获取到的数据存储到 portScanResults 中
        errorMessage.value = ''; // 清空错误信息

        // 显示成功通知
        showNotification.value = true;
        notificationMessage.value = "成功刷新端口扫描结果";
        notificationEmoji.value = "🔄";
        notificationType.value = "success";

      } catch (error) {
        console.error('获取端口扫描结果失败:', error);
        errorMessage.value = '获取端口扫描结果失败';

        // 显示错误通知
        showNotification.value = true;
        notificationMessage.value = "获取端口扫描结果失败";
        notificationEmoji.value = "❌";
        notificationType.value = "error";
      }
    };

    // 查看详情逻辑，跳转到 /results/{id} 页面
    const viewDetails = (id) => {
      router.push({ name: 'PortScanDetail', params: { id } });
    };

    // 删除逻辑，调用 DELETE /results/{id} 接口
    const deleteResult = async (id) => {
      try {
        await api.delete(`/results/${id}`);
        fetchPortScanResults(); // 删除成功后刷新数据

        // 显示成功通知
        showNotification.value = true;
        notificationMessage.value = `成功删除任务 ${id}`;
        notificationEmoji.value = "🗑️";
        notificationType.value = "success";

      } catch (error) {
        console.error(`删除任务失败 (ID: ${id}):`, error);
        showNotification.value = true;
        notificationMessage.value = `删除任务失败 (ID: ${id})`;
        notificationEmoji.value = "❌";
        notificationType.value = "error";
      }
    };

    onMounted(() => {
      fetchPortScanResults(); // 页面加载时获取数据
    });

    return {
      portScanResults,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showConfirmDialog,
      confirmDialogTitle,
      confirmDialogMessage,
      errorMessage,

      fetchPortScanResults,
      handleRefreshTasks() { fetchPortScanResults(); },
      viewDetails,
      deleteResult
    };
  }
};
</script>

<style scoped>
.container { padding: 20px; }

.text-red500 { color: #ef4444; /* 错误提示的红色 */ }
</style>

