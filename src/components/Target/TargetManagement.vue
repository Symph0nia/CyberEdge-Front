<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <!-- 顶部操作栏 -->
        <div
          class="flex flex-col sm:flex-row justify-between items-center mb-8"
        >
          <div class="flex items-center mb-4 sm:mb-0">
            <h2 class="text-xl font-medium tracking-wide text-gray-200">
              目标管理
            </h2>
            <span
              class="ml-4 px-3 py-1.5 rounded-xl bg-gray-700/50 text-gray-200 text-sm"
            >
              共 {{ filteredTargets.length }} 个目标
            </span>
          </div>

          <div class="flex space-x-4">
            <button
              @click="openCreateDialog"
              class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 flex items-center"
            >
              <i class="ri-add-line mr-2"></i>
              新建目标
            </button>

            <button
              @click="refreshTargets"
              class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 flex items-center"
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
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <div class="relative flex-grow">
            <i class="ri-search-line absolute left-4 top-3 text-gray-400"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索目标名称或域名..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
            />
          </div>

          <select
            v-model="statusFilter"
            class="px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
          >
            <option value="">所有状态</option>
            <option value="active">活跃</option>
            <option value="archived">已归档</option>
          </select>
        </div>

        <!-- 目标卡片容器 -->
        <div class="space-y-6">
          <!-- 目标卡片 -->
          <div
            v-for="target in filteredTargets"
            :key="target.id"
            class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-xl border border-gray-700/30 hover:border-gray-600/30 transition-all duration-300"
          >
            <!-- 目标基本信息 -->
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-xl font-medium text-gray-200 mb-2">
                  {{ target.name }}
                </h3>
                <p class="text-gray-400 text-sm line-clamp-2">
                  {{ target.description }}
                </p>
              </div>

              <!-- 状态标签 -->
              <span
                class="px-3 py-1.5 rounded-xl text-sm bg-gray-700/50 text-gray-200 flex items-center"
              >
                <span
                  class="w-2 h-2 rounded-full mr-2"
                  :class="
                    target.status === 'active'
                      ? 'bg-emerald-400'
                      : 'bg-gray-400'
                  "
                >
                </span>
                {{ target.status === "active" ? "活跃" : "已归档" }}
              </span>
            </div>

            <!-- 目标详细信息 -->
            <div class="space-y-4 mb-6 bg-gray-900/30 p-5 rounded-xl">
              <div class="flex items-center text-gray-400">
                <i class="ri-global-line mr-3 text-lg"></i>
                <div>
                  <span class="text-sm">目标地址</span>
                  <div class="text-gray-200 mt-0.5">{{ target.target }}</div>
                </div>
              </div>

              <div class="flex items-center text-gray-400">
                <i class="ri-time-line mr-3 text-lg"></i>
                <div>
                  <span class="text-sm">创建时间</span>
                  <div class="text-gray-200 mt-0.5">
                    {{ formatDate(target.createdAt) }}
                  </div>
                </div>
              </div>

              <div class="flex items-center text-gray-400">
                <i class="ri-radar-line mr-3 text-lg"></i>
                <div>
                  <span class="text-sm">上次更新</span>
                  <div class="text-gray-200 mt-0.5">
                    {{
                      target.updatedAt
                        ? formatDate(target.updatedAt)
                        : "未进行过扫描"
                    }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex flex-wrap gap-2">
              <button
                  @click="editTarget(target)"
                  class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-500/50 hover:bg-blue-600/50 text-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center"
              >
                <i class="ri-edit-line mr-2"></i> 编辑
              </button>

              <button
                  @click="startScan(target)"
                  class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-green-500/50 hover:bg-green-600/50 text-green-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/50 flex items-center justify-center"
              >
                <i class="ri-scan-line mr-2"></i> 扫描
              </button>

              <button
                  @click="archiveTarget(target)"
                  class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-yellow-500/50 hover:bg-yellow-600/50 text-yellow-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 flex items-center justify-center"
              >
                <i class="ri-archive-line mr-2"></i>
                {{ target.status === "active" ? "归档" : "激活" }}
              </button>

              <button
                  @click="deleteTarget(target)"
                  class="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-500/50 hover:bg-red-600/50 text-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center justify-center"
              >
                <i class="ri-delete-bin-line mr-2"></i> 删除
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态展示 -->
        <div
          v-if="filteredTargets.length === 0"
          class="flex flex-col items-center justify-center py-24 my-8 bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/30"
        >
          <div class="text-gray-600 text-6xl mb-6">
            <i class="ri-folder-unknow-line"></i>
          </div>
          <span class="text-xl text-gray-400 mb-4">暂无目标数据</span>
          <p class="text-gray-500 mb-6 text-center max-w-md">
            创建你的第一个目标开始使用系统
          </p>
          <button
            @click="openCreateDialog"
            class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 flex items-center"
          >
            <i class="ri-add-line mr-2"></i>
            创建第一个目标
          </button>
        </div>
      </div>
    </div>

    <FooterPage />

    <!-- 创建/编辑目标对话框 -->
    <DialogModal
      v-if="showDialog"
      :title="dialogMode === 'create' ? '新建目标' : '编辑目标'"
      @close="showDialog = false"
      class="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-700/30"
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
            class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1"
            >目标类型</label
          >
          <select
            v-model="targetForm.type"
            class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
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
            class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
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
            class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all duration-200"
          ></textarea>
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDialog = false"
            class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
          >
            取消
          </button>
          <button
            @click="submitTargetForm"
            :disabled="isSubmitting"
            class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
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
import FooterPage from "@/components/FooterPage.vue";

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
