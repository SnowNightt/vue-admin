<template>
    <div>
        <el-card class="card1" style="margin-bottom: 10px;">
            <el-form :inline="true">
                <el-form-item label="用户名">
                    <el-input placeholder="请你输入搜索用户名" v-model="keywords"/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" :disabled="!keywords" @click="search">搜索</el-button>
                    <el-button type="primary" size="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card>
            <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
            <el-popconfirm title="确定要删除吗" width="200px" @confirm="selectDel">
                <template #reference>
                    <el-button type="primary" size="default" :disabled="!deleteSelectUser.length">批量删除</el-button>
                </template>
            </el-popconfirm>
            <el-table border :data="userArr" @selection-change="selectChange">
                <el-table-column align="center" type="selection"></el-table-column>
                <el-table-column align="center" label="#" type="index"></el-table-column>
                <el-table-column align="center" label="ID" prop="id"></el-table-column>
                <el-table-column align="center" label="用户名字" prop="username"></el-table-column>
                <el-table-column align="center" label="用户名称" prop="name"></el-table-column>
                <el-table-column align="center" label="用户角色" prop="roleName" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="更新时间" prop="updateTime" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" width="300px">
                    <template #="{ row }">
                        <el-button type="primary" size="small" @click="setRole(row)" icon="user">分配角色</el-button>
                        <el-button type="primary" size="small" @click="editUser(row)" icon="edit">编辑</el-button>
                        <el-popconfirm title="确定要删除吗" width="200px" @confirm="delUser(row)">
                            <template #reference>
                                <el-button type="primary" size="small" icon="delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
                :background="true" layout="prev, pager, next, jumper,->,total, sizes" :total="total"
                @current-change="getAlluserInfo" @size-change="getAlluserInfo" />
        </el-card>
        <!-- 抽屉修改|添加用户 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h1>{{ userParams.id ? '修改用户' : '添加用户' }}</h1>
            </template>
            <template #default>
                <el-form :model="userParams" :rules="rules" ref="formRef">
                    <el-form-item label="用户姓名" prop="username">
                        <el-input placeholder="请输入用户姓名" v-model="userParams.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="name">
                        <el-input placeholder="请输入用户昵称" v-model="userParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                        <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button type="primary" size="default" @click="clickConfirm">确认</el-button>
                <el-button size="default" @click="cancel">取消</el-button>
            </template>
        </el-drawer>

        <!-- 抽屉 角色分配 -->
        <el-drawer v-model="drawer2" title="角色分配">
            <template #header>
                <h1>角色分配</h1>
            </template>
            <template #default>
                <el-form :inline="false">
                    <el-form-item label="用户姓名">
                        <el-input v-model="userParams.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="职位列表">
                        <el-checkbox v-model="isCheckAll" @change="changeCheckAll"
                            :indeterminate="isIndeterminate">全选</el-checkbox>
                        <el-checkbox-group v-model="userRolesArr" @change="changeCheckItem">
                            <el-checkbox v-for="item in allRolesArr" :key="item.id" :label="item">{{
                                item.roleName }}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <el-button type="primary" size="default" @click="confirmSetRole">确定</el-button>
                <el-button size="default" @click="drawer2 = false">取消</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { getAllUserReq, saveOrUpdateUserReq, getAllRoleReq, setRoleReq, deleteUserReq, deleteSelectUserReq } from '@/api/acl/user'
