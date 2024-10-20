<template>
    <div>
        <Category @getCatgory3Id="get3Id" :disabledSelect="screen"></Category>
        <el-card style="margin-top: 10px;">
            <!-- 属性展示 -->
            <div v-show="screen">
                <el-button type="primary" size="default" icon="plus" :disabled="category3Id ? false : true"
                    @click="addAttr1">添加属性</el-button>
                <el-table border :data="attrArr">

                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>

                    <el-table-column label="属性名称" width="120px" prop="attrName"></el-table-column>

                    <el-table-column label="属性值名称">
                        <template #="{ row }">
                            <el-tag v-for="item in row.attrValueList" :key="item.id" style="margin: 0 5px;">{{
                                item.valueName }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="120px">
                        <template #="{ row }">
                            <el-button type="primary" size="small" icon="Edit" @click="addAttr2(row)"></el-button>
                            <el-popconfirm :title="`您确定要删除${row.attrName}吗`" @confirm="delAttr(row)" width="200px">
                                <template #reference>
                                    <el-button type="primary" size="small" icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 添加属性 -->
            <div v-show="!screen">
                <el-form :inline="true">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button icon="plus" type="primary" :disabled="!attrParams.attrName"
                    @click="addAttrValue">添加属性值</el-button>
                <el-table border style="margin: 10px 0;" :data="attrParams.attrValueList">
                    <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row, $index }">
                            <!-- 编辑模式和查看模式的切换 -->
                            <el-input v-if="row.flag" @blur="toLook(row, $index)" v-model="row.valueName"
                                placeholder="请输入属性值" ref="inputRef"></el-input>
                            <div v-else @click="toEdit(row)">{{ row.valueName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作">
                        <template #="{ $index }">
                            <el-button type="primary" size="small" icon="Delete"
                                @click="attrParams.attrValueList.splice($index, 1)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="save" :disabled="attrParams.attrValueList.length == 0">保存</el-button>
                <el-button type="primary" @click="quitAdd">取消</el-button>
            </div>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick } from 'vue'
import { attrReq, updataOrAddAttrReq, deleteAttr } from '@/api/product/attr/index.ts'
import { ElMessage } from 'element-plus';
let category3Id = ref<number | string>('')
let category2Id = ref<number | string>('')
let category1Id = ref<number | string>('')
// 收集新增的数据
let attrParams = reactive<any>({
    attrName: "",
    attrValueList: [
        // {
        //     valueName: ""
        // }
    ],
    categoryId: '',
    categoryLevel: 3,

})
// 设置属性展示与添加属性的切换
// true:展示属性表格
// false:显示添加属性
let screen = ref<boolean>(true)
// 保存属性
let attrArr = ref<any>([])
// 获取input
let inputRef = ref()
// 发送请求获取属性
const getArr = async () => {
    let res: any = await attrReq(category1Id.value, category2Id.value, category3Id.value)
    if (res.code == 200) {
        attrArr.value = res.data
    }
}

// 自定义事件从子组件获取id
const get3Id = (ID: { category1Id: number | string, category2Id: number | string, category3Id: number | string }) => {
    // 3id改变后将上一次请求到的数据置空
    attrArr.value = []
    // 获取子组件传过来的ID并保存
    category3Id.value = ID.category3Id
    category2Id.value = ID.category2Id
    category1Id.value = ID.category1Id
    // 有3id才发请求
    if (category3Id.value) {
        getArr()
    }
    else{
        // 1id或2id改变导致3id为空
        attrArr.value = []
    }
}
// 显示添加属性界面的回调 添加属性按钮
const addAttr1 = () => {
    // 删除id 解决先点修改按钮再点添加属性按钮，在添加属性完成后显示的是修改成功的bug
    delete attrParams.id
    Object.assign(attrParams, {
        attrName: "",
        attrValueList: [
        ],
        categoryLevel: 3,

    })
    screen.value = false
}
// 显示添加属性界面的回调 Eidt按钮
const addAttr2 = (row: any) => {
    Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
    screen.value = false
}
// 退出添加属性界面的回调
const quitAdd = () => {
    screen.value = true
    
}
// 添加属性值按钮的回调
const addAttrValue = () => {
    attrParams.attrValueList.push({
        valueName: '',
        // 用来控制编辑模式和查看模式的切换
        // true:编辑模式
        // false:查看模式
        flag: true
    })
    attrParams.categoryId = category3Id
    // 等input挂载完毕后使其获取焦点
    nextTick(() => {
        inputRef.value.focus()
    })
}
// 保存按钮的回调
const save = async () => {
    // 发送请求添加或修改属性
    let res: any = await updataOrAddAttrReq(attrParams)
    if (res.code == 200) {
        getArr()
        // 添加或修改完毕再次发送请求获取最新数据
        screen.value = true
        
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功'
        })
        
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败'
        })
    }

}
// 输入框失去焦点后切换为查看模式
const toLook = (row: any, $index: number) => {
    // 空值
    if (!row.valueName.trim()) {
        attrParams.attrValueList.splice($index, 1)
        ElMessage.error('不能输入空值')
        return
    }
    // 去重
    let repeat = attrParams.attrValueList.find((item: any) => {
        if (item != row) {
            return item.valueName == row.valueName
        }
    })
    if (repeat) {
        attrParams.attrValueList.splice($index, 1)
        ElMessage.error('属性值不能重复')
        return
    }
    row.flag = false
}
// 点击进入编辑模式
const toEdit = (row: any) => {
    row.flag = true
    // 等input重新挂载完毕后使其获取焦点
    nextTick(() => {
        inputRef.value.focus()

    })
}
// 删除属性
const delAttr = async (row: any) => {
    console.log(row);
    
    let res: any = await deleteAttr(row.id)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        getArr()
    } else {
        ElMessage.error('删除失败')
    }
}
</script>

<style scoped lang="less"></style>