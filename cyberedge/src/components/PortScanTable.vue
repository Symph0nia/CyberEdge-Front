<template>
  <table class="min-w-full bg-gray-800 shadow-lg rounded-md overflow-hidden">
    <thead class="bg-gray-700">
    <tr>
      <th class="py-4 px-6 border-b-2 border-gray-600 text-left">扫描ID</th>
      <th class="py-4 px-6 border-b-2 border-gray-600 text-left">目标地址</th>
      <th class="py-4 px-6 border-b-2 border-gray-600 text-left">时间戳</th>
      <th class="py-4 px-6 border-b-2 border-gray-600 text-left">端口数量</th>
      <th class="py-4 px-6 border-b-2 border-gray-600 text-left">操作</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="result in portScanResults" :key="result.id" class="hover:bg-gray-700 transition duration-300">
      <td class="py-5 px-6 border-b border-gray-600">{{ result.id }}</td>
      <td class="py-5 px-6 border-b border-gray-600">{{ result.Target }}</td>
      <td class="py-5 px-6 border-b border-gray-600">{{ new Date(result.Timestamp).toLocaleString() }}</td>
      <!-- 计算端口数量 -->
      <td class="py-5 px-6 border-b border-gray-600">
        {{ getPortCount(result) }} 个端口
      </td>
      <!-- 操作按钮 -->
      <td class="py-5 px-6 border-b border-gray-600 flex space-x-[10px]">
        <!-- 查看详情按钮 -->
        <button @click="$emit('view-details', result.id)"
                class="bg-blue500 text-white px-[12px] py-[8px] rounded-md hover:bg-blue600 transform hover:scale-[1.05] transition duration=300 shadow-md">
          查看详情 🔍
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

button.bg-red500 {
  background-color: #ef4444; /* 红色按钮 */
}

button.bg-red600:hover {
  background-color: #dc2626; /* 悬停时的深红色 */
}
</style>
