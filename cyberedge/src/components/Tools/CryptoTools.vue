<template>
  <div class="flex flex-col p-6 text-gray-200">
    <h2 class="text-xl font-medium mb-6 tracking-wide">加密解密工具</h2>

    <!-- 工具列表 -->
    <div class="space-y-1.5">
      <button
          v-for="tool in tools"
          :key="tool.action"
          @click="showModal(tool.action)"
          class="w-full text-left px-4 py-2.5 rounded-xl
               text-sm font-medium tracking-wide
               transition-all duration-200
               hover:bg-gray-700/50 focus:bg-gray-700/50
               flex items-center space-x-3"
      >
        <span class="text-lg">{{ tool.icon }}</span>
        <span>{{ tool.name }}</span>
      </button>
    </div>

    <!-- 操作面板 - 添加固定高度和滚动 -->
    <div v-if="isModalVisible"
         class="mt-6 rounded-2xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6
                max-h-[400px] overflow-y-auto relative">
      <!-- 输入区域 -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 text-gray-300">输入文本</label>
          <input
              v-model="inputText"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl
                   bg-gray-900/50 backdrop-blur-sm
                   border border-gray-700/30
                   text-sm
                   focus:outline-none focus:ring-2 focus:ring-gray-600/50
                   transition-all duration-200"
              placeholder="请输入需要处理的文本"
          />
        </div>

        <!-- AES加密解密的密钥输入 -->
        <div v-if="['aesEncrypt', 'aesDecrypt'].includes(currentAction)">
          <label class="block text-sm font-medium mb-2 text-gray-300">密钥</label>
          <input
              v-model="key"
              type="text"
              class="w-full px-4 py-2.5 rounded-xl
                   bg-gray-900/50 backdrop-blur-sm
                   border border-gray-700/30
                   text-sm
                   focus:outline-none focus:ring-2 focus:ring-gray-600/50
                   transition-all duration-200"
              placeholder="请输入密钥"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex space-x-3">
          <button
              @click="handleAction"
              class="flex-1 px-4 py-2.5 rounded-xl
                   bg-gray-700/50 hover:bg-gray-600/50
                   text-sm font-medium
                   transition-all duration-200"
          >
            执行
          </button>
          <button
              @click="closeModal"
              class="flex-1 px-4 py-2.5 rounded-xl
                   bg-gray-800/50 hover:bg-gray-700/50
                   text-sm font-medium
                   transition-all duration-200"
          >
            取消
          </button>
        </div>

        <!-- 结果显示 -->
        <div v-if="outputText" class="space-y-3">
          <div class="p-4 rounded-xl bg-gray-900/50 backdrop-blur-sm
              border border-gray-700/30 break-words">
            <p class="text-sm text-gray-400 mb-2">处理结果：</p>
            <div class="max-h-[200px] overflow-y-auto overflow-x-auto">
              <p class="text-sm p-0.5">{{ outputText }}</p>
            </div>
          </div>

          <button
              @click="copyToClipboard"
              class="w-full px-4 py-2.5 rounded-xl
           bg-gray-700/50 hover:bg-gray-600/50
           text-sm font-medium
           transition-all duration-200
           flex items-center justify-center space-x-2"
          >
            <span>{{ copyButtonText }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 复制成功提示 -->
    <div v-if="showCopySuccess"
         class="fixed bottom-4 left-1/2 transform -translate-x-1/2
                bg-gray-800/90 backdrop-blur-sm
                text-white text-sm
                px-4 py-2 rounded-full
                shadow-lg border border-gray-700/30
                transition-all duration-300"
         :class="{ 'opacity-0': !showCopySuccess }"
    >
      已复制到剪贴板
    </div>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

export default {
  name: 'CryptoTools',
  data() {
    return {
      isModalVisible: false,
      inputText: '',
      outputText: '',
      currentAction: '',
      key: '',
      showCopySuccess: false,
      copyButtonText: '复制结果',
      tools: [
        { name: 'Base64 加密', action: 'base64Encode', icon: '🔒' },
        { name: 'Base64 解密', action: 'base64Decode', icon: '🔓' },
        { name: 'AES 加密', action: 'aesEncrypt', icon: '🔐' },
        { name: 'AES 解密', action: 'aesDecrypt', icon: '🗝️' },
        { name: 'MD5 加密', action: 'md5Hash', icon: '🔏' },
        { name: 'SHA-256 加密', action: 'sha256Hash', icon: '🔒' },
        { name: 'URL 编码', action: 'urlEncode', icon: '🌐' },
        { name: 'URL 解码', action: 'urlDecode', icon: '🔍' },
        { name: 'Hex 编码', action: 'hexEncode', icon: '📝' },
        { name: 'Hex 解码', action: 'hexDecode', icon: '📄' }
      ]
    };
  },
  methods: {
    // 保持原有的方法实现不变
    showModal(action) {
      this.currentAction = action;
      this.isModalVisible = true;
      this.inputText = '';
      this.outputText = '';
      this.key = '';
    },
    closeModal() {
      this.isModalVisible = false;
      this.inputText = '';
      this.outputText = '';
      this.key = '';
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
            // 更改按钮文字
            this.copyButtonText = '已复制 ✓';
            // 显示提示
            this.showCopySuccess = true;

            // 2秒后恢复按钮文字
            setTimeout(() => {
              this.copyButtonText = '复制结果';
              this.showCopySuccess = false;
            }, 2000);
          })
          .catch(() => {
            this.copyButtonText = '复制失败 ✗';
            setTimeout(() => {
              this.copyButtonText = '复制结果';
            }, 2000);
          });
    }
  }
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

/* 确保文本正确换行 */
.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* 优化滚动容器的样式 */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

/* 确保内容有合适的间距 */
.p-0.5 {
  padding: 0.125rem;
}
</style>
