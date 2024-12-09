// useSubdomainScan.js
import { ref, computed, watch } from 'vue'
import api from '../api/axiosInstance'
import { useRoute } from 'vue-router'
import { useNotification } from './useNotification'
import { useConfirmDialog } from './useConfirmDialog'

export function useSubdomainScan() {
    const route = useRoute()

    // 使用通知和确认对话框钩子
    const { showNotification, notificationMessage, notificationType, showSuccess, showError, showWarning } = useNotification()
    const { showDialog, dialogTitle, dialogMessage, dialogType, confirm, handleConfirm, handleCancel } = useConfirmDialog()

    // 状态管理
    const scanResult = ref(null)
    const errorMessage = ref('')
    const selectedSubdomains = ref([])
    const selectAll = ref(false)
    const isResolving = ref(false)

    // 监听选中状态变化
    watch(selectedSubdomains, (newVal) => {
        selectAll.value = newVal.length === subdomains.value.length && newVal.length > 0
    })

    // 获取扫描结果
    const fetchScanResult = async (id) => {
        try {
            const response = await api.get(`/results/${id}`)
            scanResult.value = response.data
            errorMessage.value = ''
        } catch (error) {
            errorMessage.value = '获取扫描结果详情失败'
            showError('获取扫描结果详情失败')
        }
    }

    // 处理子域名数据
    const subdomains = computed(() => {
        if (!scanResult.value?.Data) return []
        const subdomainGroup = scanResult.value.Data.find(group => group.Key === "subdomains")
        if (!subdomainGroup?.Value?.length) return []

        return subdomainGroup.Value.map(subdomainData => ({
            id: subdomainData.find(item => item.Key === "_id")?.Value || '',
            domain: subdomainData.find(item => item.Key === "domain")?.Value || '',
            is_read: subdomainData.find(item => item.Key === "is_read")?.Value || false,
            ip: subdomainData.find(item => item.Key === "ip")?.Value || ''
        }))
    })

    // 切换全选
    const toggleSelectAll = () => {
        selectedSubdomains.value = selectAll.value
            ? subdomains.value.map(s => s.id)
            : []
    }

    // 切换已读状态
    const toggleReadStatus = async (subdomain) => {
        try {
            await api.put(
                `/results/${route.params.id}/entries/${subdomain.id}/read`,
                { isRead: !subdomain.is_read }
            )
            await fetchScanResult(route.params.id)
            showSuccess(`已${subdomain.is_read ? '标记为未读' : '标记为已读'}`)
        } catch (error) {
            showError('更新状态失败')
        }
    }

    // 解析单个IP
    const resolveIP = async (subdomain) => {
        try {
            const confirmed = await confirm({
                title: '解析IP',
                message: `是否解析 ${subdomain.domain} 的IP地址？`,
                type: 'info'
            })

            if (!confirmed) return

            await api.put(`/results/${route.params.id}/entries/${subdomain.id}/resolve`)
            await fetchScanResult(route.params.id)
            showSuccess('IP解析成功')
        } catch (error) {
            showError('IP解析失败')
        }
    }

    // 批量解析IP
    const resolveSelectedIPs = async () => {
        if (!selectedSubdomains.value.length) {
            showWarning('请先选择子域名')
            return
        }

        try {
            const confirmed = await confirm({
                title: '批量解析IP',
                message: `是否解析选中的 ${selectedSubdomains.value.length} 个子域名的IP？`,
                type: 'info'
            })

            if (!confirmed) return

            isResolving.value = true
            let successCount = 0
            let failureCount = 0
            let skippedCount = 0

            for (const id of selectedSubdomains.value) {
                const subdomain = subdomains.value.find(s => s.id === id)
                if (!subdomain) continue

                if (subdomain.ip) {
                    skippedCount++
                    continue
                }

                try {
                    await api.put(`/results/${route.params.id}/entries/${id}/resolve`)
                    successCount++
                } catch {
                    failureCount++
                }
            }

            await fetchScanResult(route.params.id)
            selectedSubdomains.value = []
            selectAll.value = false

            let message = `解析完成。成功: ${successCount}`
            if (failureCount > 0) message += `, 失败: ${failureCount}`
            if (skippedCount > 0) message += `, 已跳过: ${skippedCount}`

            failureCount > 0 ? showWarning(message) : showSuccess(message)
        } catch (error) {
            showError('批量解析失败')
        } finally {
            isResolving.value = false
        }
    }

    // 发送到端口扫描
    const sendToPortScan = async (subdomain) => {
        if (!subdomain.ip) {
            showWarning('没有可用的IP')
            return
        }

        try {
            const confirmed = await confirm({
                title: '发送到端口扫描',
                message: `是否将 ${subdomain.domain} (${subdomain.ip}) 发送到端口扫描？`,
                type: 'info'
            })

            if (!confirmed) return

            await api.post('/tasks', {
                type: 'nmap',
                payload: subdomain.ip,
                parent_id: scanResult.value.id
            })
            showSuccess('已发送到端口扫描')
        } catch {
            showError('发送失败')
        }
    }

    // 批量发送到端口扫描
    const sendSelectedToPortScan = async () => {
        const selectedDomains = selectedSubdomains.value
            .map(id => subdomains.value.find(sub => sub.id === id))
            .filter(subdomain => subdomain?.ip)

        const uniqueIPs = [...new Set(selectedDomains.map(subdomain => subdomain.ip))]

        if (!uniqueIPs.length) {
            showWarning('没有可用的IP')
            return
        }

        try {
            const confirmed = await confirm({
                title: '批量发送到端口扫描',
                message: `是否将选中的 ${uniqueIPs.length} 个IP发送到端口扫描？`,
                type: 'info'
            })

            if (!confirmed) return

            for (const ip of uniqueIPs) {
                await api.post('/tasks', {
                    type: 'nmap',
                    payload: ip,
                    parent_id: scanResult.value.id
                })
            }
            showSuccess(`已发送 ${uniqueIPs.length} 个IP到端口扫描`)
        } catch {
            showError('批量发送失败')
        }
    }

    return {
        // 状态
        scanResult,
        errorMessage,
        subdomains,
        selectedSubdomains,
        selectAll,
        isResolving,

        // 方法
        fetchScanResult,
        toggleSelectAll,
        toggleReadStatus,
        resolveIP,
        resolveSelectedIPs,
        sendToPortScan,
        sendSelectedToPortScan,

        // 通知相关
        showNotification,
        notificationMessage,
        notificationType,

        // 确认对话框相关
        showDialog,
        dialogTitle,
        dialogMessage,
        dialogType,
        handleConfirm,
        handleCancel
    }
}
