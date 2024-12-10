<template>
  <div class="flex flex-col p-6 text-gray-200 space-y-6">
    <!-- 标题和说明 -->
    <div class="text-center space-y-4">
      <h2 class="text-xl font-medium tracking-wide">网络请求工具</h2>
      <p class="text-sm text-gray-400 leading-relaxed">
        使用该功能时需要关闭浏览器的 CORS 安全检查
        <br />
        <span class="text-xs opacity-75 mt-1 block">
          在 Chrome 中运行：
          <code class="bg-gray-900/50 px-2 py-1 rounded-md text-gray-300">
            chrome.exe --user-data-dir="C:/Chrome dev session"
            --disable-web-security
          </code>
        </span>
      </p>
    </div>

    <!-- 表单区域 -->
    <div class="space-y-4">
      <!-- URL输入 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-300">请求地址</label>
        <input
          type="text"
          v-model="url"
          class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200"
          placeholder="输入请求的 URL"
        />
      </div>

      <!-- HTTP方法选择 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-300">HTTP 方法</label>
        <select
          v-model="httpMethod"
          class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200 appearance-none"
        >
          <option
            v-for="method in [
              'GET',
              'POST',
              'PUT',
              'DELETE',
              'PATCH',
              'OPTIONS',
            ]"
            :key="method"
            :value="method"
          >
            {{ method }}
          </option>
        </select>
      </div>

      <!-- 数据格式选择 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-300">数据格式</label>
        <select
          v-model="dataFormat"
          class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200 appearance-none"
        >
          <option value="json">JSON</option>
          <option value="raw">Raw</option>
        </select>
      </div>

      <!-- 请求数据输入 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-300">请求数据</label>
        <textarea
          v-model="requestData"
          rows="4"
          class="w-full px-4 py-2.5 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 text-sm focus:outline-none focus:ring-2 focus:ring-gray-600/50 transition-all duration-200 resize-none"
          placeholder='{"key": "value"}'
        ></textarea>
      </div>

      <!-- 发送按钮 -->
      <button
        @click="sendRequest"
        class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <span>发送请求</span>
      </button>

      <!-- 响应结果 -->
      <div v-if="response" class="space-y-3">
        <!-- 状态码 -->
        <div class="flex items-center space-x-2 text-sm">
          <span class="font-medium text-gray-300">状态码：</span>
          <span
            :class="{
              'text-green-400': responseStatus >= 200 && responseStatus < 300,
              'text-yellow-400': responseStatus >= 300 && responseStatus < 400,
              'text-red-400': responseStatus >= 400,
            }"
            >{{ responseStatus }}</span
          >
        </div>

        <!-- 响应数据 - 添加最大高度和滚动 -->
        <div
          class="p-4 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 break-words"
        >
          <p class="text-sm text-gray-400 mb-2">响应数据：</p>
          <div class="max-h-[200px] overflow-y-auto overflow-x-auto">
            <pre class="text-sm whitespace-pre-wrap">{{ response }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HttpRequestTool",
  data() {
    return {
      url: "",
      httpMethod: "GET",
      requestData: "",
      response: null,
      responseStatus: null,
      dataFormat: "json",
    };
  },
  methods: {
    async sendRequest() {
      try {
        const options = {
          method: this.httpMethod,
          headers: {
            "Content-Type":
              this.dataFormat === "json" ? "application/json" : "text/plain",
          },
          body:
            this.httpMethod !== "GET"
              ? this.dataFormat === "json"
                ? JSON.stringify(JSON.parse(this.requestData))
                : this.requestData
              : null,
        };

        const res = await fetch(this.url, options);
        this.responseStatus = res.status;
        this.response = await res.text();
      } catch (error) {
        this.responseStatus = "请求出错";
        this.response = error.message;
      }
    },
  },
};
</script>

<style scoped>
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

/* 确保pre标签内的文本正确换行 */
.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 移除select的默认箭头 */
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* 优化滚动容器的样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

/* 确保内容区域有足够的内边距 */
pre {
  padding: 0.5rem;
}
</style>
