<template>
    <div class="logo-container" v-if="!logoSetting.isHidden" >
        <img :src="logoSetting.img" >
        <h1 >{{logoSetting.title}}</h1>
    </div>
</template>

<script setup lang="ts">
// 引入logo配置项
import logoSetting from '../../../../setting.ts'
</script>

<style lang="less" scoped>
.logo-container{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    
    
    img{
        width: 50px;
        height: 50px;
        
    }
    h1{
        font-size: 20px;
        color: white;
        padding-left: 5px;
        font-weight: bold;
        white-space: nowrap;
    }
}

</style>