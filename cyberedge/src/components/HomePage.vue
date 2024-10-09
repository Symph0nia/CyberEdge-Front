<template>
  <div class="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-gradient-x text-white flex flex-col min-h-screen">
    <HeaderPage />
    <div class="container mx-auto px-4 py-24 flex-1">
      <!-- 欢迎信息 -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 animate-pulse">欢迎使用 CyberEdge 🌐 综合扫描器 🚀</h1>
        <p class="text-xl text-gray-300">全面扫描互联网资产，确保安全无忧 🔐。</p>
      </div>

      <!-- 功能卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="(card, index) in cards"
            :key="index"
            :class="card.bgClass"
            class="p-6 rounded-lg shadow-lg transform hover:scale-110 hover:rotate-6 hover:shadow-2xl transition-all duration-700 ease-in-out"
        >
          <div class="flex items-center mb-4">
            <span class="text-4xl animate-bounce">{{ card.icon }}</span>
            <h3 class="text-2xl font-bold ml-3">{{ card.title }}</h3>
          </div>
          <p class="text-gray-100">{{ card.description }}</p>
        </div>
      </div>
    </div>
    <FooterPage />
  </div>
</template>

<script>
import HeaderPage from './HeaderPage.vue'
import FooterPage from './FooterPage.vue'

export default {
  name: 'HomePage',
  components: {
    HeaderPage,
    FooterPage
  },
  data() {
    return {
      cards: [
        {
          icon: '🔍',
          title: '子域名发现',
          description: '快速识别并列出所有子域名，确保全面覆盖。',
          bgClass: 'bg-gradient-to-r from-green-400 to-blue-500'
        },
        {
          icon: '🌐',
          title: '端口扫描',
          description: '深入分析开放端口，识别潜在的安全风险。',
          bgClass: 'bg-gradient-to-r from-pink-500 to-red-500'
        },
        {
          icon: '📂',
          title: '路径扫描',
          description: '自动化路径扫描，发现隐藏的敏感信息。',
          bgClass: 'bg-gradient-to-r from-yellow-400 to-orange-500'
        },
        {
          icon: '🧩',
          title: '指纹识别',
          description: '识别应用程序和服务的指纹，获取详细信息。',
          bgClass: 'bg-gradient-to-r from-purple-500 to-indigo-500'
        },
        {
          icon: '🔒',
          title: '漏洞扫描',
          description: '全面扫描已知漏洞，确保系统安全。',
          bgClass: 'bg-gradient-to-r from-teal-400 to-cyan-500'
        },
        {
          icon: '⚠️',
          title: '漏洞利用',
          description: '模拟攻击，测试系统的防御能力。',
          bgClass: 'bg-gradient-to-r from-gray-500 to-gray-700'
        },
        {
          icon: '⚡',
          title: '多线程支持',
          description: '高效利用资源，实现快速扫描。',
          bgClass: 'bg-gradient-to-r from-green-500 to-teal-500'
        },
        {
          icon: '📊',
          title: '任务管理',
          description: '集中管理所有扫描任务，轻松监控进度。',
          bgClass: 'bg-gradient-to-r from-red-500 to-pink-500'
        },
        {
          icon: '⏰',
          title: '分时段扫描',
          description: '根据需求设置定时任务，灵活高效。',
          bgClass: 'bg-gradient-to-r from-blue-500 to-purple-500'
        },
        {
          icon: '🚀',
          title: '快速部署',
          description: '一键集成和部署，节省时间和资源。',
          bgClass: 'bg-gradient-to-r from-yellow-500 to-orange-500'
        },
        {
          icon: '🔑',
          title: '安全报告生成',
          description: '自动生成详细的安全报告，便于审计与分析。',
          bgClass: 'bg-gradient-to-r from-indigo-400 to-blue-400'
        },
        {
          icon: '🛠️',
          title: '自定义配置',
          description: '灵活配置扫描参数，以满足特定需求。',
          bgClass: 'bg-gradient-to-r from-pink-300 to-red-300'
        },
        {
          icon: '📈',
          title: '实时监控面板',
          description: '实时监控扫描进度与结果，直观呈现数据。',
          bgClass: 'bg-gradient-to-r from-teal-300 to-cyan-300'
        },
        {
          icon: '🔄',
          title: '定期更新数据库',
          description: '自动更新漏洞数据库，确保数据的时效性。',
          bgClass: 'bg-gradient-to-r from-orange-400 to-red-400'
        },
        {
          icon: '📞',
          title: '支持多种协议',
          description: '支持HTTP、HTTPS、FTP等多种协议的扫描。',
          bgClass: 'bg-gradient-to-r from-purple-300 to-indigo-300'
        }
      ]
    }
  }
}
</script>
