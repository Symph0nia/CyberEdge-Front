<template>
  <div class="flex relative">
    <LeftSidebarMenu :isVisible="isMenuVisible" />
    <div class="flex-1">
      <router-view />
    </div>

    <!-- 加密解密工具箱按钮 -->
    <button
      v-if="isAuthenticated"
      @click="toggleMenu"
      class="absolute left-6 bottom-6 bg-gray-800/80 backdrop-blur-md text-white text-sm font-medium px-6 py-3 rounded-2xl hover:bg-gray-700/80 transition-all duration-300 border border-gray-600/30 focus:outline-none shadow-lg hover:shadow-xl tracking-wide"
      type="button"
      style="z-index: 2000"
    >
      加密解密工具箱
    </button>

    <RightSidebarMenu :isVisible="isRequestToolVisible" />

    <!-- 网络请求工具箱按钮 -->
    <button
      v-if="isAuthenticated"
      @click="toggleRequestTools"
      class="absolute right-6 bottom-6 bg-gray-800/80 backdrop-blur-md text-white text-sm font-medium px-6 py-3 rounded-2xl hover:bg-gray-700/80 transition-all duration-300 border border-gray-600/30 focus:outline-none shadow-lg hover:shadow-xl tracking-wide"
      type="button"
      style="z-index: 2000"
    >
      网络请求工具箱
    </button>
  </div>
</template>

<script>
// script 部分保持不变
import LeftSidebarMenu from "./components/LeftSidebarMenu.vue";
import RightSidebarMenu from "./components/RightSidebarMenu.vue";
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "App",
  components: {
    LeftSidebarMenu,
    RightSidebarMenu,
  },
  setup() {
    const store = useStore();
    const isAuthenticated = computed(() => store.state.isAuthenticated);
    return {
      isAuthenticated,
    };
  },
  data() {
    return {
      isMenuVisible: false,
      isRequestToolVisible: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
    toggleRequestTools() {
      this.isRequestToolVisible = !this.isRequestToolVisible;
    },
  },
};
</script>

<style>
.flex {
  display: flex;
}

.relative {
  position: relative;
}

/* 可选：添加按钮按下效果 */
button:active {
  transform: scale(0.98);
}
</style>
