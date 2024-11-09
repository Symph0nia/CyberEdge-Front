<template>
  <div class="flex flex-col justify-center space-y-4">
    <h2 class="text-2xl font-bold mb-4 text-white text-center">加密解密工具</h2>
    <ul class="space-y-2">
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('base64Encode')">Base64 加密</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('base64Decode')">Base64 解密</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('aesEncrypt')">AES 加密</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('aesDecrypt')">AES 解密</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('md5Hash')">MD5 加密</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('sha256Hash')">SHA-256 加密</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('urlEncode')">URL 编码</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('urlDecode')">URL 解码</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('hexEncode')">Hex 编码</button>
      </li>
      <li>
        <button class="block w-full text-left px-4 py-3 hover:bg-gray-700 rounded-lg text-white transition duration-200" @click="showModal('hexDecode')">Hex 解码</button>
      </li>
    </ul>

    <!-- 输入框和结果输出 -->
    <div v-if="isModalVisible" class="mt-4 p-6 bg-gray-900 rounded-lg shadow-lg">
      <h3 class="text-lg text-white mb-2">请输入文本:</h3>
      <input type="text" v-model="inputText" class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" placeholder="输入文本"/>

      <div v-if="currentAction === 'aesEncrypt' || currentAction === 'aesDecrypt'" class="mt-2">
        <h4 class="text-white mb-1">密钥:</h4>
        <input type="text" v-model="key" class="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200" placeholder="输入密钥"/>
      </div>

      <button @click="handleAction" class="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200">提交</button>
      <button @click="closeModal" class="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">关闭</button>

      <div v-if="outputText" class="mt-4 text-white flex flex-col">
        <div class="bg-gray-800 rounded-lg p-3 break-words overflow-auto" style="max-height: 150px;">
          <strong>结果:</strong> {{ outputText }}
        </div>
        <button @click="copyToClipboard" class="mt-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-200">复制</button>
      </div>
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js'; // 确保您安装了 crypto-js 库

export default {
  name: 'CryptoTools',
  data() {
    return {
      isModalVisible: false,
      inputText: '',
      outputText: '',
      currentAction: '',
      key: '' // 用于存储密钥
    };
  },
  methods: {
    showModal(action) {
      this.currentAction = action;
      this.isModalVisible = true;
      this.inputText = ''; // 清空输入
      this.outputText = ''; // 清空输出
      this.key = ''; // 清空密钥
    },
    closeModal() {
      this.isModalVisible = false;
      this.inputText = ''; // 清空输入
      this.outputText = ''; // 清空输出
      this.key = ''; // 清空密钥
    },
    handleAction() {
      switch (this.currentAction) {
        case 'base64Encode':
          this.outputText = btoa(this.inputText);
          break;
        case 'base64Decode':
          try {
            this.outputText = atob(this.inputText);
          } catch (e) {
            this.outputText = '无效的 Base64 输入';
          }
          break;
        case 'aesEncrypt':
          if (this.inputText && this.key) {
            this.outputText = CryptoJS.AES.encrypt(this.inputText, this.key).toString();
          }
          break;
        case 'aesDecrypt':
          if (this.inputText && this.key) {
            const decrypted = CryptoJS.AES.decrypt(this.inputText, this.key).toString(CryptoJS.enc.Utf8);
            this.outputText = decrypted || '无效的 AES 输入';
          }
          break;
        case 'md5Hash':
          this.outputText = CryptoJS.MD5(this.inputText).toString();
          break;
        case 'sha256Hash':
          this.outputText = CryptoJS.SHA256(this.inputText).toString();
          break;
        case 'urlEncode':
          this.outputText = encodeURIComponent(this.inputText);
          break;
        case 'urlDecode':
          this.outputText = decodeURIComponent(this.inputText);
          break;
        case 'hexEncode':
          this.outputText = this.textToHex(this.inputText);
          break;
        case 'hexDecode':
          this.outputText = this.hexToText(this.inputText);
          break;
        default:
          this.outputText = '';
      }
    },
    textToHex(text) {
      return text.split('').map(char => char.charCodeAt(0).toString(16)).join('');
    },
    hexToText(hex) {
      return hex.match(/.{1,2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.outputText)
          .then(() => {
            alert("结果已复制到剪贴板");
          })
          .catch(() => {
            alert("复制失败");
          });
    }
  }
};
</script>

<style scoped>
/* 添加样式，如果需要的话 */
.break-words {
  word-wrap: break-word; /* 允许长单词换行 */
  overflow-wrap: break-word; /* 兼容性处理 */
}
</style>
