<template>
  <div class="min-h-screen bg-gray-900">
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 pt-24 pb-12">
      <!-- 顶部操作栏 -->
      <div class="flex flex-col sm:flex-row justify-between items-center mb-10">
        <div class="flex items-center mb-4 sm:mb-0">
          <h1 class="text-3xl font-bold text-white">目标管理</h1>
          <span
            class="ml-4 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
          >
            共 {{ filteredTargets.length }} 个目标
          </span>
        </div>

        <div class="flex space-x-4">
          <button
            @click="openCreateDialog"
            class="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center"
          >
            <i class="ri-add-line mr-2"></i>
            新建目标
          </button>

          <button
            @click="refreshTargets"
            class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-100 transition-all duration-200 flex items-center"
            :disabled="isLoading"
          >
            <i
              class="ri-refresh-line mr-2"
              :class="{ 'animate-spin': isLoading }"
            ></i>
            {{ isLoading ? "加载中..." : "刷新" }}
          </button>
        </div>
      </div>

      <!-- 搜索和筛选区 -->
      <div class="flex flex-col md:flex-row gap-4 mb-10">
        <div class="relative flex-grow">
          <i class="ri-search-line absolute left-4 top-3 text-gray-400"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索目标名称或域名..."
            class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
          />
        </div>

        <select
          v-model="statusFilter"
          class="px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
        >
          <option value="">所有状态</option>
          <option value="active">活跃</option>
          <option value="archived">已归档</option>
        </select>
      </div>

      <!-- 目标卡片 -->
      <div
        v-for="target in filteredTargets"
        :key="target.id"
        class="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:bg-gray-750 transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:shadow-xl hover:shadow-blue-500/5 group"
      >
        <!-- 目标基本信息 -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3
              class="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors"
            >
              {{ target.name }}
            </h3>
            <p class="text-gray-400 text-sm line-clamp-2">
              {{ target.description }}
            </p>
          </div>

          <!-- 状态标签 -->
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium flex items-center',
              target.status === 'active'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
            ]"
          >
            <span
              class="w-2 h-2 rounded-full mr-2"
              :class="
                target.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
              "
            >
            </span>
            {{ target.status === "active" ? "活跃" : "已归档" }}
          </span>
        </div>

        <!-- 目标详细信息 -->
        <div class="space-y-3 mb-6 bg-gray-900/30 p-4 rounded-lg">
          <div class="flex items-center text-gray-400">
            <i class="ri-global-line mr-2"></i>
            <span class="text-sm">{{ target.domain }}</span>
          </div>
          <div class="flex items-center text-gray-400">
            <i class="ri-time-line mr-2"></i>
            <span class="text-sm"
              >创建于 {{ formatDate(target.createdAt) }}</span
            >
          </div>
          <div class="flex items-center text-gray-400">
            <i class="ri-radar-line mr-2"></i>
            <span class="text-sm"
              >上次扫描：{{ formatDate(target.lastScanTime) }}</span
            >
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="editTarget(target)"
            class="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-600/30 text-blue-300 text-sm transition-all duration-200 flex items-center justify-center"
          >
            <i class="ri-edit-line mr-1"></i> 编辑
          </button>

          <button
            @click="startScan(target)"
            class="flex-1 px-3 py-2 rounded-lg bg-green-500/20 hover:bg-green-600/30 text-green-300 text-sm transition-all duration-200 flex items-center justify-center"
          >
            <i class="ri-scan-line mr-1"></i> 扫描
          </button>

          <button
            @click="archiveTarget(target)"
            class="flex-1 px-3 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-600/30 text-yellow-300 text-sm transition-all duration-200 flex items-center justify-center"
          >
            <i class="ri-archive-line mr-1"></i>
            {{ target.status === "active" ? "归档" : "激活" }}
          </button>

          <button
            @click="deleteTarget(target)"
            class="flex-1 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-600/30 text-red-300 text-sm transition-all duration-200 flex items-center justify-center"
          >
            <i class="ri-delete-bin-line mr-1"></i> 删除
          </button>
        </div>
      </div>

      <!-- 空状态展示 -->
      <div
        v-if="filteredTargets.length === 0"
        class="flex flex-col items-center justify-center py-24 my-8 bg-gray-800/30 rounded-xl border border-gray-700/50"
      >
        <!-- 使用图标替代图片 -->
        <div class="text-gray-600 text-6xl mb-6">
          <i class="ri-folder-unknow-line"></i>
        </div>
        <span class="text-xl text-gray-400 mb-4">暂无目标数据</span>
        <p class="text-gray-500 mb-6 text-center max-w-md">
          创建你的第一个目标开始使用系统
        </p>
        <button
          @click="openCreateDialog"
          class="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center"
        >
          <i class="ri-add-line mr-2"></i>
          创建第一个目标
        </button>
      </div>
    </div>

    <!-- 创建/编辑目标对话框 -->
    <DialogModal
      v-if="showDialog"
      :title="dialogMode === 'create' ? '新建目标' : '编辑目标'"
      @close="showDialog = false"
    >
      <!-- 表单内容 -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >目标名称</label
          >
          <input
            v-model="targetForm.name"
            type="text"
            placeholder="请输入目标名称"
            class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >目标类型</label
          >
          <select
            v-model="targetForm.type"
            class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <option value="domain">域名</option>
            <option value="ip">IP地址</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">
            {{ targetForm.type === "domain" ? "域名" : "IP地址" }}
          </label>
          <input
            v-model="targetForm.target"
            type="text"
            :placeholder="
              targetForm.type === 'domain' ? '请输入域名' : '请输入IP地址'
            "
            class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >描述</label
          >
          <textarea
            v-model="targetForm.description"
            rows="3"
            placeholder="请输入目标描述"
            class="w-full px-4 py-2 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
          ></textarea>
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDialog = false"
            class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all duration-200"
          >
            取消
          </button>
          <button
            @click="submitTargetForm"
            :disabled="isSubmitting"
            class="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? "提交中..." : "确定" }}
          </button>
        </div>
      </template>
    </DialogModal>

    <!-- 通知组件 -->
    <PopupNotification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
    />

    <!-- 确认对话框 -->
    <ConfirmDialog
      v-if="showConfirmDialog"
      :show="showConfirmDialog"
      :title="dialogTitle"
      :message="dialogMessage"
      :type="dialogType"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTargetManagement } from "@/composables/useTargetManagement";
