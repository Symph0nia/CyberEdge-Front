// usePathScan.js
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axiosInstance";
import { useNotification } from "./useNotification";
import { useConfirmDialog } from "./useConfirmDialog";

export function usePathScan() {
  const route = useRoute();

  // 使用通知和确认对话框钩子
  const {
    showSuccess,
    showError,
    showWarning,
    showNotification,
    notificationMessage,
    notificationType,
  } = useNotification();

  const {
    confirm,
    showDialog,
    dialogTitle,
    dialogMessage,
    dialogType,
    handleConfirm,
    handleCancel,
  } = useConfirmDialog();

  // 状态管理
  const scanResult = ref(null);
  const errorMessage = ref("");
  const selectedPaths = ref([]);
  const selectAll = ref(false);
  const isResolving = ref(false);

  // 获取扫描结果
  const fetchScanResult = async (id) => {
    try {
      const response = await api.get(`/results/${id}`);
      scanResult.value = response.data;
      errorMessage.value = "";
    } catch (error) {
      errorMessage.value = "获取扫描结果详情失败";
      showError("获取扫描结果详情失败");
    }
  };

  // 处理路径数据
  const paths = computed(() => {
    if (!scanResult.value?.Data) return [];
    const pathGroup = scanResult.value.Data.find(
      (group) => group.Key === "paths"
    );
    if (!pathGroup?.Value?.length) return [];

    return pathGroup.Value.map((pathData) => ({
      id: pathData.find((item) => item.Key === "_id")?.Value || "",
      Path: pathData.find((item) => item.Key === "path")?.Value || "",
      Status: pathData.find((item) => item.Key === "status")?.Value || "",
      IsRead: pathData.find((item) => item.Key === "is_read")?.Value || false,
    }));
  });

  // 切换全选
  const toggleSelectAll = () => {
    selectedPaths.value = selectAll.value ? paths.value.map((p) => p.id) : [];
  };

  // 切换已读状态
  const toggleReadStatus = async (path) => {
    try {
      await api.put(`/results/${route.params.id}/entries/${path.id}/read`, {
        isRead: !path.IsRead,
      });
      await fetchScanResult(route.params.id);
      showSuccess(`已${path.IsRead ? "标记为未读" : "标记为已读"}`);
    } catch (error) {
      showError("更新状态失败");
    }
  };

  // 解析单个路径
  const resolveIP = async (path) => {
    try {
      const confirmed = await confirm({
        title: "解析路径",
        message: `是否解析路径 ${path.Path}？`,
        type: "info",
      });

      if (!confirmed) return;

      await api.put(`/results/${route.params.id}/entries/${path.id}/resolve`);
      await fetchScanResult(route.params.id);
      showSuccess("解析成功");
    } catch (error) {
      showError("解析失败");
    }
  };

  // 批量解析
  const resolveSelectedIPs = async () => {
    if (selectedPaths.value.length === 0) {
      showWarning("请先选择要解析的路径");
      return;
    }

    try {
      const confirmed = await confirm({
        title: "批量解析",
        message: `是否解析选中的 ${selectedPaths.value.length} 个路径？`,
        type: "info",
      });

      if (!confirmed) return;

      isResolving.value = true;
      let successCount = 0;
      let failureCount = 0;

      for (const id of selectedPaths.value) {
        try {
          await api.put(`/results/${route.params.id}/entries/${id}/resolve`);
          successCount++;
        } catch {
          failureCount++;
        }
      }

      await fetchScanResult(route.params.id);

      let message = `解析完成。成功: ${successCount}`;
      if (failureCount > 0) message += `, 失败: ${failureCount}`;

      failureCount > 0 ? showWarning(message) : showSuccess(message);

      // 清空选择
      selectedPaths.value = [];
      selectAll.value = false;
    } catch (error) {
      showError("批量解析失败");
    } finally {
      isResolving.value = false;
    }
  };

  // 发送到端口扫描
  const sendToPortScan = async (path) => {
    try {
      const confirmed = await confirm({
        title: "发送到端口扫描",
        message: `是否将路径 ${path.Path} 发送到端口扫描？`,
        type: "info",
      });

      if (!confirmed) return;

      await api.post("/tasks", {
        type: "nmap",
        payload: path.Path,
        parent_id: scanResult.value.id,
      });
      showSuccess("已发送到端口扫描");
    } catch (error) {
      showError("发送失败");
    }
  };

  // 批量发送到端口扫描
  const sendSelectedToPortScan = async () => {
    const selectedPathsData = selectedPaths.value
      .map((id) => paths.value.find((p) => p.id === id))
      .filter((path) => path);

    if (!selectedPathsData.length) {
      showWarning("请先选择要扫描的路径");
      return;
    }

    try {
      const confirmed = await confirm({
        title: "批量发送到端口扫描",
        message: `是否将选中的 ${selectedPathsData.length} 个路径发送到端口扫描？`,
        type: "info",
      });

      if (!confirmed) return;

      let successCount = 0;
      let failureCount = 0;

      for (const path of selectedPathsData) {
        try {
          await api.post("/tasks", {
            type: "nmap",
            payload: path.Path,
            parent_id: scanResult.value.id,
          });
          successCount++;
        } catch {
          failureCount++;
        }
      }

      let message = `发送完成。成功: ${successCount}`;
      if (failureCount > 0) message += `, 失败: ${failureCount}`;

      failureCount > 0 ? showWarning(message) : showSuccess(message);

      // 清空选择
      selectedPaths.value = [];
      selectAll.value = false;
    } catch (error) {
      showError("批量发送失败");
    }
  };

  return {
    // 状态
    scanResult,
    errorMessage,
    paths,
    selectedPaths,
    selectAll,
    isResolving,

    // 方法
    fetchScanResult,
    toggleSelectAll,
    toggleReadStatus,
    resolveIP,
    resolveSelectedIPs,
    sendToPortScan,
    sendSelectedToPortScan,

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
  };
}
