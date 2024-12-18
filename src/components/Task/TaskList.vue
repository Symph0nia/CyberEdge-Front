<template>
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-xl font-medium tracking-wide text-gray-200">
      <i class="ri-task-line mr-2"></i>
      任务管理
    </h2>

    <div class="flex space-x-4">
      <!-- 批量操作按钮 -->
      <div v-if="selectedTasks.length > 0" class="flex space-x-4">
        <button
          @click="handleBatchStart"
          class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
        >
          <i class="ri-play-line mr-2"></i>
          批量启动
        </button>
        <button
          @click="handleBatchDelete"
          class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
        >
          <i class="ri-delete-bin-line mr-2"></i>
          批量删除
        </button>
      </div>

      <!-- 刷新按钮 -->
      <button
        @click="$emit('refresh-tasks')"
        class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
      >
        <i class="ri-refresh-line mr-2"></i>
        刷新列表
      </button>
    </div>
  </div>

  <!-- 表格容器 -->
  <div v-if="tasks?.length > 0" class="overflow-x-auto">
    <div class="overflow-x-auto">
      <table class="w-full">
        <!-- 表头 -->
        <thead>
          <tr>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="toggleSelectAll"
                class="rounded-lg border-gray-600/30 text-gray-600 focus:ring-2 focus:ring-gray-600/50 bg-gray-700/50"
              />
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              任务ID
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              描述
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              目标
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              状态
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              创建时间
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              完成时间
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              结果
            </th>
            <th
              class="text-left py-4 px-6 text-sm font-medium text-gray-400 border-b border-gray-700/30"
            >
              操作
            </th>
          </tr>
        </thead>

        <!-- 表格内容 -->
        <tbody>
          <tr
            v-for="task in tasks"
            :key="task.id"
            class="border-b border-gray-700/30 hover:bg-gray-700/30 transition-all duration-200"
          >
            <td class="py-4 px-6 w-[60px]">
              <!-- 添加固定宽度 -->
              <input
                type="checkbox"
                v-model="selectedTasks"
                :value="task.id"
                class="rounded-lg border-gray-600/30 text-gray-600 focus:ring-2 focus:ring-gray-600/50 bg-gray-700/50"
              />
            </td>
            <td
              class="py-4 px-6 w-[120px] text-sm text-gray-200 whitespace-nowrap"
            >
              {{ task.id }}
            </td>
            <td
              class="py-4 px-6 w-[140px] text-sm text-gray-200 whitespace-nowrap"
            >
              {{ formatDescription(task.type) }}
            </td>
            <td
              class="py-4 px-6 w-[180px] text-sm text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {{ task.payload }}
            </td>
            <td class="py-4 px-6 w-[100px]">
              <span
                class="px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap"
                :class="getStatusStyle(task.status)"
              >
                {{ formatStatus(task.status) }}
              </span>
            </td>
            <td
              class="py-4 px-6 w-[160px] text-sm text-gray-200 whitespace-nowrap"
            >
              {{ formatDate(task.created_at) }}
            </td>
            <td
              class="py-4 px-6 w-[160px] text-sm text-gray-200 whitespace-nowrap"
            >
              {{ task.completed_at ? formatDate(task.completed_at) : "-" }}
            </td>
            <td
              class="py-4 px-6 min-w-[120px] max-w-[200px] text-sm text-gray-200 truncate"
            >
              {{ task.result || "-" }}
            </td>
            <td class="py-4 px-6 w-[160px] whitespace-nowrap">
              <div class="flex space-x-2">
                <button
                  @click="$emit('toggle-task', task)"
                  :disabled="task.status === 'running'"
                  class="px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  :class="
                    task.status === 'running'
                      ? 'bg-gray-700/50 text-gray-300'
                      : 'bg-blue-500/50 hover:bg-blue-600/50 text-blue-100 focus:ring-blue-500/50'
                  "
                >
                  <i class="ri-play-line mr-1"></i>
                  {{ task.status === "running" ? "运行中" : "启动" }}
                </button>
                <button
                  @click="handleDelete(task.id)"
                  class="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/50 hover:bg-red-600/50 text-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <i class="ri-delete-bin-line mr-1"></i>
                  删除
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- 空状态占位符 -->
  <div
    v-else
    class="flex flex-col items-center justify-center py-24 my-8 bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/30"
  >
    <div class="text-gray-600 text-6xl mb-6">
      <i class="ri-task-line"></i>
    </div>
    <span class="text-xl text-gray-400 mb-4">暂无任务</span>
    <p class="text-gray-500 mb-6 text-center max-w-md">
      当前还没有创建任何扫描任务，可以在目标管理中添加新任务
    </p>
    <router-link to="/target-management">
      <button
        class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 flex items-center"
      >
        <i class="ri-add-line mr-2"></i>
        前往创建任务
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "TaskList",
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => [], // 提供一个默认的空数组
    },
  },
  data() {
    return {
      selectedTasks: [],
    };
  },
  computed: {
    isAllSelected() {
      // 首先检查 tasks 是否存在且是数组
      if (!this.tasks || !Array.isArray(this.tasks)) {
        return false;
      }
      return (
        this.tasks.length > 0 && this.selectedTasks.length === this.tasks.length
      );
    },
  },
  methods: {
    formatStatus(status) {
      const statusMap = {
        running: "运行中",
        completed: "已完成",
        pending: "等待中",
      };
      return statusMap[status] || "未知状态";
    },
    getStatusStyle(status) {
      const styleMap = {
        running: "bg-green-500/20 text-green-300",
        completed: "bg-blue-500/20 text-blue-300",
        pending: "bg-yellow-500/20 text-yellow-300",
      };
      return styleMap[status] || "bg-gray-500/20 text-gray-300";
    },
    formatDescription(type) {
      const descriptions = {
        subfinder: "子域名扫描",
        nmap: "端口扫描",
        ffuf: "路径扫描",
      };
      return descriptions[type] || "未知任务";
    },
    formatDate(date) {
      return new Date(date).toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    handleDelete(taskId) {
      this.$emit("delete-task", taskId);
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedTasks = [];
      } else {
        this.selectedTasks = this.tasks.map((task) => task.id);
      }
    },

    handleBatchStart() {
      this.$emit("batch-start", this.selectedTasks);
    },

    handleBatchDelete() {
      this.$emit("batch-delete", this.selectedTasks);
      this.selectedTasks = [];
    },
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>
