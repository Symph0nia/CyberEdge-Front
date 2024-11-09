<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
    <!-- 主要内容卡片 -->
    <div class="bg-gray-800 rounded-lg shadow-xl p-8 max-w-2xl w-full text-center">
      <!-- 开发中图标 -->
      <div class="text-6xl mb-6 animate-bounce">
        🚧
      </div>

      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-white mb-4">
        功能开发中
      </h1>

      <!-- 说明文本 -->
      <p class="text-gray-300 text-lg mb-6">
        这项功能正在积极开发中，我们的团队正在努力将其带给您。
        敬请期待在未来的版本中体验这个激动人心的新功能！
      </p>

      <!-- 开发进度条 -->
      <div class="w-full bg-gray-700 rounded-full h-2.5 mb-6 overflow-hidden">
        <div class="bg-blue-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
      </div>

      <!-- 预计发布信息 -->
      <div class="text-gray-400 mb-8">
        预计发布时间：未来版本
      </div>

      <!-- 返回按钮 -->
      <button
          @click="$router.go(-1)"
          class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 transform hover:scale-105"
      >
        返回上一页 ↩️
      </button>
    </div>

    <!-- 底部信息 -->
    <div class="mt-8 text-gray-500 text-sm">
      如有任何建议，请随时与我们联系
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnderDevelopment',
  setup() {
    // 这里可以添加任何需要的逻辑
    return {};
  }
}
</script>

<style scoped>
/* 自定义动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-animate {
  background: linear-gradient(-45deg, #1a202c, #2d3748, #4a5568);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
</style>
