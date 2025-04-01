<template>
  <div class="bg-gray-900 text-white flex flex-col min-h-screen">
    <HeaderPage />

    <div class="container mx-auto px-6 py-8 flex-1 mt-16">
      <!-- 工具配置管理卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30 mb-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-medium tracking-wide text-gray-200">
            <i class="ri-settings-4-line mr-2"></i>
            工具配置管理
          </h2>
          <div class="flex space-x-3">
            <button
              @click="fetchToolConfigs"
              class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
            >
              <i class="ri-refresh-line mr-2"></i>
              刷新配置
            </button>
            <button
              @click="openCreateModal"
              class="px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600/70 hover:bg-blue-500/70 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
            >
              <i class="ri-add-line mr-2"></i>
              新建配置
            </button>
          </div>
        </div>

        <!-- 配置列表 -->
        <div v-if="toolConfigs && toolConfigs.length > 0">
          <div class="overflow-x-auto">
            <table
              class="min-w-full bg-gray-900/50 rounded-xl border border-gray-700/30"
            >
              <thead>
                <tr class="border-b border-gray-700/30">
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    配置名称
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    状态
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    创建时间
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-700/30">
                <tr
                  v-for="config in toolConfigs"
                  :key="config.id"
                  class="hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-200">
                        {{ config.name }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="config.is_default"
                      class="px-2 py-1 text-xs font-medium rounded-full bg-green-900/40 text-green-400 border border-green-800"
                    >
                      默认配置
                    </span>
                    <span
                      v-else
                      class="px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700"
                    >
                      普通配置
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {{ formatDate(config.created_at) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="viewConfigDetails(config)"
                        class="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        title="查看详情"
                      >
                        <i class="ri-eye-line"></i>
                      </button>
                      <button
                        @click="editConfig(config)"
                        class="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                        title="编辑"
                      >
                        <i class="ri-edit-line"></i>
                      </button>
                      <button
                        v-if="!config.is_default"
                        @click="setAsDefault(config.id)"
                        class="text-green-400 hover:text-green-300 transition-colors duration-200"
                        title="设为默认"
                      >
                        <i class="ri-star-line"></i>
                      </button>
                      <button
                        v-if="!config.is_default"
                        @click="confirmDelete(config)"
                        class="text-red-400 hover:text-red-300 transition-colors duration-200"
                        title="删除"
                      >
                        <i class="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 加载中状态 -->
        <div
          v-else-if="loading"
          class="flex items-center justify-center py-12 text-sm text-gray-400"
        >
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          加载中...
        </div>

        <!-- 无数据状态 -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-12 text-gray-400"
        >
          <i class="ri-file-list-3-line text-4xl mb-3"></i>
          <p>暂无配置数据</p>
          <button
            @click="openCreateModal"
            class="mt-4 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600/70 hover:bg-blue-500/70 text-white transition-all duration-200"
          >
            创建第一个配置
          </button>
        </div>
      </div>

      <!-- 工具支持状态卡片 -->
      <div
        class="bg-gray-800/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/30"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-medium tracking-wide text-gray-200">
            <i class="ri-tools-line mr-2"></i>
            工具支持状态
          </h2>
          <button
            @click="fetchToolsStatus"
            class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
          >
            <i class="ri-search-eye-line mr-2"></i>
            检查工具
          </button>
        </div>

        <div
          v-if="toolsInfo"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="(status, tool) in toolsInfo.installedStatus"
            :key="tool"
            class="bg-gray-900/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 transition-all duration-200 hover:bg-gray-900/70"
          >
            <div class="flex flex-col space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-gray-300 font-medium">
                  <i class="ri-terminal-box-line mr-2"></i>
                  {{ tool }}
                </span>
                <span :class="status ? 'text-green-400' : 'text-red-400'">
                  {{ status ? "已安装 ✓" : "未安装 ✗" }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="flex items-center justify-center py-12 text-sm text-gray-400"
        >
          <svg
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          加载中...
        </div>
      </div>
    </div>

    <!-- 创建/编辑配置模态框 -->
    <div
      v-if="showConfigModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/30 w-full max-w-4xl max-h-[90vh] overflow-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-700/30">
          <h3 class="text-lg font-medium text-gray-200">
            {{ isEditing ? "编辑配置" : "创建新配置" }}
          </h3>
        </div>
        <div class="p-6">
          <form @submit.prevent="saveConfig">
            <!-- 基础配置 -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-400 mb-2"
                >配置名称</label
              >
              <input
                v-model="currentConfig.name"
                type="text"
                class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                placeholder="输入配置名称"
                required
              />
            </div>

            <div class="mb-6">
              <label class="flex items-center">
                <input
                  v-model="currentConfig.is_default"
                  type="checkbox"
                  class="rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-600/50"
                />
                <span class="ml-2 text-sm text-gray-400">设为默认配置</span>
              </label>
            </div>

            <!-- 工具配置选项卡 -->
            <div class="mb-6">
              <div class="border-b border-gray-700/30 mb-4">
                <div class="flex flex-wrap -mb-px">
                  <button
                    v-for="tool in [
                      'nmap',
                      'ffuf',
                      'subfinder',
                      'httpx',
                      'fscan',
                      'afrog',
                      'nuclei',
                    ]"
                    :key="tool"
                    type="button"
                    :class="{
                      'border-blue-500 text-blue-500': activeTab === tool,
                      'border-transparent text-gray-400 hover:text-gray-300':
                        activeTab !== tool,
                    }"
                    class="py-2 px-4 text-sm font-medium border-b-2 focus:outline-none"
                    @click="activeTab = tool"
                  >
                    {{ tool.charAt(0).toUpperCase() + tool.slice(1) }}
                  </button>
                </div>
              </div>

              <!-- Nmap 配置 -->
              <div v-if="activeTab === 'nmap'" class="space-y-4">
                <div>
                  <label class="flex items-center mb-2">
                    <input
                      v-model="currentConfig.nmap_config.enabled"
                      type="checkbox"
                      class="rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-600/50"
                    />
                    <span class="ml-2 text-sm text-gray-400">启用 Nmap</span>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >端口范围</label
                  >
                  <input
                    v-model="currentConfig.nmap_config.ports"
                    type="text"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                    placeholder="例如: 80,443,8080-8090"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    支持单个端口，多个端口（逗号分隔）或端口范围（使用横线）
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >扫描超时（秒）</label
                  >
                  <input
                    v-model.number="currentConfig.nmap_config.scan_timeout"
                    type="number"
                    min="1"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >并发数</label
                  >
                  <input
                    v-model.number="currentConfig.nmap_config.concurrency"
                    type="number"
                    min="1"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  />
                </div>
              </div>

              <!-- Ffuf 配置 -->
              <div v-if="activeTab === 'ffuf'" class="space-y-4">
                <div>
                  <label class="flex items-center mb-2">
                    <input
                      v-model="currentConfig.ffuf_config.enabled"
                      type="checkbox"
                      class="rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-600/50"
                    />
                    <span class="ml-2 text-sm text-gray-400">启用 Ffuf</span>
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >字典文件路径</label
                  >
                  <input
                    v-model="currentConfig.ffuf_config.wordlist_path"
                    type="text"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                    placeholder="例如: /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >扩展名</label
                  >
                  <input
                    v-model="currentConfig.ffuf_config.extensions"
                    type="text"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                    placeholder="例如: php,asp,aspx,jsp"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >线程数</label
                  >
                  <input
                    v-model.number="currentConfig.ffuf_config.threads"
                    type="number"
                    min="1"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >匹配HTTP状态码</label
                  >
                  <input
                    v-model="currentConfig.ffuf_config.match_http_code"
                    type="text"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                    placeholder="例如: 200,204,301,302,307,401,403"
                  />
                </div>
              </div>

              <!-- Subfinder 配置 -->
              <div v-if="activeTab === 'subfinder'" class="space-y-4">
                <div>
                  <label class="flex items-center mb-2">
                    <input
                      v-model="currentConfig.subfinder_config.enabled"
                      type="checkbox"
                      class="rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-600/50"
                    />
                    <span class="ml-2 text-sm text-gray-400"
                      >启用 Subfinder</span
                    >
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >配置文件路径</label
                  >
                  <input
                    v-model="currentConfig.subfinder_config.config_path"
                    type="text"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                    placeholder="例如: /etc/subfinder/config.yaml"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >线程数</label
                  >
                  <input
                    v-model.number="currentConfig.subfinder_config.threads"
                    type="number"
                    min="1"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >最大深度</label
                  >
                  <input
                    v-model.number="currentConfig.subfinder_config.max_depth"
                    type="number"
                    min="1"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >超时（秒）</label
                  >
                  <input
                    v-model.number="currentConfig.subfinder_config.timeout"
                    type="number"
                    min="1"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  />
                </div>
              </div>

              <!-- 其他工具配置（简化版） -->
              <div
                v-if="['httpx', 'fscan', 'afrog', 'nuclei'].includes(activeTab)"
                class="space-y-4"
              >
                <div>
                  <label class="flex items-center mb-2">
                    <input
                      v-model="currentConfig[`${activeTab}_config`].enabled"
                      type="checkbox"
                      class="rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-blue-600/50"
                    />
                    <span class="ml-2 text-sm text-gray-400"
                      >启用
                      {{
                        activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                      }}</span
                    >
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-400 mb-2"
                    >线程数</label
                  >
                  <input
                    v-model.number="
                      currentConfig[`${activeTab}_config`].threads
                    "
                    type="number"
                    min="1"
                    class="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  />
                </div>
              </div>
            </div>

            <div
              class="flex justify-end space-x-3 pt-4 border-t border-gray-700/30"
            >
              <button
                type="button"
                @click="showConfigModal = false"
                class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600/70 hover:bg-blue-500/70 text-white transition-all duration-200"
              >
                {{ isEditing ? "保存更改" : "创建配置" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/30 w-full max-w-md"
        @click.stop
      >
        <div class="p-6">
          <h3 class="text-lg font-medium text-gray-200 mb-4">确认删除</h3>
          <p class="text-gray-400">
            您确定要删除配置 "{{ configToDelete?.name }}" 吗？此操作无法撤销。
          </p>
        </div>
        <div class="flex justify-end space-x-3 p-4 border-t border-gray-700/30">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200"
          >
            取消
          </button>
          <button
            @click="deleteConfig"
            class="px-4 py-2 rounded-xl text-sm font-medium bg-red-600/70 hover:bg-red-500/70 text-white transition-all duration-200"
          >
            确认删除
          </button>
        </div>
      </div>
    </div>

    <!-- 查看详情对话框 -->
    <div
      v-if="showViewDetails"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/30 w-full max-w-4xl max-h-[90vh] overflow-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-700/30">
          <h3 class="text-lg font-medium text-gray-200">
            配置详情: {{ configToView?.name }}
          </h3>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="configToView" class="space-y-6">
            <!-- 基本信息 -->
            <div
              class="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30"
            >
              <h4 class="text-sm font-medium text-gray-300 mb-2">基本信息</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-xs text-gray-500">配置名称:</span>
                  <div class="text-sm text-gray-300">
                    {{ configToView.name }}
                  </div>
                </div>
                <div>
                  <span class="text-xs text-gray-500">状态:</span>
                  <div class="text-sm text-gray-300">
                    {{ configToView.is_default ? "默认配置" : "普通配置" }}
                  </div>
                </div>
                <div>
                  <span class="text-xs text-gray-500">创建时间:</span>
                  <div class="text-sm text-gray-300">
                    {{ formatDate(configToView.created_at) }}
                  </div>
                </div>
                <div>
                  <span class="text-xs text-gray-500">更新时间:</span>
                  <div class="text-sm text-gray-300">
                    {{ formatDate(configToView.updated_at) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 各工具配置展示 -->
            <div
              v-for="tool in [
                'nmap',
                'ffuf',
                'subfinder',
                'httpx',
                'fscan',
                'afrog',
                'nuclei',
              ]"
              :key="tool"
              class="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30"
            >
              <h4 class="text-sm font-medium text-gray-300 mb-2">
                {{ tool.charAt(0).toUpperCase() + tool.slice(1) }} 配置
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-xs text-gray-500">状态:</span>
                  <div class="text-sm text-gray-300">
                    {{
                      configToView[`${tool}_config`].enabled
                        ? "已启用"
                        : "已禁用"
                    }}
                  </div>
                </div>

                <!-- Nmap特有配置 -->
                <template v-if="tool === 'nmap'">
                  <div>
                    <span class="text-xs text-gray-500">端口范围:</span>
                    <div class="text-sm text-gray-300">
                      {{ configToView.nmap_config.ports || "未设置" }}
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">扫描超时:</span>
                    <div class="text-sm text-gray-300">
                      {{ configToView.nmap_config.scan_timeout || "0" }} 秒
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">并发数:</span>
                    <div class="text-sm text-gray-300">
                      {{ configToView.nmap_config.concurrency || "0" }}
                    </div>
                  </div>
                </template>

                <!-- Ffuf特有配置 -->
                <template v-if="tool === 'ffuf'">
                  <div>
                    <span class="text-xs text-gray-500">字典文件:</span>
                    <div class="text-sm text-gray-300 break-all">
                      {{ configToView.ffuf_config.wordlist_path || "未设置" }}
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">扩展名:</span>
                    <div class="text-sm text-gray-300">
                      {{ configToView.ffuf_config.extensions || "未设置" }}
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">HTTP状态码:</span>
                    <div class="text-sm text-gray-300">
                      {{ configToView.ffuf_config.match_http_code || "未设置" }}
                    </div>
                  </div>
                </template>

                <!-- Subfinder特有配置 -->
                <template v-if="tool === 'subfinder'">
                  <div>
                    <span class="text-xs text-gray-500">配置文件:</span>
                    <div class="text-sm text-gray-300 break-all">
                      {{
                        configToView.subfinder_config.config_path || "未设置"
                      }}
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">最大深度:</span>
                    <div class="text-sm text-gray-300">
                      {{ configToView.subfinder_config.max_depth || "0" }}
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500">超时:</span>
                    <div class="text-sm text-gray-300">
                      {{ configToView.subfinder_config.timeout || "0" }} 秒
                    </div>
                  </div>
                </template>

                <!-- 通用配置 -->
                <div v-if="configToView[`${tool}_config`].threads">
                  <span class="text-xs text-gray-500">线程数:</span>
                  <div class="text-sm text-gray-300">
                    {{ configToView[`${tool}_config`].threads }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end p-4 border-t border-gray-700/30">
          <button
            @click="showViewDetails = false"
            class="px-4 py-2 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200"
          >
            关闭
          </button>
        </div>
      </div>
    </div>

    <FooterPage />

    <PopupNotification
      v-if="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="showNotification = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "../../api/axiosInstance";
import HeaderPage from "../HeaderPage.vue";
import FooterPage from "../FooterPage.vue";
import PopupNotification from "../Utils/PopupNotification.vue";
import { useNotification } from "../../composables/useNotification";

export default {
  name: "ToolConfig",
  components: {
    HeaderPage,
    FooterPage,
    PopupNotification,
  },
  setup() {
    const toolConfigs = ref([]);
    const toolsInfo = ref(null);
    const loading = ref(false);
    const showConfigModal = ref(false);
    const showDeleteConfirm = ref(false);
    const showViewDetails = ref(false);
    const configToDelete = ref(null);
    const configToView = ref(null);
    const isEditing = ref(false);
    const activeTab = ref("nmap");

    const {
      showNotification,
      notificationMessage,
      notificationType,
      showSuccess,
      showError,
    } = useNotification();

    // 默认配置模板
    const defaultConfig = {
      name: "",
      is_default: false,
      nmap_config: {
        enabled: true,
        ports:
          "21,22,23,25,53,80,110,111,135,139,143,443,445,465,587,993,995,1080,1433,1521,3306,3389,5432,5900,6379,8080,8443",
        scan_timeout: 300,
        concurrency: 100,
      },
      ffuf_config: {
        enabled: true,
        wordlist_path:
          "/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt",
        extensions: "php,asp,aspx,jsp,html,js",
        threads: 50,
        match_http_code: "200,204,301,302,307,401,403",
      },
      subfinder_config: {
        enabled: true,
        config_path: "/etc/subfinder/config.yaml",
        threads: 10,
        max_depth: 2,
        timeout: 60,
      },
      httpx_config: {
        enabled: true,
        threads: 50,
        timeout: 10,
      },
      fscan_config: {
        enabled: true,
        threads: 100,
      },
      afrog_config: {
        enabled: true,
        threads: 50,
      },
      nuclei_config: {
        enabled: true,
        threads: 50,
      },
    };

    const currentConfig = ref({ ...defaultConfig });

    const fetchToolConfigs = async () => {
      loading.value = true;
      try {
        const response = await api.get("/tools/configs");
        if (response.data?.status === "success") {
          toolConfigs.value = response.data.data || [];
          showSuccess("工具配置列表已更新");
        }
      } catch (error) {
        showError(error.response?.data?.message || "获取工具配置失败");
      } finally {
        loading.value = false;
      }
    };

    const fetchToolsStatus = async () => {
      try {
        const response = await api.get("/system/tools");
        if (
          response.data?.status === "success" &&
          response.data?.data?.toolsInfo
        ) {
          toolsInfo.value = response.data.data.toolsInfo;
          showSuccess("工具状态已更新");
        }
      } catch (error) {
        showError(error.response?.data?.message || "获取工具状态失败");
      }
    };

    const openCreateModal = () => {
      isEditing.value = false;
      currentConfig.value = { ...defaultConfig };
      showConfigModal.value = true;
      activeTab.value = "nmap";
    };

    const editConfig = (config) => {
      isEditing.value = true;
      currentConfig.value = JSON.parse(JSON.stringify(config)); // 深拷贝
      showConfigModal.value = true;
      activeTab.value = "nmap";
    };

    const saveConfig = async () => {
      try {
        if (isEditing.value) {
          await api.put(
            `/tools/configs/${currentConfig.value.id}`,
            currentConfig.value
          );
          showSuccess("配置已更新");
        } else {
          await api.post("/tools/configs", currentConfig.value);
          showSuccess("配置已创建");
        }
        showConfigModal.value = false;
        fetchToolConfigs();
      } catch (error) {
        showError(error.response?.data?.message || "保存配置失败");
      }
    };

    const confirmDelete = (config) => {
      configToDelete.value = config;
      showDeleteConfirm.value = true;
    };

    const deleteConfig = async () => {
      try {
        await api.delete(`/tools/configs/${configToDelete.value.id}`);
        showSuccess("配置已删除");
        showDeleteConfirm.value = false;
        fetchToolConfigs();
      } catch (error) {
        showError(error.response?.data?.message || "删除配置失败");
      }
    };

    const setAsDefault = async (id) => {
      try {
        await api.put(`/tools/configs/${id}/default`);
        showSuccess("默认配置已设置");
        fetchToolConfigs();
      } catch (error) {
        showError(error.response?.data?.message || "设置默认配置失败");
      }
    };

    const viewConfigDetails = (config) => {
      configToView.value = JSON.parse(JSON.stringify(config)); // 深拷贝
      showViewDetails.value = true;
    };

    const formatDate = (dateString) => {
      if (!dateString) return "未知时间";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(date);
    };

    onMounted(() => {
      fetchToolConfigs();
      fetchToolsStatus();
    });

    return {
      toolConfigs,
      toolsInfo,
      loading,
      showConfigModal,
      showDeleteConfirm,
      showViewDetails,
      currentConfig,
      configToDelete,
      configToView,
      isEditing,
      activeTab,
      fetchToolConfigs,
      fetchToolsStatus,
      openCreateModal,
      editConfig,
      saveConfig,
      confirmDelete,
      deleteConfig,
      setAsDefault,
      viewConfigDetails,
      formatDate,
      showNotification,
      notificationMessage,
      notificationType,
    };
  },
};
</script>

<style scoped>
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* 优化按钮点击效果 */
button:active {
  transform: scale(0.98);
}

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
</style>
