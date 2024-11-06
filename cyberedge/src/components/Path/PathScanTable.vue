<template>
  <div>
    <table class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden">
      <thead class="bg-gray-700">
      <tr>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">
          <input type="checkbox" @change="toggleSelectAll" v-model="selectAll" />
        </th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">扫描ID</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">目标地址</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">时间戳</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">路径数量</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">已读状态</th>
        <th class="py-4 px-6 border-b-2 border-gray-600 text-left">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="result in pathScanResults" :key="result.id" class="hover:bg-gray-700 transition duration-300">
        <td class="py-5 px-6 border-b border-gray-600">
          <input type="checkbox" v-model="selectedResults" :value="result.id" />
        </td>
        <td class="py-5 px-6 border-b border-gray-600">{{ result.id }}</td>
        <td class="py-5 px-6 border-b border-gray-600">{{ result.Target }}</td>
        <td class="py-5 px-6 border-b border-gray-600">{{ new Date(result.Timestamp).toLocaleString() }}</td>
        <td class="py-5 px-6 border-b border-gray-600">
          {{ getPathCount(result) }} 个路径
        </td>
        <td class="py-5 px-6 border-b border-gray-600">
          {{ result.IsRead ? '✅ 已读' : '📖 未读' }}
        </td>
        <td class="py-5 px-6 border-b border-gray-600 flex space-x-[10px]">
          <button @click="$emit('view-details', result.id)"
                  class="bg-blue-500 text-white px-[12px] py-[8px] rounded-md hover:bg-blue-600 transform hover:scale-[1.05] transition duration=300 shadow-md">
            查看详情 🔍
          </button>
          <button @click="$emit('toggle-read-status', result.id, !result.IsRead)"
                  class="bg-green-500 text-white px-[12px] py-[8px] rounded-md hover:bg-green-600 transform hover:scale-[1.05] transition duration=300 shadow-md">
            {{ result.IsRead ? '标记为未读' : '标记为已读' }}
          </button>
          <button @click="$emit('delete-result', result.id)"
                  class="bg-red-500 text-white px-[12px] py-[8px] rounded-md hover:bg-red-600 transform hover:scale-[1.05] transition duration=300 shadow-md">
            删除 🗑️
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- 批量操作按钮 -->
    <div class="mt-4 flex space-x-4">
      <button @click="$emit('mark-selected-read', selectedResults)"
              :disabled="selectedResults.length === 0"
              class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
        批量标记为已读
      </button>
      <button @click="$emit('delete-selected', selectedResults)"
              :disabled="selectedResults.length === 0"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
        批量删除
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PathScanTable',
  props: {
    pathScanResults: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedResults: [],
      selectAll: false
    };
  },
  methods: {
    getPathCount(result) {
      // 遍历 result.Data，查找 Key 为 "paths" 的条目
      const pathGroup = result.Data.find(group => group.Key === 'paths');
      if (pathGroup && Array.isArray(pathGroup.Value)) {
        return pathGroup.Value.length; // 返回路径数组的长度
      }
      return 0;
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedResults = this.pathScanResults.map(result => result.id);
      } else {
        this.selectedResults = [];
      }
    }
  },
  watch: {
    selectedResults() {
      this.selectAll = this.selectedResults.length === this.pathScanResults.length;
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

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: scale(1.05);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bg-blue-500 { background-color: #3b82f6; }
.bg-blue-600:hover { background-color: #2563eb; }
.bg-green-500 { background-color: #10b981; }
.bg-green-600:hover { background-color: #059669; }
.bg-red-500 { background-color: #ef4444; }
.bg-red-600:hover { background-color: #dc2626; }
</style>
