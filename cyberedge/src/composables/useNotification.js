import { ref, nextTick } from 'vue';

export function useNotification() {
    const showNotification = ref(false);
    const notificationMessage = ref('');
    const notificationType = ref('success');

    // 预定义的通知类型配置
    const notificationConfig = {
        success: {
            icon: '✓',
            duration: 2000
        },
        error: {
            icon: '⚠',
            duration: 3000
        }
    };

    /**
     * 显示通知消息
     * @param {string} message - 通知消息内容
     * @param {('success'|'error')} [type='success'] - 通知类型
     * @param {number} [duration] - 可选：自定义显示时长（毫秒）
     */
    const showNotificationMessage = (message, type = 'success', duration) => {
        // 重置之前的通知状态
        showNotification.value = false;

        // 使用 nextTick 确保状态更新
        nextTick(() => {
            notificationMessage.value = message;
            notificationType.value = type;
            showNotification.value = true;

            // 使用配置中的默认时长或自定义时长
            const displayDuration = duration || notificationConfig[type].duration;

            // 设置自动关闭
            setTimeout(() => {
                showNotification.value = false;
            }, displayDuration);
        });
    };

    /**
     * 显示成功通知的快捷方法
     * @param {string} message - 通知消息
     * @param {number} [duration] - 显示时长
     */
    const showSuccess = (message, duration) => {
        showNotificationMessage(message, 'success', duration);
    };

    /**
     * 显示错误通知的快捷方法
     * @param {string} message - 通知消息
     * @param {number} [duration] - 显示时长
     */
    const showError = (message, duration) => {
        showNotificationMessage(message, 'error', duration);
    };

    return {
        showNotification,
        notificationMessage,
        notificationType,
        showNotificationMessage,
        showSuccess,
        showError
    };
}
