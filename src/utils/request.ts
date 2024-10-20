import useUserStore from '@/store/user/index.ts'

import axios from 'axios'
import { ElMessage } from 'element-plus'
let request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,//从开发环境变量中引入，baseURL为'/api'
    timeout: 50000
})

// 请求拦截器
request.interceptors.request.use((config) => {
    // 发送请求时请求头设置token
    let userStore = useUserStore()

    if (userStore.token) {
        config.headers.token = userStore.token
    }
    return config
})

// 响应拦截器
request.interceptors.response.use((res) => {
    return res.data
}, (err) => {
    let message = ''
    let status = err.response.status
    switch (status) {
        case 401:
            message = 'token过期'
            break;
        case 403:
            message = '无权访问'
            break;
        case 404:
            message = '页面丢失'
            break;
        case 500:
            message = '服务器错误'
            break;
        default:
            message = '网络错误'
            break;
    }
    ElMessage({
        type: 'error',
        message
    })
    return Promise.reject(err)
})
export default request;