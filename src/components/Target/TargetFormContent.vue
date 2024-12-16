<!-- components/Target/TargetFormContent.vue -->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >目标名称</label
      >
      <input
        v-model="formData.name"
        type="text"
        placeholder="请输入目标名称"
        class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
        required
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1"
        >目标类型</label
      >
      <select
        v-model="formData.type"
        class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
        required
      >
        <option value="domain">域名</option>
        <option value="ip">IP地址</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1">
        {{ formData.type === "domain" ? "域名" : "IP地址" }}
      </label>
      <input
        v-model="formData.target"
        type="text"
        @input="handleTargetInput"
        :placeholder="
          formData.type === 'domain'
            ? '请输入域名（不含 http:// 或 https://）'
            : '请输入IP地址'
        "
        class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
        :class="{ 'border-red-500/50': validationError }"
        required
      />
      <!-- 错误提示 -->
      <p v-if="validationError" class="mt-1 text-sm text-red-400">
        {{ validationError }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-300 mb-1">描述</label>
      <textarea
        v-model="formData.description"
        rows="3"
        placeholder="请输入目标描述"
        class="w-full px-4 py-2.5 rounded-xl bg-gray-700/50 text-gray-100 border border-gray-600/30 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none transition-all duration-200"
      ></textarea>
    </div>

    <!-- Footer buttons -->
    <div class="flex justify-end space-x-4 mt-6">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-600/50"
      >
        取消
      </button>
      <button
        type="submit"
        :disabled="isSubmitDisabled || isSubmitting"
        class="px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-500/50 hover:bg-blue-600/50 text-blue-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="ri-save-line mr-2"></i>
        {{ isSubmitting ? "提交中..." : "确定" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, computed, watch } from "vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      name: "",
      type: "domain",
      target: "",
      description: "",
    }),
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const formData = ref({ ...props.initialData });
const validationError = ref("");

// 验证函数
const validateDomain = (domain) => {
  const domainRegex =
    /^(?!http(s)?:\/\/)((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/;
  return domainRegex.test(domain);
};

const validateIP = (ip) => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!ipv4Regex.test(ip)) return false;

  const parts = ip.split(".");
  return parts.every((part) => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255;
  });
};

// 验证状态计算
const validation = computed(() => {
  if (!formData.value.name || !formData.value.target) {
    return {
      isValid: false,
      error: "请填写必填字段",
    };
  }

  if (formData.value.type === "domain") {
    return {
      isValid: validateDomain(formData.value.target),
      error: "请输入有效的域名，不要包含 http:// 或 https://",
    };
  } else if (formData.value.type === "ip") {
    return {
      isValid: validateIP(formData.value.target),
      error: "请输入有效的 IPv4 地址",
    };
  }

  return { isValid: true, error: "" };
});

// 使用 watch 来更新验证错误信息
watch(
  () => validation.value,
  (newVal) => {
    validationError.value = !newVal.isValid ? newVal.error : "";
  }
);

// 计算提交按钮是否禁用
const isSubmitDisabled = computed(() => {
  return !validation.value.isValid;
});

// 处理目标值变化
const handleTargetInput = () => {
  if (formData.value.type === "domain") {
    formData.value.target = formData.value.target.replace(/^https?:\/\//i, "");
  }
};

const handleSubmit = async () => {
  if (isSubmitDisabled.value) return;

  // 构造提交数据
  const submitData = {
    name: formData.value.name.trim(),
    type: formData.value.type,
    target: formData.value.target.trim(),
    description: formData.value.description.trim(),
    status: "active", // 添加默认状态
  };

  // 检查必填字段
  if (!submitData.name || !submitData.target) {
    validationError.value = "请填写必填字段";
    return;
  }

  try {
    emit("submit", submitData);
  } catch (error) {
    console.error("Form submission error:", error);
    validationError.value = "提交失败，请重试";
  }
};

onMounted(() => {
  formData.value = { ...props.initialData };
});
</script>
