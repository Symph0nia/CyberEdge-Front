import { ref } from 'vue';

export function useNotification() {
    const showNotification = ref(false);
    const notificationMessage = ref('');
    const notificationEmoji = ref('');
    const notificationType = ref('success');

    const showNotificationMessage = (message, emoji = '🎉', type = 'success', duration = 3000) => {
        notificationMessage.value = message;
        notificationEmoji.value = emoji;
        notificationType.value = type;
        showNotification.value = true;

        setTimeout(() => {
            showNotification.value = false;
        }, duration);
    };

    return {
        showNotification,
        notificationMessage,
        notificationEmoji,
        notificationType,
        showNotificationMessage
    };
}
