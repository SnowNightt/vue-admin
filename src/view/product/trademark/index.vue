<template>
    <div>
        <el-card class="box-card">
            <!-- 添加品牌按钮 -->
            <el-button type="primary" icon="plus" @click="changeShowTrue" v-has="'btn.Trademark.add'">添加品牌</el-button>
            <!-- table表格 -->
            <el-table style="width: 100%" border :data="records">

                <!-- 显示序号                                             type为index时该列值从1开始逐个递增 -->
                <el-table-column label="序号" width="80px" align="center" type="index" />

                <!-- 显示品牌名称，可以不用插槽，底层是用div的 -->
                <el-table-column prop="tmName" label="品牌名称" />

                <!-- 显示logo图片，必须用插槽 -->
                <el-table-column label="品牌LOGO">
                    <template #="{ row }">
                        <img :src="row.logoUrl" style="width: 100px;height: 100px;" />
                    </template>
                </el-table-column>

                <!-- 显示按钮 -->
                <el-table-column label="品牌操作">
                    <template #="{ row }">
                        <el-button type="primary" icon="Edit" size="small" @click="editTrademark(row)"></el-button>
                        <el-popconfirm :title="`确定要删除${row.tmName}?`" width="300px" icon="Delete"
                            @confirm="delTrademark(row.id)">
                            <template #reference>
                                <el-button type="primary" icon="Delete" size="small"></el-button>
                            </template>
                        </el-popconfirm>

                    </template>
                </el-table-column>

            </el-table>

            <!-- 分页器 -->
            <el-pagination v-model:current-page="currentPage" v-model:page-size="limit" :page-sizes="[3, 5, 7, 9]"
                layout="prev, pager, next, jumper,->,total, sizes" :total="total" @current-change="getTrademarkReq"
                @size-change="changeSize" />
        </el-card>
        <!-- 弹出对话框 -->
        <el-dialog v-model="isShow" :title="addTrademarkInfo.id != 0 ? '修改品牌' : '添加品牌'" @close="close">
            <el-form style="width: 80%;" :rules="rules" ref="formRef" :model="addTrademarkInfo">
                <el-form-item label="品牌名称" label-width="80px" prop="tmName">
                    <el-input v-model="addTrademarkInfo.tmName" placeholder="请输入品牌名称"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" label-width="80px" prop="logoUrl">
                    <!-- on-success：上传成功的钩子
                        before-upload：上传前的钩子
                        action：请求服务器的URL，图片上传到服务器
                        show-file-list：是否显示已上传文件列表
                    -->
                    <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleTrademarkSuccess" :before-upload="beforeTrademarkUpload"
                        :on-error="handleTrademarkError">
                        <!-- 有图片就显示图片否则显示默认的东西 -->
                        <img v-if="addTrademarkInfo.logoUrl" :src="addTrademarkInfo.logoUrl" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!-- 通过dialog提供的插槽添加按钮 -->
            <template #footer>
                <el-button type="primary" size="middle" @click="cancel">取消</el-button>
                <el-button type="primary" size="middle" @click="confirm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
// 引入ts类型
import type { ResponseBody, RecordsArr, RecordsObj } from '@/api/product/trademark/type'
import { ElMessage, type UploadProps } from 'element-plus'


import { getTrademark, addTrademark, editTrademarkReq, deleleTrademarkReq } from '@/api/product/trademark/index.ts'
import { ref, onMounted } from "vue";
// dialog对话框是否显示
let isShow = ref<boolean>(false)
// 当前第几页
let currentPage = ref<number>(1)
// 每页展示多少数据
let limit = ref<number>(3)
// 当前获取的品牌信息
let records = ref<RecordsArr>([])
// 总条数
let total = ref<number>(0)
// 获取表单元素
const formRef = ref()
// 获取添加品牌的信息
let addTrademarkInfo = ref<RecordsObj>({
    // 品牌名字
    tmName: '',
    // logo的URL
    logoUrl: ''
})


