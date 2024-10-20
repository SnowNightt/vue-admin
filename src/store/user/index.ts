import { defineStore } from 'pinia'
import { reqLogin, getUserInfo, userlogout } from '@/api/user/index'
import { loginFormData, loginResponseData, userInfoReponseData } from '@/api/user/type.ts'
import type { userState } from './type/index.ts'
// 引入路由信息
import { constantRoute ,asyncRoute,anyRoute} from '@/route/routes.ts'
// 获取token的方法
import { setUserToken, removeUserToken } from '@/utils/token.ts'

//
import router from '@/route'
import type {RouteRecordRaw} from 'vue-router'

//引入深拷贝方法
import cloneDeep from 'lodash/cloneDeep'
// 过滤异步路由
function fliterAsyncRoute(routes:string[],asyncRoutes:any){
    return asyncRoutes.filter((item:any)=>{
        if(routes.includes(item.name)){
            if(item.children&&item.children.length>=1){
                item.children = fliterAsyncRoute(routes,item.children)
            }
            return true
        }
    })
}

let useUserStore = defineStore('User', {
    state: (): userState => {
        return {
            // token
            token: localStorage.getItem("TOKEN"),
            // 路由信息
            menuRoutes: constantRoute,
            username: '',
            avatar: '',
            buttons:[]
        }
    },
    actions: {
        // 该函数返回一个promise对象（async定义的函数），不设置返回值默认返回undefined，promise中算成功，所以需要手动设置返回值
        async userLogin(data: loginFormData) {
            // 发送登陆请求
            let res: loginResponseData = await reqLogin(data)

            if (res.code === 200) {
                // 保存token，非持久化的
                this.token = (res.data as string)
                // 本地存一份
                setUserToken((res.data as string))
                // async函数返回一个成功的promise
                return 'ok'
            } else {
                return Promise.reject(res.message)
            }
        },
        // 获取用户信息
        async getUserInfo() {
            let res: userInfoReponseData = await getUserInfo()
            if (res.code == 200) {
                // 过滤异步路由                          用户有的路由    所有的异步路由
                const userAsyncRoute = fliterAsyncRoute(res.data.routes, cloneDeep(asyncRoute))
                // 把btn权限传入，在自定义指令要用
                this.buttons = res.data.buttons
                // 将用户所有的路由整合
                this.menuRoutes = [...constantRoute,...userAsyncRoute,...anyRoute];
                //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
                [...userAsyncRoute,...anyRoute].forEach((item:RouteRecordRaw)=>{
                    router.addRoute(item)
                })
                this.username = res.data.name
                this.avatar = res.data.avatar
                return 'ok'
            } else {
                return Promise.reject(new Error(res.message))
            }
        },

        // 退出登陆
        async userLoginOut() {
            let res: any = await userlogout()
            if (res.code == 200) {
                // 清除token
                removeUserToken()
                // 删除用户信息
                this.avatar = ''
                this.username = ''
                this.token = ''
                return 'ok'
            }else{
                return Promise.reject('退出失败')
            }

        }
    },
    getters: {}
})
export default useUserStore
