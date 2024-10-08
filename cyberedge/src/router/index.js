import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import Home from '@/components/HomePage.vue'
import AttackerProfileTracking from '@/components/AttackerProfileTracking.vue'
import CustomRuleManagement from '@/components/CustomRuleManagement.vue'
import LogAnalysis from '@/components/LogAnalysis.vue'
import LoginPage from '@/components/LoginPage.vue'
import SystemConfiguration from '@/components/SystemConfiguration.vue'
import UserManagement from '@/components/UserManagement.vue'
import WAFDashboard from '@/components/WAFDashboard.vue'
import GoogleAuthQRCode from "@/components/GoogleAuthQRCode.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/attacker-profile',
        name: 'AttackerProfileTracking',
        component: AttackerProfileTracking
    },
    {
        path: '/custom-rule',
        name: 'CustomRuleManagement',
        component: CustomRuleManagement
    },
    {
        path: '/log-analysis',
        name: 'LogAnalysis',
        component: LogAnalysis
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
