<template>
  <div class="flex relative">
    <LeftSidebarMenu :isVisible="isMenuVisible" />
    <div class="flex-1">
      <router-view />
    </div>

    <!-- 只有在用户已认证时显示按钮 -->
    <button
        v-if="isAuthenticated"
    @click="toggleMenu"
    class="absolute left-6 bottom-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    type="button"
    style="z-index: 2000;"
    >
    加密解密工具箱
    </button>

    <RightSidebarMenu :isVisible="isRequestToolVisible" /> <!-- 引入右侧悬浮栏 -->

    <!-- 只有在用户已认证时显示按钮 -->
    <button
        v-if="isAuthenticated" 
    @click="toggleRequestTools"
    class="absolute right-6 bottom-6 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transform hover:scale-105 transition duration-300 border-2 border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
    type="button"
    style="z-index: 2000;"
    >
    网络请求工具箱
    </button>
  </div>
</template>

<script>
import LeftSidebarMenu from './components/LeftSidebarMenu.vue'; // 引入左侧悬浮菜单
import RightSidebarMenu from './components/RightSidebarMenu.vue'; // 引入右侧悬浮菜单
import { computed } from 'vue';
import { useStore } from 'vuex'; // 引入 Vuex store

export default {
  name: 'App',
  components: {
    LeftSidebarMenu, // 注册左侧悬浮菜单组件
    RightSidebarMenu // 注册右侧悬浮菜单组件
  },
  setup() {
    const store = useStore();

    // 计算属性，检查用户是否已认证
    const isAuthenticated = computed(() => store.state.isAuthenticated);

    return {
      isAuthenticated
    };
  },
  data() {
    return {
      isMenuVisible: false, // 控制左侧菜单的显示与隐藏
      isRequestToolVisible: false // 控制右侧菜单的显示与隐藏
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible; // 切换左侧菜单可见性
    },
    toggleRequestTools() {
      this.isRequestToolVisible = !this.isRequestToolVisible; // 切换右侧菜单可见性
    }
  }
};
</script>

<style>
/* 全局样式 */
.flex {
  display: flex;
}

.relative {
  position: relative;
}
</style>
