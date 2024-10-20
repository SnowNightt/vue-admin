import router from './route/index.ts'
// 引入ts类型
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
// 引入进度条
import nprogress from 'nprogress'
// 引入nprogress（进度条）样式
import 'nprogress/nprogress.css'
// 引入获取token的方法
import { getUserToken } from '@/utils/token.ts'
// 引入仓库
import useUserStore from '@/store/user/index.ts'

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    // 设置网页标签标题
    document.title = '硅谷甄选-'+to.meta.title
    console.log(next);
    
    const userStore = useUserStore()
    nprogress.start()
    let token = getUserToken()
    // 已登录
    if (token) {
        // 已登录且去login
        if (to.path == '/login') {
            // 原地tp
            next(from.path)
        } else {
            // 已登录且去其他路由

            if (userStore.username) { // 有用户数据
                next()
            } else {    //没有用户数据
                // 发送请求获取用户数据
                try{
                    // 获取用户信息是否成功
                    await userStore.getUserInfo()
                    //万一:刷新的时候是异步路由,有可能获取到用户信息、但异步路由还没有加载完毕,出现空白的效果
                    next({...to,replace:true})
                }catch(err){
                    // 获取用户信息失败
                    // 1.token过期
                    // 2.手动修改本地存储的token
                    // 路由跳转不需要看token
                    // 清除用户数据，跳到login重新登陆
                    await userStore.userLoginOut()
                    next({
                        path:'/login',
                        query:{
                            redirect:to.path
                        }
                    })

                }
                

            }
        }
    }
    // 未登录
    else {
        // 未登录且去login
        if (to.path == '/login') {
            next()
        } else {
            // 未登录且去其他路由
            next({
                path: '/login',
                // 得到想去的路由，等登陆成功后跳转到该路由
                query: { redirect: to.path }
            })
        }
    }
    next()
})

router.afterEach(() => {
    nprogress.done()
})