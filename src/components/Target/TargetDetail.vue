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
            <h1 class="text-2xl font-bold text-gray-100">{{ target.name }}</h1>
            <p class="text-gray-400 mt-2">{{ target.description }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span
              class="px-3 py-1.5 rounded-xl bg-green-500/20 text-green-300 text-sm"
            >
              {{ target.status }}
            </span>
            <span class="text-gray-400">
              创建时间: {{ formatDate(target.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 数据统计卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- 子域名统计 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400">子域名数量</p>
              <h3 class="text-2xl font-bold text-gray-100">
                {{ stats.subdomainCount }}
              </h3>
            </div>
            <div class="text-blue-400 text-2xl">
              <i class="ri-global-line"></i>
            </div>
          </div>
        </div>

        <!-- 端口统计 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400">开放端口数量</p>
              <h3 class="text-2xl font-bold text-gray-100">
                {{ stats.portCount }}
              </h3>
            </div>
            <div class="text-green-400 text-2xl">
              <i class="ri-door-open-line"></i>
            </div>
          </div>
        </div>

        <!-- 指纹统计 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400">指纹数量</p>
              <h3 class="text-2xl font-bold text-gray-100">
                {{ stats.fingerprintCount }}
              </h3>
            </div>
            <div class="text-purple-400 text-2xl">
              <i class="ri-fingerprint-line"></i>
            </div>
          </div>
        </div>

        <!-- 漏洞统计 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400">漏洞数量</p>
              <h3 class="text-2xl font-bold text-gray-100">
                {{ stats.vulnerabilityCount }}
              </h3>
            </div>
            <div class="text-red-400 text-2xl">
              <i class="ri-bug-line"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 子域名发现趋势图 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <h3 class="text-lg font-medium text-gray-200 mb-4">子域名发现趋势</h3>
          <div class="h-80">
            <LineChart
              :chartData="subdomainTrendData"
              :options="lineChartOptions"
            />
          </div>
        </div>

        <!-- 漏洞风险等级分布图 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <h3 class="text-lg font-medium text-gray-200 mb-4">
            漏洞风险等级分布
          </h3>
          <div class="h-80">
            <PieChart
              :chartData="vulnerabilityDistributionData"
              :options="pieChartOptions"
            />
          </div>
        </div>

        <!-- 端口服务分布图 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <h3 class="text-lg font-medium text-gray-200 mb-4">端口服务分布</h3>
          <div class="h-80">
            <BarChart
              :chartData="portDistributionData"
              :options="barChartOptions"
            />
          </div>
        </div>

        <!-- 资产类型分布图 -->
        <div
          class="bg-gray-800/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30"
        >
          <h3 class="text-lg font-medium text-gray-200 mb-4">资产类型分布</h3>
          <div class="h-80">
            <DoughnutChart
              :chartData="assetTypeData"
              :options="doughnutChartOptions"
            />
          </div>
        </div>
      </div>
    </div>

    <FooterPage />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import HeaderPage from "@/components/HeaderPage.vue";
import FooterPage from "@/components/FooterPage.vue";
import {
  Line as LineChart,
  Pie as PieChart,
  Bar as BarChart,
  Doughnut as DoughnutChart,
} from "vue-chartjs";

export default {
  name: "TargetDetail",
  components: {
    HeaderPage,
    FooterPage,
    LineChart,
    PieChart,
    BarChart,
    DoughnutChart,
  },
  setup() {
    const route = useRoute();

    // Mock 目标基本信息
    const target = ref({
      id: route.params.id,
      name: "Example.com",
      description: "示例目标网站，用于演示系统功能",
      status: "active",
      createdAt: "2024-03-15T08:00:00.000Z",
      type: "domain",
      target: "example.com",
    });

    // Mock 统计数据
    const stats = ref({
      subdomainCount: 156,
      portCount: 89,
      fingerprintCount: 45,
      vulnerabilityCount: 21,
    });

    // Mock 子域名趋势数据
    const subdomainTrendData = ref({
      labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
      datasets: [
        {
          label: "子域名数量",
          data: [65, 78, 90, 110, 135, 156],
          borderColor: "#3B82F6",
          tension: 0.4,
          fill: false,
        },
      ],
    });

    // Mock 漏洞分布数据
    const vulnerabilityDistributionData = ref({
      labels: ["高危", "中危", "低危", "信息"],
      datasets: [
        {
          data: [4, 6, 8, 3],
          backgroundColor: ["#EF4444", "#F59E0B", "#10B981", "#6B7280"],
        },
      ],
    });

    // Mock 端口分布数据
    const portDistributionData = ref({
      labels: ["80/443", "22", "3306", "6379", "其他"],
      datasets: [
        {
          label: "端口数量",
          data: [30, 15, 8, 5, 12],
          backgroundColor: "#8B5CF6",
        },
      ],
    });

    // Mock 资产类型分布数据
    const assetTypeData = ref({
      labels: ["Web应用", "数据库", "文件服务", "API服务"],
      datasets: [
        {
          data: [40, 20, 15, 25],
          backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
        },
      ],
    });

    // 图表通用配置
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: "#9CA3AF" },
        },
      },
      scales: {
        y: {
          ticks: { color: "#9CA3AF" },
          grid: { color: "rgba(75, 85, 99, 0.2)" },
        },
        x: {
          ticks: { color: "#9CA3AF" },
          grid: { color: "rgba(75, 85, 99, 0.2)" },
        },
      },
    };

    // 饼图和环形图的特殊配置
    const pieChartOptions = {
      ...chartOptions,
      scales: {}, // 移除刻度
    };

    const barChartOptions = {
      ...chartOptions,
    };

    const lineChartOptions = {
      ...chartOptions,
      plugins: {
        ...chartOptions.plugins,
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
    };

    const doughnutChartOptions = {
      ...pieChartOptions,
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleString("zh-CN");
    };

    return {
      target,
      stats,
      formatDate,
      subdomainTrendData,
      vulnerabilityDistributionData,
      portDistributionData,
      assetTypeData,
      // 返回不同类型图表的特定配置
      lineChartOptions,
      pieChartOptions,
      barChartOptions,
      doughnutChartOptions,
    };
  },
};
</script>
