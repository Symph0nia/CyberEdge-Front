<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <HeaderPage />

    <!-- 主体内容 -->
    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <!-- 用户列表 -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-4">用户列表 📋</h2>
        <table class="min-w-full bg-gray-800">
          <thead>
          <tr>
            <th class="py-2 px-4 border-b-2 border-gray-700 text-left">用户名</th>
            <th class="py-2 px-4 border-b-2 border-gray-700 text-left">登录次数</th>
            <th class="py-2 px-4 border-b-2 border-gray-700 text-left">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.account" class="hover:bg-gray-700 transition duration-300 animate-fade-in-up">
            <td class="py-2 px-4 border-b border-gray-700">{{ user.account }}</td>
            <td class="py-2 px-4 border-b border-gray-700">{{ user.loginCount }}</td>
            <td class="py-2 px-4 border-b border-gray-700">
              <button @click="confirmDelete(user.account)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transform hover:scale-105 transition duration-300">删除 🗑️</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 二维码接口控制 -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-md transform transition-all duration-500 hover:shadow-2xl">
        <h2 class="text-2xl font-bold mb-4">二维码接口控制 🔧</h2>
        <div class="flex items-center">
          <span class="mr-4">是否开启二维码接口：</span>
          <label class="switch">
            <input type="checkbox" v-model="qrcodeEnabled" @change="updateQRCodeStatus">
            <span class="slider round"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <FooterPage />

    <!-- 弹窗通知 -->
    <PopupNotification
        v-if="showNotification"
        :message="notificationMessage"
        :emoji="notificationEmoji"
        :type="notificationType"
        @close="showNotification = false"
    />

    <!-- 确认对话框 -->
    <ConfirmDialog
        :show="showConfirmDialog"
        :title="confirmDialogTitle"
        :message="confirmDialogMessage"
        type="danger"
        @confirm="handleConfirmDelete"
        @cancel="showConfirmDialog = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../api/axiosInstance'
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'
import PopupNotification from './PopupNotification.vue'
import ConfirmDialog from './ConfirmDialog.vue'

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
    const showNotification = ref(false)
    const notificationMessage = ref('')
    const notificationEmoji = ref('')
    const notificationType = ref('success')

    // 新增的确认对话框相关状态
    const showConfirmDialog = ref(false)
    const confirmDialogTitle = ref('')
    const confirmDialogMessage = ref('')
    const userToDelete = ref(null)

    const fetchUsers = async () => {
      try {
        const response = await api.get('/users')
        users.value = response.data
      } catch (error) {
        console.error('获取用户列表失败:', error)
        showNotification.value = true
        notificationMessage.value = '获取用户列表失败'
        notificationEmoji.value = '❌'
        notificationType.value = 'error'
      }
    }

    const confirmDelete = (account) => {
      userToDelete.value = account
      confirmDialogTitle.value = '删除用户确认'
      confirmDialogMessage.value = `您确定要删除用户 ${account} 吗？此操作不可撤销。`
      showConfirmDialog.value = true
    }

    const handleConfirmDelete = () => {
      if (userToDelete.value) {
        deleteUser(userToDelete.value)
        showConfirmDialog.value = false
      }
    }

    const deleteUser = async (account) => {
      try {
        await api.delete(`/users/${account}`)
        await fetchUsers() // 重新获取用户列表
        showNotification.value = true
        notificationMessage.value = `成功删除用户 ${account}`
        notificationEmoji.value = '🗑️'
        notificationType.value = 'success'
      } catch (error) {
        console.error(`删除用户失败: ${account}`, error)
        showNotification.value = true
        notificationMessage.value = `删除用户 ${account} 失败`
        notificationEmoji.value = '❌'
        notificationType.value = 'error'
      }
    }

    const getQRCodeStatus = async () => {
      try {
        const response = await api.get('/auth/qrcode/status')
        qrcodeEnabled.value = response.data.enabled
      } catch (error) {
        console.error('获取二维码接口状态失败:', error)
        showNotification.value = true
        notificationMessage.value = '获取二维码接口状态失败'
        notificationEmoji.value = '❌'
        notificationType.value = 'error'
      }
    }

    const updateQRCodeStatus = async () => {
      try {
        await api.post('/auth/qrcode/status', {
          enabled: qrcodeEnabled.value
        })
        showNotification.value = true
        notificationMessage.value = '二维码接口状态已更新'
        notificationEmoji.value = '✅'
        notificationType.value = 'success'
      } catch (error) {
        console.error('更新二维码接口状态失败:', error)
        qrcodeEnabled.value = !qrcodeEnabled.value // 如果更新失败，恢复到之前的状态
        showNotification.value = true
        notificationMessage.value = '更新二维码接口状态失败'
        notificationEmoji.value = '❌'
        notificationType.value = 'error'
      }
    }

    onMounted(() => {
      fetchUsers()
      getQRCodeStatus()
    })

    return {
      users,
      qrcodeEnabled,
      confirmDelete,
      updateQRCodeStatus,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      showConfirmDialog,
      confirmDialogTitle,
      confirmDialogMessage,
      handleConfirmDelete
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}

/* 滑块样式 */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
