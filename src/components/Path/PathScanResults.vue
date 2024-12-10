<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 路径扫描结果卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <!-- 标题和刷新按钮 -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-medium tracking-wide text-gray-200">
            路径扫描
          </h2>
          <button
            @click="handleRefreshTasks"
            class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
          >
            刷新列表
          </button>
        </div>

        <!-- 扫描结果表格 -->
        <PathScanTable
          :pathScanResults="pathScanResults"
          @view-details="handleViewDetails"
          @delete-result="handleDeleteResult"
          @delete-selected="handleDeleteSelected"
          @toggle-read-status="handleToggleReadStatus"
          @mark-selected-read="handleMarkSelectedRead"
        />

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="mt-4 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30"
        >
          <p class="text-sm text-red-400">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <FooterPage />

    <!-- 通知和确认对话框 -->
    <PopupNotification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />

    <ConfirmDialog
      :show="showDialog"
      :title="dialogTitle"
      :message="dialogMessage"
      :type="dialogType"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/axiosInstance";
import HeaderPage from "../HeaderPage.vue";
import FooterPage from "../FooterPage.vue";
import PathScanTable from "./PathScanTable.vue";
import PopupNotification from "../Utils/PopupNotification.vue";
import ConfirmDialog from "../Utils/ConfirmDialog.vue";
import { useNotification } from "../../composables/useNotification";
import { useConfirmDialog } from "../../composables/useConfirmDialog";

export default {
  name: "PathScanResults",
  components: {
    HeaderPage,
    FooterPage,
    PathScanTable,
    PopupNotification,
    ConfirmDialog,
  },
  setup() {
    const router = useRouter();
    const pathScanResults = ref([]);
    const errorMessage = ref("");

    // 使用通知钩子
    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError,
    } = useNotification();

    // 使用确认对话框钩子
    const {
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      confirm,
      handleConfirm,
      handleCancel,
    } = useConfirmDialog();

    // 获取扫描结果
    const fetchPathScanResults = async () => {
      try {
        const response = await api.get("/results/type/Path");
        pathScanResults.value = response.data;
        errorMessage.value = "";
        showSuccess("已刷新扫描结果");
      } catch (error) {
        errorMessage.value = "获取扫描结果失败";
        showError("获取扫描结果失败");
      }
    };

    // 查看详情
    const handleViewDetails = (id) => {
      router.push({ name: "PathScanDetail", params: { id } });
    };

    // 删除单个结果
    const handleDeleteResult = async (id) => {
      try {
        const confirmed = await confirm({
          title: "确认删除",
          message: "是否确认删除此扫描结果？此操作不可撤销。",
          type: "danger",
        });

        if (!confirmed) return;

        await api.delete(`/results/${id}`);
        await fetchPathScanResults();
        showSuccess("已删除扫描结果");
      } catch (error) {
        showError("删除扫描结果失败");
      }
    };

    // 切换已读状态
    const handleToggleReadStatus = async (id, isRead) => {
      try {
        await api.put(`/results/${id}/read`, { isRead });
        await fetchPathScanResults();
        showSuccess("已更新状态");
      } catch (error) {
        showError("更新状态失败");
      }
    };

    // 批量标记已读
    const handleMarkSelectedRead = async (selectedIds) => {
      try {
        const confirmed = await confirm({
          title: "批量标记",
          message: `是否将选中的 ${selectedIds.length} 项标记为已读？`,
          type: "info",
        });

        if (!confirmed) return;

        await Promise.all(
          selectedIds.map((id) =>
            api.put(`/results/${id}/read`, { isRead: true })
          )
        );
        await fetchPathScanResults();
        showSuccess("已标记选中项为已读");
      } catch (error) {
        showError("批量标记失败");
      }
    };

    // 批量删除
    const handleDeleteSelected = async (selectedIds) => {
      try {
        const confirmed = await confirm({
          title: "批量删除",
          message: `是否确认删除选中的 ${selectedIds.length} 个结果？此操作不可撤销。`,
          type: "danger",
        });

        if (!confirmed) return;

        await Promise.all(
          selectedIds.map((id) => api.delete(`/results/${id}`))
        );
        await fetchPathScanResults();
        showSuccess("已删除选中项");
      } catch (error) {
        showError("批量删除失败");
      }
    };

    onMounted(fetchPathScanResults);

    return {
      pathScanResults,
      errorMessage,
      // 通知相关
      showNotification,
      notificationMessage,
      notificationType,
      // 确认对话框相关
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      handleConfirm,
      handleCancel,
      // 方法
      handleRefreshTasks: fetchPathScanResults,
      handleViewDetails,
      handleDeleteResult,
      handleDeleteSelected,
      handleToggleReadStatus,
      handleMarkSelectedRead,
    };
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
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
