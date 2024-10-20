<template>
    <div>
        <el-card>
            <el-table border style="margin-bottom: 10px;" :data="skuArr">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                <el-table-column label="名称" width="150px" prop="skuName" show-overflow-tooltip></el-table-column>
                <el-table-column label="描述" width="300px" prop="skuDesc" show-overflow-tooltip></el-table-column>
                <el-table-column label="图片" width="200px">
                    <template #="{ row }">
                        <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
                    </template>
                </el-table-column>
                <el-table-column label="重量" width="100px" prop="weight"></el-table-column>
                <el-table-column label="价格" width="100px" prop="price"></el-table-column>
                <el-table-column label="操作" width="250px" fixed="right">
                    <template #="{ row }">
                        <el-button size="small" :icon="row.isSale == 0 ? 'top' : 'Bottom'" type="success"
                            @click="updateSale(row)" title="上架或下架"></el-button>
                        <el-button size="small" icon="Edit" type="primary" title="修改sku" @click="editSku"></el-button>
                        <el-button size="small" icon="Warning" type="warning" title="查看详情" @click="findSku(row)"></el-button>
                        <el-popconfirm title="你确定要删除吗？" @confirm="delSku(row)" width="200px">
                            <template #reference>
                                <el-button size="small" icon="Delete" type="danger" title="删除sku"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
                :background="true" layout=" prev, pager, next, jumper,->,total, sizes" :total="total" @current-change="getSku"
                @size-change="sizeChange" />
        </el-card>
        <!-- 抽屉 -->
        <el-drawer v-model="drawer" title="查看商品的详情">
            <template #default>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuInfo?.skuName }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuInfo?.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuInfo?.price }}</el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18">
                        <el-tag type="primary" v-for="item in skuInfo?.skuAttrValueList" :key="item.attrId">{{
                            item.attrName }} </el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">销售属性</el-col>
                    <el-col :span="18">
                        <el-tag type="primary" v-for="item in skuInfo?.skuSaleAttrValueList" :key="item.saleAttrId">{{
                            item.saleAttrValueName }} </el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin: 10px 0;">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="item in skuInfo?.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" style="width: 100%;height: 100%;">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
        </el-drawer>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSkuReq, upSkuReq, cancelSkuReq, skuInfoReq, deleteSku } from '@/api/product/sku'
import { skuInfoData, SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus';
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
// 控制抽屉是否显示
let drawer = ref<boolean>(false)
// 存储sku数据
let skuArr = ref<SkuData[]>([])
// 存储获取商品详情数据
let skuInfo = ref<SkuData>()
// 获取sku数据的方法
const getSku = async (page = 1) => {
    pageNo.value = page
    let res: skuInfoData = await getSkuReq(pageNo.value, pageSize.value)
    total.value = res.data.total
    if (res.code == 200) {
        skuArr.value = res.data.records
    }
}
// page-size 改变时触发 会注入参数，值为page-size
const sizeChange = (size: number) => {
    pageSize.value = size
    getSku()
}
// 上下架按钮的回调
const updateSale = async (row: SkuData) => {
    // isSale ==0 该商品处理下架状态
    // isSale == 1 该商品处理上架状态
    if (row.isSale == 0) {
        // 发送请求商品上架
        let res = await upSkuReq(row.id as number)
        if (res.code == 200) {
            ElMessage.success('上架成功')
        }

    } else {
        let res1 = await cancelSkuReq(row.id as number)
        console.log(res1);

        if (res1.code == 200) {
            ElMessage.success('下架成功')
        }
    }
    getSku(pageNo.value)
}
// 查看商品的详情按钮的回调
const findSku = async (row: SkuData) => {
    let res = await skuInfoReq(row.id as number)
    if (res.code == 200) {
        skuInfo.value = res.data
    }
    drawer.value = true

}
// 删除sku按钮的回调
const delSku = async (row: SkuData) => {
    let res = await deleteSku(row.id as number)
    if (res.code == 200) {
        ElMessage.success('删除成功')
        getSku(skuArr.value.length >= 1 ? pageNo.value : pageNo.value - 1)
    } else {
        ElMessage.error('删除失败')
    }
}
// 修改sku
const editSku = ()=>{
    ElMessage.warning('该功能正在开发中...')
}
// 页面挂载完毕发请求获取sku数据
onMounted(() => {
    getSku()
})
</script>

<style scoped lang="less">
.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>