import { UserResponseData, User, AllRoleResponseData, RoleData, setRoleData } from '@/api/acl/user/type'
import { ElMessage } from 'element-plus';
import useSettingStore from '@/store/settingmenu'
// 注册仓库
const settingStore = useSettingStore()
let total = ref<number>(100)
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
// 控制抽屉是否显示
let drawer = ref<boolean>(false)
// 控制角色分配的抽屉是否显示
let drawer2 = ref<boolean>(false)
// 存储所有用户
let userArr = ref<User[]>([])
// 获取form组件
let formRef = ref<any>()
// 存储所有角色信息
let allRolesArr = ref<RoleData[]>([])
// 存储已有的角色信息
let userRolesArr = ref<RoleData[]>([])
// 角色分配全选框是否选中
let isCheckAll = ref<boolean>(false)
// 角色分配全选框的不确定状态
let isIndeterminate = ref<boolean>(false)
// 收集批量删除用户的用户
let deleteSelectUser = ref<User[]>([])
// 收集批量删除用户的用户id
let deleteSelectUserIdArr = ref<number[]>([])
// 收集搜索框的字
let keywords = ref<string>('')
//收集用户信息的响应式数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
});
//校验用户名字回调函数
const validatorUsername = (rule: any, value: any, cb: any) => {
    console.log(rule);
    console.log('username',value);
    if (value.trim().length >= 5) {
        cb()
    } else {
        cb(new Error('职位位数必须大于5位'))
    }

}
//校验用户名字回调函数
const validatorname = (rule: any, value: any, callBack: any) => {
    
    console.log(rule);
    //用户名字|昵称,长度至少五位
    if (value.trim().length >= 5) {
        callBack();
    } else {
        callBack(new Error('用户昵称至少五位'))
    }
}
const validatorPassword = (rule: any, value: any, callBack: any) => {
    console.log(rule);
    // 密码至少6位
    if (value.trim().length >= 6) {
        callBack();
    } else {
        callBack(new Error('用户密码至少六位'))
    }
}
//表单校验的规则对象
let rules = {
    //用户名字
    name: [{ required: true, trigger: 'blur', validator: validatorname }],
    //用户昵称
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    //用户的密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

// 获取所用用户信息
const getAlluserInfo = async (page = 1) => {
    pageNo.value = page
    let res: UserResponseData = await getAllUserReq(pageNo.value, pageSize.value,keywords.value)
    if (res.code == 200) {
        total.value = res.data.total
        userArr.value = res.data.records
    }
}
// 添加用户按钮的回调
const addUser = () => {
    // 清除表单数据
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: ''
    })
    // 清除上一次表单验证的错误的提示信息
    nextTick(() => {
        // formRef.value.clearValidate('username');
        // formRef.value.clearValidate('name');
        // formRef.value.clearValidate('password');
        // clearValidate中不写内容代表清空所有
        // 等form组件挂载完毕再调用方法
        formRef.value.clearValidate()


    });

    drawer.value = true

}
// 修改用户按钮的回调
const editUser = (row: User) => {
    nextTick(() => {
        formRef.value.clearValidate();

    });

    drawer.value = true
    Object.assign(userParams, row)
}
// 抽屉确定按钮的回调
const clickConfirm = async () => {
    // 表单校验，通过才行
    await formRef.value.validate()
    let res: any = await saveOrUpdateUserReq(userParams)
    if (res.code == 200) {
        ElMessage({
            type: 'success',
            message: userParams.id ? '修改成功' : '添加成功'
        })
        drawer.value = false
        getAlluserInfo(userParams.id ? pageNo.value : 1)
        //获取最新的全部账号的信息
        //浏览器自动刷新一次
        window.location.reload()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: userParams.id ? '修改失败' : '添加失败'
        })
    }


}
// 抽屉取消按钮的回调
const cancel = () => {
    drawer.value = false
}
// 角色分配按钮的回调
const setRole = async (row: User) => {
    // input需要绑定用户姓名
    Object.assign(userParams, row)
    let res: AllRoleResponseData = await getAllRoleReq(userParams.id as number)
    if (res.code == 200) {
        userRolesArr.value = res.data.assignRoles
        allRolesArr.value = res.data.allRolesList
    }
    drawer2.value = true
}
// 角色分配的全选多选框状态改变
// change事件会注入参数，值为true或false，选中为true
const changeCheckAll = (val: boolean) => {
    // val为true则将所有角色信息赋值给当前角色信息，否则将空列表赋值
    userRolesArr.value = val ? allRolesArr.value : []
    // 取消不确定状态
    isIndeterminate.value = false

}
//  角色分配选择角色多选框
// change事件会注入参数，值为当前选中项的列表
const changeCheckItem = (val: any) => {
    // 当前选中的数量等于所有角色的数量则全选框状态为true
    isCheckAll.value = val.length == allRolesArr.value.length
    // 当前选中的数量大于0且小于所有角色数量则为不确定状态
    isIndeterminate.value = val.length > 0 && val.length < allRolesArr.value.length
}
//  分配角色分配确定按钮的回调
const confirmSetRole = async () => {
    // 发送分配角色请求所需的参数收集
    let data: setRoleData = {
        userId: (userParams.id as number),
        roleIdList: userRolesArr.value.map((item) => {
            return item.id as number
        })
    }
    let res: any = await setRoleReq(data)
    if (res.code == 200) {
        ElMessage.success('分配成功')
        drawer2.value = false
        getAlluserInfo(pageNo.value)
    } else {
        ElMessage.error('分配失败')
        drawer2.value = false
    }
}
// 确定删除单个用户的回调
const delUser = async (row: User) => {
    let res: any = await deleteUserReq(row.id as number)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        getAlluserInfo(userArr.value.length >= 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error('删除失败')
    }
}
// table第一列选项框变化时触发的回调
const selectChange = async (val: User[]) => {
    // 收集要批量删除的用户
    // val返回的是选择框选中的用户组成的用户对象数组
    deleteSelectUser.value = val

}
// 批量删除按钮的回调
const selectDel = async () => {
    // 收集要批量删除的用户id
    deleteSelectUserIdArr.value = deleteSelectUser.value.map((item) => {
        return item.id as number
    })
    let res = await deleteSelectUserReq(deleteSelectUserIdArr.value)
    console.log(res);
    if (res.code == 200) {
        ElMessage.success('删除成功')
        getAlluserInfo(userArr.value.length >= 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error('删除失败')
    }
}
// 搜索按钮的回调
const search = ()=>{
    getAlluserInfo()
}
// 重置按钮的回调
const reset = ()=>{
    // 重新挂载页面达到刷新的目的
    settingStore.refresh = !settingStore.refresh
}
// 页面挂载完毕发送请求获取所有用户信息
onMounted(() => {
    getAlluserInfo()
})

</script>

<style scoped lang="less">
.card1 {
    height: 80px;
    display: flex;
    align-items: center;
}
</style>