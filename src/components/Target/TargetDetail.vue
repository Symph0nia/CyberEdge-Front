<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 目标基本信息卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30 mb-6"
      >
        <!-- 标题和状态行 -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <div class="flex items-center gap-4">
              <h1 class="text-2xl font-bold text-gray-100">
                {{ details?.name }}
              </h1>
              <span
                class="px-3 py-1.5 rounded-xl text-sm font-medium"
                :class="getStatusStyle(details?.status)"
              >
                {{ getStatusText(details?.status) }}
              </span>
            </div>
            <p class="text-gray-400 mt-2">
              {{ details?.description || "暂无描述" }}
            </p>
          </div>
        </div>

        <!-- 详细信息网格 -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="space-y-1">
            <p class="text-gray-400 text-sm">ID</p>
            <p class="text-gray-200 font-mono">{{ details?.id || "-" }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-gray-400 text-sm">目标地址</p>
            <p class="text-gray-200">{{ details?.target || "-" }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-gray-400 text-sm">创建时间</p>
            <p class="text-gray-200">{{ formatDate(details?.createdAt) }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-gray-400 text-sm">更新时间</p>
            <p class="text-gray-200">{{ formatDate(details?.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- 数据统计卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div
          v-for="stat in statistics"
          :key="stat.title"
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30 hover:border-gray-600/30 transition-all duration-200"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">{{ stat.title }}</p>
              <div class="flex items-baseline gap-2">
                <h3
                  class="text-3xl font-bold"
                  :class="`text-${stat.color}-400`"
                >
                  {{ stat.value }}
                </h3>
                <span class="text-gray-400 text-sm">个</span>
              </div>
            </div>
            <div :class="`text-${stat.color}-400 text-3xl opacity-50`">
              <i :class="stat.icon"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据统计卡片网格之后 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <!-- 端口排名图表 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <h3 class="text-lg font-medium text-gray-200 mb-4">端口分布</h3>
          <div class="chart-container">
            <Bar
              v-if="portChartData.datasets[0].data.length > 0"
              :data="portChartData"
              :options="portChartOptions"
            />
            <p v-else class="text-gray-400 text-center py-8">暂无数据</p>
          </div>
        </div>

        <!-- HTTP状态码分布图表 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <h3 class="text-lg font-medium text-gray-200 mb-4">HTTP状态码分布</h3>
          <div class="chart-container">
            <Pie
              v-if="httpStatusChartData.datasets[0].data.length > 0"
              :data="httpStatusChartData"
              :options="httpStatusChartOptions"
            />
            <p v-else class="text-gray-400 text-center py-8">暂无数据</p>
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
import { Bar, Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

export default {
  name: "TargetDetail",
  components: {
    HeaderPage,
    FooterPage,
    Bar,
    Pie,
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

    const chartColors = {
      backgrounds: [
        "rgba(59, 130, 246, 0.2)", // 蓝色
        "rgba(34, 197, 94, 0.2)", // 绿色
        "rgba(239, 68, 68, 0.2)", // 红色
        "rgba(168, 85, 247, 0.2)", // 紫色
        "rgba(234, 179, 8, 0.2)", // 黄色
        "rgba(14, 165, 233, 0.2)", // 天蓝色
        "rgba(249, 115, 22, 0.2)", // 橙色
        "rgba(236, 72, 153, 0.2)", // 粉色
        "rgba(45, 212, 191, 0.2)", // 青色
        "rgba(139, 92, 246, 0.2)", // 靛蓝色
      ],
      borders: [
        "rgb(59, 130, 246)", // 蓝色
        "rgb(34, 197, 94)", // 绿色
        "rgb(239, 68, 68)", // 红色
        "rgb(168, 85, 247)", // 紫色
        "rgb(234, 179, 8)", // 黄色
        "rgb(14, 165, 233)", // 天蓝色
        "rgb(249, 115, 22)", // 橙色
        "rgb(236, 72, 153)", // 粉色
        "rgb(45, 212, 191)", // 青色
        "rgb(139, 92, 246)", // 靛蓝色
      ],
    };

    // 端口排名图表数据
    const portChartData = computed(() => ({
      labels: stats.value.top_ports?.map((p) => `端口 ${p.port}`) || [],
      datasets: [
        {
          label: "端口数量",
          data: stats.value.top_ports?.map((p) => p.count) || [],
          backgroundColor: chartColors.backgrounds,
          borderColor: chartColors.borders,
          borderWidth: 1,
        },
      ],
    }));

    // 端口排名图表配置
    const portChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `数量: ${context.raw}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#9ca3af",
          },
          grid: {
            color: "rgba(156, 163, 175, 0.1)",
          },
        },
        x: {
          ticks: {
            color: "#9ca3af",
            maxRotation: 45,
            minRotation: 45,
          },
          grid: {
            display: false,
          },
        },
      },
    };

    // HTTP状态码图表数据
    const httpStatusChartData = computed(() => ({
      labels: stats.value.http_status_stats?.map((s) => s.label) || [],
      datasets: [
        {
          data: stats.value.http_status_stats?.map((s) => s.count) || [],
          backgroundColor: [
            "rgba(239, 68, 68, 0.2)", // 500系列
            "rgba(234, 179, 8, 0.2)", // 400系列
            "rgba(59, 130, 246, 0.2)", // 300系列
            "rgba(34, 197, 94, 0.2)", // 200系列
            "rgba(168, 85, 247, 0.2)", // 100系列
            "rgba(107, 114, 128, 0.2)", // 其他
          ],
          borderColor: [
            "rgb(239, 68, 68)",
            "rgb(234, 179, 8)",
            "rgb(59, 130, 246)",
            "rgb(34, 197, 94)",
            "rgb(168, 85, 247)",
            "rgb(107, 114, 128)",
          ],
          borderWidth: 1,
        },
      ],
    }));

    // HTTP状态码图表配置
    const httpStatusChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "#9ca3af",
          },
        },
      },
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
      portChartData,
      portChartOptions,
      httpStatusChartData,
      httpStatusChartOptions,
    };
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}
.chart-container {
  height: 300px;
}
</style>
