<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 子域名扫描结果卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <!-- 标题行 -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <h2 class="text-xl font-medium tracking-wide text-gray-200">
              <i class="ri-radar-line mr-2"></i>
              子域名扫描
            </h2>
            <span
              class="ml-4 px-3 py-1.5 rounded-xl bg-gray-700/50 text-gray-200 text-sm"
            >
              共 {{ filteredResults.length }} 个结果
            </span>
          </div>
          <button
            @click="handleRefreshTasks"
            class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 flex items-center justify-center"
          >
            <i class="ri-refresh-line mr-2"></i>
            刷新列表
          </button>
        </div>

        <!-- 搜索和过滤栏 -->
        <div class="flex items-center space-x-4 mb-6">
          <!-- 搜索框 -->
          <div class="flex-1 relative">
            <i class="ri-search-line absolute left-4 top-3 text-gray-400"></i>
            <input
              v-model.trim="searchQuery"
              type="text"
              placeholder="搜索目标地址..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
            />
          </div>

          <!-- 状态过滤下拉框 -->
          <div class="relative">
            <i class="ri-filter-line absolute left-4 top-3 text-gray-400"></i>
            <select
              v-model="statusFilter"
              class="pl-10 pr-8 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 appearance-none"
            >
              <option value="">所有状态</option>
              <option value="true">已读</option>
              <option value="false">未读</option>
            </select>
            <i
              class="ri-arrow-down-s-line absolute right-4 top-3 text-gray-400 pointer-events-none"
            ></i>
          </div>
        </div>

        <!-- 扫描结果表格 -->
        <SubdomainScanTable
          :subdomainScanResults="filteredResults"
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

    <!-- 通知组件 -->
    <PopupNotification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />

    <!-- 确认对话框 -->
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../../api/axiosInstance";
import { useNotification } from "../../composables/useNotification";
import { useConfirmDialog } from "../../composables/useConfirmDialog";
import HeaderPage from "../HeaderPage.vue";
import FooterPage from "../FooterPage.vue";
import SubdomainScanTable from "./SubdomainScanTable.vue";
import PopupNotification from "../Utils/PopupNotification.vue";
import ConfirmDialog from "../Utils/ConfirmDialog.vue";

export default {
  name: "SubdomainScanResults",
  components: {
    HeaderPage,
    FooterPage,
    SubdomainScanTable,
    PopupNotification,
    ConfirmDialog,
  },
  setup() {
    const router = useRouter();
    const subdomainScanResults = ref([]);
    const errorMessage = ref("");
    const searchQuery = ref("");
    const statusFilter = ref("");

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
      confirm,
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      handleConfirm,
      handleCancel,
    } = useConfirmDialog();

    // 获取扫描结果
    const fetchSubdomainScanResults = async () => {
      try {
        const response = await api.get("/results/type/Subdomain");
        subdomainScanResults.value = response.data;
        errorMessage.value = "";
        showSuccess("已刷新扫描结果");
      } catch (error) {
        errorMessage.value = "获取扫描结果失败";
        showError("获取扫描结果失败");
      }
    };

    // 查看详情
    const handleViewDetails = (id) => {
      router.push({ name: "SubdomainScanDetail", params: { id } });
    };

    // 删除单个结果
    const handleDeleteResult = async (id) => {
      try {
        const confirmed = await confirm({
          title: "确认删除",
          message: "是否确认删除此扫描结果？此操作不可撤销。",
          type: "danger",
        });

        if (confirmed) {
          await api.delete(`/results/${id}`);
          await fetchSubdomainScanResults();
          showSuccess("已删除扫描结果");
        }
      } catch (error) {
        showError("删除扫描结果失败");
      }
    };

    // 切换已读状态
    const handleToggleReadStatus = async (id, is_read) => {
      try {
        await api.put(`/results/${id}/read`, { is_read });
        await fetchSubdomainScanResults();
        showSuccess("已更新状态");
      } catch (error) {
        showError("更新状态失败");
      }
    };

    // 批量标记已读
    const handleMarkSelectedRead = async (selectedIds) => {
      try {
        await Promise.all(
          selectedIds.map((id) =>
            api.put(`/results/${id}/read`, { is_read: true })
          )
        );
        await fetchSubdomainScanResults();
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

        if (confirmed) {
          await Promise.all(
            selectedIds.map((id) => api.delete(`/results/${id}`))
          );
          await fetchSubdomainScanResults();
          showSuccess("已删除选中项");
        }
      } catch (error) {
        showError("批量删除失败");
      }
    };

    // 过滤后的结果
    const filteredResults = computed(() => {
      // 确保 subdomainScanResults 是数组且不为空
      if (
        !Array.isArray(subdomainScanResults.value) ||
        !subdomainScanResults.value.length
      ) {
        return [];
      }

      let filtered = [...subdomainScanResults.value];

      // 搜索过滤 - 确保 Target 属性存在
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(
          (result) =>
            result.Target && result.Target.toLowerCase().includes(query)
        );
      }

      // 状态过滤 - 使用严格比较
      if (statusFilter.value !== "") {
        const is_read = statusFilter.value === "true";
        filtered = filtered.filter((result) => result.is_read === is_read);
      }

      // 按时间戳排序
      return filtered.sort(
        (a, b) =>
          new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
      );
    });

    onMounted(fetchSubdomainScanResults);

    return {
      subdomainScanResults,
      errorMessage,
      showNotification,
      notificationMessage,
      notificationType,
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      searchQuery,
      statusFilter,
      filteredResults,
      handleConfirm,
      handleCancel,
      handleRefreshTasks: fetchSubdomainScanResults,
      handleViewDetails,
      handleDeleteResult,
      handleDeleteSelected,
      handleToggleReadStatus,
      handleMarkSelectedRead,
    };
  },
};
</script>
