<template>
    <div class="layout-container">
        <!-- 左侧导航栏 -->
        <div class="nav-bar" :class="{ flod: settingLayoutStore.isCollapse }">
            <Logo></Logo>
            <el-scrollbar class="scroll-bar">
                <!-- :collapse="settingLayoutStore.isCollapse" -->
                <el-menu 
                    :default-active="$route.path" 
                    text-color="white" 
                    background-color="#001529"
                    :collapse="settingLayoutStore.isCollapse"
                    :collapse-transition="true">
                    <Menu :menuList="userStore.menuRoutes"></Menu>
                </el-menu>
            </el-scrollbar>
        </div>
        <!-- 顶部导航栏 -->
        <div class="topbar" :class="{ flod: settingLayoutStore.isCollapse }">
            <TopBar></TopBar>
        </div>
        <!-- 内容区 -->
        <div class="main" :class="{ flod: settingLayoutStore.isCollapse }">
            <router-view v-slot="{ Component }">
                <component :is="Component" v-if="fold" />
            </router-view>
        </div>
    </div>
</template>

<script setup lang="ts">
// 引入获取路由信息
import { useRoute } from 'vue-router'
// 引入组件
import Logo from './logo/index.vue'
import TopBar from './topbar/index.vue'
// 引入仓库
import useUserStore from '@/store/user/index.ts'
// 引入菜单组件
import Menu from '@/view/menu/Menu.vue'
// 引入仓库设置菜单折叠
import useSettingLayoutStore from '@/store/settingmenu/index.ts'
import { watch, ref, nextTick } from 'vue'
const settingLayoutStore = useSettingLayoutStore()

// 刷新业务
// v-if可以销毁和创建组件，利用这点实现刷新业务。
// fold绑定给内容区的v-if,仓库中设置refresh属性为布尔值，点击刷新按钮触发取反，监听refresh，它变化就触发刷新。
let fold = ref(true)
// 监听refresh
watch(() => settingLayoutStore.refresh, () => {
    fold.value = false
    // dom更新渲染完后执行nexttick
    nextTick(() => {
        fold.value = true
    })
})


const userStore = useUserStore()
const $route = useRoute()

</script>

<style lang="less" scoped>
.layout-container {
    height: 100vh;
    width: 100%;

    .nav-bar {
        width: 260px;
        height: 100vh;
        background-color: #001529;
        transition: all .3s;

        &.flod {
            width: 50px;
        }

        .scroll-bar {
            height: calc(100vh - 50px);

            .el-menu {
                border-right: none;
            }
        }
    }

    .topbar {
        height: 50px;
        width: calc(100% - 260px);
        position: fixed;
        top: 0;
        left: 260px;
        transition: all .3s;

        &.flod {
            width: calc(100% - 50px);
            left: 50px;
        }
    }

    .main {
        box-sizing: border-box;
        width: calc(100% - 260px);
        height: calc(100vh - 50px);
       
        position: absolute;
        left: 260px;
        top: 50px;
        padding: 20px;
        // 防止内容区的内容过长出现滚动条导致滚动时其他组件不会跟着下来的bug，加这个让内容区自适应
        overflow: auto;
        transition: all .3s;

        &.flod {
            width: calc(100vw - 50px);
            left: 50px;
        }
    }
}
</style>


