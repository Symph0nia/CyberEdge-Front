<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 主要内容卡片 -->
      <div class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl
                  border border-gray-700/30">
        <!-- 标题和基本信息 -->
        <div class="space-y-6 mb-8">
          <h2 class="text-xl font-medium tracking-wide text-gray-200">端口扫描详情</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-1">
              <p class="text-sm text-gray-400">扫描ID</p>
              <p class="text-sm text-gray-200">{{ scanResult?.id }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-400">目标地址</p>
              <p class="text-sm text-gray-200">{{ scanResult?.Target }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-400">扫描时间</p>
              <p class="text-sm text-gray-200">
                {{ scanResult ? formatDate(scanResult.Timestamp) : '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- 批量操作按钮 -->
        <button
            @click="sendSelectedToPathScan"
            :disabled="selectedPorts.length === 0"
            class="px-4 py-2.5 rounded-xl text-sm font-medium
                 transition-all duration-200
                 focus:outline-none focus:ring-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="[
            selectedPorts.length === 0
              ? 'bg-gray-700/50 text-gray-400'
              : 'bg-purple-500/50 hover:bg-purple-600/50 text-purple-100'
          ]"
        >
          发送选中端口到路径扫描
        </button>

        <!-- 端口信息表格 -->
        <div class="mt-8">
          <div class="relative overflow-x-auto rounded-xl">
            <table class="w-full">
              <thead>
              <tr class="border-b border-gray-700/50">
                <th class="py-4 px-6 text-left">
                  <input
                      type="checkbox"
                      @change="toggleSelectAll"
                      v-model="selectAll"
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
              <tr v-for="port in filteredPorts"
                  :key="getPortValue(port, '_id')"
                  class="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200">
                <td class="py-4 px-6">
                  <input
                      type="checkbox"
                      v-model="selectedPorts"
                      :value="getPortValue(port, '_id')"
                      class="rounded border-gray-700/50 bg-gray-900/50
                             text-blue-500/50 focus:ring-blue-500/30"
                  />
                </td>
                <td class="py-4 px-6 text-sm text-gray-200">{{ getPortValue(port, '_id') }}</td>
                <td class="py-4 px-6 text-sm text-gray-200">{{ getPortValue(port, 'number') }}</td>
                <td class="py-4 px-6 text-sm text-gray-200">{{ getPortValue(port, 'protocol') }}</td>
                <td class="py-4 px-6 text-sm text-gray-200">{{ getPortValue(port, 'service') }}</td>
                <td class="py-4 px-6 text-sm text-gray-200">{{ getPortValue(port, 'banner') }}</td>
                <td class="py-4 px-6 text-sm text-gray-200">{{ getPortValue(port, 'fingerprints') || '-' }}</td>
                <td class="py-4 px-6 text-sm text-gray-200">{{ getPortValue(port, 'paths') || '-' }}</td>
                <td class="py-4 px-6">
                    <span
                        class="px-2 py-1 rounded-full text-xs font-medium"
                        :class="getPortValue(port, 'is_read') ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'"
                    >
                      {{ getPortValue(port, 'is_read') ? '已读' : '未读' }}
                    </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex space-x-2">
                    <button
                        @click="toggleReadStatus(port)"
                        class="table-action-button"
                        :class="getPortValue(port, 'is_read') ? 'bg-gray-700/50 text-gray-300' : 'bg-green-500/50 text-green-100'"
                    >
                      {{ getPortValue(port, 'is_read') ? '标为未读' : '标为已读' }}
                    </button>
                    <button
                        @click="sendToPathScan(port)"
                        class="table-action-button bg-blue-500/50 text-blue-100"
                    >
                      路径扫描
                    </button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="errorMessage"
             class="mt-4 px-4 py-2 rounded-xl
                    bg-red-500/20 border border-red-500/30">
          <p class="text-sm text-red-400">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <FooterPage />

    <!-- 通知和确认对话框 -->
    <PopupNotification
        v-if="showNotification"
        :message="notificationMessage"
        :type="notificationType"
        @close="showNotification = false"
    />

    <ConfirmDialog
        :show="showDialog"
        :title="dialogTitle"
        :message="dialogMessage"
        :type="dialogType"
        @confirm="handleConfirm"
        @cancel="handleCancel"
    />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePortScanDetail } from '../../composables/usePortScanDetail'
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'
import PopupNotification from '../Utils/PopupNotification.vue'
import ConfirmDialog from '../Utils/ConfirmDialog.vue'

export default {
  name: 'PortScanDetail',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    ConfirmDialog
  },
  setup() {
    const route = useRoute()

    const tableHeaders = [
      '端口ID',
      '端口号',
      '协议',
      '服务',
      'Banner',
      '指纹',
      '路径',
      '状态',
      '操作'
    ]

    const formatDate = (timestamp) => {
      return new Date(timestamp).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 使用 usePortScanDetail 中的所有功能
    const {
      // 基础数据
      scanResult,
      errorMessage,
      selectedPorts,
      selectAll,
      filteredPorts,

      // 方法
      getPortValue,
      toggleReadStatus,
      toggleSelectAll,
      sendToPathScan,
      sendSelectedToPathScan,
      fetchScanResult,

      // 通知状态和方法
      showNotification,
      notificationMessage,
      notificationType,

      // 确认对话框状态和方法
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      handleConfirm,
      handleCancel
    } = usePortScanDetail()

    // 在组件挂载时获取数据
    onMounted(() => {
      fetchScanResult(route.params.id)
    })

    return {
      // 基础数据
      scanResult,
      errorMessage,
      selectedPorts,
      selectAll,
      filteredPorts,
      tableHeaders,

      // 工具方法
      formatDate,
      getPortValue,

      // 操作方法
      toggleReadStatus,
      toggleSelectAll,
      sendToPathScan,
      sendSelectedToPathScan,

      // 通知相关
      showNotification,
      notificationMessage,
      notificationType,

      // 确认对话框相关
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      handleConfirm,
      handleCancel
    }
  }
}
</script>

<style scoped>
.table-action-button {
  @apply px-3 py-1.5 rounded-xl text-xs font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-opacity-50;
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

.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>
