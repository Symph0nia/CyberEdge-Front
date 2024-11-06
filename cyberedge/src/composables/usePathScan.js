import { ref, computed } from 'vue'
import api from '../api/axiosInstance'
import { useRoute } from 'vue-router'

export function usePathScan() {
    const route = useRoute();
    const scanResult = ref(null);
    const errorMessage = ref('');
    const selectedPaths = ref([]);
    const selectAll = ref(false);
    const isResolving = ref(false);

    const fetchScanResult = async (id) => {
        try {
            const response = await api.get(`/results/${id}`);
            scanResult.value = response.data;
        } catch (error) {
            console.error('获取扫描结果详情失败:', error);
            errorMessage.value = '获取扫描结果详情失败';
        }
    };

    const paths = computed(() => {
        if (!scanResult.value || !scanResult.value.Data) return [];
        const pathGroup = scanResult.value.Data.find(group => group.Key === "paths");
        if (!pathGroup || !Array.isArray(pathGroup.Value)) return [];

        return pathGroup.Value.map(pathData => {
            const idItem = pathData.find(item => item.Key === "_id");
            const pathItem = pathData.find(item => item.Key === "path");
            const statusItem = pathData.find(item => item.Key === "status");
            const isReadItem = pathData.find(item => item.Key === "is_read");

            return {
                id: idItem ? idItem.Value : '',
                Path: pathItem ? pathItem.Value : '',
                Status: statusItem ? statusItem.Value : '',
                IsRead: isReadItem ? isReadItem.Value : false,
            };
        });
    });

    const toggleSelectAll = () => {
        if (selectAll.value) {
            selectedPaths.value = paths.value.map(p => p.id);
        } else {
            selectedPaths.value = [];
        }
    };

    const toggleReadStatus = async (path) => {
        try {
            await api.put(`/results/${route.params.id}/entries/${path.id}/read`, { isRead: !path.IsRead });
            await fetchScanResult(route.params.id);
        } catch (error) {
            console.error('更新路径已读状态失败:', error);
        }
    };

    const resolveIP = async (path) => {
        try {
            await api.put(`/results/${route.params.id}/entries/${path.id}/resolve`);
            await fetchScanResult(route.params.id);  // 解析完成后刷新数据
        } catch (error) {
            console.error('解析路径失败:', error);
        }
    };

    const resolveSelectedIPs = async (showNotificationMessage) => {
        if (selectedPaths.value.length === 0) {
            showNotificationMessage('请先选择路径', '⚠️', 'warning');
            return;
        }

        isResolving.value = true;
        let successCount = 0;
        let failureCount = 0;

        try {
            for (const id of selectedPaths.value) {
                const path = paths.value.find(p => p.id === id);
                if (!path) continue;

                // 假设 resolveIP 函数会处理 IP 解析逻辑
                try {
                    await api.put(`/results/${route.params.id}/entries/${id}/resolve`);
                    successCount++;
                } catch (error) {
                    console.error(`解析路径 ID ${id} 失败:`, error);
                    failureCount++;
                }
            }

            await fetchScanResult(route.params.id);

            let message = `解析完成。成功: ${successCount}`;
            if (failureCount > 0) {
                message += `, 失败: ${failureCount}`;
            }
            showNotificationMessage(message, '🌐', failureCount > 0 ? 'warning' : 'success');

            selectedPaths.value = [];
            selectAll.value = false;
        } catch (error) {
            console.error('批量解析过程中发生错误:', error);
            showNotificationMessage('批量解析过程中发生错误', '❌', 'error');
        } finally {
            isResolving.value = false;
        }
    };

    const sendToPortScan = async (path, showNotificationMessage) => {
        // 具体的发送到端口扫描逻辑
        // 示例代码
        const payload = {
            type: 'nmap',
            payload: path.Path, // 假设 Path 是路径或其他需要的信息
            parent_id: scanResult.value.id // 使用 scanResult 的 ID 作为 parent_id
        };

        try {
            await api.post('/tasks', payload);
            showNotificationMessage(`成功发送路径 ${path.Path} 到端口扫描`, '🌐', 'success');
        } catch (error) {
            console.error('发送到端口扫描失败:', error);
            showNotificationMessage('发送到端口扫描失败', '❌', 'error');
        }
    };

    const sendSelectedToPortScan = async (showNotificationMessage) => {
        const selectedPathsData = selectedPaths.value
            .map(id => paths.value.find(p => p.id === id))
            .filter(path => path); // 只选择存在的路径

        if (selectedPathsData.length === 0) {
            showNotificationMessage('没有选中的路径进行端口扫描', '⚠️', 'warning');
            return;
        }

        for (const path of selectedPathsData) {
            await sendToPortScan(path, showNotificationMessage);
        }

        showNotificationMessage(`成功发送 ${selectedPathsData.length} 个路径到端口扫描`, '🌐', 'success');
    };

    return {
        scanResult,
        errorMessage,
        paths,
        selectedPaths,
        selectAll,
        isResolving,
        fetchScanResult,
        toggleSelectAll,
        toggleReadStatus,
        resolveIP,
        resolveSelectedIPs,
        sendToPortScan,
        sendSelectedToPortScan
    };
}
