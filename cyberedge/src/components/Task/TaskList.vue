<template>
  <div class="task-list-container">
    <h2 class="text-2xl font-bold mb-6">任务列表 📋</h2>

    <!-- 刷新按钮 -->
    <button @click="$emit('refresh-tasks')"
      class="bg-blue500 text-white w-full text-left px-[12px] py-[12px] rounded-md hover:bg-blue600 transform hover:scale-[1.02] transition duration=300 shadow-md mb-4">
      刷新任务列表 🔄
    </button>

    <table class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden">
      <thead class="bg-gray-700">
      <tr>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">任务ID</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">描述</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">状态</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">创建时间</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">完成时间</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">结果</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-700 transition duration-300 animate-fade-in-up">
        <td class="py-5 px-6 border-b border-gray-600">{{ task.id }}</td>
        <td class="py-5 px-6 border-b border-gray-600">{{ formatDescription(task.type) }}</td>
        <td :class="statusClass(task.status)" class="py-5 px-6 border-b border-gray-600">
          {{ formatStatus(task.status) }}
        </td>
        <td class="py-5 px-6 border-b border-gray-600">{{ new Date(task.created_at).toLocaleString() }}</td>
        <td class="py-5 px-6 border-b border-gray-600">{{ task.completed_at ? new Date(task.completed_at).toLocaleString() : '-' }}</td>
        <td class="py-5 px-6 border-b border-gray-600">{{ task.result || '-' }}</td>
        <td class="py-5 px-6 border-b border-gray-600 flex space-x-[10px]">
          <!-- 启动/停止按钮 -->
          <button @click="$emit('toggle-task', task)"
                  :disabled="task.status === 'running'"
                  :class="[task.status === 'running' ? 'bg-gray500 cursor-not-allowed' : 'bg-green500', 'text-white', 'px-[12px]', 'py-[8px]', 'rounded-md', 'hover:bg-opacity-[0.8]', 'transform', 'hover:scale-[1.05]', 'transition', 'duration=300', 'shadow-md']">
            {{ task.status === 'running' ? '运行中 ⏹️' : '启动 ▶️' }}
          </button>

          <!-- 删除按钮 -->
          <button @click="$emit('confirm-delete', task.id)"
                  class="bg-red500 text-white px-[12px] py-[8px] rounded-md hover:bg-red-[600] transform hover:scale-[1.05] transition duration=300 shadow-md">
            删除 🗑️
          </button>
        </td>
      </tr>
      </tbody>
    </table>
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
        running: { text: "运行中 🟢", color: "text-green500" },
        completed: { text: "已完成 ✅", color: "text-blue500" },
        pending: { text: "等待中 ⏳", color: "text-yellow500" }
      };
      return statusMap[status]?.text || "未知状态";
    },
    statusClass(status) {
      const statusMap = {
        running: "text-green500",
        completed: "text-blue500",
        pending: "text-yellow500"
      };
      return statusMap[status] || "text-white";
    },
    formatDescription(type) {
      const descriptions = {
        ping: "Ping 检查",
        httpx: "HTTPX 扫描",
        subfinder: "子域名扫描",
        nmap: "端口扫描"
      };
      return descriptions[type] || "未知任务";
    }
  }
}
</script>

<style scoped>
/* 在这里添加任何特定于该组件的样式 */
.task-list-container {
  padding: 20px;
}

table {
  width: 100%;
  margin-top: 0; /* 移除表格顶部的 margin，使其紧贴刷新按钮 */
}

thead th {
  padding-bottom: 12px;
}

tbody tr:nth-child(even) {
  background-color: #1f2937; /* 偶数行背景色 */
}

tbody tr:hover {
  background-color: #374151; /* 悬停时的背景色 */
}

button.bg-red500 {
  background-color: #ef4444; /* 红色按钮 */
}

button.bg-green500 {
  background-color: #10b981; /* 绿色按钮 */
}

button.bg-blue500 {
  background-color: #3b82f6; /* 蓝色刷新按钮 */
}

button.bg-gray500 {
  background-color: #9ca3af; /* 灰色禁用按钮 */
}

.text-green500 {
  color: #10b981; /* 状态为运行中的文本颜色 */
}

.text-blue500 {
  color: #3b82f6; /* 状态为已完成的文本颜色 */
}

.text-yellow500 {
  color: #f59e0b; /* 状态为等待中的文本颜色 */
}
</style>
