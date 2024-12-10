<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 主要内容卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <!-- 标题和基本信息 -->
        <div class="space-y-6 mb-8">
          <h2 class="text-xl font-medium tracking-wide text-gray-200">
            扫描详情
          </h2>

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
                {{
                  scanResult
                    ? new Date(scanResult.Timestamp).toLocaleString()
                    : ""
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- 批量操作按钮 -->
        <div class="flex space-x-3 mb-6">
          <button
            @click="resolveIPs(selectedSubdomains)"
            :disabled="selectedSubdomains.length === 0 || isResolving"
            class="action-button"
            :class="[
              selectedSubdomains.length === 0 || isResolving
                ? 'bg-gray-700/50 text-gray-400'
                : 'bg-blue-500/50 hover:bg-blue-600/50 text-blue-100',
            ]"
          >
            {{ isResolving ? "正在解析..." : "解析选中IP" }}
          </button>

          <!-- 新增的批量HTTPX探测按钮 -->
          <button
            @click="probeHosts(selectedSubdomains)"
            :disabled="selectedSubdomains.length === 0 || isProbing"
            class="action-button"
            :class="[
              selectedSubdomains.length === 0 || isProbing
                ? 'bg-gray-700/50 text-gray-400'
                : 'bg-purple-500/50 hover:bg-purple-600/50 text-purple-100',
            ]"
          >
            {{ isProbing ? "正在探测..." : "HTTPX探测" }}
          </button>

          <button
            @click="sendToPortScan(selectedSubdomains)"
            :disabled="selectedSubdomains.length === 0"
            class="action-button"
            :class="[
              selectedSubdomains.length === 0
                ? 'bg-gray-700/50 text-gray-400'
                : 'bg-yellow-500/50 hover:bg-yellow-600/50 text-yellow-100',
            ]"
          >
            发送到端口扫描
          </button>
        </div>

        <!-- 子域名表格 -->
        <div class="relative overflow-x-auto rounded-xl">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-700/50">
                <th class="py-4 px-6 text-left">
                  <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    v-model="selectAll"
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
                v-for="subdomain in subdomains"
                :key="subdomain.id"
                class="border-b border-gray-700/30 transition-colors duration-200"
                :class="[
                  subdomain.isFirstIP
                    ? 'bg-blue-900/20'
                    : 'hover:bg-gray-700/20',
                  subdomain.isFirstIP
                    ? 'border-blue-500/30'
                    : 'border-gray-700/30',
                ]"
              >
                <td class="py-4 px-6">
                  <input
                    type="checkbox"
                    v-model="selectedSubdomains"
                    :value="subdomain.id"
                    class="rounded border-gray-700/50 bg-gray-900/50 text-blue-500/50 focus:ring-blue-500/30"
                  />
                </td>
                <td class="py-4 px-6 text-sm text-gray-200">
                  {{ subdomain.id }}
                </td>
                <td class="py-4 px-6 text-sm">
                  <div class="flex items-center gap-2">
                    <span class="text-gray-200">{{ subdomain.domain }}</span>
                    <button
                        @click="copyToClipboard(subdomain.domain)"
                        class="text-gray-400 hover:text-gray-200 transition-colors"
                        title="复制域名"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                </td>

                <td class="py-4 px-6 text-sm">
                  <div v-if="subdomain.ip" class="flex items-center gap-2">
                    <span
                      :class="[
                        'text-gray-200',
                        subdomain.isFirstIP ? 'font-medium' : '',
                      ]"
                    >
                      {{ subdomain.ip }}
                    </span>
                    <button
                      @click="copyToClipboard(subdomain.ip)"
                      class="text-gray-400 hover:text-gray-200 transition-colors"
                      title="复制IP"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                    </button>
                  </div>
                  <button
                    v-else
                    @click="resolveIPs(subdomain)"
                    class="text-xs px-3 py-1.5 rounded-xl bg-blue-500/50 hover:bg-blue-600/50 text-blue-100 transition-all duration-200"
                  >
                    解析IP
                  </button>
                </td>
                <td class="py-4 px-6 text-sm">
                  <span
                    v-if="subdomain.httpStatus"
                    :class="[
                      'px-2 py-1 rounded-full text-xs font-medium',
                      getHttpStatusClass(subdomain.httpStatus),
                    ]"
                  >
                    {{ subdomain.httpStatus }}
                  </span>
                  <button
                    v-else
                    @click="probeHosts(subdomain)"
                    class="text-xs px-3 py-1.5 rounded-xl bg-purple-500/50 hover:bg-purple-600/50 text-purple-100 transition-all duration-200"
                  >
                    探测
                  </button>
                </td>
                <td
                  class="py-4 px-6 text-sm text-gray-200 truncate max-w-xs"
                  :title="subdomain.httpTitle"
                >
                  {{ subdomain.httpTitle || "-" }}
                </td>
                <td class="py-4 px-6">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="
                      subdomain.is_read
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    "
                  >
                    {{ subdomain.is_read ? "已读" : "未读" }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex space-x-2">
                    <button
                      @click="toggleReadStatus(subdomain)"
                      class="table-action-button"
                      :class="
                        subdomain.is_read
                          ? 'bg-gray-700/50 text-gray-300'
                          : 'bg-green-500/50 text-green-100'
                      "
                    >
                      {{ subdomain.is_read ? "标为未读" : "标为已读" }}
                    </button>
                    <button
                      @click="sendToPortScan(subdomain)"
                      :disabled="!subdomain.ip"
                      class="table-action-button"
                      :class="[
                        subdomain.ip
                          ? 'bg-yellow-500/50 text-yellow-100 hover:bg-yellow-600/50'
                          : 'bg-gray-700/50 text-gray-400',
                      ]"
                    >
                      端口扫描
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 错误提示 -->
        <div
          v-if="errorMessage"
          class="mt-4 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30"
        >
          <p class="text-sm text-red-400">{{ errorMessage }}</p>
        </div>
      </div>
    </div>

    <FooterPage />

    <!-- 通知组件 -->
    <PopupNotification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />

    <!-- 确认对话框 -->
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

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderPage from "../HeaderPage.vue";
import FooterPage from "../FooterPage.vue";
import PopupNotification from "../Utils/PopupNotification.vue";
import ConfirmDialog from "../Utils/ConfirmDialog.vue";
import { useSubdomainScan } from "../../composables/useSubdomainScan";

const route = useRoute();

// 表头配置
const tableHeaders = [
  "子域名ID",
  "子域名",
  "IP地址",
  "HTTP状态",
  "标题",
  "状态",
  "操作",
];

// 从组合式函数中解构所需的状态和方法
const {
  // 状态数据
  scanResult,
  errorMessage,
  subdomains,
  selectedSubdomains,
  selectAll,
  isResolving,
  isProbing,

  // UI状态
  showNotification,
  notificationMessage,
  notificationType,
  showDialog,
  dialogTitle,
  dialogMessage,
  dialogType,

  // 方法
  fetchScanResult,
  toggleSelectAll,
  toggleReadStatus,
  resolveIPs,
  sendToPortScan,
  probeHosts,
  handleConfirm,
  handleCancel,
  getHttpStatusClass,
  copyToClipboard,
} = useSubdomainScan();

// 初始化加载
onMounted(() => {
  fetchScanResult(route.params.id);
});
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

.action-button {
  @apply px-4 py-2.5 rounded-xl text-sm font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-opacity-50
  disabled:opacity-50 disabled:cursor-not-allowed;
}

.table-action-button {
  @apply px-3 py-1.5 rounded-xl text-xs font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-opacity-50
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
