<template>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// import { onMounted } from 'vue';
// import request from './utils/request';
// onMounted(()=>{
// request({
//   url:'/user/info',
//   method:'post',
//   data:{
//     username:'admin',
//     password:'111111'
//   }
// })
// })



</script>

<style lang="less" scoped>


.container{
  height: 100vh;
  width: 100vw;
}
</style>