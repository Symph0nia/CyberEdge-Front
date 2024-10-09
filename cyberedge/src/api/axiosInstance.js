// src/api/axiosInstance.js

import axios from 'axios';

// 创建一个 axios 实例
const api = axios.create({
    baseURL: 'http://172.20.2.226:8081',
    withCredentials: true // 允许跨域请求发送 cookies
});

// 添加请求拦截器，将 JWT 添加到请求头中
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