import HeaderPage from "@/components/HeaderPage.vue";
import DialogModal from "@/components/Utils/DialogModal.vue";
import PopupNotification from "@/components/Utils/PopupNotification.vue";
import ConfirmDialog from "@/components/Utils/ConfirmDialog.vue";

// 组合式函数
const {
  targets,
  isLoading,
  isSubmitting,
  targetForm,
  dialogMode,
  showDialog,
  showNotification,
  showConfirmDialog,
  notificationMessage,
  notificationType,
  dialogTitle,
  dialogMessage,
  dialogType,

  fetchTargets,
  openCreateDialog,
  editTarget,
  deleteTarget,
  archiveTarget,
  startScan,
  submitTargetForm,
  handleConfirm,
  handleCancel,
} = useTargetManagement();

// 搜索和筛选
const searchQuery = ref("");
const statusFilter = ref("");

// 过滤后的目标列表
const filteredTargets = computed(() => {
  if (!targets.value || !Array.isArray(targets.value)) return [];

  let filtered = [...targets.value];

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (target) =>
        target.name.toLowerCase().includes(query) ||
        target.target.toLowerCase().includes(query) ||
        target.description.toLowerCase().includes(query)
    );
  }

  // 按创建时间排序（最新的在前）
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return filtered;
});

// 刷新目标列表
const refreshTargets = () => {
  fetchTargets();
};

// 格式化日期
const formatDate = (date) => {
  return new Date(date).toLocaleString();
};
</script>
