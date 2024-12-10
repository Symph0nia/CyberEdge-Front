<template>
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />
    <div class="container mx-auto px-6 pt-28 pb-20 flex-1">
      <!-- 欢迎信息 -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-medium mb-4 tracking-tight">
          CyberEdge 综合扫描器
        </h1>
        <p class="text-lg text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
          简单、高效、专业的资产扫描工具
        </p>
      </div>

      <!-- 功能卡片网格 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="(card, index) in cards"
            :key="index"
            class="bg-gray-800/40 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-800/50 transition-all duration-300 ease-out border border-gray-700/30"
        >
          <div class="flex items-center mb-4 space-x-3">
            <i :class="card.icon" class="text-2xl text-gray-300"></i>
            <h3 class="text-base font-medium tracking-wide">
              {{ card.title }}
            </h3>
          </div>
          <p class="text-gray-400 text-sm leading-relaxed">
            {{ card.description }}
          </p>
        </div>
      </div>
    </div>
    <FooterPage />
  </div>
</template>

<script>
import HeaderPage from "./HeaderPage.vue";
import FooterPage from "./FooterPage.vue";

export default {
  name: "HomePage",
  components: {
    HeaderPage,
    FooterPage,
  },
  data() {
    return {
      cards: [
        {
          icon: "ri-search-line",
          title: "资产发现",
          description: "快速准确的子域名扫描，全面掌握数字资产。",
        },
        {
          icon: "ri-global-line",
          title: "端口扫描",
          description: "高效的端口检测，精准识别服务组件。",
        },
        {
          icon: "ri-folders-line",
          title: "路径扫描",
          description: "深度探索网站结构，发现隐藏资源。",
        },
        {
          icon: "ri-fingerprint-line",
          title: "指纹识别",
          description: "准确识别技术组件，提供详细分析。",
        },
        {
          icon: "ri-shield-check-line",
          title: "安全评估",
          description: "全面的漏洞检测，提供专业评估。",
        },
        {
          icon: "ri-flashlight-line",
          title: "高性能",
          description: "优化的扫描引擎，提供卓越性能。",
        },
        {
          icon: "ri-bar-chart-2-line",
          title: "可视化",
          description: "清晰的数据展示，直观的进度管理。",
        },
        {
          icon: "ri-task-line",
          title: "任务管理",
          description: "灵活的任务调度，高效资源利用。",
        },
        {
          icon: "ri-rocket-line",
          title: "快速部署",
          description: "简单的部署流程，快速开始扫描。",
        },
        {
          icon: "ri-line-chart-line",
          title: "数据分析",
          description: "实时的数据分析，清晰的安全概览。",
        },
        {
          icon: "ri-file-text-line",
          title: "安全报告",
          description: "专业的报告生成，便于安全决策。",
        },
        {
          icon: "ri-settings-3-line",
          title: "配置管理",
          description: "灵活的配置选项，满足多样需求。",
        },
        {
          icon: "ri-refresh-line",
          title: "定期更新",
          description: "持续的特征更新，保持安全防护。",
        },
        {
          icon: "ri-device-line",
          title: "多平台",
          description: "支持多种平台，保持一致体验。",
        },
        {
          icon: "ri-cloud-line",
          title: "协议支持",
          description: "支持主流协议，全面扫描覆盖。",
        },
      ],
    };
  },
};
</script>