// @current-change这个自定义函数会回传一个参数：当前页码
// 设置默认值为 1，有回传的参数就用回传的参数。
// 主要用于改变一页显示的个数时要把当前的页码改为 1再发请求。
// 不然可能当前20页，一页显示3个，改变为一页显示5个后总页数减少，20页可能大于总页数，所以要重新从第一页开始
const getTrademarkReq = async (page = 1) => {
    currentPage.value = page
    // 发送请求
    let res: ResponseBody = await getTrademark(currentPage.value, limit.value)
    if (res.code == 200) {
        // 获取品牌信息
        records.value = res.data.records
        // 获取总条数
        total.value = res.data.total
    }
}
// 点击添加品牌按钮的回调
const changeShowTrue = () => {
    // 显示对话框
    isShow.value = true
}
// 关闭对话框的回调
const close = () => {
    // 清空上一次添加的数据
    addTrademarkInfo.value.tmName = ''
    addTrademarkInfo.value.logoUrl = ''
    addTrademarkInfo.value.id = 0
    // 清理某个字段的表单验证信息。
    formRef.value.clearValidate()
}
// 对话框中点击取消的回调
const cancel = () => {
    // 关闭对话框
    isShow.value = false
}
// 对话框中点击确定的回调
const confirm = async () => {
    //在你发请求之前,要对于整个表单进行校验
    //调用这个方法进行全部表单相校验,如果校验全部通过，在执行后面的语法
    await formRef.value.validate()
    // 修改品牌
    if (addTrademarkInfo.value.id) {
        let res = await editTrademarkReq(addTrademarkInfo.value)
        if (res.code == 200) {
            getTrademarkReq(currentPage.value)
        }
    }
    // 添加品牌
    else {
        let res = await addTrademark(addTrademarkInfo.value)
        if (res.code == 200) {
            ElMessage({
                type: 'success',
                message: '添加成功'
            })
            // 重新获取品牌数据
            getTrademarkReq()
        } else {
            ElMessage.error('添加失败')
        }
    }

    // 关闭对话框
    isShow.value = false

}
// 每页显示个数改变时触发
let changeSize = () => {
    getTrademarkReq()
}
// 页面挂载完毕发送请求
onMounted(() => {
    getTrademarkReq()
})
// 上传logo前的钩子
const beforeTrademarkUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // 必须上传jpeg或png或gif的格式
    if (rawFile.type == 'image/png' || rawFile.type == 'image/jpeg' || rawFile.type == 'image/gif') {
        // 上传的图片大小必须小于4M
        if (rawFile.size / 1024 / 1024 <= 4) {
            console.log(1);
            
            return true
        } else {
            console.log(2);
            
            ElMessage({
                type: 'error',
                message: '上传的图片大小必须小于4M'
            })
        }
    } else {
        ElMessage({
            type: 'error',
            message: '必须上传jpeg或png或gif的格式'
        })
    }
}

// 上传成功时的钩子
const handleTrademarkSuccess: UploadProps['onSuccess'] = (response) => {
    if (response.code == 200) {
        addTrademarkInfo.value.logoUrl = response.data
    }
}
// 上传失败的钩子
const handleTrademarkError: UploadProps['onError'] = (...arg) => {
    console.log(arg);
    ElMessage({
        type: 'error',
        message: '图片八太彳亍'
    })
}
// 修改品牌的回调
const editTrademark = (row: RecordsObj) => {
    isShow.value = true
    addTrademarkInfo.value.id = row.id
    addTrademarkInfo.value.logoUrl = row.logoUrl
    addTrademarkInfo.value.tmName = row.tmName

}

// tmName校验函数
// const validatorTmName = (rule:any,value:any,cb:any)=>{
//     console.log(value);

//     if(value.trim().length>=2){
//         cb()
//     }else{
//          //校验未通过返回的错误的提示信息
//         cb(new Error('品牌名称位数大于等于两位'))
//     }

// }
// // 表单校验规则
// const rules = {
//     tmName:[
//     { required: true, trigger: 'blur', validator: validatorTmName }
//     ],
//     logoUrl:[]
// }

//品牌自定义校验规则方法
const validatorTmName = (rule: any, value: any, callBack: any) => {
    console.log('rule',rule);
    //是当表单元素触发blur时候,会触发此方法
    //自定义校验规则
    if (value.trim().length >= 2) {
        callBack();
    } else {
        //校验未通过返回的错误的提示信息
        callBack(new Error('品牌名称位数大于等于两位'))
    }
}
//品牌LOGO图片的自定义校验规则方法
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
    console.log('rule',rule);
    
    //如果图片上传
    if (value) {
        callBack();
    } else {
        callBack(new Error('LOGO图片务必上传'))
    }
}

//表单校验规则对象
const rules = {
    tmName: [
        //required:这个字段务必校验,表单项前面出来五角星
        //trigger:代表触发校验规则时机[blur、change]
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, validator: validatorLogoUrl }
    ]
}
// 删除品牌的回调
const delTrademark = async (id: number) => {
    let res = await deleleTrademarkReq(id)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        getTrademarkReq(records.value.length == 1 ? currentPage.value - 1 : currentPage.value)
    } else {
        ElMessage.error('删除失败')
    }
}
</script>

<style scoped lang="less">
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style lang="less">
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
