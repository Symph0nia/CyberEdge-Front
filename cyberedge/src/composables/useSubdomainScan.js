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

        isResolving.value = true; // 设置解析状态为 true
        let successCount = 0;
        let failureCount = 0;
        let skippedCount = 0;

        try {
            for (const id of selectedSubdomains.value) {
                const subdomain = subdomains.value.find(s => s.id === id);
                if (!subdomain) continue;

                if (subdomain.ip) {
                    skippedCount++;
                    continue; // 跳过已有 IP 的子域名
                }

                try {
                    await api.put(`/results/${route.params.id}/entries/${id}/resolve`);
                    successCount++;
                } catch (error) {
                    console.error(`解析子域名 ID ${id} 失败:`, error);
                    failureCount++;
                }
            }

            await fetchScanResult(route.params.id);  // 解析完成后刷新数据

            let message = `解析完成。成功: ${successCount}`;
            if (failureCount > 0) {
                message += `, 失败: ${failureCount}`;
            }
            if (skippedCount > 0) {
                message += `, 已跳过: ${skippedCount}`;
            }
            showNotificationMessage(message, '🌐', failureCount > 0 ? 'warning' : 'success');

            selectedSubdomains.value = []; // 清空选择
            selectAll.value = false; // 重置全选状态
        } catch (error) {
            console.error('批量解析过程中发生错误:', error);
            showNotificationMessage('批量解析过程中发生错误', '❌', 'error');
        } finally {
            isResolving.value = false; // 重置解析状态为 false
        }
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
        resolveSelectedIPs
    };
}
