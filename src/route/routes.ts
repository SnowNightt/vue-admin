// 常量路由
export const constantRoute = [
    // 登陆路由
    {
        path: '/login',
        component: () => import('@/view/login/index.vue'),
        name: 'login',
        meta: {
            title: '登陆',
            hidden: true
        },


    },
    // 首页
    {
        path: '/',
        component: () => import('@/view/layout/index.vue'),
        name: 'home',
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/view/home/index.vue'),
                name: 'home',
                meta: {
                    title: '首页',
                    icon: 'House',
                    hidden: false,
                },
            },

        ],
        meta:
        {
            title: '',
            hidden: false,
            icon: 'House'
        }

    },

    // 数据大屏
    {
        path: '/screen',
        component: () => import('@/view/screen/index.vue'),
        name: 'Screen',
        meta: {
            hidden: false,
            title: '数据大屏',
            icon: 'Platform',
        },
    },
    // 404
    {
        path: '/404',
        component: () => import('@/view/404/index.vue'),
        name: '404',
        meta:
        {
            title: '404',
            hidden: true,
            icon: 'House'
        }

    },

]

export const asyncRoute = [
    // 权限管理
    {
        path: '/acl',
        name: 'Acl',
        component: () => import('@/view/layout/index.vue'),
        meta: {
            title: '权限管理',
            hidden: false,
            icon: 'House'
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                component: () => import('@/view/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    hidden: false,
                    icon: 'House'
                }

            },
            {
                path: '/acl/role',
                component: () => import('@/view/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hidden: false,
                    icon: 'House'
                }

            },
            {
                path: '/acl/permission',
                component: () => import('@/view/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'House'
                }

            }
        ],

    },
    // 商品管理
    {
        path: '/product',
        name: 'Product',
        // component:()=>import('@/view/product/trademark'),
        component: () => import('@/view/layout/index.vue'),
        meta: {
            title: '商品管理',
            icon: 'Goods',
            hidden: false,
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/view/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCartFull',
                    hidden: false,
                },
            },
            {
                path: '/product/attr',
                component: () => import('@/view/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    icon: 'ChromeFilled',
                    hidden: false,
                },
            },
            {
                path: '/product/spu',
                component: () => import('@/view/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',
                    icon: 'Calendar',
                    hidden: false,
                },
            },
            {
                path: '/product/sku',
                component: () => import('@/view/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU管理',
                    icon: 'Orange',
                    hidden: false,
                },
            },
        ]
    }
]

// 任意路由
export const anyRoute = [
    // 404
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
            title: '任意路由',
            hidden: true,
            icon: 'DataLine',
        },
    }

]