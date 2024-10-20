<template>
    <div>
        <el-card class="top-card">
            <el-form :inline="true" class="form">
                <el-form-item label="职位搜索">
                    <el-input placeholder="请你输入搜索职位关键字" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="search">搜索</el-button>
                    <el-button type="primary" size="default" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin: 10px 0;">
            <el-button type="primary" icon="plus" size="default" @click="addRole">添加职位</el-button>
            <el-table border :data="allRoleArr">
                <el-table-column label="#" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="ID" align="center" width="80px" prop="id"></el-table-column>
                <el-table-column label="职位名称" align="center" width="150px" show-overflow-tooltip
                    prop="roleName"></el-table-column>
                <el-table-column label="创建时间" align="center" width="250px" show-overflow-tooltip
                    prop="createTime"></el-table-column>
                <el-table-column label="更新时间" align="center" width="250px" show-overflow-tooltip
                    prop="updateTime"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #="{ row }">
                        <el-button type="primary" icon="User" size="small" @click="setPermisstion(row)">分配权限</el-button>
                        <el-button type="primary" icon="edit" size="small" @click="editRole(row)">编辑</el-button>
                        <el-popconfirm title="你确定要删除吗？" @confirm="delRole(row)" width="200px">
                            <template #reference>
                                <el-button type="primary" icon="delete" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
                :background="true" layout=" prev, pager, next, jumper,->,total, sizes" :total="total"
                @size-change="handleSizeChange" @current-change="getAllRole" />
        </el-card>
        <!-- 添加|修改职位 -->
        <el-dialog v-model="isShowDialog">
            <template #header>
                <h1 style="font-size: 22px;">{{ roleParams.id ? '修改职位' : '添加职位' }}</h1>
            </template>
            <el-form :model="roleParams" :rules="rules" ref="form">
                <el-form-item label="职位名称" prop="roleName">
                    <el-input placeholder="请你输入职位名称" v-model="roleParams.roleName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" size="default" @click="cancel">取消</el-button>
                <el-button type="primary" size="default" @click="save">确定</el-button>
            </template>
        </el-dialog>
        <!-- 分配权限 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h1>权限分配</h1>
            </template>
            <template #default>
                <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                    :default-checked-keys="selectArr" :props="defaultProps" />
            </template>
            <template #footer>
                <el-button type="primary" size="default" @click="cancelDraeer">取消</el-button>
                <el-button type="primary" size="default" @click="savePermisstion">确定</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { getAllRolesInfo, deleteRoleReq, updateRoleReq, addRoleReq, getAllMenuReq, reqSetPermisstion } from '@/api/acl/role'
import type { RoleResponseData, Records, roleDate, MenuResponseData, MenuList, MunuData } from '@/api/acl/role/type'
import useSettingStore from '@/store/settingmenu'
import { ElMessage } from 'element-plus';

