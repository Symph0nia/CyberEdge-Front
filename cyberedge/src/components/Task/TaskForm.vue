<template>
  <div class="task-form-container mt-6">
    <h3 class="text-2xl font-bold mb-6">创建新任务 ✨</h3>

    <!-- 选择任务类型 -->
    <select
        v-model="newTaskType"
        class="p-3 rounded-md bg-gray-700 text-white w-full mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    >
      <option value="" disabled>选择任务类型</option>
      <option value="ping">Ping 任务</option>
      <option value="httpx">Httpx 任务</option>
      <option value="subfinder">Subfinder 任务</option>
      <option value="nmap">Nmap 任务</option>
      <option value="ffuf">Ffuf 任务</option>
    </select>

    <!-- 输入目标地址 -->
    <input
        v-model="newTaskAddress"
        type="text"
        placeholder="输入目标地址"
        class="p-3 rounded-md bg-gray-700 text-white w-full mb-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
    />

    <!-- 创建按钮 -->
    <button
        @click="createTask"
        :disabled="!isValidInput"
        class="bg-gradient-to-r from-blue500 to-blue700 text-white px-[12px] py-[8px] rounded-md hover:bg-blue600 transform hover:scale-[1.05] transition duration=300 shadow-md w-full">
      创建任务
    </button>
  </div>
</template>

<script>
export default {
  name: 'TaskForm',
  data() {
    return {
      newTaskAddress: '', // 目标地址
      newTaskType: '' // 任务类型
    };
  },
  computed: {
    isValidInput() {
      // 确保任务类型和目标地址始终有效
      const hasType = this.newTaskType.trim() !== '';
      const hasAddress = this.newTaskAddress.trim() !== '';

      return hasType && hasAddress;
    }
  },
  methods: {
    createTask() {
      // 发出 'create-task' 事件，并传递符合 API 要求的数据格式
      this.$emit('create-task', {
        type: this.newTaskType,
        payload: this.newTaskAddress // 使用目标地址作为 payload
      });

      // 清空表单字段
      this.newTaskAddress = '';
      this.newTaskType = '';
    }
  }
}
</script>

<style scoped>
.task-form-container {
  padding: 20px;
}

input, select {
  width: 100%;
}

button.bg-blue500 {
  background-color: #3b82f6; /* 蓝色按钮 */
}

button.bg-blue600:hover {
  background-color: #2563eb; /* 深蓝色按钮悬停效果 */
}

button.bg-gradient-to-r.from-blue500.to-blue700 {
  background-image: linear-gradient(to right, #3b82f6, #2563eb); /* 渐变背景 */
}
</style>
