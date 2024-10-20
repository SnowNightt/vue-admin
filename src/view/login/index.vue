<template>
    <div class="login-container">
        <el-row>
            <el-col :span="12" :xs="0"><div class="grid-content ep-bg-purple" />emm</el-col>
            <el-col :span="12"><div class="grid-content ep-bg-purple-light" />
                <el-form class="login" :model="form" :rules="rulse" ref="loginForm">
                    <h1>Hello</h1>
                    <h3>欢迎来到硅谷甄选</h3>
                    <div class="input">
                        <div class="input-container">
                            <el-form-item prop="username">
                                <el-input :prefix-icon="User" v-model="form.username"/>
                            </el-form-item>
                            <el-form-item prop="password">
                                <el-input :prefix-icon="Lock" :show-password="true" v-model="form.password"/>
                            </el-form-item>
                            <el-form-item>
                                <el-button :loading="isLoading" type="primary" class="btn" @click="submit">登陆</el-button>
                            </el-form-item>
                        </div>
                        
                    </div>
                    
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { reactive,ref } from 'vue';
// vue3使用组件里使用路由的方式
import { useRouter,useRoute } from 'vue-router';
// 引入图标
import {User,Lock} from '@element-plus/icons-vue'
// 引入仓库
import useUserStore from '@/store/user/index.ts'
import { ElNotification } from 'element-plus';
// 引入获取时间信息的方法
import {getTime} from '@/utils/time.ts'
// // 引入登陆参数类型
let userStore = useUserStore()
let form = reactive({
    username:'admin',
    password:'atguigu123'
})
// 定义表单验证规则
let rulse = {
    // 规则的名字，名字随意
    username:[
        {required:true,min:3,max:100,trigger:'blur',message:'长度不符合要求'}
    ],
    password:[
        {required:true,min:3,max:100,trigger:'blur',message:'长度不符合要求'}
    ]
}
// 获取form元素，检查表单验证是否通过
let loginForm = ref()


// loginForm.validate()	
// 按钮是否处于加载状态、
let isLoading = ref(false)
// vue3使用组件里使用路由的方式
const $router = useRouter()
const $route = useRoute()
console.log($route);

// 登陆点击事件
let submit = async function(){
    // 保证全部表单校验通过不通过就不会执行下面代码
    // 不传参数，验证成功返会成功的promise，验证失败返回失败的promise
    await loginForm.value.validate()
    // let res = loginForm.value.validate()
    // console.log(res);
    
    try{
        // 开启按钮加载
        isLoading.value = true
        // 调用仓库的方法进行登陆
        await userStore.userLogin(form)
        // userStore.getUserInfo()
        // 类似ELmessage
        ElNotification({
            type:'success',
            message:'欢迎回来！',
            // 晚上好，早上好，下午好
            title:getTime()
        })
        // 关闭按钮加载
        isLoading.value = false
        // 登陆成功路由跳转
        let redirect:any = $route.query.redirect
        $router.push({
            path:redirect||'/'
        })
    }catch(err){
        
        ElNotification({
            type:'error',
            message:(err as Error).message
        })
        // 关闭按钮加载
        isLoading.value = false

    }
}


</script>

<style lang="less" scoped>
.login-container{
    width: 100%;
    height: 100%;
    background: url('@/assets/images/background.jpg');
    background-size: cover;
    .login{
        width: 50%;
        top: 30vh;
        position: relative;
        background: url('@/assets/images/login_form.png');
        padding: 40px;
        .input{
            width: 100%;
            padding-top: 15px;
            display: flex;
            justify-content: center;
            .input-container{
                width: 80%;
            }
        }
        h1{
            font-size: 50px;
            color: white;
        }
        h3{
            font-size: 30px;
            margin: 20px 0;
        }
        .btn{
            width: 100%;
        }
    }
}
</style>