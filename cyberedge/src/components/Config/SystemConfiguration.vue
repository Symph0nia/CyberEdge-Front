<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <!-- 系统运行信息 -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-6">系统运行信息 📊</h2>
        <div v-if="statusInfo" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatusCard v-for="(value, key) in statusInfo" :key="key" :title="formatTitle(key)" :value="formatValue(key, value)" />
        </div>
        <div v-else class="text-center py-8">
          <p class="text-xl">加载中... ⏳</p>
        </div>
      </div>

      <!-- 扫描设置 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- 子域名发现设置 -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4">子域名发现设置 🔍</h3>
          <button @click="configureSubdomainDiscovery" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            配置设置
          </button>
        </div>

        <!-- 端口扫描设置 -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4">端口扫描设置 🌐</h3>
          <button @click="configurePortScanning" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            配置设置
          </button>
        </div>

        <!-- 路径扫描设置 -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4">路径扫描设置 📂</h3>
          <button @click="configurePathScanning" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            配置设置
          </button>
        </div>

        <!-- 指纹识别设置 -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4">指纹识别设置 🧩</h3>
          <button @click="configureFingerprintRecognition" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            配置设置
          </button>
        </div>

        <!-- 漏洞扫描设置 -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4">漏洞扫描设置 🔒</h3>
          <button @click="configureVulnerabilityScanning" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
            配置设置
          </button>
        </div>
      </div>

      <!-- 刷新按钮 -->
      <div class="text-center">
        <button @click="fetchStatus" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105">
          刷新系统信息 🔄
        </button>
      </div>
    </div>

    <FooterPage />

    <PopupNotification
        v-if="showNotification"
        :message="notificationMessage"
        :emoji="notificationEmoji"
        :type="notificationType"
        @close="showNotification = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import api from '../../api/axiosInstance';
import HeaderPage from '../HeaderPage.vue';
import FooterPage from '../FooterPage.vue';
import PopupNotification from '../Utils/PopupNotification.vue';
import StatusCard from '../Utils/StatusCard.vue';

export default {
  name: 'SystemStatus',
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
    StatusCard
  },
  setup() {
    const statusInfo = ref(null);
    const showNotification = ref(false);
    const notificationMessage = ref('');
    const notificationEmoji = ref('');
    const notificationType = ref('success');

    const showPopup = (message, emoji, type) => {
      notificationMessage.value = message;
      notificationEmoji.value = emoji;
      notificationType.value = type;
      showNotification.value = true;
    };

    const fetchStatus = async () => {
      try {
        const response = await api.get('/status');
        statusInfo.value = response.data;
        showPopup('系统信息已更新', '✅', 'success');
      } catch (error) {
        console.error('获取系统状态失败:', error);
        showPopup('获取系统状态失败', '❌', 'error');
      }
    };

    const configureSubdomainDiscovery = () => {
      // TODO: 实现子域名发现配置逻辑
      showPopup('子域名发现配置功能尚未实现', '⚙️', 'info');
    };

    const configurePortScanning = () => {
      // TODO: 实现端口扫描配置逻辑
      showPopup('端口扫描配置功能尚未实现', '⚙️', 'info');
    };

    const configurePathScanning = () => {
      // TODO: 实现路径扫描配置逻辑
      showPopup('路径扫描配置功能尚未实现', '⚙️', 'info');
    };

    const configureFingerprintRecognition = () => {
      // TODO: 实现指纹识别配置逻辑
      showPopup('指纹识别配置功能尚未实现', '⚙️', 'info');
    };

    const configureVulnerabilityScanning = () => {
      // TODO: 实现漏洞扫描配置逻辑
      showPopup('漏洞扫描配置功能尚未实现', '⚙️', 'info');
    };

    onMounted(() => {
      fetchStatus();
    });

    return {
      statusInfo,
      fetchStatus,
      configureSubdomainDiscovery,
      configurePortScanning,
      configurePathScanning,
      configureFingerprintRecognition,
      configureVulnerabilityScanning,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType
    };
  }
};
</script>

<style scoped>
/* 添加自定义样式（如果需要） */
</style>
