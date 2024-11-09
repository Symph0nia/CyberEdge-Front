<template>
  <div class="space-y-6">
    <!-- 表格 -->
    <div class="relative overflow-x-auto rounded-xl">
      <table class="w-full">
        <thead>
        <tr class="border-b border-gray-700/50">
          <th class="py-4 px-6 text-left">
            <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="isAllSelected"
                class="rounded border-gray-700/50 bg-gray-900/50
                       text-blue-500/50 focus:ring-blue-500/30"
            />
          </th>
          <th v-for="header in tableHeaders"
              :key="header"
              class="py-4 px-6 text-left text-sm font-medium text-gray-400">
            {{ header }}
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="result in portScanResults"
            :key="result.id"
            class="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200">
          <td class="py-4 px-6">
            <input
                type="checkbox"
                v-model="selectedResults"
                :value="result.id"
                class="rounded border-gray-700/50 bg-gray-900/50
                       text-blue-500/50 focus:ring-blue-500/30"
            />
          </td>
          <td class="py-4 px-6 text-sm text-gray-200">{{ result.id }}</td>
          <td class="py-4 px-6 text-sm text-gray-200">{{ result.Target }}</td>
          <td class="py-4 px-6 text-sm text-gray-200">{{ formatDate(result.Timestamp) }}</td>
          <td class="py-4 px-6 text-sm text-gray-200">{{ getPortCount(result) }} 个端口</td>
          <td class="py-4 px-6">
              <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="result.IsRead ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'"
              >
                {{ result.IsRead ? '已读' : '未读' }}
              </span>
          </td>
          <td class="py-4 px-6">
            <div class="flex space-x-2">
              <button
                  @click="handleViewDetails(result.id)"
                  class="table-action-button bg-blue-500/50 text-blue-100"
              >
                查看
              </button>
              <button
                  @click="handleToggleRead(result)"
                  class="table-action-button"
                  :class="result.IsRead ? 'bg-gray-700/50 text-gray-300' : 'bg-green-500/50 text-green-100'"
              >
                {{ result.IsRead ? '标为未读' : '标为已读' }}
              </button>
              <button
                  @click="handleDelete(result)"
                  class="table-action-button bg-red-500/50 text-red-100"
              >
                删除
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 批量操作按钮 -->
    <div class="flex space-x-3">
      <button
          @click="handleBatchDelete"
          :disabled="!hasSelected"
          class="batch-button bg-red-500/50 hover:bg-red-600/50 text-red-100"
      >
        批量删除
      </button>
      <button
          @click="handleBatchRead"
          :disabled="!hasSelected"
          class="batch-button bg-green-500/50 hover:bg-green-600/50 text-green-100"
      >
        标记选中为已读
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'PortScanTable',
  props: {
    portScanResults: {
      type: Array,
      required: true
    }
  },
  emits: ['view-details', 'delete-result', 'delete-selected', 'toggle-read-status', 'mark-selected-read'],
  setup(props, { emit }) {
    const tableHeaders = [
      '扫描ID',
      '目标地址',
      '时间戳',
      '端口数量',
      '状态',
      '操作'
    ]

    const selectedResults = ref([])

    const hasSelected = computed(() => selectedResults.value.length > 0)
    const isAllSelected = computed(() => {
      return props.portScanResults.length > 0 &&
          selectedResults.value.length === props.portScanResults.length
    })

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getPortCount = (result) => {
      let portCount = 0
      result.Data.forEach(portGroup => {
        if (portGroup.Key === 'ports') {
          portCount += portGroup.Value.length
        }
      })
      return portCount
    }

    const toggleSelectAll = () => {
      selectedResults.value = isAllSelected.value
          ? []
          : props.portScanResults.map(result => result.id)
    }

    const handleViewDetails = (id) => emit('view-details', id)
    const handleDelete = (result) => emit('delete-result', result.id)
    const handleToggleRead = (result) => emit('toggle-read-status', result.id, !result.IsRead)
    const handleBatchDelete = () => {
      emit('delete-selected', selectedResults.value)
      selectedResults.value = []
    }
    const handleBatchRead = () => {
      emit('mark-selected-read', selectedResults.value)
      selectedResults.value = []
    }

    return {
      selectedResults,
      tableHeaders,
      hasSelected,
      isAllSelected,
      formatDate,
      getPortCount,
      toggleSelectAll,
      handleViewDetails,
      handleDelete,
      handleToggleRead,
      handleBatchDelete,
      handleBatchRead
    }
  }
}
</script>

<style scoped>
.table-action-button {
  @apply px-3 py-1.5 rounded-xl text-xs font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-opacity-50
  disabled:opacity-50 disabled:cursor-not-allowed;
}

.batch-button {
  @apply px-4 py-2.5 rounded-xl text-sm font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2
  disabled:opacity-50 disabled:cursor-not-allowed;
}

/* 自定义滚动条 */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 优化按钮点击效果 */
button:active:not(:disabled) {
  transform: scale(0.98);
}
</style>
