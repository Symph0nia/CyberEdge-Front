<template>
  <div class="flex flex-col justify-center space-y-6"> <!-- 增加间距 -->
    <h2 class="text-2xl font-bold mb-4 text-white text-center">网络请求工具</h2>
    <p class="text-sm text-gray-400 text-center">
      使用该功能时必须关闭浏览器的 CORS 安全检查。
      <br />
      <strong>在 Chrome 中：</strong> 关闭后请在终端中运行：
      <code>chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security</code>
    </p>

    <div>
      <label class="text-white mb-1">输入 URL:</label>
      <input type="text" v-model="url" class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" placeholder="输入请求的 URL" />
    </div>

    <div>
      <label class="text-white mb-1">选择 HTTP 方法:</label>
      <select v-model="httpMethod" class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
        <option value="PATCH">PATCH</option>
        <option value="OPTIONS">OPTIONS</option>
      </select>
    </div>

    <div>
      <label class="text-white mb-1">选择数据格式:</label>
      <select v-model="dataFormat" class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200">
        <option value="json">JSON</option>
        <option value="raw">Raw</option>
      </select>
    </div>

    <div>
      <label class="text-white mb-1">输入数据:</label>
      <textarea v-model="requestData" class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" rows="4" placeholder='{"key": "value"}'></textarea>
    </div>

    <button @click="sendRequest" class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">发送请求</button>

    <div v-if="response" class="mt-4 text-white">
      <div><strong>状态码:</strong> {{ responseStatus }}</div>
      <div class="bg-gray-800 rounded-lg p-3 break-words">
        <strong>返回数据:</strong> {{ response }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HttpRequestTool',
  data() {
    return {
      url: '',
      httpMethod: 'GET', // 默认选择 GET 方法
      requestData: '',
      response: null,
      responseStatus: null,
      dataFormat: 'json' // 默认选择数据格式为 JSON
    };
  },
  methods: {
    async sendRequest() {
      try {
        const options = {
          method: this.httpMethod,
          headers: {
            'Content-Type': this.dataFormat === 'json' ? 'application/json' : 'text/plain',
          },
          body: this.httpMethod !== 'GET' ? this.dataFormat === 'json' ? JSON.stringify(JSON.parse(this.requestData)) : this.requestData : null, // 根据选择的数据格式发送请求
        };

        const res = await fetch(this.url, options);
        this.responseStatus = res.status; // 获取状态码
        this.response = await res.text(); // 获取响应文本

      } catch (error) {
        this.responseStatus = '请求出错';
        this.response = error.message;
      }
    },
  },
};
</script>

<style scoped>
/* 添加样式，如果需要的话 */
.break-words {
  word-wrap: break-word; /* 允许长单词换行 */
  overflow-wrap: break-word; /* 兼容性处理 */
}
</style>
