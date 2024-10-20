<template>
    <div>
        <div class="container">
            <div class="screen" ref="screen">
                <div class="top">
                    <Top></Top>
                </div>
                <div class="bottom">
                    <div class="left">
                        <Tourist class="tourist"></Tourist>
                        <Sex class="sex"></Sex>
                        <Rank class="age"></Rank>
                    </div>
                    <div class="middle">middle</div>
                    <div class="right">right</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, } from "vue";
// 引入top组件
import Top from './components/top/index.vue'
// 引入左侧组件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Rank from './components/rank/index.vue'

//获取数据大屏展示内容盒子的DOM元素
let screen = ref();
onMounted(() => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
});
//定义大屏缩放比例
function getScale(w = 1920, h = 1080) {
    const ww = window.innerWidth / w;
    const wh = window.innerHeight / h;
    return ww < wh ? ww : wh;
}
//监听视口变化
window.onresize = () => {
    screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}

</script>

<style scoped lang="less">
.container {
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background: url('./images/bg.png') no-repeat;

    .screen {
        position: fixed;
        width: 1920px;
        height: 1080px;
        left: 50%;
        top: 50%;
        transform-origin: left top;

        .bottom {
            display: flex;

            .left {
                flex: 1;
                height: 1040px;
                display: flex;
                flex-direction: column;
                // background-color: red;
                .tourist {
                    flex: 1.2;
                }

                .sex {
                    flex: 1;

                }

                .age {
                    flex: 1;
                }
            }

            .middle {
                flex: 1.5;
            }

            .right {
                flex: 1;
            }
        }
    }
}
</style>