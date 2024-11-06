<template>
  <div class="flex relative">
    <PopupMenu :isVisible="isMenuVisible" />
    <div class="flex-1">
      <router-view />
    </div>
    <button
        @click="toggleMenu"
        class="absolute left-6 bottom-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        type="button"
        style="z-index: 2000;"
    >
      加密解密工具箱
    </button>
  </div>
</template>

<script>
import PopupMenu from './components/PopupMenu.vue';

export default {
  name: 'App',
  components: {
    PopupMenu
  },
  data() {
    return {
      isMenuVisible: false // 控制弹出菜单的显示与隐藏
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible; // 切换菜单可见性
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
