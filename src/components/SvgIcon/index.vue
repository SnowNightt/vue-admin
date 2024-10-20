<template>
    <div>
        <svg :style="{width,height}">
            <use :xlink:href="prefix+name" :fill="color"></use>
        </svg>
    </div>
</template>

<script setup lang="ts">
defineProps({
    prefix:{
        default:'#icon-',
        type:String,
    },
    name:{
        type:String
    },
    color:{
        type:String,
        // 默认为自身的颜色
        default:''
    },
    width:{
        type:String,
    },
    height:{
        type:String,
    }
})
</script>

<style scoped></style>