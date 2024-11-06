<template>
  <Transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-white relative overflow-hidden">
        <div class="emoji-background">
          {{ backgroundEmojis }}
        </div>
        <h2 class="text-2xl font-bold mb-4">{{ title }}</h2>
        <p class="mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-4">
          <button
              @click="onCancel"
              class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition duration-300"
          >
            取消
          </button>
          <button
              @click="onConfirm"
              class="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition duration-300"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'ConfirmDialog',
  props: {
    show: Boolean,
    title: {
      type: String,
      default: '确认'
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'warning', 'danger'].includes(value)
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const backgroundEmojis = computed(() => {
      switch (props.type) {
        case 'info':
          return '❓🤔💭🧐🔍📝📌❗';
        case 'warning':
          return '⚠️🚧🔔🚨🛑⏰🔰';
        case 'danger':
          return '🚫⛔🔥💀☠️⚡💢';
        default:
          return '❓🤔💭🧐🔍📝📌❗';
      }
    });

    const onConfirm = () => {
      emit('confirm');
    };

    const onCancel = () => {
      emit('cancel');
    };

    return {
      backgroundEmojis,
      onConfirm,
      onCancel
    };
  }
}
</script>

<style scoped>
.emoji-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8em;
  opacity: 0.1;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
