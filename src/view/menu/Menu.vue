<template>
    <div>
        <template v-for="item in menuList" :key="item.path">
            <!-- 没有子路由 -->
            <template v-if="!item.children">
                <el-menu-item v-show="!item.meta.hidden" :index="item.path" @click="goRoute">
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    <template #title>
                        <span>{{ item.meta.title }}</span>
                    </template>
                </el-menu-item>
            </template>


            <!-- 有子路由但子路由只有一个 -->
            <template v-if="item.children && item.children.length == 1">
                <el-menu-item v-show="!item.meta.hidden" :index="item.children[0].path" @click="goRoute">
                    <!--显示图标 -->
                    <el-icon>
                        <component :is="item.children[0].meta.icon"></component>
                    </el-icon>
                    {{ item.children[0].meta.title }}
                </el-menu-item>
            </template>
            <!-- 多个子路由 -->
            <el-sub-menu v-show="item.children && item.children.length > 1" :index="item.path">
                <template #title>
                    <el-icon>
                        <component :is="item.meta.icon"></component>
                    </el-icon>
                    {{ item.meta.title }}
                </template>
                <Menu :menuList="item.children"></Menu>
            </el-sub-menu>

        </template>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
defineProps(['menuList'])
const $router = useRouter()

// 单击菜单栏触发事件 这个click事件是el-menu-item 实例的自定义事件
// 参数是vc实例
let goRoute = function (vc: any) {
    $router.push(vc.index)
}
</script>

<script lang="ts">
export default {
    name: 'Menu'
}
</script>
<style lang="less" scoped>
// ::v-deep .el-sub-menu__title .el-sub-menu__icon-arrow{
//     display: none ;
// }
</style>