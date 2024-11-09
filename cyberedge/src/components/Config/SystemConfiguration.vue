<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-4 py-8 flex-1 mt-16">
      <!-- 系统运行信息 -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 class="text-2xl font-bold mb-6">系统运行信息 📊</h2>
        <div v-if="systemInfo" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatusCard title="程序运行目录" :value="systemInfo.currentDirectory" />
          <StatusCard title="本机IP" :value="systemInfo.localIP" />
          <StatusCard title="外网IP" :value="systemInfo.publicIP" />
          <StatusCard title="系统内核版本" :value="systemInfo.kernelVersion" />
          <StatusCard title="系统发行版" :value="systemInfo.osDistribution" />
          <StatusCard title="程序运行权限" :value="systemInfo.privileges" />
        </div>
        <div v-else class="text-center py-8">
          <p class="text-xl">加载中... ⏳</p>
        </div>
      </div>

      <!-- 刷新按钮 -->
      <div class="text-center">
        <button
            @click="fetchSystemInfo"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
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
    const systemInfo = ref(null);
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

    const fetchSystemInfo = async () => {
      try {
        const response = await api.get('/system/info');
        if (response.data && response.data.data) {
          systemInfo.value = response.data.data.systemInfo;
          showPopup('系统信息已更新', '✅', 'success');
        }
      } catch (error) {
        console.error('获取系统信息失败:', error);
        showPopup('获取系统信息失败', '❌', 'error');
      }
    };

    onMounted(() => {
      fetchSystemInfo();
    });

    return {
      systemInfo,
      fetchSystemInfo,
      showNotification,
      notificationMessage,
      notificationEmoji,
      notificationType
    };
  }
};
</script>
