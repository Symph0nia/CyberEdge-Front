// src/composables/useTargetManagement.js
import { ref, onMounted } from "vue";
import api from "../api/axiosInstance";
import { useNotification } from "./useNotification";
import { useConfirmDialog } from "./useConfirmDialog";

export function useTargetManagement() {
  const {
    showNotification,
    notificationMessage,
    notificationType,
    showSuccess,
    showError,
  } = useNotification();

  const {
    confirm,
    showDialog: showConfirmDialog,
    dialogTitle,
    dialogMessage,
    dialogType,
    handleConfirm,
    handleCancel,
  } = useConfirmDialog();

  // 状态管理
  const targets = ref([]); // 将 null 改为空数组
  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const showDialog = ref(false);
  const dialogMode = ref("create"); // 'create' 或 'edit'

  // 表单数据
  const targetForm = ref({
    name: "",
    description: "",
    type: "domain", // 'domain' 或 'ip'
    target: "", // 具体的域名或IP地址
  });

  // 获取目标列表
  const fetchTargets = async () => {
    isLoading.value = true;
    try {
      const response = await api.get("/targets");
      targets.value = Array.isArray(response.data) ? response.data : []; // 确保是数组
      showSuccess("加载目标列表成功");
    } catch (error) {
      targets.value = []; // 出错时设置为空数组
      showError("加载目标列表失败");
    } finally {
      isLoading.value = false;
    }
  };

  // 打开创建对话框
  const openCreateDialog = () => {
    dialogMode.value = "create";
    targetForm.value = {
      name: "",
      description: "",
      type: "domain",
      target: "",
    };
    showDialog.value = true;
  };

  // 编辑目标
  const editTarget = (target) => {
    console.log("Editing target:", target); // 调试日志
    dialogMode.value = "edit";
    targetForm.value = {
      _id: target._id || target.id, // 保存 ID
      name: target.name,
      description: target.description || "",
      type: target.type,
      target: target.target,
    };
    showDialog.value = true;
  };

  // 删除目标
  const deleteTarget = async (target) => {
    try {
      const confirmed = await confirm({
        title: "确认删除",
        message: `是否确认删除目标 "${target.name}"？此操作不可撤销。`,
        type: "danger",
      });

      if (confirmed) {
        await api.delete(`/targets/${target.id}`);
        await fetchTargets();
        showSuccess("删除目标成功");
      }
    } catch (error) {
      showError("删除目标失败");
    }
  };

  // 提交表单
  const submitTargetForm = async () => {
    if (isSubmitting.value) return;

    isSubmitting.value = true;
    try {
      const submitData = {
        name: targetForm.value.name,
        description: targetForm.value.description,
        type: targetForm.value.type,
        target: targetForm.value.target,
      };

      if (dialogMode.value === "create") {
        await api.post("/targets", submitData);
      } else {
        // 确保我们使用正确的 ID 字段
        const id = targetForm.value._id || targetForm.value.id;
        await api.put(`/targets/${id}`, submitData);
      }

      showDialog.value = false;
      await fetchTargets();
      showSuccess(`${dialogMode.value === "create" ? "创建" : "更新"}目标成功`);
    } catch (error) {
      console.log("Form data:", targetForm.value); // 打印表单数据
      console.error("Error details:", error.response?.data); // 打印详细错误信息
      showError(`${dialogMode.value === "create" ? "创建" : "更新"}目标失败`);
    } finally {
      isSubmitting.value = false;
    }
  };

  // 在组件挂载时获取数据
  onMounted(() => {
    fetchTargets();
  });

  return {
    targets,
    isLoading,
    isSubmitting,
    targetForm,
    dialogMode,
    showDialog,
    showNotification,
    notificationMessage,
    notificationType,
    showConfirmDialog,
    dialogTitle,
    dialogMessage,
    dialogType,

    fetchTargets,
    openCreateDialog,
    editTarget,
    deleteTarget,
    submitTargetForm,
    handleConfirm,
    handleCancel,
  };
}
