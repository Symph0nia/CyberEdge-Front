<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-medium tracking-wide text-gray-200">任务管理</h2>
      <!-- 刷新按钮 -->
      <button
          @click="$emit('refresh-tasks')"
          class="px-4 py-2.5 rounded-xl text-sm font-medium
               bg-gray-700/50 hover:bg-gray-600/50 text-gray-200
               transition-all duration-200
               focus:outline-none focus:ring-2 focus:ring-gray-600/50"
      >
        刷新列表
      </button>
    </div>

    <!-- 任务表格 -->
    <div class="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/30 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
          <tr>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/50">任务ID</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/50">描述</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/50">状态</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/50">创建时间</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/50">完成时间</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/50">结果</th>
            <th class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/50">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="task in tasks"
              :key="task.id"
              class="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200"
          >
            <td class="py-4 px-6 text-sm text-gray-200">{{ task.id }}</td>
            <td class="py-4 px-6 text-sm text-gray-200">{{ formatDescription(task.type) }}</td>
            <td class="py-4 px-6 text-sm">
                <span
                    :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    getStatusStyle(task.status)
                  ]"
                >
                  {{ formatStatus(task.status) }}
                </span>
            </td>
            <td class="py-4 px-6 text-sm text-gray-200">{{ formatDate(task.created_at) }}</td>
            <td class="py-4 px-6 text-sm text-gray-200">{{ task.completed_at ? formatDate(task.completed_at) : '-' }}</td>
            <td class="py-4 px-6 text-sm text-gray-200">{{ task.result || '-' }}</td>
            <td class="py-4 px-6">
              <div class="flex space-x-2">
                <!-- 启动/停止按钮 -->
                <button
                    @click="$emit('toggle-task', task)"
                    :disabled="task.status === 'running'"
                    class="px-3 py-1.5 rounded-xl text-xs font-medium
                           transition-all duration-200
                           focus:outline-none focus:ring-2"
                    :class="[
                      task.status === 'running'
                        ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500/50 hover:bg-blue-600/50 text-blue-100 focus:ring-blue-500/50'
                    ]"
                >
                  {{ task.status === 'running' ? '运行中' : '启动' }}
                </button>

                <!-- 删除按钮 -->
                <button
                    @click="handleDelete(task.id)"
                    class="px-3 py-1.5 rounded-xl text-xs font-medium
                           bg-red-500/50 hover:bg-red-600/50 text-red-100
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatStatus(status) {
      const statusMap = {
        running: "运行中",
        completed: "已完成",
        pending: "等待中"
      };
      return statusMap[status] || "未知状态";
    },
    getStatusStyle(status) {
      const styleMap = {
        running: "bg-green-500/20 text-green-300",
        completed: "bg-blue-500/20 text-blue-300",
        pending: "bg-yellow-500/20 text-yellow-300"
      };
      return styleMap[status] || "bg-gray-500/20 text-gray-300";
    },
    formatDescription(type) {
      const descriptions = {
        ping: "Ping 检查",
        httpx: "HTTPX 扫描",
        subfinder: "子域名扫描",
        nmap: "端口扫描",
        ffuf: "路径扫描"
      };
      return descriptions[type] || "未知任务";
    },
    formatDate(date) {
      return new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    handleDelete(taskId) {
      this.$emit('delete-task', taskId);
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
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

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
