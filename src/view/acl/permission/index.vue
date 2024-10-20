<template>
    <div>
        <el-table :data="menuArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="权限值" />
            <el-table-column prop="updateTime" label="修改时间" />
            <el-table-column label="操作">
                <template #="{ row }">
                    <el-button type="primary" size="small" icon="plus" :disabled="row.level == 4"
                        @click="addaddPermisstion(row)">{{ row.level ==
                            3 ? '添加功能' : '添加菜单' }}</el-button>
                    <el-button type="primary" size="small" icon="edit" @click="updateaddPermisstion(row)">编辑</el-button>
                    <el-popconfirm title="确定要删除吗？" @confirm="delMenu(row)">
                        <template #reference>
                            <el-button type="primary" size="small" icon="delete" :disabled="row.level == 1">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框 -->
        <el-dialog v-model="dialogVisible">
            <template #header>
                <h1>{{ menuParams.id ? '修改菜单' : '添加菜单' }}</h1>
            </template>
            <el-form>
                <el-form-item label="名称">
                    <el-input placeholder="请你输入名称" v-model="menuParams.name"></el-input>
                </el-form-item>
                <el-form-item label="权限">
                    <el-input placeholder="请你输入权限值" v-model="menuParams.code"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveMenu">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, } from "vue";
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
import { PermisstionResponseData, PermisstionList, Permisstion } from '@/api/acl/menu/type'
import { ElMessage } from "element-plus";
// 存储菜单数据
let menuArr = ref<PermisstionList>([])
// 控制对话框是否显示
let dialogVisible = ref<boolean>(false)
// 新增或修改需要收集的数据
let menuParams = reactive({
    code: '',
    name: '',
    pid: 0,
    level: 0,
    id: 0
})
// 获取菜单数据
const getMenuInfo = async () => {
    let res: PermisstionResponseData = await reqAllPermisstion()
    if (res.code == 200) {
        menuArr.value = res.data
    }
}
onMounted(() => {
    getMenuInfo()
})
// 添加功能|添加菜单 按钮的回调
const addaddPermisstion = (row: Permisstion) => {
    Object.assign(menuParams, {
        code: '',
        name: '',
        pid: 0,
        level: 0,
        id: 0
    })
    dialogVisible.value = true
    menuParams.level = row.level + 1
    menuParams.pid = row.pid + 1
}
// 编辑按钮的回调
const updateaddPermisstion = (row: Permisstion) => {
    dialogVisible.value = true
    Object.assign(menuParams, row)
}
// 保存按钮的回调
const saveMenu = async () => {
    let res: any = await reqAddOrUpdateMenu(menuParams)
    if (res.code == 200) {
        dialogVisible.value = false
        ElMessage({
            type: 'success',
            message: menuParams.id ? '修改成功' : '添加成功'
        })
        getMenuInfo()
    } else {
        dialogVisible.value = false
        ElMessage({
            type: 'success',
            message: menuParams.id ? '修改失败' : '添加失败'
        })
    }
}
// 删除按钮的回调
const delMenu = async (row:Permisstion) => {
    let res:any = await reqRemoveMenu(row.id as number)
    if(res.code == 200){
        ElMessage.success('删除成功')
        getMenuInfo()
    }else{
        ElMessage.success('删除失败')
    }
}
</script>

<style scoped></style>