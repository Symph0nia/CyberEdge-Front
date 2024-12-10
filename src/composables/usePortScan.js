// usePortScan.js
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axiosInstance";
import { useNotification } from "./useNotification";
import { useConfirmDialog } from "./useConfirmDialog";

export function usePortScan() {
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
  const selectedPorts = ref([]);
  const selectAll = ref(false);

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

  // 工具方法
  const getPortValue = (port, key) => {
    const item = port.find((i) => i.Key === key);
    return item ? item.Value : "-";
  };

  // 处理端口数据
  const filteredPorts = computed(() => {
    if (!scanResult.value?.Data) return [];
    const portGroup = scanResult.value.Data.find(
      (group) => group.Key === "ports"
    );
    return portGroup?.Value || [];
  });

  // 切换已读状态
  const toggleReadStatus = async (port) => {
    const portID = getPortValue(port, "_id");
    const currentStatus = getPortValue(port, "is_read");
    try {
      await api.put(`/results/${route.params.id}/entries/${portID}/read`, {
        isRead: !currentStatus,
      });
      await fetchScanResult(route.params.id);
      showSuccess(`已${currentStatus ? "标记为未读" : "标记为已读"}`);
    } catch (error) {
      showError("更新状态失败");
    }
  };

  // 切换全选
  const toggleSelectAll = () => {
    selectedPorts.value = selectAll.value
      ? filteredPorts.value.map((port) => getPortValue(port, "_id"))
      : [];
  };

  // 发送到路径扫描
  const sendToPathScan = async (port) => {
    const portNumber = getPortValue(port, "number");

    try {
      const confirmed = await confirm({
        title: "发送到路径扫描",
        message: `是否将端口 ${portNumber} 发送到路径扫描？`,
        type: "info",
      });

      if (!confirmed) return;

      await api.post("/tasks", {
        type: "ffuf",
        payload: `${scanResult.value.Target}:${portNumber}`,
        parent_id: scanResult.value.id,
      });
      showSuccess(`已发送端口 ${portNumber} 到路径扫描`);
    } catch (error) {
      showError("发送失败");
    }
  };

  // 批量发送到路径扫描
  const sendSelectedToPathScan = async () => {
    const selectedPortDetails = selectedPorts.value
      .map((id) =>
        filteredPorts.value.find((port) => getPortValue(port, "_id") === id)
      )
      .filter((port) => port);

    if (!selectedPortDetails.length) {
      showWarning("请先选择要扫描的端口");
      return;
    }

    try {
      const confirmed = await confirm({
        title: "批量发送到路径扫描",
        message: `是否将选中的 ${selectedPortDetails.length} 个端口发送到路径扫描？`,
        type: "info",
      });

      if (!confirmed) return;

      let successCount = 0;
      let failureCount = 0;

      for (const port of selectedPortDetails) {
        try {
          await api.post("/tasks", {
            type: "ffuf",
            payload: `${scanResult.value.Target}:${getPortValue(
              port,
              "number"
            )}`,
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
      selectedPorts.value = [];
      selectAll.value = false;
    } catch (error) {
      showError("批量发送失败");
    }
  };

  return {
    // 状态
    scanResult,
    errorMessage,
    selectedPorts,
    selectAll,
    filteredPorts,

    // 方法
    fetchScanResult,
    getPortValue,
    toggleReadStatus,
    toggleSelectAll,
    sendToPathScan,
    sendSelectedToPathScan,

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
