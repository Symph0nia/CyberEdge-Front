<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 用户列表 -->
      <div class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl mb-8
                  border border-gray-700/30">
        <h2 class="text-xl font-medium tracking-wide mb-6">用户管理</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
            <tr>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400 border-b border-gray-700/50">用户名</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400 border-b border-gray-700/50">登录次数</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400 border-b border-gray-700/50">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="user in users"
                :key="user.account"
                class="border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors duration-200">
              <td class="py-3 px-4 text-sm text-gray-200">{{ user.account }}</td>
              <td class="py-3 px-4 text-sm text-gray-200">{{ user.loginCount }}</td>
              <td class="py-3 px-4">
                <button
                    @click="handleDelete(user.account)"
                    class="px-4 py-2 rounded-xl text-sm font-medium
                           bg-red-500/50 hover:bg-red-600/50 text-red-100
                           transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  删除
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 二维码接口控制 -->
      <div class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl
                  border border-gray-700/30">
        <h2 class="text-xl font-medium tracking-wide mb-6">系统配置</h2>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-300">二维码接口状态</span>
          <!-- 苹果风格的开关 -->
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
import { ref, onMounted } from 'vue'
import api from '../../api/axiosInstance'
import HeaderPage from '../HeaderPage.vue'
import FooterPage from '../FooterPage.vue'
import PopupNotification from '../Utils/PopupNotification.vue'
import ConfirmDialog from '../Utils/ConfirmDialog.vue'
import { useNotification } from '../../composables/useNotification'
import { useConfirmDialog } from '../../composables/useConfirmDialog'

export default {
  name: 'UserManagement',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    ConfirmDialog
  },
  setup() {
    const users = ref([])
    const qrcodeEnabled = ref(false)

    // 使用新的通知钩子
    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError
    } = useNotification()

    // 使用新的确认对话框钩子
    const {
      showDialog,
      dialogTitle,
      dialogMessage,
      dialogType,
      confirm,
      handleConfirm,
      handleCancel
    } = useConfirmDialog()

    // 获取用户列表
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        users.value = response.data
      } catch (error) {
        showError('获取用户列表失败')
      }
    }

    // 删除用户
    const handleDelete = async (account) => {
      try {
        const confirmed = await confirm({
          title: '确认删除',
          message: `是否确认删除用户 ${account}？此操作不可撤销。`,
          type: 'danger'
        })

        if (confirmed) {
          await api.delete(`/users/${account}`)
          await fetchUsers()
          showSuccess(`已删除用户 ${account}`)
        }
      } catch (error) {
        showError(`删除用户 ${account} 失败`)
      }
    }

    // 切换二维码接口状态
    const toggleQRCodeStatus = async () => {
      try {
        await api.post('/auth/qrcode/status', {
          enabled: !qrcodeEnabled.value
        })
        qrcodeEnabled.value = !qrcodeEnabled.value
        showSuccess('已更新二维码接口状态')
      } catch (error) {
        showError('更新二维码接口状态失败')
      }
    }

    // 获取二维码接口状态
    const getQRCodeStatus = async () => {
      try {
        const response = await api.get('/auth/qrcode/status')
        qrcodeEnabled.value = response.data.enabled
      } catch (error) {
        showError('获取二维码接口状态失败')
      }
    }

    onMounted(() => {
      fetchUsers()
      getQRCodeStatus()
    })

    return {
      users,
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
      toggleQRCodeStatus
    }
  }
}
</script>

<style scoped>
/* 移除了之前的动画和滑块样式，使用更简洁的过渡效果 */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* 确保表格在小屏幕上可以滚动 */
.overflow-x-auto {
  -webkit-overflow-scrolling: touch;
}

/* 自定义滚动条 */
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
