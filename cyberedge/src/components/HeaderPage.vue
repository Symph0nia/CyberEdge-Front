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
            <button
                @click="toggleDropdown('collection')"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 flex items-center"
            >
              攻击面搜集 🔍
            </button>
            <div
                v-show="dropdowns.collection"
                class="absolute left-0 bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl mt-2 transition-all duration-200"
            >
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
            <button
                @click="toggleDropdown('characterization')"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 flex items-center"
            >
              攻击面刻画 📂
            </button>
            <div
                v-show="dropdowns.characterization"
                class="absolute left-0 bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl mt-2 transition-all duration-200"
            >
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
            <button
                @click="toggleDropdown('penetration')"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 flex items-center"
            >
              攻击面渗透 🔒
            </button>
            <div
                v-show="dropdowns.penetration"
                class="absolute left-0 bg-gray-800/90 backdrop-blur-md text-white rounded-lg shadow-xl mt-2 transition-all duration-200"
            >
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

          <!-- 任务管理 -->
          <router-link to="/task-management" v-slot="{ navigate }">
            <button
                @click="navigate"
                class="text-sm font-medium text-gray-200 hover:text-white transition-all duration-300"
            >
              任务管理 📋
            </button>
          </router-link>

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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
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

    // 通知相关的状态
    const showNotification = ref(false)
    const notificationMessage = ref('')
    const notificationEmoji = ref('')
    const notificationType = ref('success')

    // 下拉菜单的状态
    const dropdowns = ref({
      collection: false,
      characterization: false,
      penetration: false
    })

    // 切换下拉菜单
    const toggleDropdown = (menu) => {
      // 阻止事件冒泡
      event?.stopPropagation()

      Object.keys(dropdowns.value).forEach(key => {
        if (key !== menu) {
          dropdowns.value[key] = false
        }
      })
      dropdowns.value[menu] = !dropdowns.value[menu]
    }

    // 关闭所有下拉菜单
    const closeAllDropdowns = () => {
      Object.keys(dropdowns.value).forEach(key => {
        dropdowns.value[key] = false
      })
    }

    // 登出处理
    const handleLogout = async () => {
      await store.dispatch('logout')
      notificationMessage.value = '登出成功！期待您的再次访问！'
      notificationEmoji.value = '👋'
      notificationType.value = 'success'
      showNotification.value = true

      setTimeout(() => {
        router.push({ name: 'Home' })
      }, 1500)
    }

    // 修改点击外部处理函数
    const handleClickOutside = (e) => {
      // 如果点击的是按钮本身，不处理
      if (e.target.closest('button')) return

      // 如果点击的不是下拉菜单区域，则关闭所有下拉菜单
      if (!e.target.closest('.relative.group')) {
        closeAllDropdowns()
      }
    }

    // 组件挂载时添加事件监听
    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    // 组件卸载前移除事件监听
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      isAuthenticated: computed(() => store.state.isAuthenticated),
      handleLogout,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType,
      dropdowns,
      toggleDropdown
    }
  }
}
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
