// usePortScanDetail.js
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '../api/axiosInstance'

export function usePortScanDetail() {
    const route = useRoute();
    const scanResult = ref(null);
    const errorMessage = ref('');
    const selectedPorts = ref([]);
    const selectAll = ref(false);

    const fetchScanResult = async (id) => {
        try {
            const response = await api.get(`/results/${id}`);
            scanResult.value = response.data;
        } catch (error) {
            console.error('获取扫描结果详情失败:', error);
            errorMessage.value = '获取扫描结果详情失败';
        }
    };

    const getPortValue = (port, key) => {
        const item = port.find(i => i.Key === key);
        return item ? item.Value : '-';
    };

    const toggleReadStatus = async (port) => {
        const portID = getPortValue(port, '_id');
        const currentStatus = getPortValue(port, 'is_read');
        try {
            await api.put(`/results/${route.params.id}/entries/${portID}/read`, { isRead: !currentStatus });
            fetchScanResult(route.params.id);
        } catch (error) {
            console.error('更新端口已读状态失败:', error);
            errorMessage.value = '更新端口已读状态失败';
        }
    };

    const filteredPorts = computed(() => {
        if (!scanResult.value || !scanResult.value.Data) return [];
        const portGroup = scanResult.value.Data.find(group => group.Key === 'ports');
        return portGroup ? portGroup.Value : [];
    });

    const toggleSelectAll = () => {
        if (selectAll.value) {
            selectedPorts.value = filteredPorts.value.map(port => getPortValue(port, '_id'));
        } else {
            selectedPorts.value = [];
        }
    };

    const sendToPathScan = async (port, showNotificationMessage) => {
        try {
            const payload = {
                type: 'ffuf',
                payload: `${scanResult.value.Target}:${getPortValue(port, 'number')}`,
                parent_id: scanResult.value.id
            };

            await api.post('/tasks', payload);
            showNotificationMessage(`成功发送端口 ${getPortValue(port, 'number')} 到路径扫描`, '🔍', 'success');
        } catch (error) {
            console.error('发送到路径扫描失败:', error);
            showNotificationMessage('发送到路径扫描失败', '❌', 'error');
        }
    };

    const sendSelectedToPathScan = async (showNotificationMessage) => {
        const selectedPortDetails = selectedPorts.value
            .map(id => filteredPorts.value.find(port => getPortValue(port, '_id') === id))
            .filter(port => port);

        if (selectedPortDetails.length === 0) {
            showNotificationMessage('没有选中的端口进行路径扫描', '⚠️', 'warning');
            return;
        }

        for (const port of selectedPortDetails) {
            try {
                const payload = {
                    type: 'ffuf',
                    payload: `${scanResult.value.Target}:${getPortValue(port, 'number')}`,
                    parent_id: scanResult.value.id
                };

                await api.post('/tasks', payload);
            } catch (error) {
                console.error(`发送到路径扫描失败 (端口: ${getPortValue(port, 'number')}):`, error);
            }
        }

        showNotificationMessage(`成功发送 ${selectedPortDetails.length} 个端口到路径扫描`, '🔍', 'success');
    };

    onMounted(() => {
        const id = route.params.id;
        fetchScanResult(id);
    });

    return {
        scanResult,
        errorMessage,
        getPortValue,
        filteredPorts,
        toggleReadStatus,
        selectedPorts,
        selectAll,
        toggleSelectAll,
        sendToPathScan,
        sendSelectedToPathScan
    };
}
