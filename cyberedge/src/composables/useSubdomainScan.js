import { ref, computed } from 'vue'
import api from '../api/axiosInstance'
import { useRoute } from 'vue-router'

export function useSubdomainScan() {
    const route = useRoute();
    const scanResult = ref(null);
    const errorMessage = ref('');
    const selectedSubdomains = ref([]);
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

    const subdomains = computed(() => {
        if (!scanResult.value || !scanResult.value.Data) return [];
        const subdomainGroup = scanResult.value.Data.find(group => group.Key === "subdomains");
        if (!subdomainGroup || !Array.isArray(subdomainGroup.Value)) return [];

        return subdomainGroup.Value.map(subdomainData => {
            const idItem = subdomainData.find(item => item.Key === "_id");
            const domainItem = subdomainData.find(item => item.Key === "domain");
            const isReadItem = subdomainData.find(item => item.Key === "is_read");
            const ipItem = subdomainData.find(item => item.Key === "ip");

            return {
                id: idItem ? idItem.Value : '',
                domain: domainItem ? domainItem.Value : '',
                is_read: isReadItem ? isReadItem.Value : false,
                ip: ipItem ? ipItem.Value : ''
            };
        });
    });

    const toggleSelectAll = () => {
        if (selectAll.value) {
            selectedSubdomains.value = subdomains.value.map(s => s.id);
        } else {
            selectedSubdomains.value = [];
        }
    };

    const toggleReadStatus = async (subdomain) => {
        try {
            await api.put(`/results/${route.params.id}/entries/${subdomain.id}/read`, { isRead: !subdomain.is_read });
            await fetchScanResult(route.params.id);
        } catch (error) {
            console.error('更新子域名已读状态失败:', error);
        }
    };

    const resolveIP = async (subdomain) => {
        try {
            await api.put(`/results/${route.params.id}/entries/${subdomain.id}/resolve`);
            await fetchScanResult(route.params.id);  // 解析完成后刷新数据
        } catch (error) {
            console.error('解析IP失败:', error);
        }
    };

    const resolveSelectedIPs = async (showNotificationMessage) => {
        if (selectedSubdomains.value.length === 0) {
            showNotificationMessage('请先选择子域名', '⚠️', 'warning');
            return;
        }

        isResolving.value = true;
        let successCount = 0;
        let failureCount = 0;
        let skippedCount = 0;

        try {
            for (const id of selectedSubdomains.value) {
                const subdomain = subdomains.value.find(s => s.id === id);
                if (!subdomain) continue;

                if (subdomain.ip) {
                    skippedCount++;
                    continue;
                }

                try {
                    await api.put(`/results/${route.params.id}/entries/${id}/resolve`);
                    successCount++;
                } catch (error) {
                    console.error(`解析子域名 ID ${id} 失败:`, error);
                    failureCount++;
                }
            }

            await fetchScanResult(route.params.id);

            let message = `解析完成。成功: ${successCount}`;
            if (failureCount > 0) {
                message += `, 失败: ${failureCount}`;
            }
            if (skippedCount > 0) {
                message += `, 已跳过: ${skippedCount}`;
            }
            showNotificationMessage(message, '🌐', failureCount > 0 ? 'warning' : 'success');

            selectedSubdomains.value = [];
            selectAll.value = false;
        } catch (error) {
            console.error('批量解析过程中发生错误:', error);
            showNotificationMessage('批量解析过程中发生错误', '❌', 'error');
        } finally {
            isResolving.value = false;
        }
    };

    const sendToPortScan = async (subdomain, showNotificationMessage) => {
        if (!subdomain.ip) {
            showNotificationMessage('没有可用的 IP，无法发送到端口扫描', '⚠️', 'warning');
            return;
        }

        try {
            const payload = {
                type: 'nmap',
                payload: subdomain.ip,
                parent_id: scanResult.value.id // 使用 scanResult 的 ID 作为 parent_id
            };

            await api.post('/tasks', payload);
            showNotificationMessage(`成功发送 ${subdomain.domain} 到端口扫描`, '🌐', 'success');
        } catch (error) {
            console.error('发送到端口扫描失败:', error);
            showNotificationMessage('发送到端口扫描失败', '❌', 'error');
        }
    };

    // 批量发送选中的子域名到端口扫描
    const sendSelectedToPortScan = async (showNotificationMessage) => {
        const selectedDomains = selectedSubdomains.value
            .map(id => subdomains.value.find(sub => sub.id === id))
            .filter(subdomain => subdomain && subdomain.ip); // 只选择有 IP 的子域名

        const uniqueIPs = [...new Set(selectedDomains.map(subdomain => subdomain.ip))]; // 去重

        if (uniqueIPs.length === 0) {
            showNotificationMessage('没有可用的 IP 进行端口扫描', '⚠️', 'warning');
            return;
        }

        for (const ip of uniqueIPs) {
            try {
                const payload = {
                    type: 'nmap',
                    payload: ip,
                    parent_id: scanResult.value.id
                };

                await api.post('/tasks', payload); // 调用 API 发送任务
            } catch (error) {
                console.error(`发送到端口扫描失败 (IP: ${ip}):`, error);
            }
        }

        showNotificationMessage(`成功发送 ${uniqueIPs.length} 个 IP 到端口扫描`, '🌐', 'success');
    };

    return {
        scanResult,
        errorMessage,
        subdomains,
        selectedSubdomains,
        selectAll,
        isResolving,
        fetchScanResult,
        toggleSelectAll,
        toggleReadStatus,
        resolveIP,
        resolveSelectedIPs,
        sendToPortScan,
        sendSelectedToPortScan // 导出批量发送方法
    };
}
