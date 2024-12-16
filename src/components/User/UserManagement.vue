<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 用户列表 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl mb-8 border border-gray-700/30"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-medium tracking-wide">
            <i class="ri-user-settings-line mr-2"></i>
            用户管理
          </h2>
          <!-- 批量删除按钮 -->
          <button
            v-if="selectedUsers.length > 0"
            @click="handleBatchDelete"
            class="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/50 hover:bg-red-600/50 text-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <i class="ri-delete-bin-line mr-2"></i>
            批量删除 ({{ selectedUsers.length }})
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr>
                <th
                  class="text-left py-3 px-4 text-sm font-medium text-gray-400 border-b border-gray-700/50"
                >
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="rounded border-gray-600 text-blue-500 focus:ring-blue-500/50 bg-gray-700/50"
                  />
                </th>
                <th
                  class="text-left py-3 px-4 text-sm font-medium text-gray-400 border-b border-gray-700/50"
                >
                  用户名
                </th>
                <th
                  class="text-left py-3 px-4 text-sm font-medium text-gray-400 border-b border-gray-700/50"
                >
                  登录次数
                </th>
                <th
                  class="text-left py-3 px-4 text-sm font-medium text-gray-400 border-b border-gray-700/50"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.account"
                class="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200"
              >
                <td class="py-3 px-4">
                  <input
                    type="checkbox"
                    v-model="selectedUsers"
                    :value="user.account"
                    class="rounded border-gray-600 text-blue-500 focus:ring-blue-500/50 bg-gray-700/50"
                  />
                </td>
                <td class="py-3 px-4 text-sm text-gray-200">
                  {{ user.account }}
                </td>
                <td class="py-3 px-4 text-sm text-gray-200">
                  <i class="ri-login-circle-line mr-2"></i>
                  {{ user.loginCount }}
                </td>
                <td class="py-3 px-4">
                  <button
                    @click="handleDelete(user.account)"
                    class="px-4 py-2 rounded-xl text-sm font-medium bg-red-500/50 hover:bg-red-600/50 text-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  >
                    <i class="ri-delete-bin-line mr-2"></i>
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 二维码接口控制 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <h2 class="text-xl font-medium tracking-wide mb-6">
          <i class="ri-settings-3-line mr-2"></i>
          系统配置
        </h2>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-300">
            <i class="ri-qr-code-line mr-2"></i>
            二维码接口状态
          </span>
          <button
            @click="toggleQRCodeStatus"
            class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none"
            :class="qrcodeEnabled ? 'bg-blue-500/50' : 'bg-gray-600/50'"
          >
            <span
              class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
              :class="qrcodeEnabled ? 'transform translate-x-6' : ''"
            ></span>
          </button>
        </div>
      </div>
    </div>

    <FooterPage />

    <!-- 通知和确认对话框组件 -->
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
import { ref, computed, onMounted } from "vue";
import api from "../../api/axiosInstance";
import HeaderPage from "../HeaderPage.vue";
import FooterPage from "../FooterPage.vue";
import PopupNotification from "../Utils/PopupNotification.vue";
import ConfirmDialog from "../Utils/ConfirmDialog.vue";
import { useNotification } from "../../composables/useNotification";
import { useConfirmDialog } from "../../composables/useConfirmDialog";

export default {
  name: "UserManagement",
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    ConfirmDialog,
  },
  setup() {
    const users = ref([]);
    const selectedUsers = ref([]);
    const qrcodeEnabled = ref(false);

    // 使用新的通知钩子
    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError,
    } = useNotification();

    // 使用新的确认对话框钩子
    const {
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      confirm,
      handleConfirm,
      handleCancel,
    } = useConfirmDialog();

    // 获取用户列表
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        users.value = response.data;
      } catch (error) {
        showError("获取用户列表失败");
      }
    };

    // 批量删除用户
    const handleBatchDelete = async () => {
      if (selectedUsers.value.length === 0) return;

      try {
        const confirmed = await confirm({
          title: "确认批量删除",
          message: `是否确认删除选中的 ${selectedUsers.value.length} 个用户？此操作不可撤销。`,
          type: "danger",
        });

        if (confirmed) {
          const response = await api.delete("/users", {
            data: { accounts: selectedUsers.value },
          });

          // 处理删除结果
          const result = response.data.result;
          if (result.success.length > 0) {
            showSuccess(`成功删除 ${result.success.length} 个用户`);
          }

          if (Object.keys(result.failed).length > 0) {
            const failedCount = Object.keys(result.failed).length;
            showError(`${failedCount} 个用户删除失败`);
          }

          // 清空选择并刷新列表
          selectedUsers.value = [];
          await fetchUsers();
        }
      } catch (error) {
        showError("批量删除用户失败");
      }
    };

    // 单个删除用户的逻辑修改
    const handleDelete = async (account) => {
      try {
        const confirmed = await confirm({
          title: "确认删除",
          message: `是否确认删除用户 ${account}？此操作不可撤销。`,
          type: "danger",
        });

        if (confirmed) {
          const response = await api.delete("/users", {
            data: { accounts: [account] },
          });

          const result = response.data.result;
          if (result.success.includes(account)) {
            showSuccess(`已删除用户 ${account}`);
          } else {
            showError(`删除用户 ${account} 失败：${result.failed[account]}`);
          }

          await fetchUsers();
        }
      } catch (error) {
        showError(`删除用户 ${account} 失败`);
      }
    };

    // 切换二维码接口状态
    const toggleQRCodeStatus = async () => {
      try {
        await api.post("/auth/qrcode/status", {
          enabled: !qrcodeEnabled.value,
        });
        qrcodeEnabled.value = !qrcodeEnabled.value;
        showSuccess("已更新二维码接口状态");
      } catch (error) {
        showError("更新二维码接口状态失败");
      }
    };

    // 获取二维码接口状态
    const getQRCodeStatus = async () => {
      try {
        const response = await api.get("/auth/qrcode/status");
        qrcodeEnabled.value = response.data.enabled;
      } catch (error) {
        showError("获取二维码接口状态失败");
      }
    };

    const isAllSelected = computed(() => {
      return (
        users.value.length > 0 &&
        selectedUsers.value.length === users.value.length
      );
    });

    // 切换全选状态
    const toggleSelectAll = () => {
      if (isAllSelected.value) {
        selectedUsers.value = [];
      } else {
        selectedUsers.value = users.value.map((user) => user.account);
      }
    };

    onMounted(() => {
      fetchUsers();
      getQRCodeStatus();
    });

    return {
      users,
      selectedUsers,
      isAllSelected,
      qrcodeEnabled,
      showNotification,
      notificationMessage,
      notificationType,
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      handleConfirm,
      handleCancel,
      handleDelete,
      handleBatchDelete,
      toggleSelectAll,
      toggleQRCodeStatus,
    };
  },
};
</script>
