// 引入路由信息类型，vue提供的
import type { RouteRecordRaw } from 'vue-router'
// 定义小仓库数据类型
export interface userState{
    token:string | null
    menuRoutes: RouteRecordRaw[]
    username:string
    avatar:string
    buttons:string[]
}

// 路由信息
// [
//     {
//         path: '/login',
//         component: () => import('@/view/login/index.vue'),
//         name: 'login',
//         meta: {
//             title: '登陆',
//             hidden: true
//         },


//     },
//     {
//         path: '/',
//         component: () => import('@/view/layout/index.vue'),
//         name: 'home',
//         redirect:'/home',
//         children: [
//             {
//                 path: '/home',
//                 component: () => import('@/view/home/index.vue'),
//                 name: 'home',
//                 meta: {
//                     title: '首页',
//                     icon: 'House',
//                     hidden: false,
//                 },
//             },

//         ],
//         meta:
//         {
//             title: 'layout',
//             hidden: false,
//             icon: 'House'
//         }

//     },
//     {
//         path: '/404',
//         component: () => import('@/view/404/index.vue'),
//         name: '404',
//         meta:
//         {
//             title: '404',
//             hidden: true,
//             icon: 'House'
//         }

//     },

//     {
//         path: '/screen',
//         component: () => import('@/view/screen/index.vue'),
//         name: 'Screen',
//         meta: {
//             hidden: false,
//             title: '数据大屏',
//             icon: 'Platform',
//         },
//     },

//     {
//         path: '/acl',
//         name: 'Acl',
//         component: () => import('@/view/layout/index.vue'),
//         meta: {
//             title: '权限管理',
//             hidden: false,
//             icon: 'House'
//         },
//         children: [
//             {
//                 path: '/acl/user',
//                 component: () => import('@/view/acl/user/index.vue'),
//                 name: 'User',
//                 meta: {
//                     title: '用户管理',
//                     hidden: false,
//                     icon: 'House'
//                 }

//             },
//             {
//                 path: '/acl/role',
//                 component: () => import('@/view/acl/role/index.vue'),
//                 name: 'Role',
//                 meta: {
//                     title: '角色管理',
//                     hidden: false,
//                     icon: 'House'
//                 }

//             },
//             {
//                 path: '/acl/permission',
//                 component: () => import('@/view/acl/permission/index.vue'),
//                 name: 'Permission',
//                 meta: {
//                     title: '菜单管理',
//                     hidden: false,
//                     icon: 'House'
//                 }

//             }
//         ],

//     }
// ]