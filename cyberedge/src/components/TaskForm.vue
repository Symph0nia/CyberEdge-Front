<template>
  <div class="mt-[20px]">
    <h3 class="text-xl font-bold mb-[10px]">创建新任务 ✨</h3>

    <!-- 输入描述 -->
    <input
        v-model="newTaskDescription"
        type="text"
        placeholder="输入任务描述"
        class="p-3 rounded bg-gray-700 text-white w-full mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    />

    <!-- 输入执行间隔 -->
    <input
        v-model.number="newTaskInterval"
        type="number"
        placeholder="输入执行间隔（分钟）"
        class="p-3 rounded bg-gray-700 text-white w-full mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    />

    <!-- 选择任务类型 -->
    <select v-model="newTaskType" class="p-3 rounded bg-gray-700 text-white w-full mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
      <option value="" disabled>选择任务类型</option>
      <option value="normal">普通任务</option>
      <option value="ping">Ping 任务</option>
    </select>

    <!-- 输入地址 -->
    <input
        v-if="newTaskType === 'ping'"
        v-model="newTaskAddress"
        type="text"
        placeholder="输入目标地址（仅用于Ping任务）"
        class="p-3 rounded bg-gray-700 text-white w-full mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    />

    <!-- 创建按钮 -->
    <button
        @click="$emit('create-task', { type: newTaskType, description: newTaskDescription, interval: newTaskInterval, address: newTaskAddress })"
        :disabled="!isValidInput"
        class="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 transform hover:scale-[1.05] transition duration=300 shadow-md">
      创建任务
    </button>
  </div>
</template>

<script>
export default {
  name: 'TaskForm',
  data() {
    return {
      newTaskDescription: '',
      newTaskInterval: 0,
      newTaskAddress: '',
      newTaskType: ''
    };
  },
  computed: {
    isValidInput() {
      // 确保描述和执行间隔始终有效
      const hasDescription = this.newTaskDescription.trim() !== '';
      const hasInterval = this.newTaskInterval > 0;

      // 所有任务类型都需要描述和间隔
      return hasDescription && hasInterval;
    }
  }
}
</script>

<style scoped>
/* 在这里添加任何特定于该组件的样式 */
.switch input:checked + .slider {
  background-color: #4caf50;
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
