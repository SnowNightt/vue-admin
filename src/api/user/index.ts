// 
import request from '@/utils/request.ts'
import {loginFormData,loginResponseData,userInfoReponseData} from './type.ts'
// 统一管理接口
enum API{
    // 'http://114.115.179.162:8022/prod-api/admin/acl/index/login'
    // '/admin/acl/index/login'
    LOGIN_URL = '/admin/acl/index/login', 
    USER_INFO_URL = '/admin/acl/index/info',
    LOGOUT_URL = '/admin/acl/index/logout',
}
// 暴露请求函数
// 登陆接口方法
export const reqLogin = (data:loginFormData)=>request.post<any,loginResponseData>(API.LOGIN_URL,data)

// 获取用户信息方法
export const getUserInfo = ()=>request.get<any,userInfoReponseData>(API.USER_INFO_URL)

// 退出登陆方法
export const userlogout = ()=>request.post<any,any>(API.LOGOUT_URL,)