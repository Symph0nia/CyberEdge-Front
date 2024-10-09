<template>
  <Transition name="slide-fade">
    <div v-if="show" class="popup-container">
      <div :class="['popup-content', type === 'success' ? 'success' : 'error']">
        <div class="emoji-container">
          {{ emoji }}
        </div>
        <div class="message">
          {{ message }}
        </div>
        <div class="emoji-background">
          {{ backgroundEmojis }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';

export default {
  name: 'PopupNotification',
  props: {
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    },
    emoji: {
      type: String,
      default: '🎉'
    },
    type: {
      type: String,
      default: 'success',
      validator: (value) => ['success', 'error'].includes(value)
    }
  },
  setup(props, { emit }) {
    const show = ref(false);
    let timer;

    const backgroundEmojis = computed(() => {
      return props.type === 'success'
          ? '🎉✨🎊🏆🥇🌟💫👍👏💯🚀'
          : '😓😢😭😿💔❌⛔🚫⚠️💣';
    });

    onMounted(() => {
      show.value = true;
      timer = setTimeout(() => {
        show.value = false;
        emit('close');
      }, props.duration);
    });

    onUnmounted(() => {
      clearTimeout(timer);
    });

    return { show, backgroundEmojis };
  }
}
</script>

<style scoped>
.popup-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

.popup-content {
  color: white;
  padding: 20px 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
}

.success {
  background-color: rgba(72, 187, 120, 0.9);
}

.error {
  background-color: rgba(245, 101, 101, 0.9);
}

.emoji-container {
  font-size: 3em;
  margin-right: 20px;
  animation: bounce 0.6s ease infinite alternate;
}

.message {
  font-size: 1.2em;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.emoji-background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4em;
  opacity: 0.1;
  white-space: nowrap;
  pointer-events: none;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-50px) translateX(-50%);
  opacity: 0;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}
</style>
