<template>
  <div
      v-if="localVisible || isExiting"
      class="fixed top-0 right-0 h-full w-96 bg-transparent transition-transform duration-300"
      :class="{
        'animate-fade-in-right': localVisible,
        'animate-fade-out-right': isExiting
      }"
  >
    <div class="h-[60%] bg-transparent p-6 mx-auto my-32">
      <HttpRequestTool /> <!-- 引入网络请求工具组件 -->
    </div>
  </div>
</template>

<script>
import HttpRequestTool from './Tools/HttpRequestTool.vue'; // 引入网络请求工具组件

export default {
  name: 'RightSidebarMenu', // 右侧菜单组件名称
  components: {
    HttpRequestTool // 注册网络请求工具组件
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false // 默认不可见
    }
  },
  data() {
    return {
      localVisible: this.isVisible, // 使用内部状态来控制可见性
      isExiting: false // 控制退出动画的状态
    };
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        this.localVisible = true; // 显示菜单
        this.isExiting = false;   // 确保退出状态为 false
      } else {
        this.isExiting = true;    // 开始退出动画
        setTimeout(() => {
          this.localVisible = false; // 在动画结束后隐藏菜单
        }, 300); // 与 CSS 动画持续时间相同
      }
    }
  },
  mounted() {
    this.localVisible = this.isVisible; // 初始化时设置内部状态
  }
};
</script>

<style scoped>
.fixed {
  z-index: 1000; /* 确保菜单在其他元素之上 */
}

/* 动画效果 */
@keyframes fade-in-right {
  0% {
    opacity: 0;
    transform: translateX(100%); /* 从右侧滑入 */
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-out-right {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(100%); /* 从右侧滑出 */
  }
}

.animate-fade-in-right {
  animation: fade-in-right 0.3s forwards; /* 菜单显示时的动画 */
}

.animate-fade-out-right {
  animation: fade-out-right 0.3s forwards; /* 菜单隐藏时的动画 */
}
</style>
