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
    showNotification,
    notificationMessage,
    notificationType,
  } = useNotification();

  const {
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
    if (!scanResult.value?.data) return [];
    const pathGroup = scanResult.value.data.find(
      (group) => group.Key === "paths"
    );
    if (!pathGroup?.Value?.length) return [];

    return pathGroup.Value.map((pathData) => ({
      id: pathData.find((item) => item.Key === "_id")?.Value || "",
      path: pathData.find((item) => item.Key === "path")?.Value || "", // 改为小写
      status: pathData.find((item) => item.Key === "status")?.Value || "", // 改为小写
      is_read: pathData.find((item) => item.Key === "is_read")?.Value || false, // 改为下划线形式
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
        is_read: !path.is_read,
      });
      await fetchScanResult(route.params.id);
      showSuccess(`已${path.is_read ? "标记为未读" : "标记为已读"}`);
    } catch (error) {
      showError("更新状态失败");
    }
  };

  // 复制到剪贴板功能
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess("已复制到剪贴板");
    } catch (error) {
      showError("复制失败，请手动复制");
      console.error("剪贴板操作失败:", error);
    }
  };
  
  // 解析选中路径
  const resolveSelectedPaths = async () => {
    if (selectedPaths.value.length === 0) {
      showError("请选择要解析的路径");
      return;
    }
    
    try {
      isResolving.value = true;
      // 这里可以实现解析路径的逻辑
      // 暂时模拟一个延迟操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess(`已解析 ${selectedPaths.value.length} 个路径`);
    } catch (error) {
      showError("解析路径失败");
    } finally {
      isResolving.value = false;
    }
  };
  
  // 发送到端口扫描
  const sendToPortScan = (path) => {
    showSuccess(`已将路径 ${path.path} 发送到端口扫描`);
    // 实现发送到端口扫描的逻辑
  };
  
  // 批量发送到端口扫描
  const sendSelectedToPortScan = () => {
    if (selectedPaths.value.length === 0) {
      showError("请选择要发送的路径");
      return;
    }    
    showSuccess(`已将 ${selectedPaths.value.length} 个路径发送到端口扫描`);
    // 实现批量发送到端口扫描的逻辑
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
    copyToClipboard,
    resolveSelectedPaths,
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
