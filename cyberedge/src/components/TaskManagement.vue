<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <!-- 使用 TaskList 子组件 -->
      <TaskList
          :tasks="tasks"
          @toggle-task="toggleTask"
          @confirm-delete="confirmDelete"
          @refresh-tasks="handleRefreshTasks"
      />

      <!-- 使用 TaskForm 子组件 -->
      <TaskForm @create-task="createTask" />

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

    <!-- 页脚 -->
    <FooterPage />
  </div>
</template>

<script>
// 引入子组件
import { ref, onMounted } from 'vue'
import TaskList from './TaskList.vue'
import TaskForm from './TaskForm.vue'
import PopupNotification from './PopupNotification.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
import api from '../api/axiosInstance'

export default {
  name: 'TaskManagement',
  components: {
    HeaderPage,
    FooterPage,
    TaskList,
    TaskForm,
    PopupNotification,
    ConfirmDialog
  },
  setup() {
    const tasks = ref([]) // 存储任务列表
    const showNotification = ref(false) // 控制通知的显示
    const notificationMessage = ref('') // 通知消息
    const notificationEmoji = ref('') // 通知表情
    const notificationType = ref('success') // 通知类型

    // 确认对话框相关状态
    const showConfirmDialog = ref(false)
    const confirmDialogTitle = ref('')
    const confirmDialogMessage = ref('')
    const taskToDelete = ref(null)

    // 获取任务列表
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks')
        tasks.value = response.data
      } catch (error) {
        console.error('获取任务列表失败:', error)
        showNotification.value = true
        notificationMessage.value = '获取任务列表失败'
        notificationEmoji.value = '❌'
        notificationType.value = 'error'
      }
    }

    // 创建新任务
    const createTask = async (taskData) => {
      try {
        await api.post('/tasks', taskData)
        fetchTasks() // 重新获取任务列表
        showNotification.value = true
        notificationMessage.value = '成功创建任务'
        notificationEmoji.value = '✅'
      } catch (error) {
        console.error('创建任务失败:', error)
        showNotification.value = true
        notificationMessage.value = '创建任务失败'
        notificationEmoji.value = '❌'
      }
    }

    // 切换任务状态（启动或停止）
    const toggleTask = async (task) => {
      try {
        if (task.status === 'running') {
          await api.post(`/tasks/${task.id}/start`, { action: 'stop' }) // 假设同一个接口可以处理停止逻辑，传递 action 参数
        } else {
          await api.post(`/tasks/${task.id}/start`, { action: 'start' }) // 启动任务
        }
        fetchTasks()
      } catch (error) {
        console.error('切换任务状态失败:', error)
        showNotification.value = true
        notificationMessage.value = `切换任务状态失败: ${task.id}`
        notificationEmoji.value = '❌'
        notificationType.value = 'error'
      }
    }

    // 确认删除任务
    const confirmDelete = (taskID) => {
      taskToDelete.value = taskID
      confirmDialogTitle.value = '删除任务确认'
      confirmDialogMessage.value = `您确定要删除任务 ${taskID} 吗？此操作不可撤销。`
      showConfirmDialog.value = true
    }

    // 处理确认删除
    const handleConfirmDelete = () => {
      if (taskToDelete.value) {
        deleteTask(taskToDelete.value)
        showConfirmDialog.value = false
      }
    }

    // 删除任务
    const deleteTask = async (taskID) => {
      try {
        await api.delete(`/tasks/${taskID}`)
        fetchTasks() // 重新获取任务列表
        showNotification.value = true
        notificationMessage.value = `成功删除任务 ${taskID}`
        notificationEmoji.value = '🗑️'
      } catch (error) {
        console.error(`删除任务失败: ${taskID}`, error)
        showNotification.value = true
        notificationMessage.value = `删除任务 ${taskID} 失败`
        notificationEmoji.value = '❌'
      }
    }

    // 刷新任务列表并显示通知
    const handleRefreshTasks = async () => {
      try {
        await fetchTasks(); // 刷新数据

        // 显示刷新成功的通知消息
        showNotification.value = true;
        notificationMessage.value = "已刷新任务列表";
        notificationEmoji.value = "🔄";
        notificationType.value = "success";

      } catch (error) {
        console.error("刷新任务列表失败:", error);
        showNotification.value = true;
        notificationMessage.value = "刷新任务列表失败";
        notificationEmoji.value = "❌";
        notificationType.value = "error";
      }
    };

    onMounted(() => {
      fetchTasks(); // 页面加载时获取任务列表
    });

    return {
      tasks,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showConfirmDialog,
      confirmDialogTitle,
      confirmDialogMessage,
      createTask,
      toggleTask,
      confirmDelete,
      handleConfirmDelete,
      handleRefreshTasks, // 添加 handleRefreshTasks 到返回值中，以便监听 refresh-tasks 事件时调用该方法。
    };
  }
}
</script>
