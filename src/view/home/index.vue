<template>
    <div>
        home
    </div>
</template>

<script setup lang="ts">
// 引入仓库
import useUserStore from '@/store/user/index.ts'
import { onMounted } from 'vue';
const userStore = useUserStore()
// 挂载完毕后发请求获取用户信息
onMounted(()=>{
    userStore.getUserInfo()
})
</script>

<style scoped>

</style>