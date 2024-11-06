import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Home from '@/components/HomePage.vue'
import LoginPage from '@/components/Login/LoginPage.vue'
import SystemConfiguration from '@/components/Config/SystemConfiguration.vue'
import UserManagement from '@/components/User/UserManagement.vue'
import WAFDashboard from '@/components/WAFDashboard.vue'
import GoogleAuthQRCode from "@/components/Login/GoogleAuthQRCode.vue";
import TaskManagement from "@/components/Task/TaskManagement.vue";
import PortScanResults from "@/components/Port/PortScanResults.vue";
import PortScanDetail from "@/components/Port/PortScanDetail.vue";
import SubdomainScanResults from "@/components/Subdomain/SubdomainScanResults.vue";
import SubdomainScanDetail from "@/components/Subdomain/SubdomainScanDetail.vue";
import PathScanResults from "@/components/Path/PathScanResults.vue";
import PathScanDetail from "@/components/Path/PathScanDetail.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/system-configuration',
        name: 'SystemConfiguration',
        component: SystemConfiguration
    },
    {
        path: '/user-management',
        name: 'UserManagement',
        component: UserManagement
    },
    {
        path: '/setup-2fa',
        name: 'Setup2FA',
        component: GoogleAuthQRCode
    },
    {
        path: '/dashboard',
        name: 'WAFDashboard',
        component: WAFDashboard
    },
    {
        path: '/task-management', // 新增的任务管理路由
        name: 'TaskManagement',
        component: TaskManagement // 确保已导入 TaskManagement 组件
    },
    {
        path: '/port-scan-results',
        name: 'PortScanResults',
        component: PortScanResults
    },
    {
        path: '/port-scan-results/:id', // 新增详情页的路由
        name: 'PortScanDetail',
        component: PortScanDetail,
        props: true // 将路由参数作为 props 传递给组件
    },
    {
        path: '/subdomain-scan-results',
        name: 'SubdomainScanResults',
        component: SubdomainScanResults
    },
    {
        path: '/subdomain-scan-results/:id', // 新增详情页的路由
        name: 'SubdomainScanDetail',
        component: SubdomainScanDetail,
        props: true // 将路由参数作为 props 传递给组件
    },
    {
        path: '/path-scan-results',
        name: 'PathScanResults',
        component: PathScanResults // 确保导入了 PathScanResults 组件
    },
    {
        path: '/path-scan-results/:id', // 新增详情页的路由
        name: 'PathScanDetail',
        component: PathScanDetail, // 确保导入了 PathScanDetail 组件
        props: true // 将路由参数作为 props 传递给组件
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    await store.dispatch('checkAuth'); // 确保最新的认证状态

    const isAuthenticated = store.state.isAuthenticated;
    if (!isAuthenticated && to.name !== 'LoginPage' && to.name !== 'Home' && to.name !== 'Setup2FA') {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router
