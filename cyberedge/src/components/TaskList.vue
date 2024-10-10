<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">任务列表 📋</h2>
    <table class="min-w-full bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <thead class="bg-gray-700">
      <tr>
        <th class="py-3 px-4 border-b-2 border-gray-600 text-left">任务ID</th>
        <th class="py-3 px-4 border-b-2 border-gray-600 text-left">描述</th>
        <th class="py-3 px-4 border-b-2 border-gray-600 text-left">状态</th>
        <th class="py-3 px-4 border-b-2 border-gray-600 text-left">创建时间</th>
        <th class="py-3 px-4 border-b-2 border-gray-600 text-left">运行间隔（分钟）</th>
        <th class="py-3 px-4 border-b-2 border-gray-600 text-left">运行次数</th>
        <th class="py-3 px-4 border-b-2 border-gray-600 text-left">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-700 transition duration-300 animate-fade-in-up">
        <td class="py-4 px-4 border-b border-gray-600">{{ task.id }}</td>
        <td class="py-4 px-4 border-b border-gray-600">{{ task.description }}</td>
        <td class="py-4 px-4 border-b border-gray-600">{{ formatStatus(task.status) }}</td>
        <td class="py-4 px-4 border-b border-gray-600">{{ new Date(task.created_at).toLocaleString() }}</td>
        <td class="py-4 px-4 border-b border-gray-600">{{ task.interval || '-' }}</td>
        <td class="py-4 px-4 border-b border-gray-600">{{ task.run_count || '-' }}</td>
        <td class="py-4 px-4 border-b border-gray-600 flex space-x-2">
          <button @click="$emit('toggle-task', task)"
                  :class="task.status === 'running' ? 'bg-red-500' : 'bg-green-500'"
                  class="text-white px-[10px] py-[10px] rounded hover:bg-opacity-[0.8] transform hover:scale-[1.05] transition duration=300 shadow-md">
            {{ task.status === 'running' ? '停止 ⏹️' : '启动 ▶️' }}
          </button>
          <button @click="$emit('confirm-delete', task.id)"
                  class="bg-red500 text-white px-[10px] py-[10px] rounded hover:bg-red-[600] transform hover:scale-[1.05] transition duration=300 shadow-md">
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
      return status === 'running' ? '运行中' : status === 'completed' ? '已完成' : '等待中';
    }
  }
}
</script>

<style scoped>
/* 在这里添加任何特定于该组件的样式 */
table {
  width: 100%;
  margin-top: 20px;
}

tbody tr:nth-child(even) {
  background-color: #1f2937; /* 偶数行背景色 */
}

tbody tr:hover {
  background-color: #374151; /* 悬停时的背景色 */
}
</style>
