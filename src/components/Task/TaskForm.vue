<template>
  <div
    class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl border border-gray-700/30 mt-6"
  >
    <h3 class="text-xl font-medium tracking-wide text-gray-200 mb-6">
      创建任务
    </h3>

    <div class="space-y-4">
      <!-- 选择任务类型 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-300">任务类型</label>
        <select
          v-model="newTaskType"
          class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200 appearance-none"
        >
          <option value="" disabled>选择任务类型</option>
          <option
            v-for="(label, value) in taskTypes"
            :key="value"
            :value="value"
          >
            {{ label }}
          </option>
        </select>
      </div>

      <!-- 输入目标地址 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-300">目标地址</label>
        <input
          v-model="newTaskAddress"
          type="text"
          placeholder="输入目标地址"
          class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200"
        />
      </div>

      <!-- 创建按钮 -->
      <button
        @click="handleCreateTask"
        :disabled="!isValidInput"
        class="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[
          isValidInput
            ? 'bg-blue-500/50 hover:bg-blue-600/50 text-blue-100 focus:ring-blue-500/50'
            : 'bg-gray-700/50 text-gray-400',
        ]"
      >
        创建任务
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useNotification } from "../../composables/useNotification";

export default {
  name: "TaskForm",
  setup(props, { emit }) {
    // 使用通知钩子
    const { showSuccess, showError } = useNotification();

    // 表单数据
    const newTaskType = ref("");
    const newTaskAddress = ref("");

    // 任务类型选项
    const taskTypes = {
      ping: "Ping 检查",
      httpx: "HTTPX 扫描",
      subfinder: "子域名扫描",
      nmap: "端口扫描",
      ffuf: "路径扫描",
    };

    // 输入验证
    const isValidInput = computed(() => {
      return (
        newTaskType.value.trim() !== "" && newTaskAddress.value.trim() !== ""
      );
    });

    // 创建任务处理
    const handleCreateTask = () => {
      if (!isValidInput.value) {
        showError("请填写完整信息");
        return;
      }

      try {
        emit("create-task", {
          type: newTaskType.value,
          payload: newTaskAddress.value,
        });

        // 重置表单
        newTaskType.value = "";
        newTaskAddress.value = "";

        showSuccess("任务已创建");
      } catch (error) {
        showError("创建任务失败");
      }
    };

    return {
      newTaskType,
      newTaskAddress,
      taskTypes,
      isValidInput,
      handleCreateTask,
    };
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* 自定义select箭头 */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* 优化按钮点击效果 */
button:active:not(:disabled) {
  transform: scale(0.98);
}

/* 禁用状态样式 */
button:disabled {
  transform: none;
}
</style>
