<template>
    <div>
        <Category @getCatgory3Id="get3Id"></Category>
        <el-card style="margin-top: 10px;">
            <div v-show="sence == 0">
                <el-button type="primary" icon="plus" :disabled="!category3Id" @click="addSPU">添加SPU</el-button>
                <el-table border style="margin-top: 10px;" :data="records">
                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                    <el-table-column label="SUP名称" prop="spuName"></el-table-column>
                    <el-table-column label="SUP描述" prop="description"></el-table-column>
                    <el-table-column label="SUP操作">
                        <template #="{ row }">
                            <el-button type="primary" size="small" icon="plus" title="添加sku"
                                @click="addSku(row)"></el-button>
                            <el-button type="danger" size="small" icon="edit" title="修改sku"
                                @click="editSPU(row)"></el-button>
                            <el-button type="warning" size="small" icon="View" title="查看sku列表"
                                @click="lookSku(row)"></el-button>
                            <!-- 气泡确认框 -->
                            <el-popconfirm title="你确定要删除吗？" width="200px" @confirm="deleteSpu(row)">
                                <template #reference>
                                    <el-button type="info" size="small" icon="delete" title="删除spu"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7]"
                    :background="true" layout=" prev, pager, next, jumper,->,total, sizes" :total="total"
                    @current-change="getSpu" @size-change="changePageSize" />
            </div>
            <spuForm ref="spu" v-show="sence == 1" @changeSence="changeSence"></spuForm>
            <skuForm ref="sku" v-show="sence == 2" @changeSence="changeSence"></skuForm>
            <el-dialog v-model="isShow" title="sku">
                <el-table :data="skuInfo">
                    <el-table-column label="SKU名字" prop="skuName"></el-table-column>
                    <el-table-column label="SKU价格" prop="price"></el-table-column>
                    <el-table-column label="SKU重量" prop="weight"></el-table-column>
                    <el-table-column label="SKU图片">
                        <template #="{ row }">
                            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import skuForm from './skuForm.vue';
import spuForm from './spuForm.vue';
import { ref } from 'vue'
import { getSpuReq, getSkuInfo, delSpu } from '@/api/product/spu/index.ts'
import type { Records, HasSpuResponseData, SpuData, skuInfoData, SkuData } from '@/api/product/spu/type.ts'
import { ElMessage } from 'element-plus';
// 控制场景切换
// 0:spu列表
// 1:添加spu
// 2:添加sku
let sence = ref<number>(0)
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let category3Id = ref<number | string>('')
let category2Id = ref<number | string>('')
let category1Id = ref<number | string>('')
let total = ref<number | string>('')
let records = ref<Records>([])
let skuInfo = ref<SkuData[]>([])
// 是否显示对话框
let isShow = ref<boolean>(false)
// 获取子组件spu件实例
const spu = ref<any>()
// 获取子组件sku实例
const sku = ref<any>()
// 发送请求获得sup数据
const getSpu = async (page = 1) => {
    pageNo.value = page
    // 有3id才发送请求
    if (!category3Id) return
    let res: HasSpuResponseData = await getSpuReq(pageNo.value, pageSize.value, category3Id.value)
    if (res.code == 200) {
        records.value = res.data.records
        total.value = res.data.total
    }
    console.log(res);

}
// 获取3id
const get3Id = (ID: { category1Id: number | string, category2Id: number | string, category3Id: number | string }) => {
    // 获取子组件传过来的ID并保存
    category3Id.value = ID.category3Id
    category2Id.value = ID.category3Id
    category1Id.value = ID.category3Id
    // 发请求
    getSpu()
}

// 每页显示条数改变时
const changePageSize = () => {
    getSpu()
}
// 添加spu按钮的回调
const addSPU = () => {
    // 切换到添加spu场景
    sence.value = 1
    spu.value.addSup((category3Id.value as number))
}
// 修改spu按钮的对调
const editSPU = (row: SpuData) => {
    // 切换到添加spu场景
    sence.value = 1
    // 使用子组件的方法
    spu.value.getSpu(row)
}
// 给spuForm绑定的自定义事件
const changeSence = ({ flag, params }: { flag: number, params: string }) => {

    // 切换场景
    sence.value = flag

    // 更新数据
    if (params == 'update') {
        getSpu(pageNo.value)
        console.log(111);

    } else {
        getSpu()
    }
}
// 添加sku的回调
const addSku = (row: SpuData) => {
    sence.value = 2
    sku.value.getSku(row, category1Id.value, category2Id.value, category3Id.value)
}
const lookSku = async (row: SpuData) => {
    let res: skuInfoData = await getSkuInfo(row.id as number)
    if (res.code == 200) {
        skuInfo.value = res.data
    }
    isShow.value = true
}
// 删除spu业务
const deleteSpu = async (row: SpuData) => {
    let res: any = await delSpu(row.id as number)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        // 判断删除完后当前页spu数量是否为0 ，为0跳转到前一页
        if (records.value.length >= 1) {
            getSpu(pageNo.value)
        } else {
            getSpu(pageNo.value - 1)
        }
    } else {
        ElMessage.error('删除失败')
    }


}
</script>

<style scoped lang="less"></style>