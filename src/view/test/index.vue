<template>
    <div>
        <!-- <p ref="msg">Hello, World!</p> -->
        <p ref="msg" v-if="isShow">emmm</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
let msg = ref<any>()
let isShow= ref<boolean>(false)

onMounted(() => {
    nextTick(() => {
        console.log(2,msg.value.innerText);
    })
    isShow.value = true
    console.log(333);
    

})

</script>

<style scoped></style>