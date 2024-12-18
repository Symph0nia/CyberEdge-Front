<template>
  <!-- 标题 -->
  <h2 class="text-xl font-medium tracking-wide text-gray-200 mb-8">创建任务</h2>

  <div class="space-y-6">
    <!-- 选择任务类型 -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >任务类型</label
      >
      <select
        v-model="newTaskType"
        class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
      >
        <option value="" disabled>选择任务类型</option>
        <option v-for="(label, value) in taskTypes" :key="value" :value="value">
          {{ label }}
        </option>
      </select>
    </div>

    <!-- 输入目标地址 -->
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >目标地址</label
      >
      <input
        v-model="newTaskAddress"
        type="text"
        placeholder="输入目标地址"
        class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
      />
    </div>

    <!-- 创建按钮 -->
    <button
      @click="handleCreateTask"
      :disabled="!isValidInput"
      class="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      创建任务
    </button>
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
</style>
