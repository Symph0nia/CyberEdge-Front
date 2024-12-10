// useSubdomainScan.js
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import api from "../api/axiosInstance";
import { useNotification } from "./useNotification";
import { useConfirmDialog } from "./useConfirmDialog";
import { getHttpStatusClass } from "./constants";
import { transformSubdomainData, sortByIpAndDomain } from "./utils";

export function useSubdomainScan() {
  const route = useRoute();

  const {
    showNotification,
    notificationMessage,
    notificationType,
    showSuccess,
    showError,
    showWarning,
  } = useNotification();

  const {
    showDialog,
    dialogTitle,
    dialogMessage,
    dialogType,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirmDialog();

  // 状态管理
  const scanResult = ref(null);
  const errorMessage = ref("");
  const selectedSubdomains = ref([]);
  const selectAll = ref(false);
  const isResolving = ref(false);
  const isProbing = ref(false);

  // 监听选中状态
  watch(selectedSubdomains, (newVal) => {
    selectAll.value =
      newVal.length === subdomains.value.length && newVal.length > 0;
  });

  // 通用批量操作处理函数
  const handleBatchOperation = async ({
    targets,
    batchTitle,
    singleTitle,
    batchMessage,
    singleMessage,
    apiCall,
    successMessage,
    errorMessage,
    loadingRef = null,
    resetSelection = true,
  }) => {
    const isBatch = targets.length > 1;

    try {
      const confirmed = await confirm({
        title: isBatch ? batchTitle : singleTitle,
        message: isBatch ? batchMessage : singleMessage,
        type: "info",
      });

      if (!confirmed) return;

      if (loadingRef) loadingRef.value = true;

      await apiCall(targets);

      if (isBatch && resetSelection) {
        selectedSubdomains.value = [];
        selectAll.value = false;
      }

      showSuccess(
        typeof successMessage === "function"
          ? successMessage(targets)
          : successMessage
      );
    } catch (error) {
      showError(
        typeof errorMessage === "function"
          ? errorMessage(targets)
          : errorMessage
      );
    } finally {
      if (loadingRef) loadingRef.value = false;
    }
  };

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

  // 计算属性 - 子域名列表
  const subdomains = computed(() => {
    if (!scanResult.value?.Data) return [];

    const subdomainGroup = scanResult.value.Data.find(
      (group) => group.Key === "subdomains"
    );
    if (!subdomainGroup?.Value?.length) return [];

    const domainList = subdomainGroup.Value.map(transformSubdomainData);
    const sorted = domainList.sort(sortByIpAndDomain);

    const seenIPs = new Set();
    return sorted.map((item) => ({
      ...item,
      isFirstIP: item.ip && !seenIPs.has(item.ip) && seenIPs.add(item.ip),
    }));
  });

  // 切换全选
  const toggleSelectAll = () => {
    selectedSubdomains.value = selectAll.value
      ? subdomains.value.map((s) => s.id)
      : [];
  };

  // 切换已读状态
  const toggleReadStatus = async (subdomain) => {
    try {
      await api.put(
        `/results/${route.params.id}/entries/${subdomain.id}/read`,
        { isRead: !subdomain.is_read }
      );
      await fetchScanResult(route.params.id);
      showSuccess(`已${subdomain.is_read ? "标记为未读" : "标记为已读"}`);
    } catch (error) {
      showError("更新状态失败");
    }
  };

  // 解析IP
  const resolveIPs = async (input) => {
    // 确保 targets 只包含 ID
    const targets = Array.isArray(input)
        ? input.map(item => item.id || item)  // 处理可能是对象或ID的情况
        : [input.id || input];  // 单个项可能是对象或ID

    if (!targets.length) {
      showWarning("请先选择子域名");
      return;
    }

    await handleBatchOperation({
      targets,
      batchTitle: "批量解析IP",
      singleTitle: "解析IP",
      batchMessage: `是否解析选中的 ${targets.length} 个子域名的IP？`,
      singleMessage: `是否解析 ${targets[0].domain} 的IP地址？`,
      apiCall: async (targets) => {
        await api.put(`/results/${route.params.id}/entries/resolve`, {
          entryIds: targets  // 现在只发送ID数组
        });
        await fetchScanResult(route.params.id);
      },
      successMessage: targets.length > 1 ? "批量解析成功" : "IP解析成功",
      errorMessage: targets.length > 1 ? "批量解析失败" : "IP解析失败",
      loadingRef: isResolving
    });
  };

  // 发送到端口扫描
  const sendToPortScan = async (input) => {
    const targets = Array.isArray(input)
      ? input
          .map((id) => subdomains.value.find((sub) => sub.id === id))
          .filter((subdomain) => subdomain?.ip)
      : [input];

    const uniqueIPs = [...new Set(targets.map((subdomain) => subdomain.ip))];

    if (!uniqueIPs.length) {
      showWarning("没有可用的IP");
      return;
    }

    await handleBatchOperation({
      targets,
      batchTitle: "批量发送到端口扫描",
      singleTitle: "发送到端口扫描",
      batchMessage: `是否将选中的 ${uniqueIPs.length} 个IP发送到端口扫描？`,
      singleMessage: `是否将 ${targets[0].domain} (${targets[0].ip}) 发送到端口扫描？`,
      apiCall: async () => {
        for (const ip of uniqueIPs) {
          await api.post("/tasks", {
            type: "nmap",
            payload: ip,
            parent_id: scanResult.value.id,
          });
        }
      },
      successMessage:
        targets.length > 1
          ? `已发送 ${uniqueIPs.length} 个IP到端口扫描`
          : "已发送到端口扫描",
      errorMessage: targets.length > 1 ? "批量发送失败" : "发送失败",
    });
  };

  // HTTPX探测
  const probeHosts = async (input) => {
    const targets = Array.isArray(input) ? input : [input];

    if (!targets.length) {
      showWarning("请先选择子域名");
      return;
    }

    await handleBatchOperation({
      targets,
      batchTitle: "批量HTTPX探测",
      singleTitle: "HTTPX探测",
      batchMessage: `是否对选中的 ${targets.length} 个子域名进行HTTPX探测？`,
      singleMessage: `是否对 ${targets[0].domain} 进行HTTPX探测？`,
      apiCall: async (targets) => {
        const endpoint =
          targets.length > 1
            ? `/results/${route.params.id}/entries/batch/probe`
            : `/results/${route.params.id}/entries/${targets[0].id}/probe`;
        const data = targets.length > 1 ? { entryIds: targets } : undefined;
        await api.put(endpoint, data);
        await fetchScanResult(route.params.id);
      },
      successMessage: targets.length > 1 ? "批量探测成功" : "HTTPX探测成功",
      errorMessage: targets.length > 1 ? "批量探测失败" : "HTTPX探测失败",
      loadingRef: isProbing,
    });
  };

  return {
    // 状态数据
    scanResult,
    subdomains,
    selectedSubdomains,
    selectAll,
    errorMessage,
    isResolving,
    isProbing,

    // 业务操作方法
    fetchScanResult,
    toggleSelectAll,
    toggleReadStatus,
    resolveIPs,
    sendToPortScan,
    probeHosts,
    getHttpStatusClass,

    // UI控制 - 通知
    showNotification,
    notificationMessage,
    notificationType,

    // UI控制 - 确认对话框
    showDialog,
    dialogTitle,
    dialogMessage,
    dialogType,
    handleConfirm,
    handleCancel,
  };
}
