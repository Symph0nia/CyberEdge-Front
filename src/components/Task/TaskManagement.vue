<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 任务列表组件 -->
      <TaskList
          :tasks="tasks"
          @toggle-task="toggleTask"
          @delete-task="handleDelete"
          @refresh-tasks="handleRefreshTasks"
      />

      <!-- 任务创建表单组件 -->
      <TaskForm @create-task="createTask" />
    </div>

    <FooterPage />

    <!-- 通知和确认对话框组件 -->
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
import { ref, onMounted } from 'vue'
import TaskList from './TaskList.vue'
import TaskForm from './TaskForm.vue'
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'
import PopupNotification from '../Utils/PopupNotification.vue'
import ConfirmDialog from '../Utils/ConfirmDialog.vue'
import { useNotification } from '../../composables/useNotification'
import { useConfirmDialog } from '../../composables/useConfirmDialog'
import api from '../../api/axiosInstance'

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
    const tasks = ref([])

    // 使用新的通知钩子
    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError
    } = useNotification()

    // 使用新的确认对话框钩子
    const {
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      confirm,
      handleConfirm,
      handleCancel
    } = useConfirmDialog()

    // 获取任务列表
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks')
        tasks.value = response.data
      } catch (error) {
        showError('获取任务列表失败')
      }
    }

    // 创建任务
    const createTask = async (taskData) => {
      try {
        await api.post('/tasks', taskData)
        await fetchTasks()
        showSuccess('已创建新任务')
      } catch (error) {
        showError('创建任务失败')
      }
    }

    // 切换任务状态
    const toggleTask = async (task) => {
      try {
        const action = task.status === 'running' ? 'stop' : 'start'
        await api.post(`/tasks/${task.id}/start`, { action })
        await fetchTasks()
        showSuccess(`已${action === 'start' ? '启动' : '停止'}任务`)
      } catch (error) {
        showError(`${task.status === 'running' ? '停止' : '启动'}任务失败`)
      }
    }

    // 删除任务
    const handleDelete = async (taskId) => {
      try {
        const confirmed = await confirm({
          title: '确认删除',
          message: `是否确认删除任务 ${taskId}？此操作不可撤销。`,
          type: 'danger'
        })

        if (confirmed) {
          await api.delete(`/tasks/${taskId}`)
          await fetchTasks()
          showSuccess('已删除任务')
        }
      } catch (error) {
        showError('删除任务失败')
      }
    }

    // 刷新任务列表
    const handleRefreshTasks = async () => {
      try {
        await fetchTasks()
        showSuccess('已刷新任务列表')
      } catch (error) {
        showError('刷新任务列表失败')
      }
    }

    onMounted(fetchTasks)

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
      handleRefreshTasks
    }
  }
}
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
