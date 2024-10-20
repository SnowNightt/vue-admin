<template>
    <div class="top-bar">
        <div class="top-left">

            <!-- 设置菜单折叠图片 -->
            <el-icon style="margin-right: 10px;" @click="change">
                <component :is="settingLayoutStore.isCollapse?'Fold':'Expand'"></component>
            </el-icon>

            <el-breadcrumb separator-icon="ArrowRight">
                <!-- 动态面包屑展示，使用matched属性匹配路由                          首页是子路由但只要展示它-->
                <el-breadcrumb-item v-for="item in $route.matched" :to="item.path" v-show="item.meta.title">{{
                    item.meta.title }}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="top-right">
            <el-button icon="Refresh" circle @click="refresh"></el-button>
            <el-button icon="FullScreen" circle @click="fullScreen"></el-button>

            <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
                <el-form>
                    <el-form-item label="主题">
                        <el-color-picker @change="changeColor" v-model="color" show-alpha :predefine="predefineColors" />
                    </el-form-item>
                    <el-form-item label="暗黑模式">
                        <el-switch v-model="value1" inline-prompt active-icon="Moon" inactive-icon="Sunny"
                            @change="changeDark" style="margin-left: 20px;" />
                    </el-form-item>
                </el-form>
                <!-- 触发popover显示的元素 -->
                <template #reference>
                    <el-button icon="Setting" circle></el-button>
                </template>
            </el-popover>

            <img :src="userStore.avatar">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{ userStore.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
// 设置菜单栏是否这叠
// 引入仓库
import { ElMessage } from 'element-plus'
import useSettingLayoutStore from '@/store/settingmenu/index.ts'
import useUserStore from '@/store/user/index.ts'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
const $router = useRouter()
const $route = useRoute()
// 控制暗黑模式
// true:暗黑模式
let value1 = ref<boolean>(false)
// 设置用户名头像
const userStore = useUserStore()
// 点击按钮全屏
let fullScreen = () => {
    // 检测当前是否全屏
    let isFull = document.fullscreenElement
    if (!isFull) {
        // 设置全屏
        document.documentElement.requestFullscreen()
    } else {
        // 退出全屏
        document.exitFullscreen()
    }
}
const settingLayoutStore = useSettingLayoutStore()
let change = function () {
    settingLayoutStore.isCollapse = !settingLayoutStore.isCollapse
}
let refresh = function () {
    settingLayoutStore.refresh = !settingLayoutStore.refresh
}

// 退出登陆
const loginOut = async () => {

    try {
        await userStore.userLoginOut()
        // 跳转到login 携带query参数，当前点退出登陆时的路由路径，再登陆这个账号时回到点击退出时的路径
        $router.push({
            path: '/login',
            query: {
                redirect: $route.path
            }
        })
    } catch (err: any) {
        ElMessage({
            message: err,
            type: 'warning',
        })
    }
}
// 主题可选择的颜色
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])
// 切换主题色
const changeColor = (val: any) => {
    // document.documentElement 是全局变量时
    const el = document.documentElement
    // 获取 css 变量
    getComputedStyle(el).getPropertyValue(`--el-color-primary`)
    // 设置 css 变量
    el.style.setProperty('--el-color-primary', val)
    
}
// 暗黑模式
const changeDark = () => {
    // 得到html根标签
    let html = document.documentElement
    // html根标签加上dark类则进入暗黑模式
    if (value1.value) {
        html.className = 'dark'
    } else {
        html.className = ''
    }
}
</script>

<style scoped lang="less">
.top-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;

    .top-left {
        height: 100%;
        display: flex;
        align-items: center;
        margin-left: 20px;
    }

    .top-right {
        display: flex;
        align-items: center;
        margin-right: 20px;

        img {
            width: 24px;
            height: 24px;
            margin: 0 20px;
            border-radius: 50%;
        }

    }

}
</style>