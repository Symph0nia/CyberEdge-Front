<template>
  <nav class="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 backdrop-blur-md p-4 shadow-lg fixed w-full z-10 transition-all duration-500">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Logo区域 -->
      <div class="text-2xl font-medium text-white tracking-tight">
        🌐 CyberEdge 综合扫描器
      </div>

      <!-- 导航按钮区域 -->
      <div class="space-x-8 relative">
        <!-- 未登录状态 -->
        <template v-if="!isAuthenticated">
          <router-link to="/login" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              登录 🔐
            </button>
          </router-link>
          <router-link to="/setup-2fa" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              注册 📱
            </button>
          </router-link>
        </template>

        <!-- 登录状态 -->
        <template v-else>
          <!-- 主页按钮 -->
          <router-link to="/" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              主页 🏠
            </button>
          </router-link>

          <!-- 目标管理 -->
          <router-link to="/under-development" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              目标管理 🎯
            </button>
          </router-link>

          <!-- 攻击面搜集下拉菜单 -->
          <div class="relative group inline-block">
            <button class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 flex items-center">
              攻击面搜集 🔍
            </button>
            <div class="absolute left-0 hidden group-hover:block bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl mt-2 transition-all duration-200 transform opacity-0 group-hover:opacity-100">
              <router-link to="/subdomain-scan-results" v-slot="{ navigate }">
                <button @click="navigate" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 rounded-t-lg transition-colors duration-200">
                  子域名发现 🌐
                </button>
              </router-link>
              <router-link to="/port-scan-results" v-slot="{ navigate }">
                <button @click="navigate" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 rounded-b-lg transition-colors duration-200">
                  端口扫描 ⚓
                </button>
              </router-link>
            </div>
          </div>

          <!-- 攻击面刻画下拉菜单 -->
          <div class="relative group inline-block">
            <button class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 flex items-center">
              攻击面刻画 📂
            </button>
            <div class="absolute left-0 hidden group-hover:block bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl mt-2 transition-all duration-200 transform opacity-0 group-hover:opacity-100">
              <router-link to="/path-scan-results" v-slot="{ navigate }">
                <button @click="navigate" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 rounded-t-lg transition-colors duration-200">
                  路径扫描 🛤️
                </button>
              </router-link>
              <router-link to="/under-development" v-slot="{ navigate }">
                <button @click="navigate" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 rounded-b-lg transition-colors duration-200">
                  指纹识别 🧩
                </button>
              </router-link>
            </div>
          </div>

          <!-- 攻击面渗透下拉菜单 -->
          <div class="relative group inline-block">
            <button class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 flex items-center">
              攻击面渗透 🔒
            </button>
            <div class="absolute left-0 hidden group-hover:block bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl mt-2 transition-all duration-200 transform opacity-0 group-hover:opacity-100">
              <router-link to="/under-development" v-slot="{ navigate }">
                <button @click="navigate" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 rounded-t-lg transition-colors duration-200">
                  漏洞扫描 🔍
                </button>
              </router-link>
              <router-link to="/under-development" v-slot="{ navigate }">
                <button @click="navigate" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700/50 rounded-b-lg transition-colors duration-200">
                  漏洞利用 ⚠️
                </button>
              </router-link>
            </div>
          </div>

          <!-- 系统配置 -->
          <router-link to="/system-configuration" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              系统配置 ⚙️
            </button>
          </router-link>

          <!-- 用户管理 -->
          <router-link to="/user-management" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              用户管理 👤
            </button>
          </router-link>

          <!-- 综合扫描 -->
          <router-link to="/under-development" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              综合扫描 ⚡
            </button>
          </router-link>

          <!-- 登出按钮 -->
          <button
              @click="handleLogout"
              class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
          >
            登出 🚪
          </button>
        </template>
      </div>
    </div>

    <!-- 通知组件 -->
    <PopupNotification
        v-if="showNotification"
        :message="notificationMessage"
        :emoji="notificationEmoji"
        :type="notificationType"
        @close="showNotification = false"
    />
  </nav>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import PopupNotification from './Utils/PopupNotification.vue'

export default {
  name: 'HeaderPage',
  components: {
    PopupNotification
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const showNotification = ref(false)
    const notificationMessage = ref('')
    const notificationEmoji = ref('')
    const notificationType = ref('success')

    const handleLogout = async () => {
      await store.dispatch('logout')

      notificationMessage.value = '登出成功！期待您的再次访问！'
      notificationEmoji.value = '👋'
      notificationType.value = 'success'
      showNotification.value = true

      // 使用 setTimeout 延迟 1.5 秒后跳转
      setTimeout(() => {
        router.push({ name: 'Home' })
      }, 1500)
    }

    return {
      isAuthenticated: computed(() => store.state.isAuthenticated),
      handleLogout,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType
    }
  }
}
</script>

<style scoped>
/* 样式调整 */
.group:hover .group-hover\:block {
  display: block;
}
</style>
