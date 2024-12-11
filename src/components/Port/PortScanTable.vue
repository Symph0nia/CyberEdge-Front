<template>
  <div class="space-y-6">
    <!-- 表格 -->
    <div v-if="portScanResults?.length > 0">
      <div class="relative overflow-x-auto rounded-xl">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-700/50">
              <th class="py-4 px-6 text-left">
                <input
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="isAllSelected"
                  class="rounded border-gray-700/50 bg-gray-900/50 text-blue-500/50 focus:ring-blue-500/30"
                />
              </th>
              <th
                v-for="header in tableHeaders"
                :key="header"
                class="py-4 px-6 text-left text-sm font-medium text-gray-400"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="result in portScanResults"
              :key="result.id"
              class="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200"
            >
              <td class="py-4 px-6">
                <input
                  type="checkbox"
                  v-model="selectedResults"
                  :value="result.id"
                  class="rounded border-gray-700/50 bg-gray-900/50 text-blue-500/50 focus:ring-blue-500/30"
                />
              </td>
              <td class="py-4 px-6 text-sm text-gray-200">{{ result.id }}</td>
              <td class="py-4 px-6 text-sm text-gray-200">
                {{ result.target }}
              </td>
              <td class="py-4 px-6 text-sm text-gray-200">
                {{ formatDate(result.timestamp) }}
              </td>
              <td class="py-4 px-6 text-sm text-gray-200">
                {{ getPortCount(result) }} 个端口
              </td>
              <td class="py-4 px-6">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="
                    result.is_read
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-yellow-500/20 text-yellow-300'
                  "
                >
                  {{ result.is_read ? "已读" : "未读" }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex space-x-2">
                  <button
                    @click="handleViewDetails(result.id)"
                    class="action-button bg-blue-500/50 text-blue-100 flex items-center justify-center"
                  >
                    <i class="ri-eye-line mr-1"></i>
                    查看
                  </button>
                  <button
                    @click="handleToggleRead(result)"
                    class="action-button flex items-center justify-center"
                    :class="
                      result.is_read
                        ? 'bg-gray-700/50 text-gray-300'
                        : 'bg-green-500/50 text-green-100'
                    "
                  >
                    <i
                      :class="[
                        result.is_read ? 'ri-eye-off-line' : 'ri-eye-line',
                        'mr-1',
                      ]"
                    ></i>
                    {{ result.is_read ? "标为未读" : "标为已读" }}
                  </button>
                  <button
                    @click="handleDelete(result.id)"
                    class="action-button bg-red-500/50 text-red-100 flex items-center justify-center"
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

      <!-- 所有扫描页面统一使用这个样式 -->
      <div class="flex space-x-3 mt-6">
        <button
          @click="handleBatchRead"
          :disabled="!hasSelected"
          class="batch-button flex items-center justify-center"
          :class="[
            !hasSelected
              ? 'bg-gray-700/50 text-gray-400'
              : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-200',
          ]"
        >
          <i class="ri-eye-line mr-2"></i>
          标记选中项为已读
        </button>
        <button
          @click="handleBatchDelete"
          :disabled="!hasSelected"
          class="batch-button flex items-center justify-center"
          :class="[
            !hasSelected
              ? 'bg-gray-700/50 text-gray-400'
              : 'bg-red-500/50 hover:bg-red-600/50 text-red-100',
          ]"
        >
          <i class="ri-delete-bin-line mr-2"></i>
          删除选中项
        </button>
      </div>
    </div>

    <!-- 空状态占位符 -->
    <div
      v-else
      class="flex flex-col items-center justify-center py-24 my-8 bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/30"
    >
      <div class="text-gray-600 text-6xl mb-6">
        <i class="ri-search-2-line"></i>
      </div>
      <span class="text-xl text-gray-400 mb-4">暂无扫描结果</span>
      <p class="text-gray-500 mb-6 text-center max-w-md">
        当前还没有端口扫描结果，请在目标管理中创建扫描任务
      </p>
      <router-link to="/target-management">
        <button
          class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 flex items-center"
        >
          <i class="ri-add-line mr-2"></i>
          前往创建扫描任务
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  name: "PortScanTable",
  props: {
    portScanResults: {
      type: Array,
      required: true,
      default: () => [], // 添加默认值
    },
  },
  emits: [
    "view-details",
    "delete-result",
    "delete-selected",
    "toggle-read-status",
    "mark-selected-read",
  ],
  setup(props, { emit }) {
    const tableHeaders = [
      "扫描ID",
      "目标地址",
      "时间戳",
      "端口数量",
      "状态",
      "操作",
    ];

    const selectedResults = ref([]);

    // 添加空值检查
    const hasSelected = computed(() => selectedResults.value?.length > 0);
    const isAllSelected = computed(() => {
      if (!props.portScanResults?.length) return false;
      return selectedResults.value.length === props.portScanResults.length;
    });

    const formatDate = (timestamp) => {
      if (!timestamp) return "-";
      try {
        return new Date(timestamp).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "-";
      }
    };

    // 添加空值检查
    const getPortCount = (result) => {
      if (!result?.data) return 0;
      let portCount = 0;
      try {
        result.data.forEach((portGroup) => {
          if (portGroup?.Key === "ports" && Array.isArray(portGroup.Value)) {
            portCount += portGroup.Value.length;
          }
        });
      } catch {
        return 0;
      }
      return portCount;
    };

    const toggleSelectAll = () => {
      if (!props.portScanResults?.length) return;
      selectedResults.value = isAllSelected.value
        ? []
        : props.portScanResults.map((result) => result?.id).filter(Boolean);
    };

    const handleViewDetails = (id) => {
      if (!id) return;
      emit("view-details", id);
    };

    const handleDelete = (result) => {
      if (!result?.id) return;
      emit("delete-result", result.id);
    };

    const handleToggleRead = (result) => {
      if (!result?.id) return;
      emit("toggle-read-status", result.id, !result.is_read);
    };

    const handleBatchDelete = () => {
      if (!selectedResults.value?.length) return;
      emit("delete-selected", selectedResults.value);
      selectedResults.value = [];
    };

    const handleBatchRead = () => {
      if (!selectedResults.value?.length) return;
      emit("mark-selected-read", selectedResults.value);
      selectedResults.value = [];
    };

    // 监听 props 变化，重置选中状态
    watch(
      () => props.portScanResults,
      () => {
        selectedResults.value = [];
      }
    );

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
      handleBatchRead,
    };
  },
};
</script>

<style scoped>
.action-button {
  @apply px-3 py-1.5 rounded-xl text-xs font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-opacity-50
  disabled:opacity-50 disabled:cursor-not-allowed;
}

.batch-button {
  @apply px-4 py-2.5 rounded-xl text-sm font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-opacity-50
  disabled:opacity-50 disabled:cursor-not-allowed;
}

/* 优化按钮点击效果 */
.batch-button:active:not(:disabled) {
  transform: scale(0.98);
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
</style>
