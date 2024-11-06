<template>
  <div>
    <!-- 表格 -->
    <table class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden">
      <thead class="bg-gray-700">
      <tr>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">
          <input type="checkbox" @change="toggleSelectAll" /> <!-- 全选复选框 -->
        </th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">扫描ID</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">目标地址</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">时间戳</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">端口数量</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">已读状态</th> <!-- 使用任务级别的 IsRead 字段 -->
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="result in portScanResults" :key="result.id" class="hover:bg-gray-700 transition duration-300">
        <td class="py-5 px-6 border-b border-gray-600">
          <input type="checkbox" v-model="selectedResults" :value="result.id" /> <!-- 每行的复选框 -->
        </td>
        <td class="py-5 px-6 border-b border-gray-600">{{ result.id }}</td>
        <td class="py-5 px-6 border-b border-gray-600">{{ result.Target }}</td>
        <td class="py-5 px-6 border-b border-gray-600">{{ new Date(result.Timestamp).toLocaleString() }}</td>
        <!-- 计算端口数量 -->
        <td class="py-5 px-6 border-b border-gray-600">
          {{ getPortCount(result) }} 个端口
        </td>
        <!-- 显示任务级别的已读状态 -->
        <td class="py-5 px-6 border-b border-gray-600">
          {{ result.IsRead ? '✅ 已读' : '📖 未读' }} <!-- 使用任务级别的 IsRead 字段 -->
        </td>
        <!-- 操作按钮 -->
        <td class="py-5 px-6 border-b border-gray-600 flex space-x-[10px]">
          <!-- 查看详情按钮 -->
          <button @click="$emit('view-details', result.id)"
                  class="bg-blue500 text-white px-[12px] py-[8px] rounded-md hover:bg-blue600 transform hover:scale-[1.05] transition duration=300 shadow-md">
            查看详情 🔍
          </button>

          <!-- 已读/未读切换按钮 -->
          <button @click="toggleReadStatus(result)"
                  class="bg-green500 text-white px-[12px] py-[8px] rounded-md hover:bg-green600 transform hover:scale-[1.05] transition duration=300 shadow-md">
            {{ result.IsRead ? '标记为未读' : '标记为已读' }}
          </button>

          <!-- 删除按钮 -->
          <button @click="$emit('delete-result', result.id)"
                  class="bg-red500 text-white px-[12px] py-[8px] rounded-md hover:bg-red600 transform hover:scale-[1.05] transition duration=300 shadow-md">
            删除 🗑️
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 批量操作按钮 -->
    <div class="mt-4">
      <!-- 批量删除按钮 -->
      <button @click="deleteSelectedResults"
              :disabled="selectedResults.length === 0"
              class="bg-red500 text-white px-[12px] py-[8px] rounded-md hover:bg-red600 transform hover:scale-[1.05] transition duration=300 shadow-md">
        批量删除 🗑️
      </button>

      <!-- 批量标记为已读按钮 -->
      <button @click="markSelectedAsRead"
              :disabled="selectedResults.length === 0"
              class="bg-green500 text-white px-[12px] py-[8px] rounded-md hover:bg-green600 transform hover:scale-[1.05] transition duration=300 shadow-md ml-4">
        批量标记为已读 ✅
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PortScanTable',
  props: {
    portScanResults: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedResults: [] // 存储选中的扫描结果ID
    };
  },
  methods: {
    // 计算每个扫描结果中的端口数量
    getPortCount(result) {
      let portCount = 0;
      result.Data.forEach(portGroup => {
        if (portGroup.Key === 'ports') {
          portCount += portGroup.Value.length;
        }
      });
      return portCount;
    },
    // 切换全选复选框的状态
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedResults = this.portScanResults.map(result => result.id);
      } else {
        this.selectedResults = [];
      }
    },
    // 触发批量删除事件
    deleteSelectedResults() {
      this.$emit('delete-selected', this.selectedResults); // 向父组件发出删除选中的结果
      this.selectedResults = []; // 清空选中的结果
    },
    // 切换单个扫描结果的已读/未读状态
    toggleReadStatus(result) {
      const updatedReadStatus = !result.IsRead; // 切换已读状态
      this.$emit('toggle-read-status', result.id, updatedReadStatus); // 向父组件发出已读状态切换的事件
    },
    // 批量标记已读
    markSelectedAsRead() {
      this.$emit('mark-selected-read', this.selectedResults); // 向父组件发出批量标记为已读的事件
      this.selectedResults = []; // 清空选中的结果
    }
  }
}
</script>

<style scoped>
table {
  width: 100%;
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

button.bg-blue500 {
  background-color: #3b82f6; /* 蓝色按钮 */
}

button.bg-blue600:hover {
  background-color: #2563eb; /* 悬停时的深蓝色 */
}

button.bg-green500 {
  background-color: #10b981; /* 绿色按钮 */
}

button.bg-green600:hover {
  background-color: #059669; /* 悬停时的深绿色 */
}

button.bg-red500 {
  background-color: #ef4444; /* 红色按钮 */
}

button.bg-red600:hover {
  background-color: #dc2626; /* 悬停时的深红色 */
}

button[disabled] {
  background-color: #9ca3af; /* 禁用时的按钮背景 */
  cursor: not-allowed; /* 禁用时的鼠标样式 */
}
</style>
