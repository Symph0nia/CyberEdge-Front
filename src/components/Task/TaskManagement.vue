<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 主要内容区域卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <!-- 任务列表组件 -->
        <div class="mb-8">
          <TaskList
            :tasks="tasks"
            @toggle-task="toggleTask"
            @delete-task="handleDelete"
            @refresh-tasks="handleRefreshTasks"
            @batch-start="handleBatchStart"
            @batch-delete="handleBatchDelete"
          />
        </div>

        <!-- 分隔线 -->
        <div class="h-px bg-gray-700/30 my-8"></div>

        <!-- 任务创建表单组件 -->
        <div class="bg-gray-900/30 p-6 rounded-xl">
          <TaskForm @create-task="createTask" />
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
import { ref, onMounted } from "vue";
import TaskList from "./TaskList.vue";
import TaskForm from "./TaskForm.vue";
import HeaderPage from "../HeaderPage.vue";
import FooterPage from "../FooterPage.vue";
import PopupNotification from "../Utils/PopupNotification.vue";
import ConfirmDialog from "../Utils/ConfirmDialog.vue";
import { useNotification } from "../../composables/useNotification";
import { useConfirmDialog } from "../../composables/useConfirmDialog";
import api from "../../api/axiosInstance";

export default {
  name: "TaskManagement",
  components: {
    HeaderPage,
    FooterPage,
    TaskList,
    TaskForm,
    PopupNotification,
    ConfirmDialog,
  },
  setup() {
    const tasks = ref([]);

    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError,
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

    // 获取任务列表
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        tasks.value = response.data;
      } catch (error) {
        showError("获取任务列表失败");
      }
    };

    // 创建任务
    const createTask = async (taskData) => {
      try {
        await api.post("/tasks", taskData);
        await fetchTasks();
        showSuccess("已创建新任务");
      } catch (error) {
        showError("创建任务失败");
      }
    };

    // 切换单个任务状态
    const toggleTask = async (task) => {
      try {
        const response = await api.post("/tasks/start", {
          taskIds: [task.id],
        });
        const result = response.data.result;

        await fetchTasks();

        if (result.success.includes(task.id)) {
          showSuccess("已启动任务");
        } else {
          const errorMsg = result.failed[task.id] || "启动失败";
          showError(`启动任务失败: ${errorMsg}`);
        }
      } catch (error) {
        showError("启动任务失败");
      }
    };

    // 删除单个任务
    const handleDelete = async (taskId) => {
      try {
        const confirmed = await confirm({
          title: "确认删除",
          message: `是否确认删除任务 ${taskId}？此操作不可撤销。`,
          type: "danger",
        });

        if (confirmed) {
          const response = await api.delete("/tasks", {
            data: { taskIds: [taskId] },
          });
          const result = response.data.result;

          await fetchTasks();

          if (result.success.includes(taskId)) {
            showSuccess("已删除任务");
          } else {
            const errorMsg = result.failed[taskId] || "删除失败";
            showError(`删除任务失败: ${errorMsg}`);
          }
        }
      } catch (error) {
        showError("删除任务失败");
      }
    };

    // 批量启动任务
    const handleBatchStart = async (taskIds) => {
      try {
        const confirmed = await confirm({
          title: "确认批量启动",
          message: `是否确认启动选中的 ${taskIds.length} 个任务？`,
          type: "warning",
        });

        if (confirmed) {
          const response = await api.post("/tasks/start", { taskIds });
          const result = response.data.result;

          await fetchTasks();

          if (result.success.length > 0) {
            showSuccess(`成功启动 ${result.success.length} 个任务`);
          }

          if (Object.keys(result.failed).length > 0) {
            showError(`${Object.keys(result.failed).length} 个任务启动失败`);
          }
        }
      } catch (error) {
        showError("批量启动任务失败");
      }
    };

    // 批量删除任务
    const handleBatchDelete = async (taskIds) => {
      try {
        const confirmed = await confirm({
          title: "确认批量删除",
          message: `是否确认删除选中的 ${taskIds.length} 个任务？此操作不可撤销。`,
          type: "danger",
        });

        if (confirmed) {
          const response = await api.delete("/tasks", {
            data: { taskIds },
          });
          const result = response.data.result;

          await fetchTasks();

          if (result.success.length > 0) {
            showSuccess(`成功删除 ${result.success.length} 个任务`);
          }

          if (Object.keys(result.failed).length > 0) {
            showError(`${Object.keys(result.failed).length} 个任务删除失败`);
          }
        }
      } catch (error) {
        showError("批量删除任务失败");
      }
    };

    // 刷新任务列表
    const handleRefreshTasks = async () => {
      try {
        await fetchTasks();
        showSuccess("已刷新任务列表");
      } catch (error) {
        showError("刷新任务列表失败");
      }
    };

    onMounted(fetchTasks);

    return {
      tasks,
      showNotification,
      notificationMessage,
      notificationType,
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      handleConfirm,
      handleCancel,
      createTask,
      toggleTask,
      handleDelete,
      handleRefreshTasks,
      handleBatchStart,
      handleBatchDelete,
    };
  },
};
</script>
