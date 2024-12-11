<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 目标基本信息卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30 mb-6"
      >
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-100">
              {{ details?.name }}
            </h1>
            <p class="text-gray-400 mt-2">
              {{ details?.description || "暂无描述" }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <span
              class="px-3 py-1.5 rounded-xl text-sm font-medium"
              :class="getStatusStyle(details?.status)"
            >
              {{ getStatusText(details?.status) }}
            </span>
            <span class="text-gray-400">
              创建时间: {{ formatDate(details?.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 数据统计卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div
          v-for="stat in statistics"
          :key="stat.title"
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400">{{ stat.title }}</p>
              <h3 class="text-2xl font-bold text-gray-100">{{ stat.value }}</h3>
            </div>
            <div :class="`text-${stat.color}-400 text-2xl`">
              <i :class="stat.icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <FooterPage />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderPage from "@/components/HeaderPage.vue";
import FooterPage from "@/components/FooterPage.vue";
import api from "@/api/axiosInstance";
import { useNotification } from "@/composables/useNotification";

export default {
  name: "TargetDetail",
  components: {
    HeaderPage,
    FooterPage,
  },
  setup() {
    const route = useRoute();
    const targetData = ref(null);
    const { showError } = useNotification();

    const details = computed(() => targetData.value?.target || {});
    const stats = computed(() => targetData.value?.stats || {});

    const statistics = computed(() => [
      {
        title: "子域名数量",
        value: stats.value.subdomain_count || 0,
        icon: "ri-global-line",
        color: "blue",
      },
      {
        title: "端口数量",
        value: stats.value.port_count || 0,
        icon: "ri-door-open-line",
        color: "green",
      },
      {
        title: "路径数量",
        value: stats.value.path_count || 0,
        icon: "ri-route-line",
        color: "purple",
      },
      {
        title: "漏洞数量",
        value: stats.value.vulnerability_count || 0,
        icon: "ri-bug-line",
        color: "red",
      },
    ]);

    const fetchTargetDetails = async () => {
      try {
        const response = await api.get(`/targets/${route.params.id}/details`);
        targetData.value = response.data;
      } catch (error) {
        showError("获取目标详情失败");
        console.error("获取目标详情失败:", error);
      }
    };

    const formatDate = (date) => {
      if (!date) return "";
      return new Date(date).toLocaleString("zh-CN");
    };

    const getStatusText = (status) => {
      const statusMap = {
        active: "活跃",
        archived: "已归档",
      };
      return statusMap[status] || status;
    };

    const getStatusStyle = (status) => {
      const styleMap = {
        active: "bg-green-500/20 text-green-300",
        archived: "bg-gray-500/20 text-gray-300",
      };
      return styleMap[status] || "bg-gray-500/20 text-gray-300";
    };

    onMounted(() => {
      fetchTargetDetails();
    });

    return {
      details,
      statistics,
      formatDate,
      getStatusText,
      getStatusStyle,
    };
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
</style>
