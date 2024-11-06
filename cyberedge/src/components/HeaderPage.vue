<template>
  <nav class="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-4 shadow-md fixed w-full z-10 transition-all duration-500">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-3xl font-bold text-white">🌐 CyberEdge 综合扫描器</div>
      <div class="space-x-6 relative">
        <template v-if="!isAuthenticated">
          <router-link to="/login" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105"
            >
              登录 🔐
            </button>
          </router-link>
          <router-link to="/setup-2fa" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105"
            >
              注册 📱
            </button>
          </router-link>
        </template>
        <template v-else>
          <router-link to="/" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105"
            >
              主页 🏠
            </button>
          </router-link>

          <!-- 攻击面搜集 -->
          <div class="relative group inline-block">
            <button class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105 flex items-center">
              攻击面搜集 🔍
            </button>
            <div class="absolute left-0 hidden group-hover:block bg-gray-800 text-white rounded shadow-lg mt-1 transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 origin-top">
              <router-link to="/subdomain-discovery" v-slot="{ navigate }">
                <button @click="navigate" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
                  子域名发现 🌐
                </button>
              </router-link>
              <router-link to="/port-scanning" v-slot="{ navigate }">
                <button @click="navigate" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
                  端口扫描 ⚓
                </button>
              </router-link>
            </div>
          </div>

          <!-- 攻击面刻画 -->
          <div class="relative group inline-block">
            <button class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105 flex items-center">
              攻击面刻画 📂
            </button>
            <div class="absolute left-0 hidden group-hover:block bg-gray-800 text-white rounded shadow-lg mt-1 transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 origin-top">
              <router-link to="/path-scanning" v-slot="{ navigate }">
                <button @click="navigate" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
                  路径扫描 🛤️
                </button>
              </router-link>
              <router-link to="/fingerprint-recognition" v-slot="{ navigate }">
                <button @click="navigate" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
                  指纹识别 🧩
                </button>
              </router-link>
            </div>
          </div>

          <!-- 攻击面渗透 -->
          <div class="relative group inline-block">
            <button class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105 flex items-center">
              攻击面渗透 🔒
            </button>
            <div class="absolute left-0 hidden group-hover:block bg-gray-800 text-white rounded shadow-lg mt-1 transition-all duration-300 transform scale-y-0 group-hover:scale-y-100 origin-top">
              <router-link to="/vulnerability-scanning" v-slot="{ navigate }">
                <button @click="navigate" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
                  漏洞扫描 🔍
                </button>
              </router-link>
              <router-link to="/exploitation" v-slot="{ navigate }">
                <button @click="navigate" class="block px-4 py-2 hover:bg-gray-700 flex items-center">
                  漏洞利用 ⚠️
                </button>
              </router-link>
            </div>
          </div>

          <!-- 系统管理 -->
          <router-link to="/system-config" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105"
            >
              系统配置 ⚙️
            </button>
          </router-link>

          <router-link to="/user-management" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105"
            >
              用户管理 👤
            </button>
          </router-link>

          <!-- 综合扫描 -->
          <router-link to="/comprehensive-scan" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105"
            >
              综合扫描 ⚡
            </button>
          </router-link>

          <!-- 登出 -->
          <button
              @click="handleLogout"
              class="text-white hover:text-yellow-400 transition duration-300 transform hover:scale-105"
          >
            登出 🚪
          </button>
        </template>
      </div>
    </div>

    <!-- 添加 PopupNotification 组件 -->
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