// 发送添加或更新请求需要的参数
let roleParams: roleDate = reactive({
    roleName: ''
})
// 注册仓库
const settingStore = useSettingStore()
// 当前页
let pageNo = ref<number>(1)
// 共条数
let total = ref<number>(100)
// 一页显示个数
let pageSize = ref<number>(10)
// 绑定搜索框
let keyword = ref<string>('')
// 存储请求到的所有职位数组
let allRoleArr = ref<Records>([])
// 控制是否显示对话框
let isShowDialog = ref<boolean>(false)
// 获取form组件实例
let form = ref<any>()
// 获取树形结构的实例
let tree = ref<any>()
// 存储全部菜单
let menuArr = ref<MenuList>([])
// 控制抽屉是否显示
let drawer = ref<boolean>(false)
// 存储被选中的权限id
let selectArr = ref<number[]>([])
// 权限分配树形控件显示的字段
let defaultProps = {
    label: 'name',
    children: 'children',
}
// 获取所有职位的方法
const getAllRole = async (page = 1) => {
    pageNo.value = page
    let res: RoleResponseData = await getAllRolesInfo(pageNo.value, pageSize.value, keyword.value)
    if (res.code == 200) {
        allRoleArr.value = res.data.records
        total.value = res.data.total
    }
}
// page-size 改变时触发
const handleSizeChange = () => {
    getAllRole()
}
// 搜索按钮的回调
const search = () => {
    getAllRole()
}
// 重置按钮的回调
const reset = () => {
    settingStore.refresh = !settingStore.refresh
}
// 添加职位按钮的回调
let addRole = () => {
    // 清除表单数据
    Object.assign(roleParams, {
        roleName: '',
        id: 0
    })
    isShowDialog.value = true
    // 清除表单验证的错误,第一次使用，form组件并未加载，等加载完毕再调用方法
    nextTick(() => {
        form.value.clearValidate();
    })


}
// 修改职位的回调
const editRole = (row: roleDate) => {
    Object.assign(roleParams, row)
    isShowDialog.value = true
    // 清除表单验证的错误,第一次使用，form组件并未加载，等加载完毕再调用方法
    nextTick(() => {
        form.value.clearValidate();
    })
}
// 删除职位的回调
const delRole = async (row: roleDate) => {
    let res: any = await deleteRoleReq(row.id as number)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        getAllRole(allRoleArr.value.length >= 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error('删除失败')
    }
}
// 添加或更新保存按钮的回调
const save = async () => {
    await form.value.validate()
    if (!roleParams.id) {
        // 添加职位
        let res1 = await addRoleReq(roleParams)
        if (res1.code == 200) {
            ElMessage.success('添加成功')
            isShowDialog.value = false
            getAllRole()
        } else {
            ElMessage.error('添加失败')
            isShowDialog.value = false
        }
    } else {
        // 更新职位
        let res2 = await updateRoleReq(roleParams)
        if (res2.code == 200) {
            ElMessage.success('修改成功')
            isShowDialog.value = false
            getAllRole()
        } else {
            ElMessage.error('修改失败')
            isShowDialog.value = false
        }
    }

}
// 对话框取消按钮的回调
const cancel = () => {
    isShowDialog.value = false
}
const validatorRoleName = (rule: any, value: any, cb: any) => {
    console.log(rule);
    
    if (value.trim().length >= 2) {
        cb()
    } else {
        cb(new Error('职位位数必须大于二位'))
    }

}
// 表单规则
let rules = {
    roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }]
}
// 权限分配按钮的回调
const setPermisstion = async (row: roleDate) => {
    Object.assign(roleParams, row)
    drawer.value = true
    let res: MenuResponseData = await getAllMenuReq(row.id as number)
    if (res.code == 200) {
        menuArr.value = res.data
        selectArr.value = filterId(menuArr.value, [])
    }
}
// 获取权限id 递归
const filterId = (menuArr: MenuList, initArr: number[]) => {
    menuArr.forEach((item: MunuData) => {
        if (item.select && item.level == 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterId(item.children, initArr)
        }
    })
    return initArr
}
// 保存权限分配按钮的回调
const savePermisstion = async () => {
    // 获取自己选择的权限的id
    let selectId = tree.value.getCheckedKeys()
    // 获取父级id
    let halfId = tree.value.getHalfCheckedKeys()
    // 数组合并
    let permissionId = selectId.concat(halfId)
    let res = await reqSetPermisstion(roleParams.id as number, permissionId)
    console.log(res);
    
    if (res.code == 200) {
        drawer.value = false
        ElMessage.success('分配成功')
        window.location.reload()
    } else {
        ElMessage.error('分配失败')
        drawer.value = false
    }
}
// 权限分配取消按钮的回调
const cancelDraeer = ()=>{
    drawer.value = false
    // 清除选中的id
    selectArr.value = []
}
// 页面挂载完毕
onMounted(() => {
    getAllRole()
})
</script>

<style scoped lang="less">
.top-card {
    height: 70px;
}

.form {
    display: flex;
    align-items: center;
}
</style>